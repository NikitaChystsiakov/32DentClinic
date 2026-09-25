<?php
/**
 * Доставка заявки — единственное место, которое знает, КУДА уходит заявка.
 * booking.php валидирует поля и собирает текст, а этот файл его отправляет.
 * Сменить получателя = поменять `transport` в config.php, код не трогать.
 *
 * Транспорты:
 *   'telegram' — бот Telegram пишет в чат/группу. Токен бота и chat_id — в
 *                config.php. Все города могут идти в одну группу: город
 *                стоит в первой строке сообщения и хэштегом (#минск), а при
 *                желании у города может быть свой чат или тема группы.
 *   'webhook'  — POST JSON на адрес бота/CRM клиники. Заготовка на случай,
 *                если «их бот» окажется не Telegram: формат запроса
 *                сверить с документацией их API (см. sendWebhook ниже).
 *   'stub'     — заглушка, пока нет токена: заявка никуда не отправляется,
 *                в лог сервера пишется только факт заявки и город (без имени
 *                и телефона). Посетитель видит «заявка отправлена», поэтому
 *                на боевом сайте заглушку оставлять НЕЛЬЗЯ — заявки теряются.
 *
 * Секреты (токены) живут только в config.php на сервере — в репозитории
 * их нет, см. config.example.php и docs/ФОРМА-ЗАПИСИ.md.
 */

declare(strict_types=1);

// Файл подключается только из booking.php. Прямой запрос по URL — 404.
if (!defined('DENT32_BOOKING')) {
    http_response_code(404);
    exit;
}

/**
 * @param array<string,mixed> $config   содержимое config.php
 * @param string              $citySlug slug города из белого списка или ''
 * @param string              $text     готовый текст сообщения
 * @return string|null null — доставлено; иначе код ошибки для ответа формы
 */
function deliverBooking(array $config, string $citySlug, string $text): ?string
{
    $transport = (string) ($config['transport'] ?? 'telegram');

    switch ($transport) {
        case 'telegram':
            $token = (string) ($config['bot_token'] ?? '');
            $chatId = (string) ($config['chat_ids'][$citySlug] ?? $config['chat_id'] ?? '');
            $topicId = (string) ($config['topic_ids'][$citySlug] ?? '');
            if ($token === '' || $chatId === '') {
                return 'not_configured';
            }
            return sendTelegram($token, $chatId, $topicId, $text) ? null : 'delivery_failed';

        case 'webhook':
            $url = (string) ($config['webhook_url'] ?? '');
            $secret = (string) ($config['webhook_token'] ?? '');
            // Только https: заявка содержит имя и телефон пациента.
            if ($url === '' || $secret === '' || !str_starts_with($url, 'https://')) {
                return 'not_configured';
            }
            return sendWebhook($url, $secret, $citySlug, $text) ? null : 'delivery_failed';

        case 'stub':
            // Без персональных данных: имя и телефон в логи не пишем.
            error_log('[dent32-booking] stub: заявка не отправлена, город=' . ($citySlug !== '' ? $citySlug : '-'));
            return null;

        default:
            return 'not_configured';
    }
}

function sendTelegram(string $token, string $chatId, string $topicId, string $text): bool
{
    // Токен подставляется в путь запроса — проверяем формат, чтобы опечатка
    // в config.php не превратилась в запрос на чужой адрес.
    if (!preg_match('/^\d+:[A-Za-z0-9_-]+$/', $token)) {
        error_log('[dent32-booking] telegram: неверный формат bot_token');
        return false;
    }
    $fields = [
        'chat_id' => $chatId,
        'text' => $text,
        'disable_web_page_preview' => 'true',
    ];
    if ($topicId !== '') {
        $fields['message_thread_id'] = $topicId;
    }

    [$status, $response] = httpPost(
        "https://api.telegram.org/bot{$token}/sendMessage",
        'application/x-www-form-urlencoded',
        http_build_query($fields),
        []
    );
    if ($response === null || $status !== 200) {
        return false;
    }
    $decoded = json_decode($response, true);
    return is_array($decoded) && ($decoded['ok'] ?? false) === true;
}

/**
 * Заготовка под бот/CRM клиники. Тело — JSON { city, text }, авторизация —
 * заголовок Authorization: Bearer <webhook_token>. Когда придёт документация
 * их API — поправить здесь поля запроса и проверку ответа, больше нигде.
 */
function sendWebhook(string $url, string $secret, string $citySlug, string $text): bool
{
    [$status] = httpPost(
        $url,
        'application/json',
        (string) json_encode(['city' => $citySlug, 'text' => $text], JSON_UNESCAPED_UNICODE),
        ['Authorization: Bearer ' . $secret]
    );
    return $status >= 200 && $status < 300;
}

/**
 * POST с таймаутом 10 с и проверкой TLS-сертификата. Хостинг без curl —
 * тот же запрос через stream.
 *
 * @param list<string> $headers
 * @return array{0:int,1:?string} [HTTP-статус (0 — сеть), тело ответа]
 */
function httpPost(string $url, string $contentType, string $body, array $headers): array
{
    $headers[] = 'Content-Type: ' . $contentType;

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);
        $response = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
        return [$status, is_string($response) ? $response : null];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers) . "\r\n",
            'content' => $body,
            'timeout' => 10,
            'ignore_errors' => true,
            'follow_location' => 0,
        ],
        'ssl' => ['verify_peer' => true, 'verify_peer_name' => true],
    ]);
    $response = @file_get_contents($url, false, $context);
    $status = 0;
    foreach ($http_response_header ?? [] as $h) {
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
            $status = (int) $m[1];
        }
    }
    return [$status, $response === false ? null : $response];
}
