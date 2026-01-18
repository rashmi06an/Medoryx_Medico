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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'>
      <style jsx>{`
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.2), 0 10px 30px rgba(0, 0, 0, 0.08); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.4), 0 10px 40px rgba(0, 0, 0, 0.12); }
        }
        .header-slide { animation: slideInDown 0.5s ease-out; }
        .sidebar-slide { animation: slideInLeft 0.5s ease-out; }
        .card-fade { animation: fadeInUp 0.5s ease-out backwards; }
        .card-hover:hover { animation: pulseGlow 2s ease-in-out infinite; }
        .btn-scale { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .btn-scale:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); }
        .token-highlight { animation: fadeInUp 0.6s ease-out, pulseGlow 3s ease-in-out infinite 0.6s; }
      `}</style>

      {/* Header */}
      <header className='header-slide bg-gradient-to-r from-white via-blue-50 to-white border-b border-blue-100 shadow-md sticky top-0 z-50'>
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
              <div className='w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-sm'>M</span>
              </div>
              <span className='hidden sm:inline font-bold text-slate-900'>
                Medoryx
              </span>
            </div>
          </div>

          <div className='flex-1 max-w-xs mx-4 hidden md:block'>
            <div className='text-sm'>
              <p className='font-semibold text-slate-900'>
                {doctorData.clinic}
              </p>
              <p className='text-slate-600'>{doctorData.name}</p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {/* Clinic Status Toggle */}
            <div className='hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg'>
              <div
                className={`w-2 h-2 rounded-full ${
                  doctorData.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className='text-sm font-medium text-slate-700'>
                {doctorData.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            {/* Notifications */}
            <button className='relative p-2 hover:bg-slate-100 rounded-lg transition'>
              <FiBell className='w-5 h-5 text-slate-600' />
              <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full'></span>
            </button>

            {/* Profile */}
            <div className='relative'>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className='flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg'
              >
                <div className='w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                  {doctorData.name.charAt(0)}
                </div>
                <FiUser className='w-5 h-5 text-slate-600' />
              </button>

              {userMenuOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg p-2'>
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded font-medium'
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
          } bg-gradient-to-b from-white to-blue-50 border-r border-blue-100 transition-all duration-300 overflow-hidden hidden md:block sidebar-slide`}
        >
          <nav className='p-6 space-y-2'>
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activePage === item.id
                      ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-600'
                      : 'text-slate-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className='w-5 h-5' />
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
                <div className='card-fade bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 card-hover shadow-sm'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-blue-600 text-sm font-medium'>
                        Current Token
                      </p>
                      <p className='text-3xl font-bold text-blue-900 mt-2'>
                        {servingPatient?.number || '-'}
                      </p>
                    </div>
                    <div className='p-3 bg-blue-200 rounded-full'>
                      <FiPhone className='w-6 h-6 text-blue-700' />
                    </div>
                  </div>
                </div>

                <div className='card-fade bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200 p-6 card-hover shadow-sm' style={{animationDelay: '0.1s'}}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-cyan-600 text-sm font-medium'>
                        Patients Waiting
                      </p>
                      <p className='text-3xl font-bold text-cyan-900 mt-2'>
                        {waitingCount}
                      </p>
                    </div>
                    <div className='p-3 bg-cyan-200 rounded-full'>
                      <FiUsers className='w-6 h-6 text-cyan-700' />
                    </div>
                  </div>
                </div>

                <div className='card-fade bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-6 card-hover shadow-sm' style={{animationDelay: '0.2s'}}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-amber-600 text-sm font-medium'>
                        Avg Wait Time
                      </p>
                      <p className='text-3xl font-bold text-amber-900 mt-2'>
                        {avgWaitTime}m
                      </p>
                    </div>
                    <div className='p-3 bg-amber-200 rounded-full'>
                      <FiClock className='w-6 h-6 text-amber-700' />
                    </div>
                  </div>
                </div>

                <div className='card-fade bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6 card-hover shadow-sm' style={{animationDelay: '0.3s'}}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-green-600 text-sm font-medium'>
                        Served Today
                      </p>
                      <p className='text-3xl font-bold text-green-900 mt-2'>
                        {queueTokens.filter((t) => t.status === 'completed').length}
                      </p>
                    </div>
                    <div className='p-3 bg-green-200 rounded-full'>
                      <FiCheck className='w-6 h-6 text-green-700' />
                    </div>
                  </div>
                </div>
              </div>

              {/* Queue Management */}
              <div className='bg-white rounded-lg border border-slate-200'>
                <div className='border-b border-slate-200 p-6'>
                  <h2 className='text-xl font-bold text-slate-900'>
                    Current Queue
                  </h2>
                  <p className='text-slate-600 text-sm mt-1'>
                    Real-time patient queue management
                  </p>
                </div>

                <div className='p-6 space-y-3'>
                  {/* Serving Patient - Highlighted */}
                  {servingPatient && (
                    <div className='token-highlight bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 border-2 border-blue-400 rounded-lg p-4 text-white shadow-lg'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg'>
                            {servingPatient.number}
                          </div>
                          <div>
                            <p className='font-bold text-white'>
                              {servingPatient.patientName}
                            </p>
                            <p className='text-sm text-blue-100'>
                              Age: {servingPatient.age} • {servingPatient.visitType}
                            </p>
                          </div>
                        </div>
                        <span className='px-3 py-1 bg-white text-blue-600 text-sm font-bold rounded-full'>
                          Being Served
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='grid grid-cols-2 gap-3 my-4'>
                    <button
                      onClick={handleCallNext}
                      className='btn-scale px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 shadow-md'
                    >
                      <FiPhone className='w-5 h-5' />
                      Call Next
                    </button>
                    <button className='btn-scale px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition flex items-center justify-center gap-2 shadow-md'>
                      <FiAlertCircle className='w-5 h-5' />
                      Emergency
                    </button>
                  </div>

                  {/* Waiting Queue */}
                  <div className='space-y-2'>
                    <h3 className='font-semibold text-slate-900'>
                      Upcoming Tokens
                    </h3>
                    {queueTokens
                      .filter((t) => t.status === 'waiting')
                      .map((token) => (
                        <div
                          key={token.id}
                          className='card-fade flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-150 transition'
                        >
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold'>
                              {token.number}
                            </div>
                            <div>
                              <p className='font-medium text-slate-900'>
                                {token.patientName}
                              </p>
                              <p className='text-xs text-blue-600'>
                                {token.visitType} • {token.arrivalTime}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSkip(token.id)}
                            className='btn-scale p-2 hover:bg-blue-200 rounded-lg transition'
                          >
                            <FiSkipForward className='w-5 h-5 text-blue-600' />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'appointments' && (
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>
                  Appointments
                </h1>
                <p className='text-slate-600'>Manage your clinic appointments</p>
              </div>

              <div className='bg-white rounded-lg border border-slate-200'>
                <div className='border-b border-slate-200 p-6'>
                  <h2 className='text-xl font-bold text-slate-900'>
                    Today&apos;s Schedule
                  </h2>
                </div>

                <div className='divide-y'>
                  {appointments
                    .filter((a) => a.date === '2026-01-18')
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className='p-4 hover:bg-slate-50 transition'
                      >
                        <div className='flex items-center justify-between'>
                          <div>
                            <p className='font-semibold text-slate-900'>
                              {apt.patientName}
                            </p>
                            <div className='flex items-center gap-2 mt-1'>
                              <FiClock className='w-4 h-4 text-slate-600' />
                              <span className='text-sm text-slate-600'>
                                {apt.time}
                              </span>
                              <span className='text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded'>
                                {apt.visitType}
                              </span>
                            </div>
                          </div>
                          <span className='px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full'>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activePage === 'prescriptions' && (
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>
                  Prescriptions
                </h1>
                <p className='text-slate-600'>
                  Create and manage digital prescriptions
                </p>
              </div>
              <div className='bg-white rounded-lg border border-slate-200 p-12 text-center'>
                <FiFileText className='w-12 h-12 text-slate-400 mx-auto mb-4' />
                <p className='text-slate-600'>
                  Prescription management coming soon
                </p>
              </div>
            </div>
          )}

          {activePage === 'settings' && (
            <div className='space-y-6'>
              <div>
                <h1 className='text-3xl font-bold text-slate-900'>Settings</h1>
                <p className='text-slate-600'>Configure your clinic settings</p>
              </div>
              <div className='bg-white rounded-lg border border-slate-200 p-12 text-center'>
                <FiSettings className='w-12 h-12 text-slate-400 mx-auto mb-4' />
                <p className='text-slate-600'>Settings panel coming soon</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
