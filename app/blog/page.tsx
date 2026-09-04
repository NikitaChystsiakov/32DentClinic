import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CalendarDays } from 'lucide-react'

import { Reveal } from '@/components/reveal'
import { SectionPanel } from '@/components/section-panel'
import { getPublishedPosts, formatBlogDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Блог о стоматологии — 32Дент',
  description:
    'Статьи врачей 32Дент о лечении и профилактике: как проходит приём, что делать при боли, как ухаживать за зубами после лечения.',
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="bg-(--page-surface)">
      <Reveal delay={0}>
        <SectionPanel variant="dark">
          <div className="flex max-w-2xl flex-col gap-4">
            <span className="text-sm font-medium text-(--panel-eyebrow)">Блог</span>
            <h1 className="font-heading text-3xl leading-tight font-bold tracking-tight text-balance text-(--panel-heading) sm:text-4xl">
              Понятно о лечении зубов
            </h1>
            <p className="text-pretty leading-relaxed text-(--panel-body)">
              Статьи врачей клиники: что происходит на приёме, когда откладывать нельзя и как
              ухаживать за зубами, чтобы возвращаться к нам пореже.
            </p>
          </div>
        </SectionPanel>
      </Reveal>

      <Reveal delay={1}>
        <SectionPanel variant="cool-1">
          {posts.length === 0 ? (
            // Пустой блог — нормальное состояние до первой статьи: лучше честная
            // заглушка, чем выдуманные тексты ради заполнения раздела.
            <div className="flex flex-col items-start gap-3 rounded-2xl bg-card p-8 ring-1 ring-silver/25">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Первые статьи скоро появятся
              </h2>
              <p className="max-w-xl text-pretty text-muted-foreground">
                Готовим материалы вместе с врачами клиники. Пока можно посмотреть услуги и цены или
                записаться на консультацию — на приёме ответим на любые вопросы.
              </p>
              <Link
                href="/uslugi/"
                className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform hover:gap-2"
              >
                Смотреть услуги
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-silver/25 transition-shadow duration-300 hover:shadow-lg hover:ring-primary/40"
                >
                  {post.cover && (
                    <div className="relative aspect-16/9 w-full overflow-hidden">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {formatBlogDate(post.date)}
                    </span>
                    <h2 className="font-heading text-lg font-bold text-balance text-foreground">
                      {post.title}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary transition-transform duration-300 group-hover:gap-2">
                      Читать
                      <ArrowRight className="size-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </SectionPanel>
      </Reveal>
    </div>
  )
}
