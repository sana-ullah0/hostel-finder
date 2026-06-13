import React from 'react';
import { useNavigate } from 'react-router-dom';

const FACILITY_ICONS = {
  wifi: { icon: '📶', label: 'WiFi' },
  mess: { icon: '🍽️', label: 'Mess' },
  laundry: { icon: '👕', label: 'Laundry' },
  parking: { icon: '🚗', label: 'Parking' },
  cctv: { icon: '📷', label: 'CCTV' },
  security_guard: { icon: '💂', label: 'Security' },
  generator: { icon: '⚡', label: 'Generator' },
};

function StarRating({ rating }) {
  const stars = [];
  const full = Math.floor(rating);
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`star ${i <= full ? '' : 'empty'}`}>★</span>
    );
  }
  return <div className="stars">{stars}</div>;
}

export default function HostelCard({ hostel, style }) {
  const navigate = useNavigate();
  const imageUrl = hostel.primary_image || (hostel.images && hostel.images[0]);
  const backendUrl = 'http://localhost/hostel-finder/backend/';

  const activeFacilities = Object.entries(FACILITY_ICONS)
    .filter(([key]) => hostel[key] == 1)
    .slice(0, 4);

  const formatRent = (rent) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })
      .format(rent);

  return (
    <div
      className="hostel-card animate-fade-in-up"
      style={style}
      onClick={() => navigate(`/hostel/${hostel.id}`)}
    >
      {imageUrl ? (
        <img
          src={`${backendUrl}${imageUrl}`}
          alt={hostel.hostel_name}
          className="card-image"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div className="card-image-placeholder" style={{ display: imageUrl ? 'none' : 'flex' }}>
        🏠
      </div>

      <div className="card-body">
        <span className="card-type">{hostel.hostel_type}</span>
        <h3 className="card-name">{hostel.hostel_name}</h3>

        <div className="card-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {hostel.area ? `${hostel.area}, ` : ''}{hostel.city}
        </div>

        {hostel.rating > 0 && (
          <div className="card-rating">
            <StarRating rating={hostel.rating} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              {parseFloat(hostel.rating).toFixed(1)}
            </span>
            {hostel.total_reviews > 0 && (
              <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>
                ({hostel.total_reviews})
              </span>
            )}
          </div>
        )}

        {activeFacilities.length > 0 && (
          <div className="card-facilities">
            {activeFacilities.map(([key, { icon, label }]) => (
              <span key={key} className="facility-tag">{icon} {label}</span>
            ))}
            {Object.entries(FACILITY_ICONS).filter(([k]) => hostel[k] == 1).length > 4 && (
              <span className="facility-tag">+{Object.entries(FACILITY_ICONS).filter(([k]) => hostel[k] == 1).length - 4} more</span>
            )}
          </div>
        )}

        <div className="card-footer">
          <div>
            <div className="card-rent">
              {formatRent(hostel.rent)}
              <span>/month</span>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
            onClick={e => { e.stopPropagation(); navigate(`/hostel/${hostel.id}`); }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
