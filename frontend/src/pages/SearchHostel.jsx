import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { hostelApi } from '../services/api';
import HostelCard from '../components/HostelCard';
import './SearchHostel.css';

const CITIES = ['', 'Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Faisalabad'];
const UNIVERSITIES = ['', 'NUST', 'COMSATS', 'FAST', 'Air University', 'UET', 'IIUI'];
const HOSTEL_TYPES = ['', 'Boys Hostel', 'Girls Hostel', 'Family Hostel', 'Executive Hostel'];
const RATINGS = ['', '4', '3', '2'];

export default function SearchHostel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    area: searchParams.get('area') || '',
    university: searchParams.get('university') || '',
    hostel_type: searchParams.get('hostel_type') || '',
    min_rent: searchParams.get('min_rent') || '',
    max_rent: searchParams.get('max_rent') || '',
    rating: searchParams.get('rating') || '',
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchHostels = useCallback(async (f) => {
    setLoading(true);
    const clean = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ''));
    try {
      const res = await hostelApi.getAll(clean);
      setHostels(res.data.data || []);
    } catch {
      setHostels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostels(filters);
  }, []);

  const handleFilter = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  const applyFilters = () => {
    fetchHostels(filters);
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    setSearchParams(params);
    setSidebarOpen(false);
  };

  const clearFilters = () => {
    const empty = { city:'', area:'', university:'', hostel_type:'', min_rent:'', max_rent:'', rating:'' };
    setFilters(empty);
    setSearchParams({});
    fetchHostels(empty);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="search-page">
      {/* Page Header */}
      <div className="search-header">
        <div className="container">
          <h1 className="search-page-title">Find Your Hostel</h1>
          <p className="search-page-subtitle">
            {loading ? 'Searching...' : `${hostels.length} hostel${hostels.length !== 1 ? 's' : ''} found`}
            {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied`}
          </p>
        </div>
      </div>

      <div className="container search-layout">
        {/* Sidebar */}
        <aside className={`search-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>Filters</h3>
            {activeFilterCount > 0 && (
              <button className="clear-filters" onClick={clearFilters}>Clear All</button>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label">City</label>
            <select className="form-control" value={filters.city} onChange={e => handleFilter('city', e.target.value)}>
              <option value="">All Cities</option>
              {CITIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Area</label>
            <input
              className="form-control"
              placeholder="e.g. G-10, Gulberg..."
              value={filters.area}
              onChange={e => handleFilter('area', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Nearby University</label>
            <select className="form-control" value={filters.university} onChange={e => handleFilter('university', e.target.value)}>
              <option value="">Any University</option>
              {UNIVERSITIES.slice(1).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Hostel Type</label>
            <select className="form-control" value={filters.hostel_type} onChange={e => handleFilter('hostel_type', e.target.value)}>
              <option value="">All Types</option>
              {HOSTEL_TYPES.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Price Range (PKR/month)</label>
            <div className="price-range">
              <input
                className="form-control"
                type="number"
                placeholder="Min"
                value={filters.min_rent}
                onChange={e => handleFilter('min_rent', e.target.value)}
              />
              <span>–</span>
              <input
                className="form-control"
                type="number"
                placeholder="Max"
                value={filters.max_rent}
                onChange={e => handleFilter('max_rent', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Minimum Rating</label>
            <select className="form-control" value={filters.rating} onChange={e => handleFilter('rating', e.target.value)}>
              <option value="">Any Rating</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
              <option value="2">2★ & above</option>
            </select>
          </div>

          <button className="btn-primary" style={{ width: '100%' }} onClick={applyFilters}>
            Apply Filters
          </button>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Results */}
        <div className="search-results">
          {/* Mobile filter toggle */}
          <button className="filter-toggle-btn" onClick={() => setSidebarOpen(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/>
              <line x1="12" y1="18" x2="20" y2="18"/>
            </svg>
            Filters {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>

          {loading ? (
            <div className="loading-center" style={{ padding: '100px 0' }}>
              <div className="loading-spinner" />
            </div>
          ) : hostels.length > 0 ? (
            <div className="hostel-grid">
              {hostels.map((h, i) => (
                <HostelCard key={h.id} hostel={h} style={{ animationDelay: `${i * 0.05}s` }} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
              <h3>No Hostels Found</h3>
              <p>Try adjusting your filters or search in a different city.</p>
              <button className="btn-secondary" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
