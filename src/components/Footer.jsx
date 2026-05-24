// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook, FaInstagram, FaWhatsapp,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaHeart,
  FaLinkedin,
} from 'react-icons/fa';
import logoImg from '../assets/logo.jpeg';
import './Footer.css';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">

      {/* Barre couleurs en haut du footer */}
      <div className="footer-color-bar" />

      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">

            {/* ── Brand ── */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-wrap">
                  <img src={logoImg} alt="Little Dream logo" className="footer-logo-img" />
                </div>
                <div className="footer-logo-text">
                  <span className="fl-little">LITTLE</span>
                  <span className="fl-dream">DREAM</span>
                </div>
              </div>
              <p>
                Association caritative dédiée à l'épanouissement des jeunes
                et à la promotion de la culture camerounaise.
              </p>
              <div className="footer-social">
                <a href="https://www.linkedin.com/company/littledream-cm/"          target="_blank" rel="noreferrer" className="social-fb"><FaLinkedin /></a>
                <a href="https://www.instagram.com/littledream_cameroun?igsh=MXhmbWR0Zmh1dmpxeg=="         target="_blank" rel="noreferrer" className="social-ig"><FaInstagram /></a>
                <a href="https://wa.me/237640420079"    target="_blank" rel="noreferrer" className="social-wa"><FaWhatsapp /></a>
              </div>
            </div>

            {/* ── Navigation ── */}
            <div className="footer-col footer-col--green">
              <h4>Navigation</h4>
              <ul>
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/mission">Notre Mission</Link></li>
                <li><Link to="/activites">Activités</Link></li>
                <li><Link to="/evenements">Événements</Link></li>
                <li><Link to="/galerie">Galerie</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            {/* ── Nous soutenir ── */}
            <div className="footer-col footer-col--orange">
              <h4>Nous soutenir</h4>
              <ul>
                <li><Link to="/don">Faire un don</Link></li>
                <li><Link to="/comment-aider#benevole">Devenir bénévole</Link></li>
                <li><Link to="/comment-aider#partenaire">Devenir partenaire</Link></li>
                <li><Link to="/evenements">Participer aux événements</Link></li>
              </ul>
            </div>

            {/* ── Contact ── */}
            <div className="footer-col footer-col--blue">
              <h4>Contact</h4>
              <ul className="contact-list">
                <li>
                  <span className="contact-icon contact-icon--green"><FaMapMarkerAlt /></span>
                  <span>Douala, Cameroun</span>
                </li>
                <li>
                  <span className="contact-icon contact-icon--blue"><FaPhone /></span>
                  <span>+237 640 420 079<br />+237 673 356 881</span>
                </li>
                <li>
                  <span className="contact-icon contact-icon--red"><FaEnvelope /></span>
                  <span>littledream.association@gmail.com</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <div className="container">
          <p>
            © {year} Little Dream. Fait avec&nbsp;
            <FaHeart className="footer-heart" />
            &nbsp;au Cameroun.
          </p>
          <Link to="/admin/login" className="admin-link">Espace Admin</Link>
        </div>
      </div>

    </footer>
  );
}