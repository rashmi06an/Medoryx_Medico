'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PatientDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) router.replace('/')
  }, [router])

  return (
    <div style={{ padding: 30 }}>
      <h1>Patient Dashboard</h1>
      <p>Welcome to Medoryx</p>

      <ul>
        <li>🔍 Search Medicines</li>
        <li>📅 Book Appointment</li>
        <li>📁 Health Records</li>
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
