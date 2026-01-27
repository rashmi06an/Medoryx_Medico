"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiUsers, FiUser, FiPackage, FiTrendingUp } from "react-icons/fi";

export default function HomePage() {
  const router = useRouter();

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
      {/* Local Styles for Landing Page */}
      <style jsx>{`
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
      <section className="hero">
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Healthcare?</h2>
          <p>Join thousands of healthcare professionals and patients already using Medoryx</p>
          <button
            className="btn-large"
            onClick={() => router.push("/signup")}
          >
            Start Your Journey
          </button>
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
