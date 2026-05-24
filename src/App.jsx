//client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Mission from './pages/Mission';
import Activities from './pages/Activities';
import Events from './pages/Events';
import HowToHelp from './pages/HowToHelp';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Donate from './pages/Donate';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminActivities from './pages/admin/AdminActivities';
import AdminEvents from './pages/admin/AdminEvents';
import AdminDonations from './pages/admin/AdminDonations';
import AdminVolunteers from './pages/admin/AdminVolunteers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminLayout from './components/admin/AdminLayout';
import AdminGallery from './pages/admin/AdminGallery';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminTeam from './pages/admin/AdminTeam';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3500} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/mission" element={<PublicLayout><Mission /></PublicLayout>} />
        <Route path="/activites" element={<PublicLayout><Activities /></PublicLayout>} />
        <Route path="/evenements" element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/comment-aider" element={<PublicLayout><HowToHelp /></PublicLayout>} />
        <Route path="/galerie" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/don" element={<PublicLayout><Donate /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="activites" element={<AdminActivities />} />
          <Route path="evenements" element={<AdminEvents />} />
          <Route path="dons" element={<AdminDonations />} />
          <Route path="benevoles" element={<AdminVolunteers />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="galerie" element={<AdminGallery />} />
          <Route path="equipe" element={<AdminTeam />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
