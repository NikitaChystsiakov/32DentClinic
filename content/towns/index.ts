// Реестр текстов посадочных страниц «соседних» городов. Ключ — slug из
// config/nearby-towns.ts. Новый город: создайте content/towns/<город>.ts по
// образцу svetlogorsk.ts и добавьте строку в объект ниже.

import type { TownContent } from './types'
import { bobruiskContent } from './bobruisk'
import { bykhovContent } from './bykhov'
import { svetlogorskContent } from './svetlogorsk'

export type { TownContent } from './types'

export const townContents: Record<string, TownContent> = {
  svetlogorsk: svetlogorskContent,
  bobruisk: bobruiskContent,
  bykhov: bykhovContent,
}

export function getTownContent(townSlug: string): TownContent | undefined {
  return townContents[townSlug]
}
