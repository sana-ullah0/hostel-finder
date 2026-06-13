import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hostelApi } from '../services/api';
import Toast from '../components/Toast';
import './AddHostel.css';

const CITIES = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi', 'Peshawar', 'Faisalabad', 'Quetta', 'Multan'];
const UNIVERSITIES = ['NUST', 'COMSATS', 'FAST', 'Air University', 'UET', 'IIUI', 'University of Punjab', 'KU', 'Other'];
const HOSTEL_TYPES = ['Boys Hostel', 'Girls Hostel', 'Family Hostel', 'Executive Hostel'];
const FACILITIES = [
  { key: 'wifi', icon: '📶', label: 'WiFi' },
  { key: 'mess', icon: '🍽️', label: 'Mess / Cafeteria' },
  { key: 'laundry', icon: '👕', label: 'Laundry' },
  { key: 'parking', icon: '🚗', label: 'Parking' },
  { key: 'cctv', icon: '📷', label: 'CCTV' },
  { key: 'security_guard', icon: '💂', label: 'Security Guard' },
  { key: 'generator', icon: '⚡', label: 'Generator' },
];

const STEPS = ['Owner Info', 'Hostel Info', 'Location', 'Pricing & Facilities', 'Photos'];

export default function AddHostel() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    owner_name: '', phone: '', whatsapp: '',
    hostel_name: '', description: '',
    city: '', area: '', address: '', nearby_university: '',
    rent: '', security_fee: '', hostel_type: 'Boys Hostel',
    wifi: false, laundry: false, mess: false, parking: false,
    cctv: false, security_guard: false, generator: false,
  });

  const update = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 8));
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews].slice(0, 8));
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.owner_name.trim()) errs.owner_name = 'Owner name is required';
      if (!form.phone.trim()) errs.phone = 'Phone number is required';
    }
    if (step === 1) {
      if (!form.hostel_name.trim()) errs.hostel_name = 'Hostel name is required';
    }
    if (step === 2) {
      if (!form.city) errs.city = 'City is required';
      if (!form.address.trim()) errs.address = 'Address is required';
    }
    if (step === 3) {
      if (!form.rent || isNaN(form.rent)) errs.rent = 'Valid monthly rent is required';
      if (!form.hostel_type) errs.hostel_type = 'Hostel type is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach(img => fd.append('images[]', img));

    setLoading(true);
    try {
      await hostelApi.create(fd);
      setToast({ message: 'Hostel submitted! It will appear after admin approval.', type: 'success' });
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please try again.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, required, error, children }) => (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );

  return (
    <div className="add-hostel-page">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="add-hostel-header">
        <div className="container">
          <h1 className="add-hostel-title">List Your Hostel</h1>
          <p className="add-hostel-subtitle">Reach thousands of students searching for accommodation. It's free!</p>
        </div>
      </div>

      <div className="container add-hostel-layout">
        {/* Stepper */}
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={i} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">
                {i < step ? '✓' : i + 1}
              </div>
              <span className="step-label">{s}</span>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="form-card">
          {/* Step 0: Owner Info */}
          {step === 0 && (
            <div className="form-step">
              <h2 className="step-title">👤 Owner Information</h2>
              <p className="step-desc">Tell us about yourself as the hostel owner.</p>
              <div className="form-grid">
                <Field label="Owner Name" required error={errors.owner_name}>
                  <input className="form-control" placeholder="Your full name"
                    value={form.owner_name} onChange={e => update('owner_name', e.target.value)} />
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <input className="form-control" placeholder="0300-1234567"
                    value={form.phone} onChange={e => update('phone', e.target.value)} />
                </Field>
                <Field label="WhatsApp Number" error={errors.whatsapp}>
                  <input className="form-control" placeholder="Same as phone if same"
                    value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* Step 1: Hostel Info */}
          {step === 1 && (
            <div className="form-step">
              <h2 className="step-title">🏠 Hostel Information</h2>
              <p className="step-desc">Basic details about your hostel.</p>
              <Field label="Hostel Name" required error={errors.hostel_name}>
                <input className="form-control" placeholder="e.g. Al-Noor Boys Hostel"
                  value={form.hostel_name} onChange={e => update('hostel_name', e.target.value)} />
              </Field>
              <Field label="Hostel Type" required error={errors.hostel_type}>
                <select className="form-control" value={form.hostel_type}
                  onChange={e => update('hostel_type', e.target.value)}>
                  {HOSTEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Description">
                <textarea className="form-control" rows="5"
                  placeholder="Describe your hostel: facilities, environment, rules, etc."
                  value={form.description} onChange={e => update('description', e.target.value)} />
              </Field>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="form-step">
              <h2 className="step-title">📍 Location Information</h2>
              <p className="step-desc">Help students find your hostel easily.</p>
              <div className="form-grid">
                <Field label="City" required error={errors.city}>
                  <select className="form-control" value={form.city}
                    onChange={e => update('city', e.target.value)}>
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Area">
                  <input className="form-control" placeholder="e.g. G-10, Satellite Town"
                    value={form.area} onChange={e => update('area', e.target.value)} />
                </Field>
              </div>
              <Field label="Full Address" required error={errors.address}>
                <input className="form-control" placeholder="House no., Street, Sector..."
                  value={form.address} onChange={e => update('address', e.target.value)} />
              </Field>
              <Field label="Nearby University">
                <select className="form-control" value={form.nearby_university}
                  onChange={e => update('nearby_university', e.target.value)}>
                  <option value="">Select University (optional)</option>
                  {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </Field>
            </div>
          )}

          {/* Step 3: Pricing & Facilities */}
          {step === 3 && (
            <div className="form-step">
              <h2 className="step-title">💰 Pricing & Facilities</h2>
              <div className="form-grid">
                <Field label="Monthly Rent (PKR)" required error={errors.rent}>
                  <input className="form-control" type="number" placeholder="e.g. 8000"
                    value={form.rent} onChange={e => update('rent', e.target.value)} />
                </Field>
                <Field label="Security Deposit (PKR)">
                  <input className="form-control" type="number" placeholder="e.g. 10000"
                    value={form.security_fee} onChange={e => update('security_fee', e.target.value)} />
                </Field>
              </div>

              <div className="form-group">
                <label className="form-label">Available Facilities</label>
                <div className="facilities-checkboxes">
                  {FACILITIES.map(f => (
                    <label key={f.key} className={`facility-check ${form[f.key] ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={form[f.key]}
                        onChange={e => update(f.key, e.target.checked)}
                      />
                      <span className="facility-check-icon">{f.icon}</span>
                      <span>{f.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {step === 4 && (
            <div className="form-step">
              <h2 className="step-title">📸 Hostel Photos</h2>
              <p className="step-desc">Upload up to 8 photos. The first photo will be the main image.</p>

              <div className="image-upload-area">
                <label htmlFor="image-input" className="upload-trigger">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <strong>Click to upload photos</strong>
                  <span>PNG, JPG up to 5MB each (max 8)</span>
                </label>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((url, i) => (
                    <div key={i} className="preview-item">
                      <img src={url} alt={`Preview ${i + 1}`} />
                      {i === 0 && <span className="primary-badge">Main</span>}
                      <button className="remove-img" onClick={() => removeImage(i)}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="form-nav">
            {step > 0 && (
              <button className="btn-secondary" onClick={prevStep} type="button">
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < STEPS.length - 1 ? (
              <button className="btn-primary" onClick={nextStep} type="button">
                Continue →
              </button>
            ) : (
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                type="button"
              >
                {loading ? 'Submitting...' : '🚀 Submit Hostel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
