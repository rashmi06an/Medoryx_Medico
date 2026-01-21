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

      {/* Full-screen Hero Banner */}
      <section className="hero-banner">
        <Image
          src="/hero-banner.png"
          alt="Medoryx Health and Wellness Banner"
          width={1920}
          height={600}
          priority
        />
      </section>

      {/* Hero Section */}
      <section className="hero">
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
            <div key={index} className="feature-card group" style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
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
