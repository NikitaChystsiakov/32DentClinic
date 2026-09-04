import fs from 'node:fs'
import path from 'node:path'

/**
 * Метаданные статьи. Каждая статья объявляет их у себя в начале файла:
 *
 *   export const meta = {
 *     title: 'Заголовок',
 *     description: 'Одно предложение для списка и поисковой выдачи',
 *     date: '2026-09-04',
 *     author: 'Иванов Иван, врач-стоматолог',
 *   }
 *
 * Отдельный парсер frontmatter не нужен: MDX поддерживает обычный export,
 * поэтому метаданные читаются тем же импортом, что и сам текст.
 */
export interface BlogMeta {
  title: string
  description: string
  /** ISO-дата публикации, YYYY-MM-DD. */
  date: string
  /** Автор — врач или клиника. Необязателен. */
  author?: string
  /** Обложка из public, например '/images/blog/karies.webp'. */
  cover?: string
  /**
   * Черновик не публикуется: он не попадает ни в список, ни в sitemap, а
   * страница отдаёт 404. Так недописанную статью можно спокойно держать
   * в репозитории.
   */
  draft?: boolean
}

export interface BlogPost extends BlogMeta {
  slug: string
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

/** Имена файлов без расширения — они же адреса статей. */
export function getBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

/**
 * Статья целиком: метаданные и готовый к рендеру компонент.
 * Импорт динамический, потому что список файлов известен только во время
 * сборки — статически перечислить их в коде нельзя.
 */
export async function getBlogPost(slug: string) {
  if (!getBlogSlugs().includes(slug)) return null
  const mod = await import(`@/content/blog/${slug}.mdx`)
  const meta = mod.meta as BlogMeta | undefined
  if (!meta) return null
  return { slug, meta, Content: mod.default as React.ComponentType }
}

/** Опубликованные статьи, новые сверху. Черновики скрыты. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await Promise.all(
    getBlogSlugs().map(async (slug) => {
      const post = await getBlogPost(slug)
      return post ? { slug, ...post.meta } : null
    })
  )
  return posts
    .filter((post): post is BlogPost => post !== null && !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Дата в виде «4 сентября 2026» — для карточек и страницы статьи. */
export function formatBlogDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}
