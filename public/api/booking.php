<?php
/**
 * Приём заявки с формы записи: проверка полей, защита от ботов и сборка
 * текста. Куда заявка уходит (Telegram-бот, бот клиники, заглушка) —
 * решает booking-transport.php по настройке `transport` в config.php.
 *
 * Единственный серверный код сайта: всё остальное — статика из out/.
 * Ожидает POST с JSON-телом:
 *   { name, phone, city, service?, doctor?, comment?, source?, website }
 * `website` — honeypot: поле скрыто от людей, боты его заполняют.
 * Токены — в config.php (в репозитории его нет, см. config.example.php и
 * docs/ФОРМА-ЗАПИСИ.md).
 *
 * Ответ всегда JSON: { ok: true } или { ok: false, error: '<код>' }.
 */

declare(strict_types=1);

define('DENT32_BOOKING', true);
require __DIR__ . '/booking-transport.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const RATE_LIMIT_MAX = 5;          // заявок с одного IP…
const RATE_LIMIT_WINDOW = 600;     // …за 10 минут
const MAX_NAME = 100;
const MAX_TEXT = 200;
const MAX_COMMENT = 1000;

/**
 * Белый список городов: подпись и хэштег в сообщении. Заявки всех городов
 * могут идти в одну группу — по хэштегу администратор фильтрует свой город.
 * Slug не из списка в сообщение не попадает.
 *
 * @var array<string,array{0:string,1:string}>
 */
const CITIES = [
    'minsk' => ['Минск', '#минск'],
    'rogachev' => ['Рогачёв', '#рогачёв'],
    'zhlobin' => ['Жлобин', '#жлобин'],
];

/**
 * config.php ищется сначала вне папки сайта (на уровень выше public_html —
 * туда веб-сервер не отдаёт файлы вообще), затем рядом со скриптом.
 *
 * @return array<string,mixed>
 */
function loadConfig(): array
{
    $candidates = [
        dirname(__DIR__, 2) . '/dent32-booking-config.php',
        __DIR__ . '/config.php',
    ];
    foreach ($candidates as $path) {
        if (is_file($path)) {
            $config = require $path;
            return is_array($config) ? $config : [];
        }
    }
    return [];
}

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Обрезает строку, убирает управляющие символы и лишние пробелы. */
function clean(mixed $value, int $max): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    $value = trim(preg_replace('/\s+/u', ' ', $value) ?? '');
    return mb_substr($value, 0, $max);
}

function clientIp(bool $trustForwardedFor): string
{
    // X-Forwarded-For ставит любой клиент сам, поэтому по умолчанию верим
    // только REMOTE_ADDR: иначе лимит обходится случайным значением
    // заголовка. Включать trust_forwarded_for в config.php стоит только если
    // хостинг подтвердил, что сайт стоит за его прокси и REMOTE_ADDR — это
    // адрес прокси.
    $forwarded = $trustForwardedFor ? ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '') : '';
    if ($forwarded !== '') {
        return trim(explode(',', $forwarded)[0]);
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/**
 * Запрос с чужого сайта: браузер всегда шлёт Origin при POST, и если он не
 * совпадает с хостом — форму вызвали не с нашей страницы. Без Origin (curl,
 * старые клиенты) пропускаем: это не защита от ботов, а дешёвый фильтр
 * от встраивания формы на чужой странице.
 */
function foreignOrigin(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '' || $origin === 'null') {
        return false;
    }
    $host = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $self = strtolower((string) preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
    return $host === '' || $self === '' || $host !== $self;
}

/**
 * Простой лимит по IP на файлах во временной папке: список времён отправок,
 * из которого выбрасываются записи старше окна. flock — чтобы параллельные
 * запросы не затирали друг друга.
 */
function rateLimited(string $ip): bool
{
    $file = sys_get_temp_dir() . '/dent32-booking-' . md5($ip);
    $fh = fopen($file, 'c+');
    if ($fh === false) {
        return false; // не смогли открыть — лучше пропустить заявку, чем потерять
    }
    flock($fh, LOCK_EX);
    $raw = stream_get_contents($fh) ?: '';
    $now = time();
    $times = array_values(array_filter(
        array_map('intval', array_filter(explode("\n", $raw))),
        fn (int $t) => $now - $t < RATE_LIMIT_WINDOW
    ));
    $limited = count($times) >= RATE_LIMIT_MAX;
    if (!$limited) {
        $times[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, implode("\n", $times));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $limited;
}

// ---------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}
if (foreignOrigin()) {
    respond(403, ['ok' => false, 'error' => 'forbidden_origin']);
}

$config = loadConfig();
date_default_timezone_set((string) ($config['timezone'] ?? 'Europe/Minsk'));

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > 16384) {
    respond(413, ['ok' => false, 'error' => 'too_large']);
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'bad_json']);
}

// Honeypot: людям поле не показывается. Боту отвечаем «успех», чтобы он не
// подбирал обход, но ничего не отправляем.
if (clean($data['website'] ?? '', 50) !== '') {
    respond(200, ['ok' => true]);
}

$name = clean($data['name'] ?? '', MAX_NAME);
$phone = clean($data['phone'] ?? '', 30);
$citySlug = clean($data['city'] ?? '', 40);
$service = clean($data['service'] ?? '', MAX_TEXT);
$doctor = clean($data['doctor'] ?? '', MAX_TEXT);
$comment = clean($data['comment'] ?? '', MAX_COMMENT);
$source = clean($data['source'] ?? '', MAX_TEXT);

if ($name === '') {
    respond(422, ['ok' => false, 'error' => 'name_required']);
}
// Белорусский номер: +375 и 9 цифр; допускаем скобки, пробелы, дефисы.
$digits = preg_replace('/\D/', '', $phone) ?? '';
if (!preg_match('/^375\d{9}$/', $digits)) {
    respond(422, ['ok' => false, 'error' => 'phone_invalid']);
}

if (rateLimited(clientIp((bool) ($config['trust_forwarded_for'] ?? false)))) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

if (!isset(CITIES[$citySlug])) {
    $citySlug = '';
}
[$cityName, $cityTag] = CITIES[$citySlug] ?? ['город не указан', '#без_города'];

$lines = [
    "🦷 Новая заявка с сайта",
    "📍 Город: {$cityName}",
    '',
    "Имя: {$name}",
    "Телефон: {$phone}",
];
if ($service !== '') {
    $lines[] = "Услуга: {$service}";
}
if ($doctor !== '') {
    $lines[] = "Врач: {$doctor}";
}
if ($comment !== '') {
    $lines[] = "Комментарий: {$comment}";
}
if ($source !== '') {
    $lines[] = "Откуда: {$source}";
}
$lines[] = 'Время: ' . date('d.m.Y H:i');
$lines[] = '';
$lines[] = $cityTag;

$error = deliverBooking($config, $citySlug, implode("\n", $lines));
if ($error === 'not_configured') {
    respond(500, ['ok' => false, 'error' => 'not_configured']);
}
if ($error !== null) {
    respond(502, ['ok' => false, 'error' => $error]);
}

respond(200, ['ok' => true]);
