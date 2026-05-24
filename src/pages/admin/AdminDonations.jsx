//src/pages/admin/AdminDonations.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch, FaCheck, FaClock, FaTrash } from 'react-icons/fa';
import API from '../../api';

export default function AdminDonations() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total_donations:0, total_amount:0, confirmed_donations:0 });

  const load = () => {
    API.get('/donations').then(r => setItems(r.data.data || [])).catch(() => {});
    API.get('/donations/stats').then(r => setStats(r.data.data || {})).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/donations/${id}/status`, { payment_status: status });
      toast.success('Statut mis à jour !');
      load();
    } catch { toast.error('Erreur.'); }
  };

  const filtered = items.filter(i =>
    (i.donor_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (i.donor_email || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = d => new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <div className="admin-page">
      <div className="crud-header">
        <div><h1>Dons</h1><p>Suivi des donations reçues par l'association</p></div>
      </div>

      {/* Stats */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:28}}>
        {[
          { label:'Total dons', value:stats.total_donations || 0, color:'var(--blue)' },
          { label:'Montant total', value:`${parseFloat(stats.total_amount || 0).toLocaleString()} FCFA`, color:'var(--red)' },
          { label:'Dons confirmés', value:stats.confirmed_donations || 0, color:'var(--green)' },
        ].map((s,i) => (
          <div key={i} style={{background:'white', borderRadius:'var(--radius-lg)', padding:24, boxShadow:'var(--shadow)', borderLeft:`4px solid ${s.color}`}}>
            <div style={{fontSize:'1.8rem', fontWeight:800, color:s.color, fontFamily:'Poppins,sans-serif'}}>{s.value}</div>
            <div style={{color:'var(--gray)', fontSize:13, marginTop:4}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-input-wrap">
            <FaSearch className="search-icon" />
            <input placeholder="Rechercher un donateur..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{color:'var(--gray)', fontSize:13}}>{filtered.length} don(s)</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr><th>Donateur</th><th>Montant</th><th>Message</th><th>Statut</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign:'center', padding:'40px', color:'var(--gray)'}}>Aucun don reçu.</td></tr>
            ) : filtered.map(d => (
              <tr key={d.id}>
                <td>
                  <strong>{d.donor_name || 'Anonyme'}</strong><br/>
                  <span style={{color:'var(--gray)', fontSize:12}}>{d.donor_email || '—'}</span>
                </td>
                <td><strong style={{color:'var(--red)', fontSize:15}}>{parseFloat(d.amount).toLocaleString()} {d.currency}</strong></td>
                <td style={{maxWidth:180, color:'var(--gray)', fontSize:13}}>{d.message || '—'}</td>
                <td>
                  <span className={`status-badge ${d.payment_status === 'confirmed' ? 'success' : d.payment_status === 'pending' ? 'pending' : 'error'}`}>
                    {d.payment_status === 'confirmed' ? <FaCheck /> : <FaClock />}
                    {d.payment_status}
                  </span>
                </td>
                <td style={{fontSize:13, color:'var(--gray)'}}>{formatDate(d.created_at)}</td>
                <td>
                  <div style={{display:'flex', gap:6}}>
                    {d.payment_status !== 'confirmed' && (
                      <button className="action-btn view" onClick={() => updateStatus(d.id, 'confirmed')} title="Confirmer">
                        <FaCheck />
                      </button>
                    )}
                    {d.payment_status !== 'rejected' && (
                      <button className="action-btn delete" onClick={() => updateStatus(d.id, 'rejected')} title="Rejeter">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
