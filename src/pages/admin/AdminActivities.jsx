import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUpload } from 'react-icons/fa';
import API, { getImageUrl } from '../../api';
import './AdminDashboard.css';

const CATS = ['Education', 'Culture', 'Sport', 'Autre'];

export default function AdminActivities() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'Education', image_url: '', status: 'active' });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const load = () => {
    API.get('/activities').then(r => setItems(r.data.data || [])).catch(() => {});
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ title: '', description: '', category: 'Education', image_url: '', status: 'active' });
    setEditing(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setModal(true);
  };

  const openEdit = (a) => {
    setForm(a);
    setEditing(a.id);
    setSelectedFile(null);
    setPreviewUrl(null);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setForm({ title: '', description: '', category: 'Education', image_url: '', status: 'active' });
    setEditing(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Seules les images sont autorisées');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
      // Effacer l'URL si un fichier est sélectionné
      setForm({ ...form, image_url: '' });
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('status', form.status);
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (form.image_url) {
        formData.append('image_url', form.image_url);
      }
      
      if (editing) {
        await API.put(`/activities/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Activité mise à jour !');
      } else {
        await API.post('/activities', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Activité créée !');
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Supprimer cette activité ?')) return;
    try {
      await API.delete(`/activities/${id}`);
      toast.success('Activité supprimée.');
      load();
    } catch { toast.error('Erreur lors de la suppression.'); }
  };

  const filtered = items.filter(i =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="crud-header">
        <div>
          <h1>Activités</h1>
          <p>Gérez les activités et programmes de l'association</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><FaPlus /> Nouvelle activité</button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-input-wrap">
            <FaSearch className="search-icon" />
            <input placeholder="Rechercher une activité..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{color:'var(--gray)', fontSize:'13px'}}>{filtered.length} activité(s)</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Titre</th><th>Catégorie</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign:'center', padding:'40px', color:'var(--gray)'}}>Aucune activité trouvée.</td></tr>
            ) : filtered.map(a => (
              <tr key={a.id}>
                <td>
                  {getImageUrl(a.image_url) ? 
                    <img src={getImageUrl(a.image_url)} alt={a.title} style={{width:60, height:44, objectFit:'cover', borderRadius:8}} /> : 
                    <span style={{color:'var(--gray)'}}>—</span>
                  }
                </td>
                <td><strong>{a.title}</strong><br/><span style={{color:'var(--gray)', fontSize:'12px'}}>{a.description?.slice(0,60)}...</span></td>
                <td><span className="badge badge-blue">{a.category}</span></td>
                <td>
                  <span className={`status-badge ${a.status === 'active' ? 'success' : 'pending'}`}>
                    {a.status === 'active' ? '● Actif' : '● Inactif'}
                  </span>
                </td>
                <td>
                  <div style={{display:'flex', gap:6}}>
                    <button className="action-btn edit" onClick={() => openEdit(a)} title="Modifier"><FaEdit /></button>
                    <button className="action-btn delete" onClick={() => del(a.id)} title="Supprimer"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? 'Modifier l\'activité' : 'Nouvelle activité'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre *</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="Nom de l'activité" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Catégorie</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Statut</label>
                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="Décrivez l'activité..." />
                </div>
                
                {/* Upload d'image */}
                <div className="form-group">
                  <label>Image de l'activité</label>
                  
                  {/* Aperçu */}
                  {(previewUrl || getImageUrl(form.image_url)) && !selectedFile && (
                    <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                      <img 
                        src={previewUrl || getImageUrl(form.image_url)} 
                        alt="Aperçu" 
                        style={{ maxHeight: '150px', borderRadius: '8px' }} 
                      />
                    </div>
                  )}
                  
                  {previewUrl && (
                    <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                      <img src={previewUrl} alt="Aperçu" style={{ maxHeight: '150px', borderRadius: '8px' }} />
                    </div>
                  )}
                  
                  {/* Upload fichier */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginBottom: '8px' }}
                  />
                  
                  {/* Ou URL distante */}
                  <input
                    type="text"
                    placeholder="Ou URL de l'image (optionnel)"
                    value={form.image_url}
                    onChange={e => {
                      setForm({...form, image_url: e.target.value});
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    style={{ marginTop: '8px' }}
                  />
                  
                  <small style={{ color: 'var(--gray)', display: 'block', marginTop: '4px' }}>
                    Formats acceptés: JPG, PNG, GIF, WEBP (max 5MB)
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}