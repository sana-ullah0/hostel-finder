import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { hostelApi, BACKEND_URL } from '../services/api';
import './HostelDetails.css';

const FACILITY_LIST = [
  { key: 'wifi', icon: '📶', label: 'WiFi' },
  { key: 'mess', icon: '🍽️', label: 'Mess / Cafeteria' },
  { key: 'laundry', icon: '👕', label: 'Laundry' },
  { key: 'parking', icon: '🚗', label: 'Parking' },
  { key: 'cctv', icon: '📷', label: 'CCTV Cameras' },
  { key: 'security_guard', icon: '💂', label: 'Security Guard' },
  { key: 'generator', icon: '⚡', label: 'Generator' },
];

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= Math.floor(rating) ? '' : 'empty'}`}>★</span>
      ))}
    </div>
  );
}

export default function HostelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    hostelApi.getById(id)
      .then(res => setHostel(res.data.data))
      .catch(() => navigate('/find-hostel'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: 80 }} className="loading-center">
      <div className="loading-spinner" />
    </div>
  );

  if (!hostel) return null;

  const images = hostel.images?.length ? hostel.images : [];
  const activeFacilities = FACILITY_LIST.filter(f => hostel[f.key] == 1);
  const mapQuery = encodeURIComponent(`${hostel.address}, ${hostel.city}, Pakistan`);
  const formatRent = (n) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="hostel-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to="/find-hostel">Find Hostel</Link>
            <span>›</span>
            <span>{hostel.hostel_name}</span>
          </nav>
        </div>
      </div>

      <div className="container details-layout">
        {/* Left Column */}
        <div className="details-main">
          {/* Gallery */}
          <div className="gallery">
            <div className="gallery-main">
              {images.length > 0 ? (
                <img
                  src={`${BACKEND_URL}${images[activeImg]}`}
                  alt={hostel.hostel_name}
                  onError={e => e.target.src = ''}
                />
              ) : (
                <div className="gallery-placeholder">🏠</div>
              )}
              <span className="hostel-type-badge">{hostel.hostel_type}</span>
            </div>
            {images.length > 1 && (
              <div className="gallery-thumbs">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`gallery-thumb ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={`${BACKEND_URL}${img}`} alt={`View ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="details-info">
            <div className="details-title-row">
              <h1 className="details-name">{hostel.hostel_name}</h1>
              {hostel.rating > 0 && (
                <div className="details-rating">
                  <StarRating rating={hostel.rating} />
                  <span className="rating-value">{parseFloat(hostel.rating).toFixed(1)}</span>
                  <span className="rating-count">({hostel.total_reviews} reviews)</span>
                </div>
              )}
            </div>

            <div className="details-location">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {hostel.address}{hostel.area && `, ${hostel.area}`}, {hostel.city}
            </div>

            {hostel.nearby_university && (
              <div className="details-university">
                🎓 Near <strong>{hostel.nearby_university}</strong>
              </div>
            )}

            {hostel.description && (
              <div className="details-section">
                <h2 className="details-section-title">About This Hostel</h2>
                <p className="details-description">{hostel.description}</p>
              </div>
            )}

            {/* Facilities */}
            {activeFacilities.length > 0 && (
              <div className="details-section">
                <h2 className="details-section-title">Facilities & Amenities</h2>
                <div className="facilities-grid">
                  {activeFacilities.map(f => (
                    <div key={f.key} className="facility-item">
                      <span className="facility-item-icon">{f.icon}</span>
                      <span>{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="details-section">
              <h2 className="details-section-title">Location on Map</h2>
              <div className="map-container">
                <iframe
                  title="Hostel Location"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="details-sidebar">
          {/* Pricing Card */}
          <div className="pricing-card">
            <div className="pricing-header">
              <div className="pricing-main">
                <span className="pricing-label">Monthly Rent</span>
                <span className="pricing-amount">{formatRent(hostel.rent)}</span>
              </div>
              {hostel.security_fee > 0 && (
                <div className="pricing-security">
                  <span>Security Deposit</span>
                  <strong>{formatRent(hostel.security_fee)}</strong>
                </div>
              )}
            </div>

            <div className="contact-section">
              <h3 className="contact-title">Contact Owner</h3>
              <div className="owner-info">
                <div className="owner-avatar">👤</div>
                <div>
                  <strong className="owner-name">{hostel.owner_name}</strong>
                  <span className="owner-label">Hostel Owner</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${(hostel.whatsapp || hostel.phone).replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn whatsapp-btn"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.522 5.843L0 24l6.335-1.492A11.956 11.956 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.846 0-3.579-.482-5.088-1.326L2 22l1.353-4.805A9.961 9.961 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Chat on WhatsApp
              </a>

              <a
                href={`tel:${hostel.phone}`}
                className="contact-btn call-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1H5.1a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Call: {hostel.phone}
              </a>
            </div>
          </div>

          {/* Quick Details */}
          <div className="quick-details-card">
            <h3>Quick Details</h3>
            <ul className="quick-list">
              <li>
                <span>📍 City</span>
                <strong>{hostel.city}</strong>
              </li>
              {hostel.area && (
                <li>
                  <span>🏘️ Area</span>
                  <strong>{hostel.area}</strong>
                </li>
              )}
              <li>
                <span>🏠 Type</span>
                <strong>{hostel.hostel_type}</strong>
              </li>
              {hostel.nearby_university && (
                <li>
                  <span>🎓 University</span>
                  <strong>{hostel.nearby_university}</strong>
                </li>
              )}
              <li>
                <span>💰 Rent</span>
                <strong>{formatRent(hostel.rent)}/mo</strong>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
