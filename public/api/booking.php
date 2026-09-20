<?php
/**
 * Приём заявки с формы записи и пересылка в Telegram.
 *
 * Единственный серверный код сайта: всё остальное — статика из out/.
 * Ожидает POST с JSON-телом:
 *   { name, phone, city, service?, doctor?, comment?, source?, website }
 * `website` — honeypot: поле скрыто от людей, боты его заполняют.
 * Токен бота и chat_id — в config.php рядом (в репозитории его нет,
 * см. config.example.php и docs/ФОРМА-ЗАПИСИ.md).
 *
 * Ответ всегда JSON: { ok: true } или { ok: false, error: '<код>' }.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const RATE_LIMIT_MAX = 5;          // заявок с одного IP…
const RATE_LIMIT_WINDOW = 600;     // …за 10 минут
const MAX_NAME = 100;
const MAX_TEXT = 200;
const MAX_COMMENT = 1000;

/** @var array<string,string> Подписи городов в сообщении по slug из адреса страницы. */
const CITY_NAMES = [
    'minsk' => 'Минск',
    'rogachev' => 'Рогачёв',
    'zhlobin' => 'Жлобин',
];

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

function sendTelegram(string $token, string $chatId, string $text): bool
{
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $payload = http_build_query([
        'chat_id' => $chatId,
        'text' => $text,
        'disable_web_page_preview' => 'true',
    ]);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
    } else {
        // Хостинг без curl — тот же запрос через stream.
        $context = stream_context_create(['http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 10,
            'ignore_errors' => true,
        ]]);
        $response = @file_get_contents($url, false, $context);
        $status = 0;
        foreach ($http_response_header ?? [] as $h) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
                $status = (int) $m[1];
            }
        }
    }

    if ($response === false || $status !== 200) {
        return false;
    }
    $decoded = json_decode($response, true);
    return is_array($decoded) && ($decoded['ok'] ?? false) === true;
}

// ---------------------------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'method_not_allowed']);
}
if (foreignOrigin()) {
    respond(403, ['ok' => false, 'error' => 'forbidden_origin']);
}

$configPath = __DIR__ . '/config.php';
$config = is_file($configPath) ? require $configPath : [];
$token = (string) ($config['bot_token'] ?? '');
$chatId = (string) ($config['chat_id'] ?? '');
if ($token === '' || $chatId === '') {
    respond(500, ['ok' => false, 'error' => 'not_configured']);
}
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

$cityName = CITY_NAMES[$citySlug] ?? ($citySlug !== '' ? $citySlug : 'город не указан');

$lines = [
    "🦷 Новая запись — {$cityName}",
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

if (!sendTelegram($token, $chatId, implode("\n", $lines))) {
    respond(502, ['ok' => false, 'error' => 'telegram_failed']);
}

respond(200, ['ok' => true]);
