# Деплой на VPS ActiveCloud (по SSH)

Сервер — виртуальная машина с Linux, доступ администратора (root) по SSH:

```
ssh root@178.159.44.174 -p 2200
```

Панели с кнопками нет: веб-сервер, PHP и сертификат настраиваются командами.
Принцип деплоя тот же, что в `ДЕПЛОЙ.md`: собираем `out/` на своём компьютере
и копируем на сервер. Node.js на сервере не нужен.

Порядок: шаги 1–4 ничего не меняют (подготовка и разведка), с шага 5 начинаются
изменения на сервере. Старый сайт не удаляется: новый кладётся в отдельную
папку, и откатиться можно за минуту (шаг 9).

---

## 1. Что поменять в проекте перед сборкой

### Обязательно

1. **`lib/site-config.ts` → `siteUrl`.** Уже стоит `https://32dent.by` (без `www`).
   Адрес — с `https://`, без слэша на конце, ровно в том виде, в каком сайт
   открывается: `www.32dent.by` должен перекидывать на `32dent.by`. От этого адреса строятся
   `sitemap.xml`, `robots.txt`, canonical и Open Graph. Больше адрес нигде
   не прописан.
2. **Заглушки `[TBD]`, которые видны посетителю.** Сейчас их 60 страниц:
   - в подвале и реквизитах: `ООО «32 Дент-Эксперт» · УНП 491502772 · [TBD]`
     (не хватает юр. адреса);
   - в политике конфиденциальности: «пишите на [TBD]» (не хватает e-mail).

   Где что заполнять — `ЗАГЛУШКИ-И-УТОЧНЕНИЯ.md` и `config/legal.ts`. Если клиника
   данные ещё не дала, решите с заказчиком, запускать ли с заглушками.
3. **Токен бота для формы записи** (`ФОРМА-ЗАПИСИ.md`). Без него форма
   не работает. Режим `stub` годится только для проверки: посетитель видит
   «отправлено», а заявка теряется.

### Проверить, что всё готово

```bash
grep -rn "TBD" config/cities.ts config/legal.ts lib/site-config.ts | head -30
```

## 2. Нужно ли удалять .md и прочие «лишние» файлы

**Из проекта ничего удалять не нужно.** На сервер попадает только папка `out/`,
а в неё при сборке идут:

- сгенерированные страницы (HTML) и `_next/` (CSS/JS);
- содержимое `public/` как есть.

`docs/*.md`, `README.md`, `CLAUDE.md`, `content/blog/*.mdx`, `node_modules/`,
`assets/` в `out/` не попадают и на сервер не уезжают.

Что всё-таки стоит исключить или убрать:

| Файл | Что делать |
|---|---|
| `.DS_Store` (macOS кладёт их в каждую папку, в `out/` их 8) | не заливать: команда в шаге 7 их исключает. Через них можно узнать имена файлов в папках |
| `public/placeholder*.{png,svg,jpg}` (5 шт., остатки шаблона v0) | нигде не используются, можно удалить из `public/` |
| `out/api/config.example.php` | безвреден: доступ к нему закрыт (Apache — `api/.htaccess`, nginx — конфиг из шага 6) |

## 3. Подходит ли тариф

Сайт лёгкий: статические файлы и один PHP-скрипт. Нагрузка на процессор
почти нулевая, требования такие:

| Ресурс | Нужно | Как проверить на сервере |
|---|---|---|
| Процессор | 1 ядро — достаточно | `nproc` |
| Память | от 512 МБ, комфортно 1 ГБ | `free -h` (строка `Mem`, колонка `available`) |
| Диск | сайт весит **~110 МБ** (из них 62 МБ — видео). Свободных нужно от **1 ГБ** (сайт, бэкапы, логи, обновления) | `df -h /` (колонка `Avail`) |
| Linux | Ubuntu 22.04+ или Debian 12+ (там PHP 8.1+ из коробки) | `cat /etc/os-release` |
| PHP | **8.1 или новее** (в `booking.php` есть тип `never`) и модуль curl | `php -v`, `php -m \| grep curl` |

Что посмотреть в личном кабинете ActiveCloud (или спросить у владельца
аккаунта):

