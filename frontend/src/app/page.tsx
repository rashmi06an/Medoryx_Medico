"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiUsers, FiUser, FiPackage, FiTrendingUp } from "react-icons/fi";

export default function HomePage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      description: "Centralized healthcare management and resource optimization.",
    },
  ];

  return (
    <>
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo-wrapper">
            <Image
              src="/medoryx-logo.png"
              alt="Medoryx Logo"
              width={180}
              height={60}
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
      <section className="hero" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
        <div className="hero-content">
          <div className="hero-text">
            <span className="badge">Welcome to Healthcare Revolution</span>
            <h1 className="hero-title">
              Healthcare Made <span className="gradient-text">Simple & Smart</span>
            </h1>
            <p className="hero-description">
              Connect patients, doctors, pharmacies, and hospitals in one unified platform.
              Experience seamless healthcare management with secure digital solutions.
            </p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => router.push("/signup")}
              >
                Get Started
              </button>
              <button 
                className="btn-secondary"
                onClick={() => router.push("/about")}
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-container">
              <Image
                src="https://illustrations.popsy.co/teal/doctor.svg"
                alt="Healthcare Illustration"
                width={500}
                height={500}
                priority
              />
              <div className="floating-element element-1"></div>
              <div className="floating-element element-2"></div>
              <div className="floating-element element-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item fade-in">
          <h3>1000+</h3>
          <p>Healthcare Providers</p>
        </div>
        <div className="stat-item fade-in">
          <h3>50K+</h3>
          <p>Active Patients</p>
        </div>
        <div className="stat-item fade-in">
          <h3>99.9%</h3>
          <p>Uptime Guarantee</p>
        </div>
        <div className="stat-item fade-in">
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
          {features.map((feature, index) => (
            <div key={index} className="feature-card" style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="card-hover-effect"></div>
            </div>
          ))}
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
            <div className="footer-logo">
              <Image
                src="/medoryx-logo.png"
                alt="Medoryx Logo"
                width={150}
                height={50}
                className="logo-image"
              />
            </div>
            <p>Making healthcare accessible to everyone.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><button className="footer-link" onClick={() => router.push("/about")}>About Us</button></li>
              <li><button className="footer-link" onClick={() => router.push("/about")}>Features</button></li>
              <li><button className="footer-link" onClick={() => router.push("/contact")}>Contact</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Medoryx. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
