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
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.2), 0 10px 30px rgba(0, 0, 0, 0.08);
          }
          50% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.4), 0 10px 40px rgba(0, 0, 0, 0.12);
          }
        }

        .header-slide {
          animation: slideInDown 0.5s ease-out;
        }

        .sidebar-slide {
          animation: slideInLeft 0.5s ease-out;
        }

        .card-fade {
          animation: fadeInUp 0.5s ease-out backwards;
        }

        .card-scale {
          animation: scaleIn 0.4s ease-out;
        }

        .card-hover:hover {
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .btn-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-scale:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .nav-active {
          animation: scaleIn 0.3s ease-out;
        }

        .token-highlight {
          animation: fadeInUp 0.6s ease-out, pulseGlow 3s ease-in-out infinite 0.6s;
        }
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
              <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg'>
                <span className='text-white font-bold text-sm'>M</span>
              </div>
              <span className='hidden sm:inline font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                Medoryx
              </span>
            </div>
          </div>

          <div className='flex-1 max-w-xs mx-4 hidden md:block'>
            <div className='text-sm'>
              <p className='font-semibold text-blue-900'>
                {doctorData.clinic}
              </p>
              <p className='text-blue-600'>{doctorData.name}</p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {/* Clinic Status Toggle */}
            <div className='hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg shadow-sm hover:shadow-md transition'>
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  doctorData.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span className='text-sm font-semibold text-blue-900'>
                {doctorData.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            {/* Notifications */}
            <button className='relative p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 group'>
              <FiBell className='w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform' />
              <span className='absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse'></span>
            </button>

            {/* Profile */}
            <div className='relative'>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className='flex items-center gap-2 p-2 hover:bg-blue-100 rounded-lg transition-all duration-300 group'
              >
                <div className='w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-all'>
                  {doctorData.name.charAt(0)}
                </div>
                <FiUser className='w-5 h-5 text-blue-600' />
              </button>

              {userMenuOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white border-2 border-blue-200 rounded-lg shadow-xl p-2 animate-in fade-in duration-200'>
                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-2 px-4 py-2 text-blue-700 hover:bg-blue-100 rounded font-medium transition-all duration-300'
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
          className={`sidebar-slide ${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-gradient-to-b from-white to-blue-50 border-r-2 border-blue-100 transition-all duration-300 overflow-hidden hidden md:block shadow-lg`}
        >
          <nav className='p-6 space-y-2'>
            {navigationItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className={`card-fade w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 group ${
                    activePage === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 nav-active'
                      : 'text-blue-700 hover:bg-blue-100 hover:translate-x-1'
                  }`}
                >
                  <Icon className='w-5 h-5 group-hover:rotate-12 transition-transform' />
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
              <div className='card-fade' style={{animationDelay: '0s'}}>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent'>Queue Management</h1>
                <p className='text-blue-600 mt-2 font-medium'>Real-time patient queue monitoring</p>
              </div>

              {/* Overview Cards */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='card-fade card-hover bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 border-blue-200 p-6 shadow-md hover:shadow-xl transition-all duration-500' style={{animationDelay: '0.1s'}}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-blue-600 text-sm font-semibold uppercase tracking-wide'>Current Token</p>
                      <p className='text-4xl font-bold text-blue-700 mt-3 tabular-nums'>{servingPatient?.number || '-'}</p>
                    </div>
                    <div className='p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg'>
                      <FiPhone className='w-6 h-6 text-white' />
                    </div>
                  </div>
                </div>

                <div className='card-fade card-hover bg-gradient-to-br from-white to-cyan-50 rounded-xl border-2 border-cyan-200 p-6 shadow-md hover:shadow-xl transition-all duration-500' style={{animationDelay: '0.2s'}}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-cyan-600 text-sm font-semibold uppercase tracking-wide'>Patients Waiting</p>
                      <p className='text-4xl font-bold text-cyan-700 mt-3'>{waitingCount}</p>
                    </div>
                    <div className='p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full shadow-lg'>
                      <FiUsers className='w-6 h-6 text-white' />
                    </div>
                  </div>
                </div>

                <div className='card-fade card-hover bg-gradient-to-br from-white to-amber-50 rounded-xl border-2 border-amber-200 p-6 shadow-md hover:shadow-xl transition-all duration-500' style={{animationDelay: '0.3s'}}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-amber-600 text-sm font-semibold uppercase tracking-wide'>Avg Wait Time</p>
                      <p className='text-4xl font-bold text-amber-700 mt-3 tabular-nums'>{avgWaitTime}m</p>
                    </div>
                    <div className='p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg'>
                      <FiClock className='w-6 h-6 text-white' />
                    </div>
                  </div>
                </div>

                <div className='card-fade card-hover bg-gradient-to-br from-white to-green-50 rounded-xl border-2 border-green-200 p-6 shadow-md hover:shadow-xl transition-all duration-500' style={{animationDelay: '0.4s'}}>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-green-600 text-sm font-semibold uppercase tracking-wide'>Served Today</p>
                      <p className='text-4xl font-bold text-green-700 mt-3'>{queueTokens.filter((t) => t.status === 'completed').length}</p>
                    </div>
                    <div className='p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg'>
                      <FiCheck className='w-6 h-6 text-white' />
                    </div>
                  </div>
                </div>
              </div>

              {/* Queue Management */}
              <div className='card-fade bg-white rounded-xl border-2 border-blue-200 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500' style={{animationDelay: '0.5s'}}>
                <div className='bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800 p-6 text-white'>
                  <h2 className='text-2xl font-bold'>Current Queue</h2>
                  <p className='text-blue-100 text-sm mt-1 font-medium'>Patient management & token system</p>
                </div>

                <div className='p-6 space-y-4'>
                  {/* Serving Patient - Highlighted */}
                  {servingPatient && (
                    <div className='token-highlight bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border-2 border-blue-500 rounded-xl p-5 shadow-lg'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md'>
                            {servingPatient.number}
                          </div>
                          <div>
                            <p className='font-bold text-blue-900 text-lg'>
                              {servingPatient.patientName}
                            </p>
                            <p className='text-sm text-blue-700 font-medium'>
                              Age: {servingPatient.age} • {servingPatient.visitType}
                            </p>
                          </div>
                        </div>
                        <span className='px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-full shadow-md animate-pulse'>
                          Being Served
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className='grid grid-cols-2 gap-3 my-4'>
                    <button
                      onClick={handleCallNext}
                      className='btn-scale px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 shadow-lg flex items-center justify-center gap-2 group'
                    >
                      <FiPhone className='w-5 h-5 group-hover:rotate-12 transition-transform' />
                      Call Next
                    </button>
                    <button className='btn-scale px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:from-red-600 hover:to-red-700 shadow-lg flex items-center justify-center gap-2 group'>
                      <FiAlertCircle className='w-5 h-5 group-hover:animate-bounce' />
                      Emergency
                    </button>
                  </div>

                  {/* Waiting Queue */}
                  <div className='space-y-2'>
                    <h3 className='font-bold text-blue-900 text-lg'>Upcoming Tokens</h3>
                    {queueTokens
                      .filter((t) => t.status === 'waiting')
                      .map((token, idx) => (
                        <div
                          key={token.id}
                          className='card-fade flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-blue-100 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-300 group'
                          style={{animationDelay: `${0.5 + idx * 0.1}s`}}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform'>
                              {token.number}
                            </div>
                            <div>
                              <p className='font-semibold text-blue-900'>
                                {token.patientName}
                              </p>
                              <p className='text-xs text-blue-600 font-medium'>
                                {token.visitType} • {token.arrivalTime}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSkip(token.id)}
                            className='p-2 hover:bg-red-200 rounded-lg transition-all duration-300 group/skip'
                          >
                            <FiSkipForward className='w-5 h-5 text-blue-600 group-hover/skip:text-red-600 group-hover/skip:scale-125 transition-all' />
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
              <div className='card-fade' style={{animationDelay: '0s'}}>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent'>
                  Appointments
                </h1>
                <p className='text-blue-600 mt-2 font-medium'>Manage your clinic schedule</p>
              </div>

              <div className='card-fade bg-white rounded-xl border-2 border-blue-200 shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500' style={{animationDelay: '0.1s'}}>
                <div className='bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800 p-6 text-white'>
                  <h2 className='text-2xl font-bold'>Today&apos;s Schedule</h2>
                  <p className='text-blue-100 text-sm mt-1 font-medium'>Appointments & consultations</p>
                </div>

                <div className='divide-y-2 divide-blue-100'>
                  {appointments
                    .filter((a) => a.date === '2026-01-18')
                    .map((apt, idx) => (
                      <div
                        key={apt.id}
                        className='card-fade p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group'
                        style={{animationDelay: `${0.1 + idx * 0.1}s`}}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex-1'>
                            <p className='font-bold text-blue-900 group-hover:text-blue-700 text-lg'>
                              {apt.patientName}
                            </p>
                            <div className='flex items-center gap-3 mt-2'>
                              <FiClock className='w-4 h-4 text-blue-600' />
                              <span className='text-sm text-blue-700 font-semibold'>
                                {apt.time}
                              </span>
                              <span className='text-xs px-3 py-1 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 rounded-full font-semibold border border-cyan-200'>
                                {apt.visitType}
                              </span>
                            </div>
                          </div>
                          <span className='px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-bold rounded-lg shadow-md group-hover:shadow-lg transition-all'>
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
              <div className='card-fade' style={{animationDelay: '0s'}}>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent'>
                  Prescriptions
                </h1>
                <p className='text-blue-600 mt-2 font-medium'>Create and manage digital prescriptions</p>
              </div>
              <div className='card-fade bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 border-blue-200 shadow-lg p-12 text-center hover:shadow-xl transition-all duration-500' style={{animationDelay: '0.1s'}}>
                <div className='p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md'>
                  <FiFileText className='w-8 h-8 text-blue-700' />
                </div>
                <p className='text-blue-700 font-semibold text-lg'>Prescription management coming soon</p>
                <p className='text-blue-600 text-sm mt-2'>Digital prescription system will be available in the next update</p>
              </div>
            </div>
          )}

          {activePage === 'settings' && (
            <div className='space-y-6'>
              <div className='card-fade' style={{animationDelay: '0s'}}>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent'>Settings</h1>
                <p className='text-blue-600 mt-2 font-medium'>Configure your clinic preferences</p>
              </div>
              <div className='card-fade bg-gradient-to-br from-white to-blue-50 rounded-xl border-2 border-blue-200 shadow-lg p-12 text-center hover:shadow-xl transition-all duration-500' style={{animationDelay: '0.1s'}}>
                <div className='p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md'>
                  <FiSettings className='w-8 h-8 text-blue-700' />
                </div>
                <p className='text-blue-700 font-semibold text-lg'>Settings panel coming soon</p>
                <p className='text-blue-600 text-sm mt-2'>Configure clinic timings, notifications, and preferences in the next update</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
