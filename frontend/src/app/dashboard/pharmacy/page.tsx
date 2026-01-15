'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PharmacyDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) router.replace('/')
  }, [router])

  return (
    <div style={{ padding: 30 }}>
      <h1>Pharmacy Dashboard</h1>
      <p>Medicine & inventory control</p>

      <ul>
        <li>➕ Add Medicines</li>
        <li>📦 Stock List</li>
        <li>⚠️ Expiry Alerts</li>
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
