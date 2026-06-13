import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { hostelApi } from '../services/api';
import HostelCard from '../components/HostelCard';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';
import './Home.css';

const CITIES = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Faisalabad'];
const UNIVERSITIES = ['NUST', 'COMSATS', 'FAST', 'Air University', 'UET', 'IIUI'];
const CATEGORIES = [
  { name: 'Boys Hostel', icon: '👨‍🎓', color: '#EFF6FF', border: '#BFDBFE' },
  { name: 'Girls Hostel', icon: '👩‍🎓', color: '#FDF4FF', border: '#E9D5FF' },
  { name: 'Family Hostel', icon: '👨‍👩‍👧', color: '#F0FDF4', border: '#BBF7D0' },
  { name: 'Executive Hostel', icon: '🏢', color: '#FFF7ED', border: '#FED7AA' },
];
const WHY_US = [
  { icon: '✅', title: 'Verified Listings', desc: 'Only admin-approved hostels are displayed on our platform.' },
  { icon: '🔍', title: 'Easy Search', desc: 'Search by city, area or university and find hostels instantly.' },
  { icon: '💰', title: 'Affordable Prices', desc: 'Browse budget-friendly options starting from PKR 5,000/month.' },
  { icon: '📞', title: 'Direct Contact', desc: 'Contact hostel owners directly via call or WhatsApp.' },
];
const TESTIMONIALS = [
  { name: 'Ahmed Ali', university: 'NUST, Islamabad', review: 'Found an amazing hostel near NUST within minutes. The listings are accurate and the process is super easy!', rating: 5, avatar: '👨‍💻' },
  { name: 'Fatima Zahra', university: 'COMSATS, Islamabad', review: 'As a girl student, I was worried about finding a safe hostel. HostelFinder made it easy with verified listings.', rating: 5, avatar: '👩‍🔬' },
  { name: 'Hassan Raza', university: 'Air University, Rawalpindi', review: 'Great platform! I compared multiple hostels and found one that fits my budget perfectly. Highly recommend.', rating: 4, avatar: '👨‍🎓' },
];

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star ${i <= rating ? '' : 'empty'}`}>★</span>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ city: '', area: '', university: '' });
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    hostelApi.getFeatured(6)
      .then(res => setFeatured(res.data.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.city) params.set('city', search.city);
    if (search.area) params.set('area', search.area);
    if (search.university) params.set('university', search.university);
    navigate(`/find-hostel?${params.toString()}`);
  };

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero" style={{ backgroundImage: `url(${img1})` }}>
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="hero-badge animate-fade-in-up">🏠 Pakistan's #1 Hostel Platform</div>
          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Find Your Perfect Hostel<br />
            <span>Near Your University</span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Browse verified hostels with affordable prices and modern facilities.<br />
            No registration needed — search and contact owners directly.
          </p>

          <form className="hero-search animate-fade-in-up" style={{ animationDelay: '0.3s' }} onSubmit={handleSearch}>
            <div className="search-field">
              <label>City</label>
              <select value={search.city} onChange={e => setSearch(s => ({ ...s, city: e.target.value }))}>
                <option value="">All Cities</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <label>Area</label>
              <input
                placeholder="e.g. G-10, Gulberg..."
                value={search.area}
                onChange={e => setSearch(s => ({ ...s, area: e.target.value }))}
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <label>University</label>
              <select value={search.university} onChange={e => setSearch(s => ({ ...s, university: e.target.value }))}>
                <option value="">Any University</option>
                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <button type="submit" className="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search
            </button>
          </form>

          <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="hero-stat"><strong>500+</strong><span>Listed Hostels</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>6</strong><span>Major Cities</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>10,000+</strong><span>Students Helped</span></div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section-padding categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Browse by Type</span>
            <h2 className="section-title">Hostel Categories</h2>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/find-hostel?hostel_type=${encodeURIComponent(cat.name)}`}
                className="category-card"
                style={{ background: cat.color, borderColor: cat.border }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOSTELS ── */}
      <section className="section-padding featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Top Picks</span>
            <h2 className="section-title">Featured Hostels</h2>
            <p className="section-subtitle">Hand-picked, highly rated hostels trusted by thousands of students.</p>
          </div>

          {loading ? (
            <div className="loading-center"><div className="loading-spinner" /></div>
          ) : featured.length > 0 ? (
            <div className="hostel-grid">
              {featured.map((h, i) => (
                <HostelCard key={h.id} hostel={h} style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h3>No Hostels Yet</h3>
              <p>Be the first to list your hostel!</p>
              <Link to="/add-hostel" className="btn-primary">Add Hostel</Link>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/find-hostel" className="btn-secondary">
              View All Hostels
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── POPULAR CITIES ── */}
      <section className="section-padding cities-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Explore</span>
            <h2 className="section-title">Popular Cities</h2>
            <p className="section-subtitle">Find hostels in Pakistan's major university cities.</p>
          </div>
          <div className="cities-grid">
            {[
              { city: 'Islamabad', count: '80+', img: img2, emoji: '🏛️' },
              { city: 'Rawalpindi', count: '60+', img: img3, emoji: '🌆' },
              { city: 'Lahore', count: '120+', img: img4, emoji: '🕌' },
              { city: 'Karachi', count: '100+', img: img1, emoji: '🌊' },
              { city: 'Peshawar', count: '40+', img: img2, emoji: '🏔️' },
              { city: 'Faisalabad', count: '50+', img: img3, emoji: '🏭' },
            ].map(({ city, count, img, emoji }) => (
              <Link key={city} to={`/find-hostel?city=${city}`} className="city-card">
                <div className="city-img-wrap">
                  <img src={img} alt={city} />
                  <div className="city-overlay" />
                </div>
                <div className="city-info">
                  <span className="city-emoji">{emoji}</span>
                  <h3 className="city-name">{city}</h3>
                  <p className="city-count">{count} Hostels</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── UNIVERSITIES ── */}
      <section className="section-padding universities-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Near Campus</span>
            <h2 className="section-title">Browse by University</h2>
          </div>
          <div className="universities-grid">
            {UNIVERSITIES.map(u => (
              <Link key={u} to={`/find-hostel?university=${u}`} className="university-chip">
                🎓 {u}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section-padding why-section">
        <div className="container">
          <div className="why-inner">
            <div className="why-left">
              <span className="section-label">Why Us</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>
                Why Choose<br /><em>HostelFinder?</em>
              </h2>
              <p className="section-subtitle" style={{ textAlign: 'left', margin: 0 }}>
                We connect students with trusted hostel owners across Pakistan. Our platform ensures safety, transparency and convenience.
              </p>
              <Link to="/find-hostel" className="btn-primary" style={{ marginTop: '32px' }}>
                Find a Hostel Now
              </Link>
            </div>
            <div className="why-right">
              {WHY_US.map((item, i) => (
                <div key={i} className="why-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="why-icon">{item.icon}</div>
                  <div>
                    <h4 className="why-title">{item.title}</h4>
                    <p className="why-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-padding testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Student Reviews</span>
            <h2 className="section-title">What Students Say</h2>
          </div>
          <div className="testimonial-slider">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className={`testimonial-card ${i === testimonialIdx ? 'active' : ''}`}
              >
                <div className="testimonial-quote">"</div>
                <p className="testimonial-text">{t.review}</p>
                <StarRating rating={t.rating} />
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.university}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="testimonial-dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                className={`testimonial-dot ${i === testimonialIdx ? 'active' : ''}`}
                onClick={() => setTestimonialIdx(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section" style={{ backgroundImage: `url(${img1})` }}>
        <div className="cta-overlay" />
        <div className="container cta-content">
          <h2 className="cta-title">Own a Hostel?</h2>
          <p className="cta-subtitle">List your hostel today and reach thousands of students searching for accommodation near their university.</p>
          <div className="cta-actions">
            <Link to="/add-hostel" className="btn-accent">
              🏠 Add Your Hostel — It's Free
            </Link>
            <Link to="/about" className="btn-outline-white">
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
