import { type NextRequest, NextResponse } from 'next/server'

const GEO_MAP: Record<string, { slug: string; name: string }> = {
  minsk: { slug: 'minsk', name: 'Минск' },
  'минск': { slug: 'minsk', name: 'Минск' },
  rogachev: { slug: 'rogachev', name: 'Рогачёв' },
  'рогачёв': { slug: 'rogachev', name: 'Рогачёв' },
  'rogachevskiy': { slug: 'rogachev', name: 'Рогачёв' },
  zhlobin: { slug: 'zhlobin', name: 'Жлобин' },
  'жлобин': { slug: 'zhlobin', name: 'Жлобин' },
  'zhlobinskiy': { slug: 'zhlobin', name: 'Жлобин' },
}

const BOT_RE = /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|preview|archive|semrush|ahref/i

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname !== '/') {
    return NextResponse.next()
  }

  const ua = request.headers.get('user-agent') ?? ''
  if (BOT_RE.test(ua)) {
    return NextResponse.next()
  }

  const geoCity = (request.geo?.city ?? '').toLowerCase().trim()
  const matched = GEO_MAP[geoCity]

  if (!matched) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  response.headers.set('x-suggested-city', matched.slug)
  response.headers.set('x-suggested-city-name', matched.name)
  return response
}

export const config = {
  matcher: ['/'],
}
