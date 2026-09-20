#!/bin/zsh
# Сборка урезанных шрифтов для app/fonts (см. комментарий в app/layout.tsx).
# Запускать вручную, когда нужен новый вес или символ: `zsh scripts/subset-fonts.sh`.
# Нужны python3 и fonttools с brotli: `pip3 install fonttools brotli`.
#
# Что делает: качает вариативные TTF из репозитория Google Fonts, обрезает ось
# wght до используемых на сайте весов (instancer) и оставляет только нужные
# глифы (subset): базовая латиница, кириллица, типографские знаки. Итог —
# ~75 КБ на оба шрифта вместо 142 КБ у next/font/google.
set -euo pipefail

cd "$(dirname "$0")/.."
tmp=$(mktemp -d)
out=app/fonts

# Что оставляем: пробел…~ (латиница, цифры, пунктуация), NBSP © « ® ° · » ×,
# кириллица с Ёё/Іі/Ўў, Ґґ, тире, кавычки, •, …, №, ™, −, ∞, ≈, ₽.
unicodes='U+0020-007E,U+00A0,U+00A9,U+00AB,U+00AE,U+00B0,U+00B7,U+00BB,U+00D7,U+0400-045F,U+0490-0491,U+2013,U+2014,U+2018-201F,U+2022,U+2026,U+2116,U+2122,U+2212,U+221E,U+2248,U+20BD'

build() {
  local name=$1 url=$2 range=$3
  curl -sSL -o "$tmp/$name.ttf" "$url"
  python3 -m fontTools.varLib.instancer -q -o "$tmp/$name-cut.ttf" "$tmp/$name.ttf" "wght=$range"
  python3 -m fontTools.subset "$tmp/$name-cut.ttf" \
    --unicodes="$unicodes" --flavor=woff2 --no-hinting \
    --output-file="$out/$name-${range/:/-}.woff2"
  ls -la "$out/$name-${range/:/-}.woff2"
}

# Веса: Golos — font-normal…font-bold, Unbounded — font-medium…font-bold
# (заголовки диалогов идут с font-medium). Новый вес → поправить диапазон здесь
# и `weight` в app/layout.tsx.
build golos-text 'https://github.com/google/fonts/raw/main/ofl/golostext/GolosText%5Bwght%5D.ttf' 400:700
build unbounded  'https://github.com/google/fonts/raw/main/ofl/unbounded/Unbounded%5Bwght%5D.ttf' 500:700

rm -rf "$tmp"
