//src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaUsers, FaRunning, FaEnvelope, FaCalendarAlt, FaArrowRight, FaCheck, FaClock } from 'react-icons/fa';
import API from '../../api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ donations:0, volunteers:0, activities:0, messages:0, donationAmount:0 });
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/auth/me').then(r => setUser(r.data.user)).catch(() => {});

    Promise.all([
      API.get('/donations'),
      API.get('/volunteers'),
      API.get('/activities'),
      API.get('/contacts'),
    ]).then(([d, v, a, c]) => {
      const donations = d.data.data || [];
      const totalAmount = donations.reduce((s, d) => s + parseFloat(d.amount || 0), 0);
      setStats({
        donations: donations.length,
        volunteers: (v.data.data || []).length,
        activities: (a.data.data || []).length,
        messages: (c.data.data || []).length,
        donationAmount: totalAmount,
      });
      setRecentDonations(donations.slice(0, 5));
      setRecentMessages((c.data.data || []).slice(0, 5));
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Dons', value: stats.donations, sub: `${stats.donationAmount.toLocaleString()} FCFA`, icon: <FaHeart />, color: '#e63946', bg: 'rgba(230,57,70,0.1)', to: '/admin/dons' },
    { label: 'Bénévoles', value: stats.volunteers, sub: 'inscrits', icon: <FaUsers />, color: '#118ab2', bg: 'rgba(17,138,178,0.1)', to: '/admin/benevoles' },
    { label: 'Activités', value: stats.activities, sub: 'en base', icon: <FaRunning />, color: '#57cc04', bg: 'rgba(87,204,4,0.1)', to: '/admin/activites' },
    { label: 'Messages', value: stats.messages, sub: 'reçus', icon: <FaEnvelope />, color: '#9b5de5', bg: 'rgba(155,93,229,0.1)', to: '/admin/messages' },
  ];

  const formatDate = d => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Tableau de Bord</h1>
          <p>Bienvenue{user ? `, ${user.name}` : ''} ! Voici un aperçu de l'activité de Little Dream.</p>
        </div>
        <div className="header-date">
          <FaCalendarAlt />
          {new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dash-cards">
        {cards.map((c, i) => (
          <Link to={c.to} className="dash-card" key={i} style={{ '--card-color': c.color, '--card-bg': c.bg }}>
            <div className="dc-icon" style={{ background: c.bg, color: c.color }}>{c.icon}</div>
            <div className="dc-info">
              <div className="dc-value">{c.value}</div>
              <div className="dc-label">{c.label}</div>
              <div className="dc-sub">{c.sub}</div>
            </div>
            <FaArrowRight className="dc-arrow" />
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="dash-tables">
        {/* Recent Donations */}
        <div className="dash-table-card">
          <div className="dtc-header">
            <h3><FaHeart /> Derniers Dons</h3>
            <Link to="/admin/dons" className="see-all">Voir tout <FaArrowRight /></Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Donateur</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.length === 0 ? (
                <tr><td colSpan={4} style={{textAlign:'center', color:'var(--gray)', padding:'24px'}}>Aucun don pour l'instant</td></tr>
              ) : recentDonations.map(d => (
                <tr key={d.id}>
                  <td>{d.donor_name || 'Anonyme'}</td>
                  <td><strong style={{color:'var(--red)'}}>{parseFloat(d.amount).toLocaleString()} {d.currency}</strong></td>
                  <td>
                    <span className={`status-badge ${d.payment_status === 'confirmed' ? 'success' : d.payment_status === 'pending' ? 'pending' : 'error'}`}>
                      {d.payment_status === 'confirmed' ? <FaCheck /> : <FaClock />}
                      {d.payment_status === 'confirmed' ? 'Confirmé' : d.payment_status === 'pending' ? 'En attente' : d.payment_status}
                    </span>
                  </td>
                  <td style={{color:'var(--gray)', fontSize:'13px'}}>{formatDate(d.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Messages */}
        <div className="dash-table-card">
          <div className="dtc-header">
            <h3><FaEnvelope /> Derniers Messages</h3>
            <Link to="/admin/messages" className="see-all">Voir tout <FaArrowRight /></Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Sujet</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.length === 0 ? (
                <tr><td colSpan={4} style={{textAlign:'center', color:'var(--gray)', padding:'24px'}}>Aucun message pour l'instant</td></tr>
              ) : recentMessages.map(m => (
                <tr key={m.id}>
                  <td><strong>{m.name}</strong></td>
                  <td style={{color:'var(--gray)', fontSize:'13px'}}>{m.subject || '(sans sujet)'}</td>
                  <td>
                    <span className={`status-badge ${m.is_read ? 'success' : 'pending'}`}>
                      {m.is_read ? 'Lu' : 'Non lu'}
                    </span>
                  </td>
                  <td style={{color:'var(--gray)', fontSize:'13px'}}>{formatDate(m.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
