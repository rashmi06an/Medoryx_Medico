'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DoctorDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) router.replace('/')
  }, [router])

  return (
    <div style={{ padding: 30 }}>
      <h1>Doctor Dashboard</h1>
      <p>Manage patients & appointments</p>

      <ul>
        <li>🧾 Today’s Queue</li>
        <li>👨‍⚕️ Patient List</li>
        <li>⏰ Availability Status</li>
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
