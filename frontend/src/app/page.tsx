"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* Navbar */}
      <div className="navbar">
        <div className="logo">Medico</div>
        <div className="nav-actions">
          <button
            className="btn-login"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>

          <button
            className="btn-signup"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <h1>Healthcare, Simplified.</h1>
          <p>
            Book appointments, manage prescriptions, connect with doctors,
            pharmacies, and hospitals — all in one secure platform.
          </p>
          <button onClick={() => router.push("/auth/signup")}>
            Get Started
          </button>
        </div>

        <img
          src="https://illustrations.popsy.co/teal/doctor.svg"
          alt="Healthcare"
          width="420"
        />
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <h3>Patients</h3>
          <p>Easy booking & medical records.</p>
        </div>

        <div className="feature-card">
          <h3>Doctors</h3>
          <p>Manage appointments digitally.</p>
        </div>

        <div className="feature-card">
          <h3>Pharmacy</h3>
          <p>Smart prescription handling.</p>
        </div>

        <div className="feature-card">
          <h3>Hospitals</h3>
          <p>Centralized healthcare management.</p>
        </div>
      </section>
    </>
  );
}
