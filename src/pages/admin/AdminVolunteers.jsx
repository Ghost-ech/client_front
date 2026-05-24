//src/pages/admin/AdminVolunteers.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import API from '../../api';

export default function AdminVolunteers() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = () => API.get('/volunteers').then(r => setItems(r.data.data || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/volunteers/${id}/status`, { status });
      toast.success('Statut mis à jour !');
      load();
    } catch { toast.error('Erreur.'); }
  };

  const del = async id => {
    if (!window.confirm('Supprimer ce bénévole ?')) return;
    try { await API.delete(`/volunteers/${id}`); toast.success('Bénévole supprimé.'); load(); }
    catch { toast.error('Erreur.'); }
  };

  const filtered = items.filter(i =>
    i.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    i.city?.toLowerCase().includes(search.toLowerCase()) ||
    i.skills?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = { pending:'pending', accepted:'success', rejected:'error' };
  const statusLabel = { pending:'En attente', accepted:'Accepté', rejected:'Refusé' };
  const formatDate = d => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <div className="admin-page">
      <div className="crud-header">
        <div><h1>Bénévoles</h1><p>Gestion des candidatures bénévoles</p></div>
        <div style={{display:'flex', gap:10}}>
          <span className="status-badge success">{items.filter(i=>i.status==='accepted').length} acceptés</span>
          <span className="status-badge pending">{items.filter(i=>i.status==='pending').length} en attente</span>
        </div>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-input-wrap">
            <FaSearch className="search-icon" />
            <input placeholder="Rechercher un bénévole..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{color:'var(--gray)', fontSize:13}}>{filtered.length} bénévole(s)</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr><th>Nom</th><th>Contact</th><th>Ville</th><th>Compétences</th><th>Statut</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center', padding:'40px', color:'var(--gray)'}}>Aucun bénévole inscrit.</td></tr>
            ) : filtered.map(v => (
              <tr key={v.id}>
                <td><strong>{v.full_name}</strong></td>
                <td style={{fontSize:12}}>
                  <div>{v.email}</div>
                  <div style={{color:'var(--gray)'}}>{v.phone}</div>
                </td>
                <td style={{fontSize:13}}>{v.city || '—'}</td>
                <td style={{fontSize:12, color:'var(--gray)', maxWidth:140}}>{v.skills || '—'}</td>
                <td><span className={`status-badge ${statusColor[v.status] || 'pending'}`}>{statusLabel[v.status] || v.status}</span></td>
                <td style={{fontSize:13, color:'var(--gray)'}}>{formatDate(v.created_at)}</td>
                <td>
                  <div style={{display:'flex', gap:4}}>
                    <button className="action-btn view" onClick={() => setSelected(v)} title="Voir motivation"><FaEye /></button>
                    {v.status !== 'accepted' && <button className="action-btn edit" onClick={() => updateStatus(v.id, 'accepted')} title="Accepter"><FaCheck /></button>}
                    {v.status !== 'rejected' && <button className="action-btn delete" style={{background:'rgba(107,114,128,0.1)', color:'var(--gray)'}} onClick={() => updateStatus(v.id, 'rejected')} title="Refuser"><FaTimes /></button>}
                    <button className="action-btn delete" onClick={() => del(v.id)} title="Supprimer"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{maxWidth:480}}>
            <div className="modal-header">
              <h3>Candidature : {selected.full_name}</h3>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16}}>
                {[['Email', selected.email], ['Téléphone', selected.phone||'—'], ['Ville', selected.city||'—'], ['Disponibilité', selected.availability||'—']].map(([l,v]) => (
                  <div key={l}>
                    <div style={{fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--gray)', marginBottom:3}}>{l}</div>
                    <div style={{fontSize:14}}>{v}</div>
                  </div>
                ))}
              </div>
              {selected.skills && <><div style={{fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--gray)', marginBottom:6}}>Compétences</div><p style={{color:'var(--dark)', fontSize:14, marginBottom:16}}>{selected.skills}</p></>}
              <div style={{fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color:'var(--gray)', marginBottom:6}}>Motivation</div>
              <p style={{color:'var(--dark)', fontSize:14, lineHeight:1.7, background:'var(--light)', padding:16, borderRadius:'var(--radius)'}}>{selected.motivation || '—'}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Fermer</button>
              {selected.status !== 'accepted' && <button className="btn btn-primary" onClick={() => { updateStatus(selected.id, 'accepted'); setSelected(null); }}><FaCheck /> Accepter</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
