import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaHandHoldingHeart, FaUsers, FaHandshake, FaCheck } from 'react-icons/fa';
import API from '../api';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './HowToHelp.css';

function DonateForm() {
  const [form, setForm] = useState({ donor_name:'', donor_email:'', amount:'', currency:'XAF', message:'' });
  const [sending, setSending] = useState(false);
  const amounts = [5000, 10000, 25000, 50000];

  const handle = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return toast.error('Veuillez entrer un montant valide.');
    setSending(true);
    try {
      await API.post('/donations', { ...form, amount: +form.amount });
      toast.success('🙏 Merci pour votre générosité ! Votre don a bien été enregistré.');
      setForm({ donor_name:'', donor_email:'', amount:'', currency:'XAF', message:'' });
    } catch { toast.error('Erreur lors de l\'envoi. Réessayez.'); }
    finally { setSending(false); }
  };

  return (
    <div className="help-form-card" id="don">
      <div className="hfc-icon" style={{background:'linear-gradient(135deg,var(--red),var(--orange))'}}>
        <FaHandHoldingHeart />
      </div>
      <h3>Faire un Don</h3>
      <p>Votre don, même modeste, contribue directement à financer nos programmes pour les enfants.</p>

      <div className="quick-amounts">
        {amounts.map(a => (
          <button key={a} type="button"
            className={`amount-btn${form.amount === String(a) ? ' selected' : ''}`}
            onClick={() => setForm({...form, amount: String(a)})}>
            {a.toLocaleString()} FCFA
          </button>
        ))}
      </div>

      <form onSubmit={submit}>
        <div className="form-group">
          <label>Votre nom (optionnel)</label>
          <input name="donor_name" value={form.donor_name} onChange={handle} placeholder="Nom du donateur" />
        </div>
        <div className="form-group">
          <label>Email (optionnel)</label>
          <input name="donor_email" type="email" value={form.donor_email} onChange={handle} placeholder="email@exemple.com" />
        </div>
        <div className="form-group">
          <label>Montant (FCFA) *</label>
          <input name="amount" type="number" value={form.amount} onChange={handle} placeholder="Entrez un montant" required min="100" />
        </div>
        <div className="form-group">
          <label>Message (optionnel)</label>
          <textarea name="message" value={form.message} onChange={handle} rows={3} placeholder="Un mot pour accompagner votre don..." />
        </div>
        <button type="submit" className="btn btn-primary" style={{width:'100%'}} disabled={sending}>
          {sending ? 'Traitement...' : <><FaHandHoldingHeart /> Confirmer le don</>}
        </button>
      </form>
      <p className="secure-note">🔒 Vos données sont sécurisées et confidentielles</p>
    </div>
  );
}

