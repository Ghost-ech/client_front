import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaUpload } from 'react-icons/fa';
import API, { getImageUrl } from '../../api';
import './AdminDashboard.css';

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [form, setForm] = useState({
    name: '',
    position: '',
    bio: '',
    image_url: '',
    email: '',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
    display_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(false);

  const load = () => {
    API.get('/team/admin')
      .then(r => setMembers(r.data.data || []))
      .catch(err => console.error('Erreur:', err));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setForm({
      name: '',
      position: '',
      bio: '',
      image_url: '',
      email: '',
      linkedin_url: '',
      twitter_url: '',
      facebook_url: '',
      display_order: members.length,
      is_active: true
    });
    setModal(true);
  };

  const openEdit = (member) => {
    setEditing(member.id);
    setSelectedFile(null);
    setPreviewUrl(null);
    setForm(member);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setEditing(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        toast.error('Seules les images sont autorisées');
        return;
      }
      setSelectedFile(file);
      // Prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const save = async (e) => {
  e.preventDefault();
  
  // Validation des champs requis
  if (!form.name.trim()) {
    toast.error('Le nom du membre est requis');
    return;
  }
  if (!form.position.trim()) {
    toast.error('Le poste du membre est requis');
    return;
  }
  
  setLoading(true);
  try {
    // Créer FormData pour l'upload de fichier
    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('position', form.position.trim());
    formData.append('bio', form.bio || '');
    formData.append('email', form.email || '');
    formData.append('linkedin_url', form.linkedin_url || '');
    formData.append('twitter_url', form.twitter_url || '');
    formData.append('facebook_url', form.facebook_url || '');
    formData.append('display_order', form.display_order || 0);
    formData.append('is_active', form.is_active);
    
    // Si un nouveau fichier a été sélectionné, l'ajouter
    if (selectedFile) {
      formData.append('image', selectedFile);
      console.log('📷 Fichier sélectionné:', selectedFile.name, selectedFile.size, 'bytes');
    } else if (form.image_url && form.image_url.trim()) {
      formData.append('image_url', form.image_url.trim());
      console.log('🔗 URL sélectionnée:', form.image_url);
    }
    
    console.log('📤 Envoi de la requête...');
    
    if (editing) {
      await API.put(`/team/${editing}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Membre mis à jour !');
    } else {
      await API.post('/team', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Membre ajouté !');
    }
    closeModal();
    load();
  } catch (err) {
    console.error('❌ Erreur détaillée:', err);
    console.error('Réponse serveur:', err.response);
    console.error('Message:', err.response?.data?.message);
    
    // Afficher un message d'erreur plus parlant
    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else if (err.message === 'Network Error') {
      toast.error('Erreur réseau. Vérifiez que le serveur est démarré.');
    } else if (err.response?.status === 500) {
      toast.error('Erreur serveur. Vérifiez la console backend pour plus de détails.');
    } else {
      toast.error('Erreur lors de la sauvegarde: ' + (err.message || 'Erreur inconnue'));
    }
  } finally {
    setLoading(false);
  }
};

  const toggleActive = async (member) => {
    try {
      await API.put(`/team/${member.id}`, { ...member, is_active: !member.is_active });
      toast.success(member.is_active ? 'Membre désactivé' : 'Membre activé');
      load();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const del = async (id, name) => {
    if (!window.confirm(`Supprimer "${name}" définitivement ?`)) return;
    try {
      await API.delete(`/team/${id}`);
      toast.success('Membre supprimé');
      load();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getImageDisplay = (member) => getImageUrl(member.image_url);

  return (
    <div className="admin-page">
      <div className="crud-header">
        <div>
          <h1>Équipe</h1>
          <p>Gérez les membres de l'association</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Ajouter un membre
        </button>
      </div>

      <div className="table-container">
        <div className="table-toolbar">
          <span style={{ color: 'var(--gray)', fontSize: '13px' }}>
            {members.length} membre(s) • {members.filter(m => m.is_active).length} actif(s)
          </span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Ordre</th>
              <th>Photo</th>
              <th>Nom & Poste</th>
              <th>Contact</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--gray)' }}>
                  Aucun membre. Cliquez sur "Ajouter" pour commencer.
                </td>
              </tr>
            ) : (
              members.map(member => (
                <tr key={member.id}>
                  <td style={{ width: '60px' }}>
                    <span style={{ color: 'var(--gray)', fontSize: '13px' }}>{member.display_order}</span>
                  </td>
                  <td style={{ width: '70px' }}>
                    {getImageDisplay(member) ? (
                      <img 
                        src={getImageDisplay(member)}
                        alt={member.name}
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => e.target.src = 'https://placehold.co/100x100?text=' + member.name.charAt(0)}
                      />
                    ) : (
                      <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{member.name}</strong><br />
                    <span style={{ color: 'var(--blue)', fontSize: '13px' }}>{member.position}</span>
                    {member.bio && (
                      <div style={{ fontSize: '12px', color: 'var(--gray)', marginTop: '4px' }}>
                        {member.bio.slice(0, 60)}...
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '12px' }}>
                    {member.email && <div>📧 {member.email}</div>}
                    {member.linkedin_url && <div>🔗 LinkedIn</div>}
                  </td>
                  <td>
                    <span className={`status-badge ${member.is_active ? 'success' : 'pending'}`}>
                      {member.is_active ? '● Actif' : '● Inactif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="action-btn edit" onClick={() => openEdit(member)} title="Modifier">
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn view" 
                        onClick={() => toggleActive(member)} 
                        title={member.is_active ? 'Désactiver' : 'Activer'}
                      >
                        {member.is_active ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      <button className="action-btn delete" onClick={() => del(member.id, member.name)} title="Supprimer">
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
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>{editing ? 'Modifier le membre' : 'Ajouter un membre'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label>Nom complet *</label>
                    <input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="form-group">
                    <label>Poste / Rôle *</label>
                    <input
                      value={form.position}
                      onChange={e => setForm({ ...form, position: e.target.value })}
                      required
                      placeholder="Président, Coordinateur, etc."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Biographie</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                    placeholder="Présentation du membre..."
                  />
                </div>

                <div className="form-group">
                  <label>Photo du membre</label>
                  
                  {/* Aperçu si existant */}
                  {(previewUrl || (form.image_url && !selectedFile)) && (
                    <div style={{ marginBottom: '12px', textAlign: 'center' }}>
                      <img 
                        src={previewUrl || getImageDisplay(form)} 
                        alt="Aperçu" 
                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                    </div>
                  )}
                  
                  {/* Upload de fichier */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginBottom: '8px' }}
                  />
                  
                  {/* Ou URL distante (optionnel) */}
                  <input
                    type="text"
                    placeholder="Ou URL de l'image (optionnel)"
                    value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    style={{ marginTop: '8px' }}
                  />
                  
                  <small style={{ color: 'var(--gray)', display: 'block', marginTop: '4px' }}>
                    Formats acceptés: JPG, PNG, GIF, WEBP (max 5MB). Laissez vide pour utiliser l'initiale.
                  </small>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="jean@littledream.cm"
                    />
                  </div>
                  <div className="form-group">
                    <label>Ordre d'affichage</label>
                    <input
                      type="number"
                      value={form.display_order}
                      onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                      placeholder="0, 1, 2..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Liens sociaux (optionnels)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      placeholder="LinkedIn URL"
                      value={form.linkedin_url}
                      onChange={e => setForm({ ...form, linkedin_url: e.target.value })}
                    />
                    <input
                      placeholder="Twitter/X URL"
                      value={form.twitter_url}
                      onChange={e => setForm({ ...form, twitter_url: e.target.value })}
                    />
                    <input
                      placeholder="Facebook URL"
                      value={form.facebook_url}
                      onChange={e => setForm({ ...form, facebook_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    style={{ width: 'auto' }}
                  />
                  <label htmlFor="is_active" style={{ margin: 0 }}>Afficher sur le site</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Sauvegarde...' : (editing ? 'Mettre à jour' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}