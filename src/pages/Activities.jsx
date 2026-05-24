// client/src/pages/Activities.jsx
import React, { useEffect, useState } from 'react';
import API, { getImageUrl } from '../api';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Activities.css';

const CATEGORIES = ['Toutes', 'Education', 'Culture', 'Sport'];

export default function Activities() {
  useDocumentMeta({
    title: 'Nos Activités',
    description: "Soutien scolaire, danses traditionnelles, cuisine locale, sport, alphabétisation : découvrez les activités de Little Dream pour la jeunesse camerounaise.",
    path: '/activites',
  });
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('Toutes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/activities').then(r => setActivities(r.data.data || [])).catch(() => {
      setActivities([
        { id:1, title:'Soutien scolaire', category:'Education', description:'Programme de tutorat chaque samedi pour les enfants défavorisés de Douala. Cours de maths, français et sciences.', image_url:'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600', status:'active' },
        { id:2, title:'Danses traditionnelles', category:'Culture', description:"Initiation aux danses camerounaises : Bikutsi, Makossa, Bamiléké. Préservation du patrimoine pour les jeunes.", image_url:'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=600', status:'active' },
        { id:3, title:'Atelier cuisine locale', category:'Culture', description:"Apprentissage des recettes traditionnelles : Ndolé, Eru, Koki. Valorisation de la gastronomie camerounaise.", image_url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600', status:'active' },
        { id:4, title:'Sport & Santé', category:'Sport', description:"Tournois de football, basketball et course à pied pour promouvoir la santé des jeunes dans nos quartiers.", image_url:'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600', status:'active' },
        { id:5, title:'Alphabétisation adultes', category:'Education', description:"Cours d'alphabétisation pour adultes les soirs de semaine. Lire, écrire et compter pour mieux s'intégrer.", image_url:'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600', status:'active' },
        { id:6, title:'Contes & Traditions', category:'Culture', description:"Soirées de contes camerounais animées par des conteurs traditionnels. Transmission orale du patrimoine.", image_url:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600', status:'active' },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'Toutes' ? activities : activities.filter(a => a.category === filter);

  const catColor = { Education: 'badge-blue', Culture: 'badge-purple', Sport: 'badge-green' };

  return (
    <main>
      <div className="page-header">
        <h1>Nos Activités</h1>
        <p>Éducation, culture et sport au service des jeunes Camerounais</p>
      </div>

      <section className="activities-page">
        <div className="container">
          <div className="filter-bar">
            {CATEGORIES.map(c => (
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
            <div className="act-grid">
              {filtered.map(a => (
                <div className="act-card card" key={a.id}>
                  <div className="act-img">
                    <img src={getImageUrl(a.image_url)} alt={a.title} />
                    <span className={`badge ${catColor[a.category] || 'badge-orange'}`}>{a.category}</span>
                  </div>
                  <div className="act-body">
                    <h3>{a.title}</h3>
                    <p>{a.description}</p>
                    <div className={`status-dot ${a.status === 'active' ? 'active' : 'inactive'}`}>
                      {a.status === 'active' ? '● En cours' : '● Terminé'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
