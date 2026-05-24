// client/src/pages/admin/AdminEvents.jsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUpload } from 'react-icons/fa';
import API, { IMAGE_BASE_URL } from '../../api';
import './AdminDashboard.css';

const EMPTY = { title: '', description: '', location: '', event_date: '', image_url: '', is_published: true };

export default function AdminEvents() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const load = () => {
    API.get('/events')
      .then(r => setItems(r.data.data || []))
      .catch(err => console.error('Erreur chargement:', err));
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditing(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setModal(true);
  };

  const openEdit = (e) => {
    const d = new Date(e.event_date);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setForm({ ...e, event_date: local });
    setEditing(e.id);
    setSelectedFile(null);
    setPreviewUrl(null);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setForm(EMPTY);
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
      formData.append('location', form.location);
      formData.append('event_date', form.event_date);
      formData.append('is_published', form.is_published);
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (form.image_url) {
        formData.append('image_url', form.image_url);
      }
      
      if (editing) {
        await API.put(`/events/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Événement mis à jour !');
      } else {
        await API.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Événement créé !');
      }
      closeModal();
      load();
    } catch (err) {
      console.error('Erreur:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm('Supprimer cet événement ?')) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success('Événement supprimé.');
      load();
    } catch {
      toast.error('Erreur.');
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${IMAGE_BASE_URL}${url}`;
  };

  const filtered = items.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()));
  const formatDate = d => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="admin-page">
      <div className="crud-header">
        <div>
          <h1>Événements</h1>
          <p>Gérez les événements de l'association</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Nouvel événement
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-input-wrap">
            <FaSearch className="search-icon" />
            <input placeholder="Rechercher un événement..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ color: 'var(--gray)', fontSize: '13px' }}>{filtered.length} événement(s)</span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Titre</th>
              <th>Date</th>
              <th>Lieu</th>
              <th>Publié</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
                  Aucun événement.
                </td>
              </tr>
            ) : (
              filtered.map(ev => (
                <tr key={ev.id}>
                  <td>
                    {getImageUrl(ev.image_url) ? 
                      <img src={getImageUrl(ev.image_url)} alt="" style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 8 }} /> : 
                      <span style={{ color: 'var(--gray)' }}>—</span>
                    }
                  </td>
                  <td><strong>{ev.title}</strong></td>
                  <td style={{ fontSize: 13 }}>
                    <FaCalendarAlt style={{ color: 'var(--blue)', marginRight: 6 }} />
                    {formatDate(ev.event_date)}
                  </td>
                  <td style={{ fontSize: 13 }}>
                    <FaMapMarkerAlt style={{ color: 'var(--red)', marginRight: 6 }} />
                    {ev.location}
                  </td>
                  <td>
                    <span className={`status-badge ${ev.is_published ? 'success' : 'pending'}`}>
                      {ev.is_published ? '● Publié' : '● Brouillon'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="action-btn edit" onClick={() => openEdit(ev)} title="Modifier">
                        <FaEdit />
                      </button>
                      <button className="action-btn delete" onClick={() => del(ev.id)} title="Supprimer">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Formulaire */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>{editing ? 'Modifier l\'événement' : 'Nouvel événement'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Titre *</label>
                  <input 
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })} 
                    required 
                    placeholder="Nom de l'événement"
                  />
                </div>
                
                <div className="grid-2">
                  <div className="form-group">
                    <label>Date & Heure *</label>
                    <input 
                      type="datetime-local" 
                      value={form.event_date} 
                      onChange={e => setForm({ ...form, event_date: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Lieu</label>
                    <input 
                      value={form.location} 
                      onChange={e => setForm({ ...form, location: e.target.value })} 
                      placeholder="Ville, lieu..."
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description *</label>
                  <textarea 
                    rows={4} 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                    required 
                    placeholder="Décrivez l'événement..."
                  />
                </div>
                
                {/* Upload d'image */}
                <div className="form-group">
                  <label>Image de l'événement</label>
                  
                  {/* Aperçu */}
                  {(previewUrl || getImageUrl(form.image_url)) && (
                    <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                      <img 
                        src={previewUrl || getImageUrl(form.image_url)} 
                        alt="Aperçu" 
                        style={{ maxHeight: '150px', borderRadius: '8px' }} 
                      />
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
                      setForm({ ...form, image_url: e.target.value });
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    style={{ marginTop: '8px' }}
                  />
                  
                  <small style={{ color: 'var(--gray)', display: 'block', marginTop: '4px' }}>
                    Formats acceptés: JPG, PNG, GIF, WEBP (max 5MB)
                  </small>
                </div>
                
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input 
                    type="checkbox" 
                    id="published" 
                    checked={form.is_published} 
                    onChange={e => setForm({ ...form, is_published: e.target.checked })} 
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="published" style={{ margin: 0 }}>Publier cet événement</label>
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