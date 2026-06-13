import React from 'react';
import { Link } from 'react-router-dom';
import img2 from '../assets/img2.png';
import './StaticPages.css';

export default function AboutUs() {
  return (
    <div className="static-page">
      <div className="static-hero">
        <div className="container">
          <span className="section-label">Our Story</span>
          <h1 className="static-title">About HostelFinder</h1>
          <p className="static-subtitle">
            Connecting students with safe, affordable hostels across Pakistan since 2023.
          </p>
        </div>
      </div>

      <div className="container static-content">
        <div className="about-grid">
          <div className="about-text">
            <h2>Our Mission</h2>
            <p>
              HostelFinder was built to solve a real problem faced by thousands of students across Pakistan — finding safe, verified, and affordable accommodation near their universities. We bridge the gap between hostel owners and students, making the process simple, transparent, and free.
            </p>
            <p>
              We believe every student deserves a safe place to live while pursuing their education. That's why we review every listing before it goes live, ensuring only verified hostels appear on our platform.
            </p>
            <h2 style={{ marginTop: '32px' }}>What We Offer</h2>
            <ul className="about-list">
              <li>✅ Verified hostel listings reviewed by our admin team</li>
              <li>✅ Zero registration required for students</li>
              <li>✅ Free listing for hostel owners</li>
              <li>✅ Direct contact with hostel owners via WhatsApp or call</li>
              <li>✅ Search by city, area, university, price, and type</li>
              <li>✅ Coverage in 6+ major Pakistani cities</li>
            </ul>
          </div>
          <div className="about-image">
            <img src={img2} alt="Students" />
            <div className="about-stats-overlay">
              <div className="about-stat">
                <strong>500+</strong>
                <span>Verified Hostels</span>
              </div>
              <div className="about-stat">
                <strong>10K+</strong>
                <span>Students Helped</span>
              </div>
              <div className="about-stat">
                <strong>6</strong>
                <span>Cities Covered</span>
              </div>
            </div>
          </div>
        </div>

        <div className="team-section">
          <div className="section-header">
            <h2 className="section-title">Our Values</h2>
          </div>
          <div className="values-grid">
            {[
              { icon: '🔒', title: 'Safety First', desc: 'Every hostel is manually reviewed before going live.' },
              { icon: '💯', title: 'Transparency', desc: 'No hidden fees. Direct contact with owners.' },
              { icon: '🤝', title: 'Community', desc: 'Building trust between students and hostel owners.' },
              { icon: '🚀', title: 'Accessibility', desc: 'No signup needed — search and find instantly.' },
            ].map(v => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-inline">
          <h2>Ready to find your hostel?</h2>
          <p>Browse thousands of verified listings across Pakistan.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/find-hostel" className="btn-primary">Find a Hostel</Link>
            <Link to="/add-hostel" className="btn-secondary">List Your Hostel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
