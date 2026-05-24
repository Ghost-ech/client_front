// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import API from '../../api';
import logoImg from '../../assets/logo.jpeg';
import './AdminLogin.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('ld_token', res.data.token);
      toast.success('Bienvenue ! Connexion réussie.');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ── Panneau gauche ── */}
      <div className="login-left">
        {/* Barre 5 couleurs en haut du panneau */}
        <div className="login-color-bar" />

        <div className="login-brand">
          {/* Vrai logo dans un cercle blanc */}
          <div className="login-logo-wrap">
            <img src={logoImg} alt="Little Dream logo" className="login-logo-img" />
          </div>
          <h1>LITTLE DREAM</h1>
          <p className="login-tagline">SPREAD LOVE, SHARE HOPE</p>
          <p className="login-desc">
            Espace d'administration de l'association caritative camerounaise
          </p>

          {/* Pastilles couleurs du logo */}
          <div className="login-color-dots">
            <span className="dot dot-red"    />
            <span className="dot dot-green"  />
            <span className="dot dot-orange" />
            <span className="dot dot-blue"   />
            <span className="dot dot-purple" />
          </div>
        </div>

        <div className="login-deco">
          <div className="deco-circle c1" />
          <div className="deco-circle c2" />
          <div className="deco-circle c3" />
        </div>
      </div>

      {/* ── Panneau droit ── */}
      <div className="login-right">
        <div className="login-box">
          <div className="login-icon">
            <FaLock />
          </div>
          <h2>Connexion Admin</h2>
          <p>Entrez vos identifiants pour accéder au tableau de bord</p>

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Adresse Email</label>
              <div className="input-icon-wrap">
                <FaEnvelope className="input-icon" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handle}
                  placeholder="admin@littledream.cm"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-icon-wrap">
                <FaLock className="input-icon" />
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={handle}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}