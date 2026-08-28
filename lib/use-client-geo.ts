'use client'

import { useState, useEffect } from 'react'

const CITY_MAP: Record<string, { slug: string; name: string }> = {
  минск: { slug: 'minsk', name: 'Минск' },
  rogachev: { slug: 'rogachev', name: 'Рогачёв' },
  рогачёв: { slug: 'rogachev', name: 'Рогачёв' },
  rogačoŭ: { slug: 'rogachev', name: 'Рогачёв' },
  жлобин: { slug: 'zhlobin', name: 'Жлобин' },
  zhlobin: { slug: 'zhlobin', name: 'Жлобин' },
}

const CACHE_KEY = 'client-geo'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface CachedGeo {
  slug: string
  name: string
  ts: number
}

function readCache(): CachedGeo | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data: CachedGeo = JSON.parse(raw)
    if (Date.now() - data.ts > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

function writeCache(slug: string, name: string) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ slug, name, ts: Date.now() }))
  } catch {}
}

export function useClientGeo(): { slug: string; name: string } | null {
  const [result, setResult] = useState<{ slug: string; name: string } | null>(null)

  useEffect(() => {
    const cached = readCache()
    if (cached) {
      setResult({ slug: cached.slug, name: cached.name })
      return
    }

    let cancelled = false

    fetch('https://ipwho.is/')
      .then((r) => {
        if (!r.ok) throw new Error('geo fetch failed')
        return r.json()
      })
      .then((data) => {
        if (cancelled) return
        const city: string | undefined = data?.city
        if (!city) return
        const matched = CITY_MAP[city.toLowerCase().trim()]
        if (matched) {
          writeCache(matched.slug, matched.name)
          setResult({ slug: matched.slug, name: matched.name })
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return result
}
