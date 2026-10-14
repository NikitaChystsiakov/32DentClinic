// Убирает из out/ страницы, которые при статической сборке отрендерились как
// «не найдено»: notFound() в странице — /<город>/garantii/, пока положение о
// гарантиях не утверждено (config/guarantee-pages.ts), черновики блога
// (draft: true) и т. п.
//
// Next кладёт такой HTML по адресу самой страницы, а nginx отдаёт его с кодом
// 200 — «мягкая 404»: поисковик видит обычную страницу с заголовком главной
// города и двумя противоречащими meta robots. Убрать её из сборки через
// generateStaticParams нельзя: с output: export пустой список — ошибка сборки.
// Поэтому после next build удаляем папку целиком — тогда сервер честно
// отвечает 404 (именно папку: на пустую nginx ответил бы 403).
//
// Метка — ровно <meta name="robots" content="noindex"/>: его ставит сам Next
// на not-found. Намеренно скрытые страницы (документы, пустой блог) задают
// robots в metadata и получают «noindex, follow» / «noindex, nofollow» —
// их скрипт не трогает. Разметку not-found искать в HTML бесполезно: при
// сборке она попадает только в RSC-данные и рисуется уже в браузере.
//
// Запускается из `pnpm build`. Если убрано больше пары адресов — что-то не
// так с меткой: проверьте вывод сборки.

import { readdir, readFile, rm } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

// fileURLToPath, а не .pathname: в пути с кириллицей pathname остаётся
// в %-кодировке, и readdir не находит папку.
const root = fileURLToPath(new URL('../out/', import.meta.url))
const marker = '<meta name="robots" content="noindex"/>'

async function* pages(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      // _not-found — служебная 404 самого Next, 404.html лежит в корне.
      if (entry.name === '_next' || entry.name === '_not-found') continue
      yield* pages(path)
    } else if (entry.name === 'index.html' && dir !== root) {
      yield { dir, path }
    }
  }
}

const dropped = []
for await (const { dir, path } of pages(root)) {
  if (!(await readFile(path, 'utf8')).includes(marker)) continue
  const nested = (await readdir(dir, { withFileTypes: true })).some((e) => e.isDirectory())
  if (nested) {
    // Внутри есть настоящие страницы — папку удалять нельзя. Такого пока нет;
    // если появится, решать отдельно (nginx на папку без index.html даст 403).
    console.warn(`drop-not-found: /${relative(root, dir)}/ — внутри есть подстраницы, пропускаю`)
    continue
  }
  await rm(dir, { recursive: true })
  dropped.push(`/${relative(root, dir)}/`)
}

console.log(`drop-not-found: убрано ${dropped.length}${dropped.length ? ` — ${dropped.join(', ')}` : ''}`)
