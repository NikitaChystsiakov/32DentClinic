import { getCityBySlug, type City } from '@/config/cities'
import type { NearbyClinic, NearbyTown } from '@/config/nearby-towns'
import { getServiceBySlug } from '@/config/services'

/** Клиника + её справочная запись из config/cities.ts, в порядке приоритета. */
export interface TownClinic extends NearbyClinic {
  city: City
}

export function getTownClinics(town: NearbyTown): TownClinic[] {
  return town.clinics.flatMap((clinic) => {
    const city = getCityBySlug(clinic.slug)
    return city ? [{ ...clinic, city }] : []
  })
}

/**
 * Первая по приоритету клиника города, где услуга реально доступна
 * (availableIn в config/services.ts). Если её нет нигде — undefined, и
 * страница услугу не показывает, а не ведёт в клинику, где её не делают.
 */
export function getClinicForService(town: NearbyTown, serviceSlug: string): TownClinic | undefined {
  const service = getServiceBySlug(serviceSlug)
  if (!service) return undefined
  return getTownClinics(town).find((clinic) => service.availableIn.includes(clinic.slug))
}

/** «45 мин», «1 ч 10 мин», «2 ч». */
export function formatTravelTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} мин`
  return m === 0 ? `${h} ч` : `${h} ч ${m} мин`
}

/** Ссылка на маршрут в Яндекс.Картах от центра города до клиники, на машине. */
export function yandexRouteHref(from: { lat: number; lng: number }, to: { lat: number; lng: number }): string {
  return `https://yandex.ru/maps/?rtext=${from.lat},${from.lng}~${to.lat},${to.lng}&rtt=auto`
}
