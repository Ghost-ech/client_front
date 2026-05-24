import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import API, { getImageUrl } from '../api';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Events.css';

export default function Events() {
  useDocumentMeta({
    title: 'Événements',
    description: "Agenda des événements Little Dream au Cameroun : journées culturelles, tournois sportifs, collectes solidaires et ateliers à Yaoundé et Douala.",
    path: '/evenements',
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/events/public').then(r => setEvents(r.data.data || [])).catch(() => {
      setEvents([
        { id:1, title:'Journée Culturelle Camerounaise 2025', description:'Grande journée de célébration de la culture camerounaise avec danses, chants, expositions artisanales et dégustation culinaire.', location:'Esplanade du Palais des Congrès, Yaoundé', event_date:'2025-05-20T09:00:00', image_url:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600' },
        { id:2, title:'Tournoi de Football Little Dream', description:'Tournoi inter-quartiers de football. 16 équipes en compétition. Remise de prix aux 3 premières équipes.', location:'Terrain omnisports de Bepanda, Douala', event_date:'2025-04-15T14:00:00', image_url:'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600' },
        { id:3, title:'Collecte de fournitures scolaires', description:'Collecte de fournitures et matériel scolaire pour les enfants défavorisés. Venez déposer vos dons !', location:'Siège de Little Dream, Douala', event_date:'2025-04-01T08:00:00', image_url:'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600' },
        { id:4, title:'Atelier Ndolé & Eru', description:"Atelier de cuisine traditionnelle camerounaise animé par la cheffe Mama Ngono. Places limitées — inscription obligatoire.", location:'Centre Communautaire de Bonabéri, Douala', event_date:'2025-05-03T10:00:00', image_url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600' },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  const formatDate = d => new Date(d).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const formatTime = d => new Date(d).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  const isFuture = d => new Date(d) > new Date();

  return (
    <main>
      <div className="page-header">
        <h1>Nos Événements</h1>
        <p>Rejoignez-nous pour vivre des moments de partage et de solidarité</p>
      </div>

      <section className="events-page">
        <div className="container">
          {loading ? (
            <p style={{textAlign:'center', color:'var(--gray)'}}>Chargement...</p>
          ) : (
            <div className="events-cards">
              {events.map(e => (
                <div className="ev-card" key={e.id}>
                  <div className="ev-img">
                    <img src={getImageUrl(e.image_url)} alt={e.title} />
                    <span className={`ev-status ${isFuture(e.event_date) ? 'upcoming' : 'past'}`}>
                      {isFuture(e.event_date) ? '🟢 À venir' : '⚫ Passé'}
                    </span>
                  </div>
                  <div className="ev-content">
                    <div className="ev-date-box">
                      <span className="ev-day">{new Date(e.event_date).getDate()}</span>
                      <span className="ev-month">{new Date(e.event_date).toLocaleDateString('fr-FR', {month:'short'})}</span>
                    </div>
                    <div className="ev-info">
                      <h3>{e.title}</h3>
                      <p>{e.description}</p>
                      <div className="ev-meta">
                        <span><FaCalendarAlt /> {formatDate(e.event_date)}</span>
                        <span><FaClock /> {formatTime(e.event_date)}</span>
                        <span><FaMapMarkerAlt /> {e.location}</span>
                      </div>
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
