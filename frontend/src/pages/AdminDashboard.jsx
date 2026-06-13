import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import Toast from '../components/Toast';
import './Admin.css';

const STATUS_COLORS = {
  approved: { bg: '#D1FAE5', color: '#065F46' },
  pending: { bg: '#FEF3C7', color: '#92400E' },
  rejected: { bg: '#FEE2E2', color: '#991B1B' },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [hostels, setHostels] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQ, setSearchQ] = useState('');

  const fetchData = async () => {
    try {
      const [hostelsRes, statsRes] = await Promise.all([
        adminApi.getAll(),
        adminApi.getStats(),
      ]);
      setHostels(hostelsRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminApi.updateStatus(id, status);
      setToast({ message: `Hostel ${status} successfully!`, type: 'success' });
      fetchData();
    } catch {
      setToast({ message: 'Action failed. Please try again.', type: 'error' });
    }
  };

  const deleteHostel = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminApi.delete(id);
      setToast({ message: 'Hostel deleted.', type: 'success' });
      fetchData();
    } catch {
      setToast({ message: 'Delete failed.', type: 'error' });
    }
  };

  const filtered = hostels.filter(h => {
    const matchStatus = filter === 'all' || h.status === filter;
    const matchSearch = !searchQ || h.hostel_name.toLowerCase().includes(searchQ.toLowerCase())
      || h.city.toLowerCase().includes(searchQ.toLowerCase())
      || h.owner_name.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatRent = (n) =>
    new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="admin-dashboard">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Admin Navbar */}
      <header className="admin-header">
        <div className="admin-logo">🏠 HostelFinder Admin</div>
        <div className="admin-header-right">
          <span className="admin-user">👤 Admin</span>
          <button className="btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}
            onClick={() => navigate('/')}>
            View Site
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            {[
              { icon: '📊', label: 'Dashboard', key: 'all' },
              { icon: '⏳', label: 'Pending', key: 'pending' },
              { icon: '✅', label: 'Approved', key: 'approved' },
              { icon: '❌', label: 'Rejected', key: 'rejected' },
            ].map(item => (
              <button
                key={item.key}
                className={`admin-nav-item ${filter === item.key ? 'active' : ''}`}
                onClick={() => setFilter(item.key)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.key !== 'all' && (
                  <span className="nav-count">
                    {hostels.filter(h => h.status === item.key).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="admin-main">
          {/* Stats */}
          <div className="stats-grid">
            {[
              { label: 'Total Hostels', value: stats.total || 0, icon: '🏠', color: '#EFF6FF' },
              { label: 'Pending', value: stats.pending || 0, icon: '⏳', color: '#FEF3C7' },
              { label: 'Approved', value: stats.approved || 0, icon: '✅', color: '#D1FAE5' },
              { label: 'Cities', value: stats.cities || 0, icon: '📍', color: '#F3E8FF' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ background: s.color }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="admin-toolbar">
            <div className="admin-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                placeholder="Search hostels by name, city, owner..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
            </div>
            <span className="result-count">{filtered.length} hostel{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Table */}
          {loading ? (
            <div className="loading-center"><div className="loading-spinner" /></div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Hostel</th>
                    <th>Owner</th>
                    <th>City</th>
                    <th>Type</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No hostels found.
                      </td>
                    </tr>
                  ) : filtered.map(h => (
                    <tr key={h.id}>
                      <td>
                        <div className="table-hostel-name">{h.hostel_name}</div>
                        <div className="table-hostel-date">
                          {new Date(h.created_at).toLocaleDateString('en-PK')}
                        </div>
                      </td>
                      <td>
                        <div className="table-owner">{h.owner_name}</div>
                        <div className="table-phone">{h.phone}</div>
                      </td>
                      <td>{h.city}</td>
                      <td><span className="type-chip">{h.hostel_type}</span></td>
                      <td>{formatRent(h.rent)}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={STATUS_COLORS[h.status]}
                        >
                          {h.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          {h.status !== 'approved' && (
                            <button
                              className="action-btn approve"
                              onClick={() => updateStatus(h.id, 'approved')}
                              title="Approve"
                            >✓</button>
                          )}
                          {h.status !== 'rejected' && (
                            <button
                              className="action-btn reject"
                              onClick={() => updateStatus(h.id, 'rejected')}
                              title="Reject"
                            >✕</button>
                          )}
                          <button
                            className="action-btn delete"
                            onClick={() => deleteHostel(h.id, h.hostel_name)}
                            title="Delete"
                          >🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