function VolunteerForm() {
  const [form, setForm] = useState({ full_name:'', email:'', phone:'', city:'', motivation:'', skills:'', availability:'' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handle = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault();
    setSending(true);
    try {
      await API.post('/volunteers', form);
      toast.success('✅ Inscription bénévole envoyée ! Nous vous contacterons bientôt.');
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription.');
    } finally { setSending(false); }
  };

  if (done) return (
    <div className="help-form-card done-state" id="benevole">
      <div className="done-icon">✅</div>
      <h3>Merci pour votre engagement !</h3>
      <p>Votre inscription bénévole a bien été reçue. L'équipe Little Dream vous contactera bientôt.</p>
    </div>
  );

  return (
    <div className="help-form-card" id="benevole">
      <div className="hfc-icon" style={{background:'linear-gradient(135deg,var(--blue),#0077b6)'}}>
        <FaUsers />
      </div>
      <h3>Devenir Bénévole</h3>
      <p>Rejoignez notre équipe et participez activement à nos actions pour la jeunesse camerounaise.</p>
      <form onSubmit={submit}>
        <div className="grid-2">
          <div className="form-group">
            <label>Nom complet *</label>
            <input name="full_name" value={form.full_name} onChange={handle} placeholder="Votre nom complet" required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="email@exemple.com" required />
          </div>
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Téléphone</label>
            <input name="phone" value={form.phone} onChange={handle} placeholder="+237 6XX XXX XXX" />
          </div>
          <div className="form-group">
            <label>Ville</label>
            <input name="city" value={form.city} onChange={handle} placeholder="Douala, Yaoundé..." />
          </div>
        </div>
        <div className="form-group">
          <label>Compétences / Domaines d'intérêt</label>
          <input name="skills" value={form.skills} onChange={handle} placeholder="Education, Sport, Culture, Informatique..." />
        </div>
        <div className="form-group">
          <label>Disponibilité</label>
          <select name="availability" value={form.availability} onChange={handle}>
            <option value="">-- Choisir --</option>
            <option value="weekends">Weekends</option>
            <option value="weekday_evenings">Soirs de semaine</option>
            <option value="full_time">Temps plein</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
        <div className="form-group">
          <label>Motivation *</label>
          <textarea name="motivation" value={form.motivation} onChange={handle} rows={4} placeholder="Pourquoi souhaitez-vous rejoindre Little Dream ?" required />
        </div>
        <button type="submit" className="btn btn-blue" style={{width:'100%'}} disabled={sending}>
          {sending ? 'Envoi...' : <><FaUsers /> S'inscrire comme bénévole</>}
        </button>
      </form>
    </div>
  );
}

export default function HowToHelp() {
  useDocumentMeta({
    title: 'Comment aider',
    description: "Devenez bénévole, faites un don ou devenez partenaire de Little Dream. Plusieurs façons concrètes de soutenir la jeunesse camerounaise.",
    path: '/comment-aider',
  });
  return (
    <main>
      <div className="page-header">
        <h1>Comment Aider ?</h1>
        <p>Il existe plusieurs façons de soutenir Little Dream et d'agir pour nos enfants</p>
      </div>

      <section className="help-intro">
        <div className="container">
          <div className="help-ways">
            {[
              { icon:<FaHandHoldingHeart/>, color:'var(--red)', title:'Faire un Don', desc:'Financer directement nos programmes éducatifs, culturels et sportifs.', href:'#don' },
              { icon:<FaUsers/>, color:'var(--blue)', title:'Être Bénévole', desc:'Rejoindre notre équipe et partager vos talents avec nos bénéficiaires.', href:'#benevole' },
              { icon:<FaHandshake/>, color:'var(--green)', title:'Partenariat', desc:'Devenir partenaire institutionnel ou entreprise pour soutenir notre mission.', href:'#partenaire' },
            ].map((w,i) => (
              <a href={w.href} className="way-card" key={i}>
                <div className="way-icon" style={{color:w.color}}>{w.icon}</div>
                <h4>{w.title}</h4>
                <p>{w.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="help-forms">
        <div className="container">
          <div className="forms-grid">
            <DonateForm />
            <VolunteerForm />
          </div>
        </div>
      </section>

      <section className="partner-section" id="partenaire">
        <div className="container">
          <div className="partner-box">
            <FaHandshake className="partner-icon" />
            <div>
              <h3>Devenir Partenaire</h3>
              <p>Votre entreprise ou organisation souhaite soutenir Little Dream ? Nous proposons différentes modalités de partenariat : mécénat, sponsoring d'événements, dons en nature.</p>
              <p style={{marginTop:10}}>Contactez-nous pour discuter d'un partenariat sur-mesure.</p>
            </div>
            <a href="/contact" className="btn btn-outline">Nous contacter</a>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="container">
          <div className="section-title">
            <h2>L'impact de votre aide</h2>
            <p>Ce que votre soutien rend possible concrètement</p>
            <div className="accent" />
          </div>
          <div className="impact-grid">
            {[
              { amount:'5 000 FCFA', impact:'Fournitures scolaires pour 1 enfant', icon:'📚' },
              { amount:'10 000 FCFA', impact:'1 mois de cours de soutien pour 2 enfants', icon:'✏️' },
              { amount:'25 000 FCFA', impact:'Organisation d\'une journée culturelle', icon:'🎭' },
              { amount:'50 000 FCFA', impact:'Équipement sportif pour une équipe', icon:'⚽' },
            ].map((i,idx) => (
              <div className="impact-card" key={idx}>
                <div className="impact-icon">{i.icon}</div>
                <div className="impact-amount">{i.amount}</div>
                <div className="impact-desc">{i.impact}</div>
                <FaCheck className="impact-check" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
