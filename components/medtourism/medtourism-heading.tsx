/*
 * Заголовок секции страницы медтуризма — тот же ритм, что у секций
 * «соседних» городов (components/town): надзаголовок, h2, подводка, цвета
 * из токенов панели (--panel-*), чтобы текст читался на любом её фоне.
 */
export function MedTourismHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <span className="text-sm font-medium text-(--panel-eyebrow)">{eyebrow}</span>
      <h2 className="text-balance font-heading text-3xl font-bold tracking-tight text-(--panel-heading)">{title}</h2>
      {subtitle && <p className="max-w-2xl text-pretty text-(--panel-body)">{subtitle}</p>}
    </div>
  )
}

/** Плашка «согласовать» у пункта, который клиника ещё не подтвердила (только в черновике). */
export function TbdBadge() {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 ring-1 ring-amber-300">
      согласовать
    </span>
  )
}
