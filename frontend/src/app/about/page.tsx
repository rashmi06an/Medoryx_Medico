"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiCheckCircle,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiTarget,
  FiMapPin,
  FiBarChart,
  FiPackage,
  FiClock,
  FiMonitor,
  FiFileText,
  FiLayers,
  FiAlertTriangle,
  FiClipboard,
  FiUsers,
  FiShuffle,
  FiDatabase,
} from "react-icons/fi";

export default function AboutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      // Scroll handler if needed for future animations
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const problems = [
    { title: "Finding Essential Medicines", icon: <FiPackage /> },
    { title: "Long Clinic Waiting Times", icon: <FiClock /> },
    { title: "Unknown Hospital Bed Availability", icon: <FiMonitor /> },
    { title: "Confusing Handwritten Prescriptions", icon: <FiFileText /> },
    { title: "Scattered Medical Records", icon: <FiLayers /> },
  ];

  const solutions = [
    {
      title: "Real-time Medicine Availability",
      description: "Instant tracking of medicines across pharmacies",
      icon: <FiZap />,
    },
    {
      title: "Expiry & Wastage Reduction",
      description: "Minimize losses with smart inventory management",
      icon: <FiTrendingUp />,
    },
    {
      title: "Appointment & Queue Management",
      description: "Organized clinics with live waiting times",
      icon: <FiBarChart />,
    },
    {
      title: "Hospital Bed Monitoring",
      description: "Real-time bed availability across hospitals",
      icon: <FiMapPin />,
    },
    {
      title: "Digital Prescriptions with OCR",
      description: "Transform handwritten prescriptions instantly",
      icon: <FiTarget />,
    },
    {
      title: "Secure Health Records",
      description: "Encrypted personal health data, always accessible",
      icon: <FiShield />,
    },
  ];

  const whyDifferent = [
    { title: "Local-First Design", description: "Built for pharmacies and clinics, not just hospitals" },
    { title: "Real-Time Data", description: "Live visibility, not outdated information" },
    { title: "Senior-Friendly UX", description: "Simple interfaces, not complex dashboards" },
    { title: "Modular & Scalable", description: "Ready to grow from city to national level" },
    { title: "Impact-Driven", description: "Social good with sustainable business" },
  ];

  const impacts = [
    { metric: "Reduced Medicine Wastage", icon: "♻️" },
    { metric: "Lower Healthcare Costs", icon: "💰" },
    { metric: "Faster Emergency Response", icon: "🚑" },
    { metric: "Better Patient Outcomes", icon: "❤️" },
  ];

  return (
    <div className="about-container">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .about-container {
          background: linear-gradient(135deg, #f8fffe 0%, #e8f7f6 50%, #f0fffe 100%);
          color: #1a4d4d;
          overflow-x: hidden;
        }

        /* Navbar */
        .navbar-about {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 128, 128, 0.1);
          padding: 16px 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          animation: fadeInDown 0.5s ease-out;
        }

        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 60px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logo-section:hover {
          transform: scale(1.05);
        }

        .logo-image {
          height: 45px;
          width: auto;
          object-fit: contain;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #008080 0%, #004d4d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .nav-button {
          padding: 10px 20px;
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .nav-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 128, 128, 0.3);
        }

        /* Hero Section */
        .hero-about {
          padding: 100px 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-about::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 128, 128, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          z-index: 0;
        }

        .hero-about-content {
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-badge {
          display: inline-block;
          padding: 10px 20px;
          background: rgba(0, 128, 128, 0.1);
          border: 1px solid rgba(0, 128, 128, 0.3);
          border-radius: 20px;
          color: #008080;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          animation: bounceIn 0.6s ease-out;
        }

        .hero-about h1 {
          font-size: 56px;
          line-height: 1.2;
          margin-bottom: 20px;
          color: #004d4d;
          font-weight: 800;
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .highlight-text {
          background: linear-gradient(135deg, #008080 0%, #00a8a8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-about p {
          font-size: 18px;
          line-height: 1.8;
          color: #666;
          max-width: 700px;
          margin: 0 auto 30px;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        /* Mission Section */
        .mission-section {
          padding: 100px 60px;
          background: linear-gradient(135deg, rgba(0, 128, 128, 0.02) 0%, rgba(0, 128, 128, 0.01) 100%);
          border-top: 2px solid rgba(0, 128, 128, 0.1);
          border-bottom: 2px solid rgba(0, 128, 128, 0.1);
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .mission-content h2 {
          font-size: 40px;
          color: #004d4d;
          margin-bottom: 20px;
          font-weight: 800;
          animation: fadeInUp 0.8s ease-out;
        }

        .mission-content p {
          font-size: 16px;
          line-height: 1.8;
          color: #666;
          margin-bottom: 20px;
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .mission-image {
          animation: slideInRight 0.8s ease-out;
        }

        .mission-image img {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 128, 128, 0.15);
        }

        /* Problems Section */
        .problems-section {
          padding: 100px 60px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
          animation: fadeInUp 0.8s ease-out;
        }

        .section-header h2 {
          font-size: 44px;
          color: #004d4d;
          margin-bottom: 15px;
          font-weight: 800;
        }

        .section-header p {
          font-size: 18px;
          color: #666;
          font-weight: 500;
        }

        .problems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .problem-card {
          background: white;
          padding: 30px;
          border-radius: 14px;
          border: 1px solid rgba(0, 128, 128, 0.1);
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.08);
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInUp 0.6s ease-out both;
        }

        .problem-card:nth-child(1) {
          animation-delay: 0s;
        }
        .problem-card:nth-child(2) {
          animation-delay: 0.1s;
        }
        .problem-card:nth-child(3) {
          animation-delay: 0.2s;
        }
        .problem-card:nth-child(4) {
          animation-delay: 0.3s;
        }
        .problem-card:nth-child(5) {
          animation-delay: 0.4s;
        }

        .problem-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 128, 128, 0.2);
          border-color: rgba(0, 128, 128, 0.3);
        }

        .problem-icon {
          font-size: 50px;
          margin-bottom: 15px;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .problem-card h3 {
          font-size: 18px;
          color: #004d4d;
          font-weight: 700;
        }

        /* Flip Card Styles */
        .flip-card-container {
          background-color: transparent;
          width: 100%;
          height: 250px;
          perspective: 1000px;
          cursor: pointer;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.08);
          border-radius: 16px;
        }

        .flip-card-container:hover .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .flip-card-front {
          background-color: white;
          color: #008080;
          border: 1px solid rgba(0, 128, 128, 0.1);
        }

        .flip-card-back {
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          transform: rotateY(180deg);
          border: 1px solid #008080;
        }

        .flip-icon {
          font-size: 60px;
          margin-bottom: 0;
          filter: drop-shadow(0 4px 6px rgba(0, 128, 128, 0.2));
        }

        .flip-title-back {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.5;
        }

        /* Solutions Section */
        .solutions-section {
          padding: 100px 60px;
          background: linear-gradient(135deg, rgba(0, 128, 128, 0.02) 0%, rgba(0, 128, 128, 0.01) 100%);
        }

        .solutions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .solution-card {
          background: white;
          padding: 40px 30px;
          border-radius: 16px;
          border: 1px solid rgba(0, 128, 128, 0.1);
          box-shadow: 0 8px 25px rgba(0, 128, 128, 0.08);
          transition: all 0.4s ease;
          animation: fadeInUp 0.6s ease-out both;
        }

        .solution-card:nth-child(1) {
          animation-delay: 0s;
        }
        .solution-card:nth-child(2) {
          animation-delay: 0.1s;
        }
        .solution-card:nth-child(3) {
          animation-delay: 0.2s;
        }
        .solution-card:nth-child(4) {
          animation-delay: 0.3s;
        }
        .solution-card:nth-child(5) {
          animation-delay: 0.4s;
        }
        .solution-card:nth-child(6) {
          animation-delay: 0.5s;
        }

        .solution-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 50px rgba(0, 128, 128, 0.2);
          border-color: rgba(0, 128, 128, 0.3);
        }

        .solution-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, rgba(0, 128, 128, 0.1) 0%, rgba(0, 128, 128, 0.05) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          font-size: 28px;
          color: #008080;
          transition: all 0.3s ease;
        }

        .solution-card:hover .solution-icon {
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          transform: scale(1.1) rotate(-10deg);
        }

        .solution-card h3 {
          font-size: 20px;
          color: #004d4d;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .solution-card p {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
        }

        /* Why Different Section */
        .different-section {
          padding: 100px 60px;
        }

        .different-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .different-card {
          padding: 30px;
          background: white;
          border-radius: 14px;
          border-left: 4px solid #008080;
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.08);
          transition: all 0.3s ease;
          animation: slideInLeft 0.6s ease-out both;
        }

        .different-card:nth-child(1) {
          animation-delay: 0s;
        }
        .different-card:nth-child(2) {
          animation-delay: 0.1s;
        }
        .different-card:nth-child(3) {
          animation-delay: 0.2s;
        }
        .different-card:nth-child(4) {
          animation-delay: 0.3s;
        }
        .different-card:nth-child(5) {
          animation-delay: 0.4s;
        }

        .different-card:hover {
          transform: translateX(10px);
          box-shadow: 0 12px 30px rgba(0, 128, 128, 0.15);
          border-left-color: #006666;
        }

        .different-card h3 {
          font-size: 18px;
          color: #004d4d;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .different-card p {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
        }

        /* Stats Section */
        .stats-section {
          padding: 100px 60px;
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .stats-section::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 10s ease-in-out infinite;
          z-index: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          text-align: center;
          animation: fadeInUp 0.8s ease-out both;
        }

        .stat-card:nth-child(1) {
          animation-delay: 0s;
        }
        .stat-card:nth-child(2) {
          animation-delay: 0.1s;
        }
        .stat-card:nth-child(3) {
          animation-delay: 0.2s;
        }
        .stat-card:nth-child(4) {
          animation-delay: 0.3s;
        }

        .stat-icon {
          font-size: 50px;
          margin-bottom: 15px;
          animation: rotate 20s linear infinite;
        }

        .stat-card h3 {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.6;
        }

        /* Vision Section */
        .vision-section {
          padding: 100px 60px;
          text-align: center;
        }

        .vision-content {
          max-width: 900px;
          margin: 0 auto;
          animation: fadeInUp 0.8s ease-out;
        }

        .vision-content h2 {
          font-size: 42px;
          color: #004d4d;
          margin-bottom: 30px;
          font-weight: 800;
        }

        .vision-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .vision-item {
          padding: 25px;
          background: white;
          border-radius: 12px;
          border: 1px solid rgba(0, 128, 128, 0.1);
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.08);
          animation: bounceIn 0.6s ease-out both;
        }

        .vision-item:nth-child(1) {
          animation-delay: 0s;
        }
        .vision-item:nth-child(2) {
          animation-delay: 0.1s;
        }
        .vision-item:nth-child(3) {
          animation-delay: 0.2s;
        }
        .vision-item:nth-child(4) {
          animation-delay: 0.3s;
        }

        .vision-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0, 128, 128, 0.15);
        }

        .vision-item p {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
        }

        .cta-section {
          margin-top: 50px;
          padding: 40px;
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          border-radius: 16px;
          color: white;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .cta-section h3 {
          font-size: 24px;
          margin-bottom: 15px;
          font-weight: 800;
        }

        .cta-section p {
          font-size: 16px;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.9);
        }

        .cta-button {
          padding: 12px 30px;
          background: white;
          color: #008080;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        /* Footer */
        .footer-about {
          background: linear-gradient(135deg, #004d4d 0%, #003333 100%);
          color: white;
          padding: 60px;
          text-align: center;
        }

        .footer-about p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .navbar-content {
            padding: 0 30px;
          }

          .hero-about {
            padding: 60px 30px;
          }

          .hero-about h1 {
            font-size: 42px;
          }

          .mission-section {
            padding: 60px 30px;
          }

          .section-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .problems-section,
          .solutions-section,
          .different-section,
          .vision-section {
            padding: 60px 30px;
          }

          .stats-section {
            padding: 60px 30px;
          }
        }

        @media (max-width: 768px) {
          .navbar-content {
            padding: 0 20px;
          }

          .logo-text {
            font-size: 18px;
          }

          .hero-about {
            padding: 50px 20px;
          }

          .hero-about h1 {
            font-size: 32px;
          }

          .hero-about p {
            font-size: 16px;
          }

          .mission-section,
          .problems-section,
          .solutions-section,
          .different-section,
          .vision-section {
            padding: 50px 20px;
          }

          .section-header h2 {
            font-size: 32px;
          }

          .problems-grid,
          .solutions-grid,
          .different-grid,
          .stats-grid,
          .vision-list {
            grid-template-columns: 1fr;
          }

          .stats-section {
            padding: 50px 20px;
          }

          .vision-content h2 {
            font-size: 28px;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar-about">
        <div className="navbar-content">
          <div className="logo-section" onClick={() => router.push("/")}>
            <Image
              src="/medoryx-logo.png"
              alt="Medoryx"
              width={160}
              height={50}
              className="logo-image"
            />
            <span className="logo-text">Medoryx</span>
          </div>
          <button className="nav-button" onClick={() => router.push("/signup")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-about">
        <div className="hero-about-content">
          <div className="hero-badge">About Medoryx</div>
          <h1>
            Building the Missing Digital Backbone of <span className="highlight-text">India&apos;s Local Healthcare</span>
          </h1>
          <p>
            Medoryx is a unified, scalable healthcare infrastructure platform that brings medicines, clinics, hospitals, and patient health records onto a single, intelligent system.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-grid">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              To make healthcare accessible, transparent, and efficient by connecting local medical providers and patients through real-time data and smart digital infrastructure.
            </p>
            <p style={{ marginTop: "25px", fontWeight: "600", color: "#004d4d" }}>
              While healthcare technology has advanced rapidly at the enterprise level, local pharmacies, small clinics, and everyday patients still rely on manual processes, phone calls, and guesswork.
            </p>
            <p style={{ marginTop: "15px", fontSize: "17px", fontWeight: "700", color: "#008080" }}>
              Medoryx exists to change that. We are not just creating another healthcare app — <br /> Medoryx is a local healthcare operating system.
            </p>
          </div>
          <div className="mission-image">
            <div style={{ position: 'relative', height: '400px', width: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0, 128, 128, 0.2)' }}>
              <Image
                src="/hospital-exterior.png"
                alt="Modern Hospital Infrastructure"
                fill
                style={{ objectFit: "cover" }}
                className="mission-img-techno"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team and Tech Section */}
      <section style={{ padding: '60px', background: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div style={{ position: 'relative', height: '350px', borderRadius: '16px', overflow: 'hidden' }}>
            <Image src="/medical-staff.png" alt="Our Medical Team" fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Compassionate Care</h3>
              <p>Empowering professionals with better tools.</p>
            </div>
          </div>
          <div style={{ position: 'relative', height: '350px', borderRadius: '16px', overflow: 'hidden' }}>
            <Image src="/medical-technology.png" alt="Advanced Technology" fill style={{ objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', color: 'white' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Future-Ready Tech</h3>
              <p>Building the digital infrastructure of tomorrow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="problems-section">
        <div className="section-header">
          <h2>The Problem We&apos;re Solving</h2>
          <p>India&apos;s healthcare challenges aren&apos;t only about affordability — they are about coordination.</p>
        </div>

        <div style={{ marginBottom: "50px" }}>
          <h3 style={{ fontSize: "22px", color: "#004d4d", marginBottom: "30px", textAlign: "center", fontWeight: "700" }}>
            Patients Struggle With:
          </h3>
          <div className="problems-grid">
            {problems.map((problem, index) => (
              <div key={index} className="flip-card-container">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="flip-icon">{problem.icon}</div>
                  </div>
                  <div className="flip-card-back">
                    <p className="flip-title-back">{problem.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: "22px", color: "#004d4d", marginBottom: "30px", textAlign: "center", fontWeight: "700" }}>
            Healthcare Providers Face:
          </h3>
          <div className="problems-grid">
            {[
              { title: "Medicine Expiry Losses", icon: <FiAlertTriangle /> },
              { title: "Manual Inventory Tracking", icon: <FiClipboard /> },
              { title: "Overcrowded Clinics", icon: <FiUsers /> },
              { title: "Poor Patient Flow", icon: <FiShuffle /> },
              { title: "Fragmented Data Systems", icon: <FiDatabase /> },
            ].map((problem, index) => (
              <div key={index} className="flip-card-container">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="flip-icon">{problem.icon}</div>
                  </div>
                  <div className="flip-card-back">
                    <p className="flip-title-back">{problem.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="solutions-section">
        <div className="section-header">
          <h2>Our Solution: Medoryx Platform</h2>
          <p>Six Core Systems, One Seamless Ecosystem</p>
        </div>

        <div className="solutions-grid">
          {solutions.map((solution, index) => (
            <div key={index} className="solution-card">
              <div className="solution-icon">{solution.icon}</div>
              <h3>{solution.title}</h3>
              <p>{solution.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Different Section */}
      <section className="different-section">
        <div className="section-header">
          <h2>Why Medoryx Is Different</h2>
          <p>We focus where inefficiencies hurt the most — at the ground level of healthcare delivery</p>
        </div>

        <div className="different-grid">
          {whyDifferent.map((item, index) => (
            <div key={index} className="different-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section className="stats-section">
        <div className="section-header" style={{ marginBottom: "50px", color: "white" }}>
          <h2 style={{ color: "white" }}>Our Impact</h2>
          <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>Because better healthcare systems save more than money — they save time, trust, and lives</p>
        </div>

        <div className="stats-grid">
          {impacts.map((impact, index) => {
            let imgSrc = "/medical-staff.png"; // Default
            if (impact.metric === "Reduced Medicine Wastage") imgSrc = "/medical-technology.png";
            if (impact.metric === "Lower Healthcare Costs") imgSrc = "/stat-uptime.png";
            if (impact.metric === "Faster Emergency Response") imgSrc = "/hospital-exterior.png";
            if (impact.metric === "Better Patient Outcomes") imgSrc = "/medical-staff.png";

            return (
              <div key={index} className="stat-card" style={{ padding: 0, overflow: 'hidden', height: '250px', position: 'relative', background: 'black' }}>
                <Image src={imgSrc} alt={impact.metric} fill style={{ objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '20px' }}>
                  {/* <div className="stat-icon" style={{ fontSize: '0px', marginBottom: '10px' }}></div>  Hide original icon spacing */}
                  <h3 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontSize: '22px', fontWeight: 'bold' }}>{impact.metric}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="vision-content">
          <h2>Our Vision</h2>
          <p style={{ fontSize: "17px", lineHeight: "1.8", color: "#666", marginBottom: "40px" }}>
            We envision a future where Medoryx becomes the default healthcare infrastructure layer for India&apos;s cities.
          </p>

          <div className="vision-list">
            {[
              "No patient runs from pharmacy to pharmacy",
              "No emergency is delayed due to lack of information",
              "No medical record is ever lost",
              "Local healthcare works with the efficiency of a modern digital system",
            ].map((vision, index) => (
              <div key={index} className="vision-item">
                <FiCheckCircle style={{ fontSize: "32px", color: "#008080", marginBottom: "10px" }} />
                <p>{vision}</p>
              </div>
            ))}
          </div>

          <div className="cta-section">
            <h3>Ready to Be Part of the Healthcare Revolution?</h3>
            <p>Join Medoryx and help us transform healthcare across India</p>
            <button className="cta-button" onClick={() => router.push("/signup")}>
              Get Started Today <FiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-about">
        <p>&copy; 2026 Medoryx. Building the future of healthcare, one system at a time.</p>
      </footer>
    </div>
  );
}
