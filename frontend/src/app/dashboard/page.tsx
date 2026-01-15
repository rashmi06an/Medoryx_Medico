'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser')

    if (!userStr) {
      router.replace('/')
      return
    }

    const user = JSON.parse(userStr)

    router.replace(`/dashboard/${user.role}`)
  }, [router])

  return null
}
