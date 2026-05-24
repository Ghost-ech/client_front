import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';
import API from '../api';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Contact.css';

export default function Contact() {
  useDocumentMeta({
    title: 'Contact',
    description: "Contactez l'association Little Dream au Cameroun : adresse, téléphone, email et formulaire de contact. Nous répondons à toutes vos questions.",
    path: '/contact',
  });
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [sending, setSending] = useState(false);

  const handle = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault();
    setSending(true);
    try {
      await API.post('/contacts', form);
      toast.success('✅ Message envoyé ! Nous vous répondrons dans les plus brefs délais.');
      setForm({ name:'', email:'', subject:'', message:'' });
    } catch { toast.error('Erreur lors de l\'envoi. Réessayez.'); }
    finally { setSending(false); }
  };

  return (
    <main>
      <div className="page-header">
        <h1>Nous Contacter</h1>
        <p>Une question, une suggestion ? Nous sommes à votre écoute</p>
      </div>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Info */}
            <div className="contact-info">
              <h3>Nos Coordonnées</h3>
              <p>N'hésitez pas à nous contacter. Notre équipe vous répondra dans les 24 heures ouvrables.</p>

              <div className="contact-items">
                <div className="contact-item">
                  <div className="ci-icon"><FaMapMarkerAlt /></div>
                  <div><strong>Adresse</strong><span>Douala, Cameroun</span></div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon"><FaPhone /></div>
                  <div><strong>Téléphone</strong><span>+237 640 420 079 <br /> +237 673 356 881</span></div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon"><FaEnvelope /></div>
                  <div><strong>Email</strong><span>littledream.association@gmail.com</span></div>
                </div>
                <div className="contact-item">
                  <div className="ci-icon"><FaClock /></div>
                  <div><strong>Disponibilité</strong><span>Lun–Sam : 8h00 – 18h00</span></div>
                </div>
              </div>

              <div className="contact-social">
                <h4>Suivez-nous</h4>
                <div className="social-links">
                  <a href="https://www.linkedin.com/company/littledream-cm/" target="_blank" rel="noreferrer" className="sl-fb"><FaLinkedinIn /> LinkedIn</a>
                  <a href="https://www.instagram.com/littledream_cameroun?igsh=MXhmbWR0Zmh1dmpxeg==" target="_blank" rel="noreferrer" className="sl-ig"><FaInstagram /> Instagram</a>
                  <a href="https://wa.me/237640420079" target="_blank" rel="noreferrer" className="sl-wa"><FaWhatsapp /> WhatsApp</a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrap">
              <h3>Envoyez-nous un Message</h3>
              <form onSubmit={submit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Nom complet *</label>
                    <input name="name" value={form.name} onChange={handle} placeholder="Votre nom" required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handle} placeholder="email@exemple.com" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Sujet</label>
                  <select name="subject" value={form.subject} onChange={handle}>
                    <option value="">-- Sélectionner un sujet --</option>
                    <option value="don">Information sur les dons</option>
                    <option value="benevole">Bénévolat</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="activite">Nos activités</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea name="message" value={form.message} onChange={handle} rows={6} placeholder="Votre message..." required />
                </div>
                <button type="submit" className="btn btn-primary" style={{width:'100%'}} disabled={sending}>
                  {sending ? 'Envoi en cours...' : '📨 Envoyer le message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
