import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaMoneyBillWave, FaMobileAlt, FaHandHoldingHeart, FaCheckCircle } from 'react-icons/fa';
import API from '../api';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Donate.css';

const PAYMENT_METHODS = [
  { id: 'orange', name: 'Orange Money', icon: '📱', color: '#ff6600', description: 'Paiement sécurisé via Orange Money' },
  { id: 'mtn', name: 'MTN Mobile Money', icon: '📱', color: '#ffcc00', description: 'Paiement sécurisé via MTN Mobile Money' },
  { id: 'cash', name: 'Espèces', icon: '💵', color: '#57cc04', description: 'Faire un don en espèces lors de nos événements' }
];

const AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000];

export default function Donate() {
  useDocumentMeta({
    title: 'Faire un don',
    description: "Faites un don à Little Dream via Orange Money, MTN Mobile Money ou espèces. Chaque don soutient les enfants et jeunes vulnérables du Cameroun.",
    path: '/don',
  });
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    custom_amount: '',
    payment_method: '',
    phone_number: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleAmountSelect = (amount) => {
    setForm({ ...form, amount: amount, custom_amount: '' });
  };

  const handleCustomAmount = (e) => {
    setForm({ ...form, custom_amount: e.target.value, amount: '' });
  };

  const submitDonation = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.donor_name.trim()) {
      toast.error('Veuillez entrer votre nom');
      return;
    }
    if (!form.donor_email.trim()) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    
    const finalAmount = form.amount || form.custom_amount;
    if (!finalAmount || finalAmount < 500) {
      toast.error('Le montant minimum est de 500 FCFA');
      return;
    }
    
    if (!form.payment_method) {
      toast.error('Veuillez choisir un moyen de paiement');
      return;
    }
    
    if ((form.payment_method === 'orange' || form.payment_method === 'mtn') && !form.phone_number) {
      toast.error('Veuillez entrer votre numéro de téléphone');
      return;
    }
    
    setLoading(true);
    
    try {
      const donationData = {
        donor_name: form.donor_name,
        donor_email: form.donor_email,
        amount: finalAmount,
        currency: 'XAF',
        message: form.message,
        payment_method: form.payment_method,
        phone_number: form.phone_number,
        payment_status: form.payment_method === 'cash' ? 'confirmed' : 'pending'
      };
      
      const response = await API.post('/donations', donationData);
      
      if (response.data.success) {
        setSuccess({
          amount: finalAmount,
          method: form.payment_method,
          name: form.donor_name
        });
        setStep(3);
        
        // Message spécifique selon le moyen de paiement
        if (form.payment_method === 'orange') {
          toast.info('Vous allez recevoir une demande de paiement sur votre téléphone Orange Money');
        } else if (form.payment_method === 'mtn') {
          toast.info('Vous allez recevoir une demande de paiement sur votre téléphone MTN Mobile Money');
        } else {
          toast.success('Merci pour votre don ! Un reçu vous sera envoyé par email.');
        }
        
        // Réinitialiser le formulaire
        setForm({
          donor_name: '', donor_email: '', amount: '', custom_amount: '',
          payment_method: '', phone_number: '', message: ''
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors du traitement du don');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3 && success) {
    return (
      <main>
        <div className="page-header">
          <h1>Merci pour votre générosité !</h1>
          <p>Votre don fait la différence</p>
        </div>
        <section className="donate-success">
          <div className="container">
            <div className="success-card">
              <FaCheckCircle className="success-icon" />
              <h2>Don confirmé</h2>
              <p>Merci <strong>{success.name}</strong> pour votre don de <strong>{success.amount.toLocaleString()} FCFA</strong></p>
              <p>Un reçu vous sera envoyé par email dans les prochaines minutes.</p>
              <button className="btn btn-primary" onClick={() => { setStep(1); setSuccess(null); }}>
                Faire un autre don
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <div className="page-header">
        <h1>Faire un don</h1>
        <p>Votre soutien nous aide à poursuivre notre mission auprès des jeunes camerounais</p>
      </div>

      <section className="donate-section">
        <div className="container">
          <div className="donate-grid">
            <div className="donate-form-container">
              <div className="donate-progress">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                  <span>1</span>
                  <label>Montant</label>
                </div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                  <span>2</span>
                  <label>Informations</label>
                </div>
                <div className={`progress-step ${step === 3 ? 'active' : ''}`}>
                  <span>3</span>
                  <label>Confirmation</label>
                </div>
              </div>

              <form onSubmit={submitDonation}>
                {step === 1 && (
                  <div className="step-content">
                    <h3>Choisissez votre montant</h3>
                    <div className="amount-grid">
                      {AMOUNTS.map(amt => (
                        <button
                          key={amt}
                          type="button"
                          className={`amount-btn ${form.amount === amt ? 'selected' : ''}`}
                          onClick={() => handleAmountSelect(amt)}
                        >
                          {amt.toLocaleString()} FCFA
                        </button>
                      ))}
                      <div className="custom-amount">
                        <input
                          type="number"
                          placeholder="Autre montant"
                          value={form.custom_amount}
                          onChange={handleCustomAmount}
                          min="500"
                          step="500"
                        />
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                      Continuer
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-content">
                    <h3>Vos informations</h3>
                    
                    <div className="form-group">
                      <label>Nom complet *</label>
                      <input
                        type="text"
                        value={form.donor_name}
                        onChange={e => setForm({ ...form, donor_name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={form.donor_email}
                        onChange={e => setForm({ ...form, donor_email: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Moyen de paiement *</label>
                      <div className="payment-methods">
                        {PAYMENT_METHODS.map(method => (
                          <button
                            key={method.id}
                            type="button"
                            className={`payment-btn ${form.payment_method === method.id ? 'selected' : ''}`}
                            style={{ borderColor: form.payment_method === method.id ? method.color : '#e2e8f0' }}
                            onClick={() => setForm({ ...form, payment_method: method.id, phone_number: '' })}
                          >
                            <span style={{ fontSize: '24px' }}>{method.icon}</span>
                            <div>
                              <strong>{method.name}</strong>
                              <small>{method.description}</small>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {(form.payment_method === 'orange' || form.payment_method === 'mtn') && (
                      <div className="form-group">
                        <label>Numéro de téléphone *</label>
                        <div className="phone-input">
                          <span>+237</span>
                          <input
                            type="tel"
                            placeholder="6XXXXXXXX"
                            value={form.phone_number}
                            onChange={e => setForm({ ...form, phone_number: e.target.value })}
                            required
                          />
                        </div>
                        <small>Vous recevrez une demande de paiement sur ce numéro</small>
                      </div>
                    )}
                    
                    {form.payment_method === 'cash' && (
                      <div className="info-box">
                        <FaMoneyBillWave />
                        <p>Vous pouvez faire votre don en espèces.</p>
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label>Message (optionnel)</label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Un mot pour l'association ?"
                      />
                    </div>
                    
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                        Retour
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Traitement...' : 'Confirmer le don'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="donate-info">
              <div className="info-card">
                <FaHandHoldingHeart />
                <h3>Pourquoi donner ?</h3>
                <p>Votre don permet de :</p>
                <ul>
                  <li>✓ Financer des programmes éducatifs</li>
                  <li>✓ Offrir des repas aux enfants</li>
                  <li>✓ Organiser des activités culturelles</li>
                  <li>✓ Soutenir des projets durables</li>
                </ul>
              </div>
              {/* <div className="info-card">
                <h3>Transparence</h3>
                <p>100% de votre don est utilisé pour nos programmes. Un reçu fiscal vous sera envoyé pour tout don supérieur à 10 000 FCFA.</p>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}