- **Трафик.** Он ограничен или безлимитный, и какая скорость канала.
  Главный расход — видеообзоры клиник: один полный просмотр ≈ 5–15 МБ.
  При лимите вроде 1 ТБ/мес это десятки тысяч просмотров, для сайта клиники
  с запасом.
- **Бэкапы (снапшоты) от хостера.** Входят ли в тариф. Если нет, хотя бы
  сделайте снапшот вручную перед переездом.
- **Кто платит и до какого числа оплачено.** Сервер отключат при неоплате.
- **Что ещё работает на этом сервере** (почта, другие сайты), чтобы ничего
  не задеть.

Вывод: почти любой VPS с 1 ГБ памяти и парой гигабайт свободного диска
подходит. Менять тариф стоит только если `df -h` показывает меньше 1 ГБ
свободного места или трафик лимитирован совсем маленьким объёмом.

## 4. Разведка сервера (ничего не меняет)

Зайдите на сервер (`ssh root@178.159.44.174 -p 2200`, пароль при вводе
не отображается) и выполните по очереди:

```bash
cat /etc/os-release | head -3          # версия Linux
nproc; free -h; df -h /                # ресурсы (см. шаг 3)
systemctl is-active nginx apache2      # какой веб-сервер работает
php -v; php -m | grep -i curl          # PHP и curl
ls /var/www                            # где обычно лежат сайты
ls /etc/nginx/sites-enabled 2>/dev/null; ls /etc/apache2/sites-enabled 2>/dev/null
grep -rn "root\|server_name" /etc/nginx/sites-enabled 2>/dev/null
grep -rn "DocumentRoot\|ServerName" /etc/apache2/sites-enabled 2>/dev/null
ls /etc/letsencrypt/live 2>/dev/null   # есть ли сертификат https
ls /run/php/ 2>/dev/null               # сокет php-fpm (нужен для nginx)
```

Из ответов нужно понять и записать:

- **веб-сервер:** `nginx` или `apache2` (тот, что `active`);
- **папку старого сайта** (строка `root` у nginx или `DocumentRoot` у Apache);
- **файл конфига** сайта в `sites-enabled`;
- **есть ли PHP ≥ 8.1** и сертификат для домена.

С вашего компьютера проверьте, что домен смотрит на этот сервер:

```bash
dig +short ДОМЕН.by
dig +short www.ДОМЕН.by
```

Должно вернуть `178.159.44.174`. Если адрес другой, сайт на этом сервере никто
не увидит. Тогда нужен доступ к регистратору домена (hoster.by, domain.by и т. п.),
чтобы поменять A-запись. Спросите у Ильи, у кого он.

### Адреса старого сайта

Посетители и поисковики знают адреса старого сайта. Прежде чем его заменять,
сохраните их список:

```bash
curl -s https://ДОМЕН.by/sitemap.xml > ~/Desktop/old-sitemap.xml
```

Если sitemap нет, посмотрите файлы в папке старого сайта. Важные старые
страницы (услуги, цены, контакты) нужно перенаправить на новые (301-редирект,
шаг 6), иначе позиции в Google и Яндексе просядут.

## 5. Бэкап старого сайта

На сервере (`ПАПКА_СТАРОГО_САЙТА` — из шага 4):

```bash
tar czf /root/old-site-$(date +%F).tar.gz ПАПКА_СТАРОГО_САЙТА
cp -r /etc/nginx/sites-available /root/nginx-backup-$(date +%F)     # если nginx
cp -r /etc/apache2/sites-available /root/apache-backup-$(date +%F)  # если Apache
ls -lh /root/*.tar.gz
```

Скачайте архив себе (команду выполняйте **на своём компьютере**, не на сервере):

```bash
scp -P 2200 root@178.159.44.174:/root/old-site-*.tar.gz ~/Desktop/
```

Обратите внимание: у `scp` порт задаётся большой `-P`, а у `ssh` маленькой `-p`.

## 6. Подготовить сервер

Новый сайт будет лежать в **`/var/www/32dent`**, а старый останется на месте.

### Если PHP нет или он старше 8.1 (Ubuntu/Debian)

