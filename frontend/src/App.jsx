import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchHostel from './pages/SearchHostel';
import HostelDetails from './pages/HostelDetails';
import AddHostel from './pages/AddHostel';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes (no navbar/footer) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Public Routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find-hostel" element={<SearchHostel />} />
                <Route path="/hostel/:id" element={<HostelDetails />} />
                <Route path="/add-hostel" element={<AddHostel />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
