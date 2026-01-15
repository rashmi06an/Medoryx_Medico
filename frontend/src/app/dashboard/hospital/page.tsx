'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HospitalDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) router.replace('/')
  }, [router])

  return (
    <div style={{ padding: 30 }}>
      <h1>Hospital Dashboard</h1>
      <p>Hospital operations overview</p>

      <ul>
        <li>🛏 Bed Availability</li>
        <li>🚑 ICU / Ventilator Status</li>
        <li>📊 Admin Controls</li>
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem('currentUser')
          router.push('/')
        }}
      >
        Logout
      </button>
    </div>
  )
}
