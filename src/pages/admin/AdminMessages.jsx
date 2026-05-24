import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaEye, FaTrash, FaEnvelope, FaEnvelopeOpen, FaReply, FaSpinner } from 'react-icons/fa';
import API from '../../api';
import './AdminDashboard.css';

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [replyModal, setReplyModal] = useState(null);
  const [replyForm, setReplyForm] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);

  // Charger les messages
  const load = () => {
    API.get('/contacts')
      .then(r => setItems(r.data.data || []))
      .catch(err => console.error('Erreur chargement:', err));
  };

  useEffect(() => { load(); }, []);

  // Marquer comme lu
  const markRead = async (id) => {
    try {
      await API.put(`/contacts/${id}/read`);
      load();
    } catch (err) {
      toast.error('Erreur lors du marquage');
    }
  };

  // Supprimer un message
  const del = async (id) => {
    if (!window.confirm('Supprimer définitivement ce message ?')) return;
    try {
      await API.delete(`/contacts/${id}`);
      toast.success('Message supprimé');
      load();
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Ouvrir un message
  const openMsg = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      await markRead(msg.id);
    }
  };

  // Ouvrir le modal de réponse
  const openReplyModal = (msg) => {
    setReplyModal(msg);
    setReplyForm({
      subject: `Re: ${msg.subject || 'Votre message à Little Dream'}`,
      message: ''
    });
  };

  // Envoyer la réponse
  const sendReply = async () => {
    if (!replyForm.message.trim()) {
      toast.error('Veuillez écrire un message de réponse');
      return;
    }

    setSending(true);
    try {
      await API.post(`/contacts/${replyModal.id}/reply`, {
        subject: replyForm.subject,
        message: replyForm.message
      });
      
      toast.success('✅ Réponse envoyée avec succès !');
      setReplyModal(null);
      setReplyForm({ subject: '', message: '' });
      
    } catch (err) {
      console.error('Erreur envoi:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi de la réponse');
    } finally {
      setSending(false);
    }
  };

  // Filtrer les messages
  const filtered = items.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.email?.toLowerCase().includes(search.toLowerCase()) ||
    i.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const unread = items.filter(i => !i.is_read).length;
  
  const formatDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    const diffMinutes = Math.floor(diff / 60000);
    const diffHours = Math.floor(diff / 3600000);
    const diffDays = Math.floor(diff / 86400000);
    
    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="admin-page">
      <div className="crud-header">
        <div>
          <h1>Messages</h1>
          <p>Messages reçus via le formulaire de contact</p>
        </div>
        {unread > 0 && (
          <span className="status-badge pending" style={{ fontSize: 14, padding: '8px 16px' }}>
            <FaEnvelope /> {unread} non lu(s)
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: 24, alignItems: 'start' }}>
        
        {/* Liste des messages */}
        <div className="table-container">
          <div className="table-toolbar">
            <div className="search-input-wrap">
              <FaSearch className="search-icon" />
              <input 
                placeholder="Rechercher par nom, email ou sujet..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <span style={{ color: 'var(--gray)', fontSize: 13 }}>
              {filtered.length} message(s)
            </span>
          </div>

          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray)' }}>
                Aucun message trouvé
              </div>
            ) : (
              filtered.map(m => (
                <div 
                  key={m.id}
                  onClick={() => openMsg(m)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    background: selected?.id === m.id ? 'rgba(17,138,178,0.05)' : !m.is_read ? 'rgba(230,57,70,0.02)' : 'white',
                    borderLeft: selected?.id === m.id ? '3px solid var(--blue)' : !m.is_read ? '3px solid var(--red)' : '3px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        {m.is_read ? (
                          <FaEnvelopeOpen style={{ color: 'var(--gray)', fontSize: 12 }} />
                        ) : (
                          <FaEnvelope style={{ color: 'var(--red)', fontSize: 12 }} />
                        )}
                        <strong style={{ fontSize: 14, fontWeight: m.is_read ? 500 : 700 }}>
                          {m.name}
                        </strong>
                        {!m.is_read && (
                          <span className="badge" style={{ background: 'var(--red)', color: 'white', fontSize: 10, padding: '2px 8px' }}>
                            Nouveau
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 4 }}>
                        {m.subject || '(sans sujet)'}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(107,114,128,0.7)' }}>
                        {m.message?.slice(0, 80)}...
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                      <span style={{ fontSize: 11, color: 'var(--gray)' }}>
                        {formatDate(m.created_at)}
                      </span>
                      <button 
                        className="action-btn delete" 
                        onClick={e => { e.stopPropagation(); del(m.id); }} 
                        style={{ width: 28, height: 28 }}
                        title="Supprimer"
                      >
                        <FaTrash style={{ fontSize: 11 }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Détail du message sélectionné */}
        {selected && (
          <div style={{ 
            background: 'white', 
            borderRadius: 'var(--radius-lg)', 
            boxShadow: 'var(--shadow)', 
            overflow: 'hidden',
            position: 'sticky',
            top: 20
          }}>
            <div style={{ 
              padding: '20px 24px', 
              borderBottom: '1px solid #f1f5f9', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(230,57,70,0.05), rgba(244,162,97,0.05))'
            }}>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: 4, color: 'var(--dark)' }}>
                  {selected.subject || '(sans sujet)'}
                </h4>
                <span style={{ fontSize: 12, color: 'var(--gray)' }}>
                  Reçu le {new Date(selected.created_at).toLocaleString('fr-FR')}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => openReplyModal(selected)}
                  style={{ padding: '8px 16px', fontSize: 13 }}
                >
                  <FaReply /> Répondre
                </button>
                <button 
                  className="action-btn delete" 
                  onClick={() => del(selected.id)}
                  title="Supprimer"
                >
                  <FaTrash />
                </button>
                <button 
                  className="modal-close" 
                  onClick={() => setSelected(null)}
                  style={{ width: 32, height: 32 }}
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                <strong style={{ fontSize: 14, color: 'var(--dark)' }}>{selected.name}</strong>
              </div>
              <a 
                href={`mailto:${selected.email}`} 
                style={{ color: 'var(--blue)', fontSize: 13, textDecoration: 'none' }}
              >
                {selected.email}
              </a>
            </div>
            
            <div style={{ 
              padding: '28px', 
              lineHeight: 1.8, 
              fontSize: 15, 
              color: 'var(--dark)', 
              whiteSpace: 'pre-wrap',
              minHeight: 200,
              background: 'white'
            }}>
              {selected.message}
            </div>
          </div>
        )}
      </div>

      {/* Modal de réponse */}
      {replyModal && (
        <div className="modal-overlay" onClick={() => setReplyModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>
                <FaReply style={{ marginRight: '8px', color: 'var(--blue)' }} />
                Répondre à {replyModal.name}
              </h3>
              <button className="modal-close" onClick={() => setReplyModal(null)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Destinataire</label>
                <input 
                  value={replyModal.email} 
                  disabled 
                  style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
                />
              </div>
              
              <div className="form-group">
                <label>Sujet</label>
                <input 
                  value={replyForm.subject}
                  onChange={e => setReplyForm({ ...replyForm, subject: e.target.value })}
                  placeholder="Sujet du message"
                />
              </div>
              
              <div className="form-group">
                <label>Message de réponse *</label>
                <textarea 
                  rows={8}
                  value={replyForm.message}
                  onChange={e => setReplyForm({ ...replyForm, message: e.target.value })}
                  placeholder="Écrivez votre réponse ici..."
                  style={{ fontFamily: 'inherit', fontSize: '14px' }}
                />
              </div>
              
              <div style={{ 
                background: '#f0fdf4', 
                padding: '12px', 
                borderRadius: '8px', 
                fontSize: '12px',
                color: '#166534'
              }}>
                <strong>ℹ️ Information</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
                  La réponse sera envoyée par email à {replyModal.email}. 
                  L'utilisateur recevra un email professionnel avec votre message.
                </p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setReplyModal(null)}>
                Annuler
              </button>
              <button 
                className="btn btn-primary" 
                onClick={sendReply}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> 
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <FaEnvelope /> Envoyer la réponse
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}