// src/components/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaRunning, FaCalendarAlt, FaHeart,
  FaUsers, FaEnvelope, FaBars, FaTimes, FaSignOutAlt,
  FaExternalLinkAlt, FaUserFriends, FaImages,
} from 'react-icons/fa';
import logoImg from '../../assets/logo.jpeg';
import './AdminLayout.css';

const navItems = [
  { to: '/admin',            label: 'Tableau de bord', icon: <FaTachometerAlt />, end: true },
  { to: '/admin/activites',  label: 'Activités',        icon: <FaRunning /> },
  { to: '/admin/evenements', label: 'Événements',       icon: <FaCalendarAlt /> },
  { to: '/admin/dons',       label: 'Dons',             icon: <FaHeart /> },
  { to: '/admin/benevoles',  label: 'Bénévoles',        icon: <FaUsers /> },
  { to: '/admin/messages',   label: 'Messages',         icon: <FaEnvelope /> },
  { to: '/admin/galerie',    label: 'Galerie',          icon: <FaImages /> },
  { to: '/admin/equipe',     label: 'Équipe',           icon: <FaUserFriends /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('ld_token');
    navigate('/admin/login');
  };

  return (
    <div className={`admin-layout${sidebarOpen ? '' : ' collapsed'}`}>

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">

        {/* Barre 5 couleurs tout en haut de la sidebar */}
        <div className="sidebar-color-bar" />

        <div className="sidebar-header">
          <div className="sidebar-logo">
            {/* Vrai logo dans un cercle blanc */}
            <div className="sidebar-logo-wrap">
              <img src={logoImg} alt="Little Dream logo" className="sidebar-logo-img" />
            </div>
            {sidebarOpen && (
              <div className="sidebar-logo-text">
                <span className="sl-little">LITTLE</span>
                <span className="sl-dream">DREAM</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarOpen && <span className="nav-section-label">MENU</span>}
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className="sl-icon">{item.icon}</span>
              {sidebarOpen && <span className="sl-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="sidebar-link"
            title={!sidebarOpen ? 'Voir le site' : ''}
          >
            <span className="sl-icon"><FaExternalLinkAlt /></span>
            {sidebarOpen && <span className="sl-label">Voir le site</span>}
          </a>
          <button
            className="sidebar-link logout-btn"
            onClick={logout}
            title={!sidebarOpen ? 'Déconnexion' : ''}
          >
            <span className="sl-icon"><FaSignOutAlt /></span>
            {sidebarOpen && <span className="sl-label">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        <Outlet />
      </main>

    </div>
  );
}