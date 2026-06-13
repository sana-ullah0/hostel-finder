import React, { useState } from 'react';
import Toast from '../components/Toast';
import './StaticPages.css';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setToast({ message: 'Please fill all required fields.', type: 'error' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setToast({ message: 'Message sent! We will get back to you soon.', type: 'success' });
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="static-page">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="static-hero">
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1 className="static-title">Contact Us</h1>
          <p className="static-subtitle">Have questions? We're here to help you.</p>
        </div>
      </div>

      <div className="container contact-layout">
        <div className="contact-info">
          <h2>We'd love to hear from you</h2>
          <p>Whether you're a student looking for help, a hostel owner with questions, or just want to say hello — reach out!</p>

          <div className="contact-items">
            {[
              { icon: '📧', title: 'Email', value: 'info@hostelfinder.pk' },
              { icon: '📱', title: 'WhatsApp', value: '+92 300 1234567' },
              { icon: '🕐', title: 'Response Time', value: 'Within 24 hours' },
              { icon: '📍', title: 'Based in', value: 'Islamabad, Pakistan' },
            ].map(item => (
              <div key={item.title} className="contact-item">
                <div className="contact-item-icon">{item.icon}</div>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-form-card">
          <h2>Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Name <span className="required">*</span></label>
                <input className="form-control" placeholder="Your name"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input className="form-control" type="email" placeholder="your@email.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-control" placeholder="How can we help?"
                value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Message <span className="required">*</span></label>
              <textarea className="form-control" rows="5" placeholder="Your message..."
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : '📨 Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
