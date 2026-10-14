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
 * @param list<array{path:string,name:string,mime:string}> $files снимки к заявке (уже проверены)
 * @return string|null null — доставлено; 'files_failed' — текст доставлен,
 *                     снимки нет; иначе код ошибки для ответа формы
 */
function deliverBooking(array $config, string $citySlug, string $text, array $files = []): ?string
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
            $sent = sendTelegram($token, $chatId, $topicId, $text);
            if ($sent === null) {
                return 'delivery_failed';
            }
            if ($files === []) {
                return null;
            }
            return sendTelegramFiles($token, $sent, $files) ? null : 'files_failed';

        case 'webhook':
            $url = (string) ($config['webhook_url'] ?? '');
            $secret = (string) ($config['webhook_token'] ?? '');
            // Только https: заявка содержит имя и телефон пациента.
            if ($url === '' || $secret === '' || !str_starts_with($url, 'https://')) {
                return 'not_configured';
            }
            if (!sendWebhook($url, $secret, $citySlug, $text)) {
                return 'delivery_failed';
            }
            // Формат передачи файлов в их API неизвестен — снимки не уходят,
            // форма попросит пациента прислать их в мессенджер.
            return $files === [] ? null : 'files_failed';

        case 'stub':
            // Без персональных данных: имя и телефон в логи не пишем.
            error_log('[dent32-booking] stub: заявка не отправлена, город=' . ($citySlug !== '' ? $citySlug : '-') . ', файлов=' . count($files));
            return null;

        default:
            return 'not_configured';
    }
}

/**
 * @return array{chat_id:string,message_id:int,topic_id:string}|null куда
 *         легло сообщение — туда же ответом уйдут снимки; null — не доставлено
 */
function sendTelegram(string $token, string $chatId, string $topicId, string $text): ?array
{
    // Токен подставляется в путь запроса — проверяем формат, чтобы опечатка
    // в config.php не превратилась в запрос на чужой адрес.
    if (!preg_match('/^\d+:[A-Za-z0-9_-]+$/', $token)) {
        error_log('[dent32-booking] telegram: неверный формат bot_token');
        return null;
    }
    $fields = [
        'chat_id' => $chatId,
        'text' => $text,
        'disable_web_page_preview' => 'true',
    ];
    if ($topicId !== '') {
        $fields['message_thread_id'] = $topicId;
    }

    $result = telegramSendMessage($token, $fields);
    if (($result['ok'] ?? false) === true) {
        return sentMessage($result, $fields);
    }

    // Обычная группа стала супергруппой (включили историю для новых
    // участников, публичную ссылку, темы и т. п.) — у неё новый id, старый
    // больше не принимает сообщения. Telegram сам называет новый id:
    // переотправляем туда, чтобы заявка не потерялась, и пишем в лог,
    // какой chat_id заменить в config.php.
    $newChatId = (string) ($result['parameters']['migrate_to_chat_id'] ?? '');
    if ($newChatId !== '' && $newChatId !== $chatId) {
        error_log("[dent32-booking] telegram: группа {$chatId} стала супергруппой {$newChatId} — замените chat_id в config.php");
        $fields['chat_id'] = $newChatId;
        unset($fields['message_thread_id']); // у обычной группы тем не было
        $result = telegramSendMessage($token, $fields);
        if (($result['ok'] ?? false) === true) {
            return sentMessage($result, $fields);
        }
    }

    // Причина отказа без текста заявки: «chat not found», «bot was kicked»…
    error_log('[dent32-booking] telegram: ' . ($result['description'] ?? 'нет ответа от api.telegram.org') . ", chat_id={$fields['chat_id']}");
    return null;
}

/**
 * @param array<string,mixed>  $result ответ sendMessage
 * @param array<string,string> $fields запрос, с которым он ушёл
 * @return array{chat_id:string,message_id:int,topic_id:string}
 */
function sentMessage(array $result, array $fields): array
{
    return [
        'chat_id' => $fields['chat_id'],
        'message_id' => (int) ($result['result']['message_id'] ?? 0),
        'topic_id' => $fields['message_thread_id'] ?? '',
    ];
}

