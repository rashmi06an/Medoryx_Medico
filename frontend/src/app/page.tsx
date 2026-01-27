"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiUsers, FiUser, FiPackage, FiTrendingUp, FiPlus, FiArrowRight, FiActivity, FiRefreshCw } from "react-icons/fi";

export default function HomePage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Start exit animation after 2.5 seconds
    const timer1 = setTimeout(() => {
      setAnimateOut(true);
    }, 2500);

    // Remove from DOM after animation completes (3s total)
    const timer2 = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const features = [
    {
      icon: <FiUsers className="feature-icon" />,
      title: "Patients",
      description: "Easy appointment booking, medical records, and health tracking.",
    },
    {
      icon: <FiUser className="feature-icon" />,
      title: "Doctors",
      description: "Manage appointments, patient records, and digital consultations.",
    },
    {
      icon: <FiPackage className="feature-icon" />,
      title: "Pharmacy",
      description: "Smart prescription handling and medicine delivery tracking.",
    },
    {
      icon: <FiTrendingUp className="feature-icon" />,
      title: "Hospitals",
      description: "Real-time bed availability tracker and emergency resource management.",
    },
  ];

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#008080", // Teal
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            opacity: animateOut ? 0 : 1,
            pointerEvents: animateOut ? "none" : "auto",
          }}
        >
          <div
            style={{
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: animateOut ? "none" : "pulse 2s infinite"
            }}
          >
            {/* Medical Cross Symbol */}
            <div style={{
              width: '100px',
              height: '100px',
              border: '4px solid white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              animation: 'spin 3s ease-in-out infinite'
            }}>
              <FiPlus style={{ fontSize: '60px' }} />
            </div>

            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              animation: 'fadeInUp 1s ease-out'
            }}>
              MEDORYX
            </h1>
          </div>
        </div>
      )}

      {/* Local Styles for Landing Page */}
      <style jsx>{`
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .btn-primary {
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          font-weight: 800;
          padding: 16px 32px;
          border-radius: 12px;
          border: none;
          box-shadow: 0 10px 20px rgba(0, 128, 128, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 16px;
          display: inline-block;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0, 128, 128, 0.3);
          background: linear-gradient(135deg, #006666 0%, #004d4d 100%);
        }

        .btn-secondary {
          background: white;
          color: #008080;
          font-weight: 800;
          padding: 16px 32px;
          border-radius: 12px;
          border: 2px solid #008080;
          transition: all 0.3s ease;
          cursor: pointer;
          font-size: 16px;
          display: inline-block;
        }

        .btn-secondary:hover {
          transform: translateY(-3px);
          background: rgba(0, 128, 128, 0.05);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      {/* Animated Background */}
      <div className="animated-bg"></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo-wrapper">
            <Image
              src="/medoryx-logo.png"
              alt="Medoryx Logo"
              width={140}
              height={45}
              priority
              className="logo-image"
            />
            <span className="navbar-logo-text">Medoryx</span>
          </div>
          <div className="nav-actions">
            <button
              className="btn-login"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </button>
            <button
              className="btn-signup"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background Image with Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
          <Image
            src="/medical-technology.png"
            alt="Medical Technology Background"
            fill
            style={{ objectFit: 'cover', opacity: 0.25 }}
            priority
          />
          {/* Gradient overlay to fade bottom/sides for better text readability */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.9) 100%)' }}></div>
        </div>

        <div className="hero-container">
          <div className="hero-content-wrapper">
            {/* Left Column: Messaging */}
            <div className="hero-text-section">
              <span className="badge">Next-Gen Healthcare OS</span>
              <h1 className="hero-title">
                One Platform. <br />
                <span className="gradient-text">Complete Care.</span>
              </h1>
              <p className="hero-description">
                Medoryx seamlessly unites patients, doctors, pharmacies, and hospitals into a single, high-performance healthcare ecosystem. Experience clinical excellence through digital innovation.
              </p>
              <div className="cta-group">
                <button
                  className="btn-primary"
                  onClick={() => router.push("/signup")}
                >
                  Join the Network
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => router.push("/about")}
                >
                  Our Solutions
                </button>
              </div>

              <div className="hero-trust">
                <p>Trusted by healthcare leaders nationwide</p>
                <div className="trust-icons">
                  <span className="trust-item">Hospitals</span>
                  <span className="trust-divider"></span>
                  <span className="trust-item">Clinics</span>
                  <span className="trust-divider"></span>
                  <span className="trust-item">Pharmacies</span>
                </div>
              </div>
            </div>

            {/* Right Column: Synergy Visualization */}
            <div className="hero-visual-section">
              <div className="synergy-hub">
                <div className="hub-center">
                  <Image
                    src="/medoryx-logo.png"
                    alt="Medoryx Hub"
                    width={80}
                    height={80}
                    className="hub-logo"
                  />
                </div>

                {/* Role Node: Patients */}
                <div className="role-node node-patient">
                  <div className="node-icon"><FiUsers /></div>
                  <div className="node-info">
                    <h5>Patients</h5>
                    <span>Digital Records</span>
                  </div>
                </div>

                {/* Role Node: Doctors */}
                <div className="role-node node-doctor">
                  <div className="node-icon"><FiUser /></div>
                  <div className="node-info">
                    <h5>Doctors</h5>
                    <span>E-Prescriptions</span>
                  </div>
                </div>

                {/* Role Node: Pharmacy */}
                <div className="role-node node-pharmacy">
                  <div className="node-icon"><FiPackage /></div>
                  <div className="node-info">
                    <h5>Pharmacy</h5>
                    <span>Inventory Sync</span>
                  </div>
                </div>

                {/* Role Node: Hospitals */}
                <div className="role-node node-hospital">
                  <div className="node-icon"><FiTrendingUp /></div>
                  <div className="node-info">
                    <h5>Hospitals</h5>
                    <span>Resource MGMT</span>
                  </div>
                </div>

                {/* Connection Lines */}
                <div className="synergy-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item fade-in">
          <div className="stat-icon-img">
            <Image src="/stat-providers.png" alt="Providers" width={80} height={80} />
          </div>
          <h3>1000+</h3>
          <p>Healthcare Providers</p>
        </div>
        <div className="stat-item fade-in">
          <div className="stat-icon-img">
            <Image src="/stat-patients.png" alt="Patients" width={80} height={80} />
          </div>
          <h3>50K+</h3>
          <p>Active Patients</p>
        </div>
        <div className="stat-item fade-in">
          <div className="stat-icon-img">
            <Image src="/stat-uptime.png" alt="Uptime" width={80} height={80} />
          </div>
          <h3>99.9%</h3>
          <p>Uptime Guarantee</p>
        </div>
        <div className="stat-item fade-in">
          <div className="stat-icon-img">
            <Image src="/stat-uptime.png" alt="Support" width={80} height={80} />
          </div>
          <h3>24/7</h3>
          <p>Support Available</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-header">
          <h2>Powerful Features for Everyone</h2>
          <p>Everything you need for modern healthcare management</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            let imgSrc = "/stat-patients.png"; // Fallback/Default
            if (feature.title === "Doctors") imgSrc = "/medical-staff.png";
            if (feature.title === "Pharmacy") imgSrc = "/medical-technology.png";
            if (feature.title === "Hospitals") imgSrc = "/hospital-exterior.png";

            return (
              <div key={index} className="feature-card group" style={{ transitionDelay: `${index * 0.1}s`, overflow: 'hidden', padding: 0 }}>
                <div style={{ height: '200px', position: 'relative', width: '100%' }}>
                  <Image src={imgSrc} alt={feature.title} fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}></div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div className="feature-icon-wrapper" style={{ marginBottom: '16px' }}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section (Updated Premium Design) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-[#022c22] px-6 py-20 text-center shadow-2xl sm:px-16 sm:py-24">

          {/* --- Background Image & Overlay --- */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/medical-staff.png"
              alt="Welcoming Medical Team"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
              className="opacity-40"
            />
            {/* Strong Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900/90 via-[#022c22]/80 to-[#022c22]/90 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* --- Floating Icons --- */}
          <div className="absolute top-10 right-10 opacity-20 rotate-12 animate-pulse duration-[4000ms]">
            <FiRefreshCw className="h-12 w-12 text-teal-300" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-20 -rotate-12">
            <FiActivity className="h-12 w-12 text-emerald-300" />
          </div>

          {/* --- Main Content --- */}
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-sans">
              Healthcare, without the hassle <br className="hidden sm:block" />
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-7 text-teal-100/80">
              Connect with the growing community of professionals and patients who rely on Medoryx for clarity, not just &quot;transformation.&quot;
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:gap-x-6">
              <button
                onClick={() => router.push("/signup")}
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Join Medoryx Now
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

                {/* Inner shine effect */}
                <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
              </button>


            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo mb-6">
              <Image
                src="/medoryx-logo.png"
                alt="Medoryx Logo"
                width={120}
                height={40}
                className="logo-image"
              />
            </div>
            <p className="text-teal-600/70 font-medium leading-relaxed">
              The unified healthcare operating system for a smarter, faster, and more accessible future.
            </p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><button className="footer-link" onClick={() => router.push("/about")}>Features</button></li>
              <li><button className="footer-link" onClick={() => router.push("/about")}>Solutions</button></li>
              <li><button className="footer-link" onClick={() => router.push("/about")}>API Docs</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><button className="footer-link" onClick={() => router.push("/about")}>About Us</button></li>
              <li><button className="footer-link" onClick={() => router.push("/about")}>Careers</button></li>
              <li><button className="footer-link" onClick={() => router.push("/contact")}>Contact</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legals</h4>
            <ul>
              <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
              <li><a href="#terms" className="footer-link">Terms of Service</a></li>
              <li><a href="#security" className="footer-link">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Medoryx Inc. All rights reserved. Crafted with care for healthcare.</p>
          <div className="flex gap-8">
            <a href="#" className="footer-link text-xs">Twitter</a>
            <a href="#" className="footer-link text-xs">LinkedIn</a>
            <a href="#" className="footer-link text-xs">GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
}
