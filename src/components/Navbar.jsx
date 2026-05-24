// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHandHoldingHeart } from 'react-icons/fa';
import logoImg from '../assets/logo.jpeg';
import './Navbar.css';

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/mission', label: 'Notre Mission' },
  { to: '/activites', label: 'Activités' },
  { to: '/evenements', label: 'Événements' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <>
      {/* Barre de couleurs 5 tons tirée du logo */}
      <div className="nav-color-bar" />

      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-container">

          {/* Logo réel */}
          <Link to="/" className="nav-logo">
            <div className="logo-img-wrap">
              <img src={logoImg} alt="Little Dream logo" className="logo-img" />
            </div>
            <div className="logo-text">
              <span className="logo-little">LITTLE</span>
              <span className="logo-dream">DREAM</span>
            </div>
          </Link>

          <ul className={`nav-links${open ? ' open' : ''}`}>
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={location.pathname === l.to ? 'active' : ''}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/don" className="nav-donate-btn">
                <FaHandHoldingHeart /> Faire un don
              </Link>
            </li>
          </ul>

          <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>
    </>
  );
}