/**
 * Снимки — документами (sendDocument), а не фото: sendPhoto пережимает
 * картинку, а на панорамном снимке важна каждая деталь. Каждый файл —
 * ответом на сообщение заявки, чтобы в общей группе было видно, чьи они.
 *
 * @param array{chat_id:string,message_id:int,topic_id:string} $sent
 * @param list<array{path:string,name:string,mime:string}>     $files
 */
function sendTelegramFiles(string $token, array $sent, array $files): bool
{
    $ok = true;
    $count = count($files);
    foreach ($files as $i => $file) {
        $fields = [
            'chat_id' => $sent['chat_id'],
            'caption' => sprintf('Снимок %d из %d к заявке выше', $i + 1, $count),
        ];
        if ($sent['message_id'] > 0) {
            $fields['reply_parameters'] = (string) json_encode([
                'message_id' => $sent['message_id'],
                'allow_sending_without_reply' => true,
            ]);
        }
        if ($sent['topic_id'] !== '') {
            $fields['message_thread_id'] = $sent['topic_id'];
        }

        [$contentType, $body] = multipartBody($fields, 'document', $file);
        [, $response] = httpPost("https://api.telegram.org/bot{$token}/sendDocument", $contentType, $body, [], 60);
        $decoded = $response === null ? null : json_decode($response, true);
        if (!is_array($decoded) || ($decoded['ok'] ?? false) !== true) {
            error_log('[dent32-booking] telegram sendDocument: ' . (is_array($decoded) ? ($decoded['description'] ?? '?') : 'нет ответа'));
            $ok = false;
        }
    }
    return $ok;
}

/**
 * multipart/form-data вручную, а не CURLFile: так тот же httpPost работает
 * и на хостинге без curl.
 *
 * @param array<string,string>                    $fields
 * @param array{path:string,name:string,mime:string} $file
 * @return array{0:string,1:string} [Content-Type с boundary, тело]
 */
function multipartBody(array $fields, string $fileField, array $file): array
{
    $boundary = '----dent32' . bin2hex(random_bytes(12));
    $body = '';
    foreach ($fields as $name => $value) {
        $body .= "--{$boundary}\r\nContent-Disposition: form-data; name=\"{$name}\"\r\n\r\n{$value}\r\n";
    }
    // Имя файла собрано в booking.php из номера и расширения — кавычек и
    // переводов строк в нём нет.
    $body .= "--{$boundary}\r\nContent-Disposition: form-data; name=\"{$fileField}\"; filename=\"{$file['name']}\"\r\n"
        . "Content-Type: {$file['mime']}\r\n\r\n"
        . (string) file_get_contents($file['path']) . "\r\n--{$boundary}--\r\n";
    return ["multipart/form-data; boundary={$boundary}", $body];
}

/**
 * @param array<string,string> $fields
 * @return array<string,mixed> ответ Telegram API; [] — сеть или не JSON
 */
function telegramSendMessage(string $token, array $fields): array
{
    [, $response] = httpPost(
        "https://api.telegram.org/bot{$token}/sendMessage",
        'application/x-www-form-urlencoded',
        http_build_query($fields),
        []
    );
    // BIGINT_AS_STRING — id супергрупп (-100…) не должны терять точность.
    $decoded = $response === null ? null : json_decode($response, true, 512, JSON_BIGINT_AS_STRING);
    return is_array($decoded) ? $decoded : [];
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
 * POST с таймаутом (10 с; файлы — дольше) и проверкой TLS-сертификата.
 * Хостинг без curl — тот же запрос через stream.
 *
 * @param list<string> $headers
 * @return array{0:int,1:?string} [HTTP-статус (0 — сеть), тело ответа]
 */
function httpPost(string $url, string $contentType, string $body, array $headers, int $timeout = 10): array
{
    $headers[] = 'Content-Type: ' . $contentType;

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $timeout,
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
            'timeout' => $timeout,
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
