import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaSearch, FaUpload, FaLink } from 'react-icons/fa';
import API, { IMAGE_BASE_URL } from '../../api';
import './AdminDashboard.css';

const CATEGORIES = ['Education', 'Culture', 'Sport', 'Events'];

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', image_url: '', category: 'Culture' });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const load = () => {
    API.get('/gallery')
      .then(r => {
        let data = r.data.data || [];
        // Ajouter l'URL complète pour l'affichage
        data = data.map(img => {
          if (img.image_url && !img.image_url.startsWith('http')) {
            return {
              ...img,
              display_url: `${IMAGE_BASE_URL}${img.image_url}`
            };
          }
          return { ...img, display_url: img.image_url };
        });
        setItems(data);
      })
      .catch(err => console.error('Erreur chargement:', err));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm({ title: '', image_url: '', category: 'Culture' });
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadMethod('url');
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setForm({ title: '', image_url: '', category: 'Culture' });
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
    }
  };

  const save = async (e) => {
    e.preventDefault();
    
    if (uploadMethod === 'file' && !selectedFile) {
      toast.error('Veuillez sélectionner une image');
      return;
    }
    if (uploadMethod === 'url' && !form.image_url) {
      toast.error('Veuillez entrer une URL d\'image');
      return;
    }
    
    setSaving(true);
    try {
      if (uploadMethod === 'file') {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('category', form.category);
        formData.append('image', selectedFile);
        
        await API.post('/gallery', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await API.post('/gallery', form);
      }
      
      toast.success('Image ajoutée à la galerie !');
      closeModal();
      load();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id, title) => {
    if (!window.confirm(`Supprimer "${title}" de la galerie ?`)) return;
    try {
      await API.delete(`/gallery/${id}`);
      toast.success('Image supprimée');
      load();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filtered = items.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="crud-header">
        <div>
          <h1>Galerie photo</h1>
          <p>Gérez les images de la galerie</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Ajouter une image
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-input-wrap">
            <FaSearch className="search-icon" />
            <input
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ color: 'var(--gray)', fontSize: '13px' }}>
            {filtered.length} image(s)
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          padding: '24px'
        }}>
          {filtered.length === 0 ? (
            <div style={{
              gridColumn: '1/-1',
              textAlign: 'center',
              padding: '60px',
              color: 'var(--gray)'
            }}>
              Aucune image dans la galerie.
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id} style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)'
              }}>
                <div style={{
                  position: 'relative',
                  height: '200px',
                  overflow: 'hidden',
                  background: '#f0f0f0'
                }}>
                  <img
                    src={item.display_url}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.error('Erreur chargement:', item.display_url);
                      e.target.src = 'https://placehold.co/600x400?text=Image+non+trouvée';
                    }}
                  />
                  <span className="badge" style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white'
                  }}>
                    {item.category}
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{item.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                    <button
                      className="action-btn delete"
                      onClick={() => del(item.id, item.title)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal d'ajout (inchangée) */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Ajouter une image</h3>
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
                  />
                </div>

                <div className="form-group">
                  <label>Méthode d'ajout</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('url')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: uploadMethod === 'url' ? 'var(--blue)' : '#f0f0f0',
                        color: uploadMethod === 'url' ? 'white' : 'var(--gray)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaLink /> URL distante
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: uploadMethod === 'file' ? 'var(--blue)' : '#f0f0f0',
                        color: uploadMethod === 'file' ? 'white' : 'var(--gray)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaUpload /> Upload fichier
                    </button>
                  </div>
                </div>

                {uploadMethod === 'url' ? (
                  <div className="form-group">
                    <label>URL de l'image *</label>
                    <input
                      value={form.image_url}
                      onChange={e => setForm({ ...form, image_url: e.target.value })}
                      placeholder="https://exemple.com/image.jpg"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Fichier image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ width: '100%' }}
                    />
                    {previewUrl && (
                      <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        <img src={previewUrl} alt="Prévisualisation" style={{ maxHeight: '150px' }} />
                      </div>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}