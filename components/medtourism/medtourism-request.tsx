import { Check, MessageCircle } from 'lucide-react'

import { MedTourismHeading } from '@/components/medtourism/medtourism-heading'
import { ScanRequestForm } from '@/components/medtourism/scan-request-form'
import { SocialLinks } from '@/components/social-links'
import type { City } from '@/config/cities'
import type { MedTourismContent } from '@/content/medtourism'

/*
 * Секция «Пришлите снимок»: слева — что прислать и мессенджеры для тех, кто
 * не любит формы, справа — сама форма (клиентский островок). Якорь
 * #raschet — на него ведёт главная кнопка hero.
 */
export function MedTourismRequest({ city, content }: { city: City; content: MedTourismContent }) {
  const { request } = content
  return (
    <div id="raschet" className="grid scroll-mt-24 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
      <div className="flex flex-col gap-6">
        <MedTourismHeading eyebrow="Расчёт по снимку" title={request.title} subtitle={request.subtitle} />
        <div className="-mt-4 flex flex-col gap-3">
          <span className="text-sm font-semibold text-(--panel-heading)">Что можно прислать</span>
          <ul className="flex flex-col gap-2 text-sm text-(--panel-body)">
            {request.whatToSend.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-(--panel-heading)">
            <MessageCircle className="size-4 text-primary" />
            Или напишите нам в мессенджер
          </span>
          <SocialLinks city={city} />
        </div>
      </div>
      <ScanRequestForm
        citySlug={city.slug}
        phone={city.phone}
        phoneHref={city.phoneHref}
        responseTime={request.responseTime}
      />
    </div>
  )
}
