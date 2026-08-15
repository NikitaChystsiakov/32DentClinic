'use client'

import * as React from 'react'

interface BookingModalOptions {
  service?: string
  doctor?: string
}

interface BookingModalContextValue extends BookingModalOptions {
  isOpen: boolean
  openBookingModal: (options?: BookingModalOptions) => void
  closeBookingModal: () => void
}

const BookingModalContext = React.createContext<BookingModalContextValue | null>(null)

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [service, setService] = React.useState<string | undefined>(undefined)
  const [doctor, setDoctor] = React.useState<string | undefined>(undefined)

  const openBookingModal = React.useCallback((options?: BookingModalOptions) => {
    setService(options?.service)
    setDoctor(options?.doctor)
    setIsOpen(true)
  }, [])

  const closeBookingModal = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = React.useMemo(
    () => ({ isOpen, service, doctor, openBookingModal, closeBookingModal }),
    [isOpen, service, doctor, openBookingModal, closeBookingModal]
  )

  return <BookingModalContext.Provider value={value}>{children}</BookingModalContext.Provider>
}

export function useBookingModal() {
  const ctx = React.useContext(BookingModalContext)
  if (!ctx) {
    throw new Error('useBookingModal must be used within a BookingModalProvider')
  }
  return ctx
}