```bash
apt update
apt install php-fpm php-curl    # для nginx
# для Apache вместо этого: apt install php libapache2-mod-php php-curl
apt install rsync               # для заливки файлов (шаг 7)
```

### Вариант A: Apache

`.htaccess` из проекта работает как есть, если в конфиге сайта разрешены
переопределения. Отредактируйте файл из `/etc/apache2/sites-enabled/`
(редактор: `nano ФАЙЛ`, сохранить — Ctrl+O, Enter, выйти — Ctrl+X):

```apache
DocumentRoot /var/www/32dent
<Directory /var/www/32dent>
    AllowOverride All
    Require all granted
</Directory>
```

Включите модули и проверьте конфиг:

```bash
a2enmod headers deflate alias
apache2ctl configtest      # должно быть «Syntax OK»
```

### Вариант B: nginx

nginx не читает `.htaccess`, поэтому его правила (404, кеш, сжатие, редиректы,
закрытый `config.php`) переносятся в конфиг. Меняются в файле сайта из
`/etc/nginx/sites-enabled/` строки `root` и всё внутри `server { … }`, кроме
`listen`, `server_name` и строк `ssl_…`, которые добавил certbot (их не трогать):

```nginx
    root /var/www/32dent;
    index index.html;
    charset utf-8;
    error_page 404 /404.html;

    gzip on;
    gzip_types text/plain text/css text/xml application/javascript application/json image/svg+xml;

    # 301 со старых адресов рогачёвской версии (то же, что в .htaccess).
    # Сюда же добавляйте редиректы со страниц старого сайта (шаг 4).
    rewrite ^/uslugi/(.*)$       /rogachev/uslugi/$1  permanent;
    rewrite ^/vrachi/(.*)$       /rogachev/vrachi/$1  permanent;
    rewrite ^/ceny/?$            /rogachev/ceny/      permanent;
    rewrite ^/o-nas/(.*)$        /rogachev/o-nas/$1   permanent;
    rewrite ^/kontakty/?$        /rogachev/kontakty/  permanent;
    rewrite ^/kalkulyator/?$     /rogachev/kalkulyator/ permanent;
    rewrite ^/primery-rabot/?$   /rogachev/primery-rabot/ permanent;

    location / {
        try_files $uri $uri/ =404;
    }

    # Хэшированные файлы Next — кеш навсегда.
    location ^~ /_next/static/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    # Видео — неделя.
    location ^~ /video/ {
        add_header Cache-Control "public, max-age=604800";
    }
    # Картинки, иконки, шрифты — месяц.
    location ~* \.(webp|jpe?g|png|gif|svg|ico|woff2?)$ {
        add_header Cache-Control "public, max-age=2592000";
    }

    # Наружу отдаётся только booking.php; config.php и прочие .php закрыты.
    location = /api/booking.php {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;   # версию — по `ls /run/php/`
    }
    location ~ \.php$ {
        return 404;
    }

    location ~ /\.(?!well-known) {
        return 404;   # .htaccess, .DS_Store и прочие скрытые файлы (кроме .well-known для certbot)
    }
```

Проверка конфига (без перезапуска):

```bash
nginx -t      # должно быть «syntax is ok» и «test is successful»
```

### Если сертификата для домена нет

После того как сайт заработает по `http://` (шаг 8), выпустите бесплатный
сертификат Let's Encrypt:

```bash
apt install certbot python3-certbot-nginx     # для Apache: python3-certbot-apache
certbot --nginx -d ДОМЕН.by -d www.ДОМЕН.by   # для Apache: --apache
```

certbot сам пропишет https в конфиг и будет продлевать сертификат.

## 7. Собрать и залить

На своём компьютере, в папке проекта:

```bash
pnpm build
find out -name .DS_Store -delete
rsync -avz --delete --exclude '.DS_Store' \
  -e "ssh -p 2200" out/ root@178.159.44.174:/var/www/32dent/
```

- Слэш в конце `out/` обязателен: так копируется **содержимое** папки, а не она сама.
- `--delete` удаляет на сервере файлы, которых больше нет в сборке (например,
  старые `_next/static/…`). Поэтому `config.php` кладём **вне** этой папки (ниже).
