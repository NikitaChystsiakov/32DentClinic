'use client'

import dynamic from 'next/dynamic'

const BookingModal = dynamic(() => import('@/components/booking-modal'), {
  ssr: false,
})

export function BookingModalLoader() {
  return <BookingModal />
}