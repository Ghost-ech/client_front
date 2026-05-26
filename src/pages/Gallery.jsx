import React, { useEffect, useState } from 'react';
import API, { getImageUrl } from '../api';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Gallery.css';

const CATS = ['Toutes', 'Education', 'Culture', 'Sport', 'Events'];

export default function Gallery() {
  useDocumentMeta({
    title: 'Galerie photos',
    description: "Photos des activités, événements et actions de Little Dream sur le terrain au Cameroun : éducation, culture, sport et solidarité.",
    path: '/galerie',
  });
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('Toutes');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/gallery')
      .then(r => {
        let data = r.data.data || [];
        
        // Normalise les URLs (force https si la page est en https)
        data = data.map(img => ({ ...img, image_url: getImageUrl(img.image_url) }));
        
        setImages(data);
      })
      .catch(err => {
        console.error('Erreur chargement:', err);
        // Données de secours
        setImages([
          { id:1, title:'Cours de soutien scolaire', image_url:'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600', category:'Education' },
          { id:2, title:'Danse Bikutsi', image_url:'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=600', category:'Culture' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'Toutes' ? images : images.filter(i => i.category === filter);

  return (
    <main>
      <div className="page-header">
        <h1>Notre Galerie</h1>
        <p>Les moments forts de la vie de Little Dream en images</p>
      </div>

      <section className="gallery-page">
        <div className="container">
          <div className="filter-bar">
            {CATS.map(c => (
              <button key={c} className={`filter-btn${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((img, i) => (
                <div className={`gallery-item${i % 5 === 0 ? ' wide' : ''}`} key={img.id} onClick={() => setLightbox(img)}>
                  <img 
                    src={img.image_url} 
                    alt={img.title} 
                    loading="lazy"
                    onError={(e) => {
                      console.error('Erreur chargement image:', img.image_url);
                      e.target.src = 'https://placehold.co/600x400?text=Image+non+trouvée';
                    }}
                  />
                  <div className="gallery-overlay">
                    <span className="gallery-title">{img.title}</span>
                    <span className="gallery-cat">{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lb-close" onClick={() => setLightbox(null)}>✕</button>
          <div className="lb-content" onClick={e => e.stopPropagation()}>
            <img src={lightbox.image_url} alt={lightbox.title} />
            <div className="lb-info">
              <h4>{lightbox.title}</h4>
              <span className="badge badge-blue">{lightbox.category}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}