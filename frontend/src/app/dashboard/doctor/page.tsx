'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiUsers,
  FiFileText,
  FiSettings,
  FiCalendar,
  FiPhone,
  FiSkipForward,
  FiAlertCircle,
  FiCheck,
  FiClock,
} from 'react-icons/fi'

interface QueueToken {
  id: string
  number: number
  patientName: string
  age: number
  visitType: 'walk-in' | 'appointment'
  status: 'waiting' | 'serving' | 'completed' | 'skipped'
  arrivalTime: string
}

interface Appointment {
  id: string
  patientName: string
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled'
  visitType: 'online' | 'walk-in'
}

export default function DoctorDashboard() {
  const router = useRouter()
  const [isLoggedIn] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState('queue')
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const [doctorData] = useState({
    id: 'doc_001',
    name: 'Dr. Rajesh Kumar',
    clinic: 'City Medical Center',
    email: 'rajesh@medoryx.com',
    phone: '9876543210',
    specialization: 'General Physician',
    experience: '8 years',
    isOpen: true,
  })

  const [queueTokens, setQueueTokens] = useState<QueueToken[]>([
    {
      id: '1',
      number: 5,
      patientName: 'Amit Singh',
      age: 35,
      visitType: 'walk-in',
      status: 'serving',
      arrivalTime: '09:00 AM',
    },
    {
      id: '2',
      number: 6,
      patientName: 'Priya Sharma',
      age: 28,
      visitType: 'walk-in',
      status: 'waiting',
      arrivalTime: '09:15 AM',
    },
    {
      id: '3',
      number: 7,
      patientName: 'Raj Patel',
      age: 45,
      visitType: 'walk-in',
      status: 'waiting',
      arrivalTime: '09:30 AM',
    },
    {
      id: '4',
      number: 8,
      patientName: 'Neha Verma',
      age: 32,
      visitType: 'walk-in',
      status: 'waiting',
      arrivalTime: '09:45 AM',
    },
    {
      id: '5',
      number: 9,
      patientName: 'Arjun Reddy',
      age: 50,
      visitType: 'walk-in',
      status: 'waiting',
      arrivalTime: '10:00 AM',
    },
  ])

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Amit Singh',
      date: '2026-01-18',
      time: '09:00 AM',
      status: 'scheduled',
      visitType: 'walk-in',
    },
    {
      id: '2',
      patientName: 'Priya Sharma',
      date: '2026-01-18',
      time: '09:30 AM',
      status: 'scheduled',
      visitType: 'walk-in',
    },
    {
      id: '3',
      patientName: 'Raj Patel',
      date: '2026-01-19',
      time: '02:00 PM',
      status: 'scheduled',
      visitType: 'online',
    },
  ])

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      router.push('/auth/login')
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== 'doctor') {
      router.push('/')
      return
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/auth/login')
  }

  const handleCallNext = () => {
    setQueueTokens((prev) => {
      const updated = [...prev]
      const currentIndex = updated.findIndex((t) => t.status === 'serving')
      if (currentIndex !== -1) {
        updated[currentIndex].status = 'completed'
      }
      const nextIndex = updated.findIndex((t) => t.status === 'waiting')
      if (nextIndex !== -1) {
        updated[nextIndex].status = 'serving'
      }
      return updated
    })
  }

  const handleSkip = (id: string) => {
    setQueueTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'skipped' } : t))
    )
  }

  if (!isLoggedIn) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-blue-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600'></div>
      </div>
    )
  }

  const navigationItems = [
    { id: 'queue', label: 'Queue', icon: FiUsers },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: FiFileText },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ]

  const waitingCount = queueTokens.filter((t) => t.status === 'waiting').length
  const avgWaitTime = Math.floor(waitingCount * 8)
  const servingPatient = queueTokens.find((t) => t.status === 'serving')

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50'>
      {/* Header */}
      <header className='bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-md sticky top-0 z-50 transition-all duration-300'>
        <div className='max-w-7xl mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='md:hidden p-2 hover:bg-slate-100 rounded-lg'
            >
              {sidebarOpen ? (
                <FiX className='w-6 h-6' />
              ) : (
                <FiMenu className='w-6 h-6' />
              )}
            </button>
            <div className='flex items-center gap-2'>
              <div className='w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105'>
                <span className='text-white font-bold text-base'>M</span>
              </div>
              <span className='hidden sm:inline font-bold text-lg text-slate-900 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent'>
                Medoryx
              </span>
            </div>
          </div>

          <div className='flex-1 max-w-xs mx-4 hidden md:block'>
            <div className='text-sm'>
              <p className='font-semibold text-slate-900 group-hover:text-teal-600 transition-colors'>
                {doctorData.clinic}
              </p>
              <p className='text-slate-500 text-xs'>Dr. {doctorData.name}</p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {/* Clinic Status Toggle */}
            <div className='hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300'>
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  doctorData.isOpen ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' : 'bg-red-500'
                }`}
              ></div>
              <span className='text-sm font-semibold text-slate-700'>
                {doctorData.isOpen ? 'Clinic Open' : 'Clinic Closed'}
              </span>
            </div>

            {/* Notifications */}
            <button className='relative p-2.5 hover:bg-teal-50 rounded-xl transition-all duration-300 group'>
              <FiBell className='w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors' />
              <span className='absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50'></span>
            </button>

            {/* Profile */}
            <div className='relative'>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className='flex items-center gap-2 px-3 py-2 hover:bg-teal-50 rounded-xl transition-all duration-300 group'
              >
                <div className='w-9 h-9 bg-gradient-to-br from-teal-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300'>
                  {doctorData.name.charAt(0)}
                </div>
                <FiUser className='w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors' />
              </button>

              {userMenuOpen && (
                <div className='absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50'>
                  <div className='px-4 py-2 border-b border-slate-200/50'>
                    <p className='text-sm font-semibold text-slate-900'>{doctorData.name}</p>
                    <p className='text-xs text-slate-500'>{doctorData.specialization}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 mt-1 font-medium'
                  >
                    <FiLogOut className='w-4 h-4' />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className='flex flex-1 max-w-7xl mx-auto'>
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white/80 backdrop-blur-md border-r border-slate-200/50 transition-all duration-300 overflow-hidden hidden md:block shadow-lg`}
        >
          <nav className='p-6 space-y-2'>
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform ${
                    activePage === item.id
                      ? 'bg-gradient-to-r from-teal-50 to-blue-50 text-teal-700 border-l-4 border-teal-600 shadow-md hover:shadow-lg'
                      : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                  }`}
                >
                  <Icon className='w-5 h-5 flex-shrink-0' />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className='flex-1 overflow-auto p-4 md:p-8'>
          {activePage === 'queue' && (
            <div className='space-y-6'>
              {/* Page Header */}
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>Queue</h1>
                <p className='text-slate-600'>Manage patient queue efficiently</p>
              </div>

              {/* Overview Cards */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='bg-white rounded-2xl border border-slate-200/50 p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-slate-600 text-sm font-semibold uppercase tracking-wide'>
                        Current Token
                      </p>
                      <p className='text-4xl font-bold text-teal-600 mt-3 transition-all duration-500'>
                        {servingPatient?.number || '-'}
                      </p>
                    </div>
                    <div className='p-4 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl shadow-lg'>
                      <FiPhone className='w-8 h-8 text-teal-600 animate-pulse' />
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-2xl border border-slate-200/50 p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-slate-600 text-sm font-semibold uppercase tracking-wide'>
                        Patients Waiting
                      </p>
                      <p className='text-4xl font-bold text-blue-600 mt-3'>
                        {waitingCount}
                      </p>
                    </div>
                    <div className='p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-lg'>
                      <FiUsers className='w-8 h-8 text-blue-600' />
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-2xl border border-slate-200/50 p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-slate-600 text-sm font-semibold uppercase tracking-wide'>
                        Avg Wait Time
                      </p>
                      <p className='text-4xl font-bold text-orange-600 mt-3'>
                        {avgWaitTime}m
                      </p>
                    </div>
                    <div className='p-4 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl shadow-lg'>
                      <FiClock className='w-8 h-8 text-orange-600' />
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-2xl border border-slate-200/50 p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-slate-600 text-sm font-semibold uppercase tracking-wide'>
                        Served Today
                      </p>
                      <p className='text-4xl font-bold text-green-600 mt-3'>
                        {queueTokens.filter((t) => t.status === 'completed').length}
                      </p>
                    </div>
                    <div className='p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl shadow-lg'>
                      <FiCheck className='w-8 h-8 text-green-600' />
                    </div>
                  </div>
                </div>
              </div>

              {/* Queue Management */}
              <div className='bg-white rounded-2xl border border-slate-200/50 shadow-lg backdrop-blur-sm'>
                <div className='border-b border-slate-200/50 p-6 bg-gradient-to-r from-slate-50 to-blue-50/30'>
                  <h2 className='text-2xl font-bold text-slate-900'>
                    Real-time Queue
                  </h2>
                  <p className='text-slate-600 text-sm mt-1 font-medium'>
                    Manage patient queue efficiently
                  </p>
                </div>

                <div className='p-6 space-y-4'>
                  {/* Serving Patient - Highlighted */}
                  {servingPatient && (
                    <div className='bg-gradient-to-r from-teal-500/10 via-teal-400/10 to-teal-500/10 border-2 border-teal-500/50 rounded-2xl p-5 shadow-md animate-pulse-slow'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-xl shadow-teal-500/50 animate-bounce-slow'>
                            {servingPatient.number}
                          </div>
                          <div>
                            <p className='font-bold text-slate-900 text-lg'>
                              {servingPatient.patientName}
                            </p>
                            <p className='text-sm text-slate-600 font-medium'>
                              Age: {servingPatient.age} • {servingPatient.visitType}
                            </p>
                          </div>
                        </div>
                        <span className='px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-sm font-bold rounded-full shadow-lg animate-pulse'>
                          Being Served
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='grid grid-cols-2 gap-3 my-5'>
                    <button
                      onClick={handleCallNext}
                      className='px-4 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-bold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95'
                    >
                      <FiPhone className='w-5 h-5' />
                      Call Next
                    </button>
                    <button className='px-4 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform active:scale-95'>
                      <FiAlertCircle className='w-5 h-5' />
                      Emergency
                    </button>
                  </div>

                  {/* Waiting Queue */}
                  <div className='space-y-3 mt-6 pt-4 border-t border-slate-200/50'>
                    <h3 className='font-bold text-slate-900 text-lg'>
                      Upcoming Tokens ({queueTokens.filter((t) => t.status === 'waiting').length})
                    </h3>
                    {queueTokens
                      .filter((t) => t.status === 'waiting')
                      .map((token, idx) => (
                        <div
                          key={token.id}
                          className='flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200/50 rounded-xl hover:from-slate-100 hover:to-blue-50 transition-all duration-300 transform hover:scale-102 hover:shadow-md group'
                          style={{
                            animation: `slideIn 0.3s ease-out ${idx * 0.1}s both`,
                          }}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-all'>
                              {token.number}
                            </div>
                            <div>
                              <p className='font-semibold text-slate-900'>
                                {token.patientName}
                              </p>
                              <p className='text-xs text-slate-600 font-medium'>
                                {token.visitType} • {token.arrivalTime}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSkip(token.id)}
                            className='p-2.5 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 text-slate-600 hover:shadow-md'
                          >
                            <FiSkipForward className='w-5 h-5' />
                          </button>
                        </div>
                      ))}
                    {queueTokens.filter((t) => t.status === 'waiting').length === 0 && (
                      <div className='text-center py-6 text-slate-500 italic'>
                        No patients waiting
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'appointments' && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div>
                <h1 className='text-4xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
                  Appointments
                </h1>
                <p className='text-slate-600 font-medium mt-2'>Manage your clinic appointments</p>
              </div>

              <div className='bg-white rounded-2xl border border-slate-200/50 shadow-lg backdrop-blur-sm'>
                <div className='border-b border-slate-200/50 p-6 bg-gradient-to-r from-slate-50 to-blue-50/30'>
                  <h2 className='text-2xl font-bold text-slate-900'>
                    Today&apos;s Schedule
                  </h2>
                </div>

                <div className='divide-y divide-slate-200/50'>
                  {appointments
                    .filter((a) => a.date === '2026-01-18')
                    .map((apt, idx) => (
                      <div
                        key={apt.id}
                        className='p-5 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-blue-50/50 transition-all duration-300 group cursor-pointer transform hover:scale-102'
                        style={{
                          animation: `slideIn 0.3s ease-out ${idx * 0.1}s both`,
                        }}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex-1'>
                            <p className='font-bold text-slate-900 text-lg group-hover:text-teal-600 transition-colors'>
                              {apt.patientName}
                            </p>
                            <div className='flex items-center gap-3 mt-2 flex-wrap'>
                              <FiClock className='w-4 h-4 text-slate-600' />
                              <span className='text-sm text-slate-600 font-medium'>
                                {apt.time}
                              </span>
                              <span className='text-xs px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full font-semibold border border-blue-200/50'>
                                {apt.visitType}
                              </span>
                            </div>
                          </div>
                          <span className='ml-4 px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-sm font-bold rounded-full border border-green-200/50 shadow-sm'>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  {appointments.filter((a) => a.date === '2026-01-18').length === 0 && (
                    <div className='text-center py-8 text-slate-500'>
                      <FiCalendar className='w-12 h-12 mx-auto mb-3 opacity-30' />
                      <p className='italic'>No appointments scheduled for today</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activePage === 'prescriptions' && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div>
                <h1 className='text-4xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
                  Prescriptions
                </h1>
                <p className='text-slate-600 font-medium mt-2'>Create and manage digital prescriptions</p>
              </div>
              <div className='bg-white rounded-2xl border border-slate-200/50 shadow-lg backdrop-blur-sm p-12 text-center'>
                <div className='w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                  <FiFileText className='w-10 h-10 text-teal-600' />
                </div>
                <p className='text-slate-600 font-medium text-lg'>Coming soon...</p>
                <p className='text-slate-500 text-sm mt-2'>Digital prescription management features</p>
              </div>
            </div>
          )}

          {activePage === 'settings' && (
            <div className='space-y-6 animate-in fade-in duration-300'>
              <div>
                <h1 className='text-4xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
                  Settings
                </h1>
                <p className='text-slate-600 font-medium mt-2'>Configure your clinic settings</p>
              </div>
              <div className='bg-white rounded-2xl border border-slate-200/50 shadow-lg backdrop-blur-sm p-12 text-center'>
                <div className='w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                  <FiSettings className='w-10 h-10 text-teal-600 animate-spin-slow' />
                </div>
                <p className='text-slate-600 font-medium text-lg'>Coming soon...</p>
                <p className='text-slate-500 text-sm mt-2'>Clinic configuration and preferences</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
