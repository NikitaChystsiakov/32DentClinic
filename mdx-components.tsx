import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'

/**
 * Оформление тегов внутри статей блога. Обязательный для @next/mdx файл:
 * без него MDX в App Router не работает.
 *
 * Автор статьи пишет обычный markdown, а стили берутся отсюда — так все
 * статьи выглядят одинаково и в одном стиле с сайтом, без классов в тексте.
 */
const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="mt-10 mb-3 font-heading text-2xl font-bold tracking-tight text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-2 font-heading text-xl font-semibold text-foreground">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-4 flex list-disc flex-col gap-2 pl-5 text-muted-foreground">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 flex list-decimal flex-col gap-2 pl-5 text-muted-foreground">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-r-xl border-l-4 border-accent bg-card px-5 py-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-silver/30" />,
  // Внутренние ссылки через next/link — иначе переход перезагружает страницу.
  a: ({ href = '', children }) => {
    const isInternal = href.startsWith('/')
    const className = 'font-medium text-primary underline underline-offset-4 hover:text-accent'
    return isInternal ? (
      <Link href={href} className={className}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  },
  img: (props) => (
    <Image
      src={typeof props.src === 'string' ? props.src : ''}
      alt={props.alt ?? ''}
      width={1200}
      height={800}
      className="my-6 h-auto w-full rounded-2xl ring-1 ring-silver/25"
    />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}
