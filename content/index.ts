import { rogachevContent } from './rogachev'
import { minskContent } from './minsk'
import { zhlobinContent } from './zhlobin'

export type CityContent = typeof rogachevContent

export const cityContents: Record<string, CityContent> = {
  rogachev: rogachevContent,
  minsk: minskContent as CityContent,
  zhlobin: zhlobinContent as CityContent,
}

export function getCityContent(citySlug: string): CityContent | undefined {
  return cityContents[citySlug]
}