- Без rsync на сервере это можно сделать в Cyberduck/FileZilla: протокол
  **SFTP**, сервер `178.159.44.174`, порт `2200`, пользователь `root`. Включите
  показ скрытых файлов, чтобы уехал `.htaccess`.

После первой заливки дайте веб-серверу права на чтение:

```bash
ssh -p 2200 root@178.159.44.174 "chown -R root:root /var/www/32dent && chmod -R a+rX /var/www/32dent"
```

### config.php формы записи (один раз)

`booking.php` сначала ищет конфиг на уровень выше папки сайта, то есть
`/var/www/dent32-booking-config.php`. Туда веб-сервер файлы не отдаёт вообще,
и `rsync --delete` его не тронет. На сервере:

```bash
cp /var/www/32dent/api/config.example.php /var/www/dent32-booking-config.php
nano /var/www/dent32-booking-config.php     # вписать bot_token и chat_id
chown root:www-data /var/www/dent32-booking-config.php
chmod 640 /var/www/dent32-booking-config.php
```

## 8. Переключить и проверить

Применить конфиг (старый сайт сменится новым):

```bash
nginx -t && systemctl reload nginx                # nginx
apache2ctl configtest && systemctl reload apache2  # Apache
```

Проверка с вашего компьютера:

- [ ] Главная, `/minsk/`, `/rogachev/uslugi/implantaciya/` открываются, стили на месте.
- [ ] `/abc/` показывает фирменную 404.
- [ ] `/uslugi/implantaciya/` перекидывает на `/rogachev/uslugi/implantaciya/`.
- [ ] `/sitemap.xml` и `/robots.txt` открываются, адреса в них — боевой домен.
- [ ] `https://` работает, `http://` и вариант с/без `www` перекидывают на адрес из `siteUrl`.
- [ ] Закрытые файлы не отдаются (ждём `403` или `404`):
      `curl -sI https://ДОМЕН.by/api/config.example.php | head -1`
      `curl -sI https://ДОМЕН.by/.htaccess | head -1`
- [ ] Кеш работает:
      `curl -sI https://ДОМЕН.by/icon.svg | grep -i cache-control`
- [ ] Тестовая заявка с формы записи пришла в Telegram (Минск, Рогачёв, Жлобин).
- [ ] Видео в карточках клиник играет (в Safari тоже).
- [ ] Старые важные адреса (шаг 4) не отдают 404.

## 9. Если что-то пошло не так — откат

Верните в конфиге сайта старую строку `root` / `DocumentRoot` (копия — в
`/root/nginx-backup-…` или `/root/apache-backup-…`) и перезагрузите веб-сервер
командой из шага 8. Старый сайт всё это время лежит нетронутым.

## 10. После запуска

- Добавьте сайт в **Google Search Console** и **Яндекс Вебмастер**,
  отправьте `https://ДОМЕН.by/sitemap.xml`.
- Через пару недель, если всё стабильно, удалите старую папку и бэкап
  с сервера (скачанная копия останется у вас).
- **Безопасность:** настройте вход по SSH-ключу вместо пароля. Пароль от root
  знают несколько человек, его стоит сменить (`passwd`), согласовав с
  владельцем сервера.

## Обновление сайта в дальнейшем

```bash
pnpm build
find out -name .DS_Store -delete
rsync -avz --delete --exclude '.DS_Store' \
  -e "ssh -p 2200" out/ root@178.159.44.174:/var/www/32dent/
```

Перезапускать веб-сервер не нужно: новые файлы отдаются сразу.

---

## Вопросы Илье

1. Домен смотрит на этот сервер? У кого доступ к регистратору домена?
2. Какой веб-сервер стоит, где лежит текущий сайт и его конфиг?
3. Есть ли https (certbot) и продлевается ли он сам?
4. Что ещё работает на сервере (почта на домене, другие сайты)?
5. Тариф: лимит трафика, бэкапы, кто платит и до какого числа?
6. Можно ли поставить PHP 8.1+ (`php-fpm`, `php-curl`), если его нет?
7. Не против ли он, чтобы перевести вход на SSH-ключ и сменить пароль root?
