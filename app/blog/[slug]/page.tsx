import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react'

import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { BookingCta } from '@/components/blog/booking-cta'
import { getBlogPost, getBlogSlugs, getPublishedPosts, formatBlogDate } from '@/lib/blog'

// Все статьи известны на этапе сборки — страницы получаются статическими.
export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return {}

  return {
    title: `${post.meta.title} — блог 32Дент`,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: 'article',
      publishedTime: post.meta.date,
      images: post.meta.cover ? [post.meta.cover] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  // Черновик недоступен по прямой ссылке — иначе его найдут поисковики.
  if (!post || post.meta.draft) notFound()

  const { meta, Content } = post
  const others = (await getPublishedPosts()).filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <div className="bg-(--page-surface)">
      <Reveal delay={0}>
        <SectionPanel variant="dark">
          <div className="flex max-w-3xl flex-col gap-4">
            <Link
              href="/blog/"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-(--panel-body) transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Все статьи
            </Link>
            <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance text-(--panel-heading) sm:text-4xl">
              {meta.title}
            </h1>
            <p className="text-pretty leading-relaxed text-(--panel-body)">{meta.description}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-(--panel-body)">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" />
                {formatBlogDate(meta.date)}
              </span>
              {meta.author && (
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="size-4" />
                  {meta.author}
                </span>
              )}
            </div>
          </div>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="neutral">
          <article className="mx-auto max-w-2xl">
            {meta.cover && (
              <div className="relative mb-8 aspect-16/9 w-full overflow-hidden rounded-2xl ring-1 ring-silver/25">
                <Image
                  src={meta.cover}
                  alt={meta.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  priority
                  className="object-cover"
                />
              </div>
            )}
            <Content />
            <BookingCta />
          </article>
        </SectionPanel>
      </Reveal>

      {others.length > 0 && (
        <Reveal delay={1}>
          <SectionPanel variant="lavender">
            <h2 className="mb-6 font-heading text-2xl font-bold tracking-tight text-(--panel-heading)">
              Другие статьи
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/blog/${other.slug}/`}
                  className="group flex flex-col gap-2 rounded-xl bg-card p-5 ring-1 ring-silver/25 transition-shadow duration-300 hover:shadow-lg hover:ring-primary/40"
                >
                  <span className="text-xs text-muted-foreground">{formatBlogDate(other.date)}</span>
                  <h3 className="font-heading text-base font-bold text-balance text-foreground">
                    {other.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{other.description}</p>
                </Link>
              ))}
            </div>
          </SectionPanel>
        </Reveal>
      )}
    </div>
  )
}
