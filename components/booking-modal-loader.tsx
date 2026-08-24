'use client'

import * as React from 'react'

const BookingModal = React.lazy(() =>
  import('@/components/booking-modal').then((mod) => ({ default: mod.BookingModal }))
)

export function BookingModalLoader() {
  return (
    <React.Suspense fallback={null}>
      <BookingModal />
    </React.Suspense>
  )
}