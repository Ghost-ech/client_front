import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { FaArrowRight, FaPlay, FaHandHoldingHeart, FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import API, { getImageUrl } from '../api';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Home.css';

const HERO_SLIDES = [
  {
    bg: '/WhatsApp Image 2026-05-06 at 12.41.29.jpeg',
    tag: 'Culture Camerounaise',
    title: 'Ensemble, faisons grandir les rêves',
    sub: "Little Dream œuvre pour l'épanouissement des jeunes à travers la culture, l'éducation et le sport au Cameroun.",
  },
  {
    bg: '/WhatsApp Image 2026-05-06 at 12.41.37.jpeg',
    tag: 'Éducation & Formation',
    title: 'Un avenir meilleur pour chaque enfant',
    sub: 'Soutien scolaire, alphabétisation, et développement des compétences pour les jeunes Camerounais.',
  },
  {
    bg: '/WhatsApp Image 2026-05-06 at 12.41.13.jpeg',
    tag: 'Patrimoine & Traditions',
    title: 'Préserver notre richesse culturelle',
    sub: 'Danses, contes, cuisine et artisanat traditionnels : nous célébrons et transmettons notre héritage.',
  },
];

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${slide.bg})` }} key={current} />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <span className="hero-tag"><FaStar /> {slide.tag}</span>
        <h1>{slide.title}</h1>
        <p>{slide.sub}</p>
        <div className="hero-actions">
          <Link to="/don" className="btn btn-primary">
            <FaHandHoldingHeart /> Faire un don
          </Link>
          <Link to="/mission" className="btn btn-outline hero-btn-outline">
            <FaPlay /> Notre mission
          </Link>
        </div>
      </div>
      <div className="hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={i === current ? 'dot active' : 'dot'} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  const [stats, setStats] = useState([
    { label: 'Bénévoles actifs', value: 0, icon: '🤝' },
    { label: 'Activités réalisées', value: 0, icon: '🎯' },
    { label: 'Événements organisés', value: 0, icon: '📅' },
    { label: 'Dons collectés (FCFA)', value: 0, icon: '💝' },
  ]);

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    API.get('/stats').then(r => {
      if (r.data.data?.length) setStats(r.data.data.map(s => ({
        label: s.label, value: s.value, icon: s.icon || '✨'
      })));
    }).catch(() => {});
  }, []);

  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">
                {inView ? <CountUp end={s.value} duration={2.5} separator=" " /> : '0'}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="mission-section">
      <div className="container">
        <div className="mission-grid">
          <div className="mission-images">
            <img src="/WhatsApp Image 2026-05-06 at 12.42.39.jpeg" alt="Activité" className="img-main" />
            <img src="/WhatsApp Image 2026-05-06 at 12.41.20.jpeg" alt="Education" className="img-secondary" />
            <div className="mission-badge-float">
              <span>❤️</span>
              <div>
                <strong>Depuis 2020</strong>
                <small>Au service des jeunes</small>
              </div>
            </div>
          </div>
          <div className="mission-text">
            <span className="section-tag">Notre Raison d'Être</span>
            <h2>Contribuer à l’épanouissement et l’autonomisation des plus démunis </h2>
            <p>Little Dream existe pour accompagner les enfants et jeunes en situation de vulnérabilité au Cameroun à travers une approche humaine, durable et porteuse d’impact.</p>
            <p style={{marginTop: 16}}>Nous croyons qu’au-delà d’une aide ponctuelle, chaque enfant mérite des opportunités pour apprendre, s’épanouir, rêver et devenir acteur de son avenir. À travers l’éducation, la santé, le mentorat, l’inclusion sociale et des projets durables, nous œuvrons à transmettre des outils, créer des perspectives et favoriser l’autonomie.</p>
            <div className="mission-pillars">
              {[
                { color: 'var(--red)', icon: '📚', label: 'Éducation' },
                { color: 'var(--green)', icon: '🎭', label: 'Culture' },
                { color: 'var(--blue)', icon: '⚽', label: 'Sport' },
                { color: 'var(--purple)', icon: '🤲', label: 'Solidarité' },
              ].map((p, i) => (
                <div className="pillar" key={i} style={{ borderColor: p.color }}>
                  <span>{p.icon}</span>
                  <strong style={{ color: p.color }}>{p.label}</strong>
                </div>
              ))}
            </div>
            <Link to="/mission" className="btn btn-primary">
              En savoir plus <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ActivitiesSection() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    API.get('/activities').then(r => setActivities(r.data.data?.slice(0, 3) || [])).catch(() => {
      setActivities([
        { id: 1, title: 'Soutien scolaire', category: 'Education', description: 'Cours de tutorat chaque samedi pour les enfants défavorisés.', image_url: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400' },
        { id: 2, title: 'Danses traditionnelles', category: 'Culture', description: 'Initiation aux danses camerounaises : Bikutsi, Makossa...', image_url: 'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=400' },
        { id: 3, title: 'Sport & Santé', category: 'Sport', description: 'Tournois sportifs pour promouvoir la santé des jeunes.', image_url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400' },
      ]);
    });
  }, []);

  const catColor = { Education: 'badge-blue', Culture: 'badge-purple', Sport: 'badge-green', default: 'badge-orange' };

  return (
    <section className="activities-section">
      <div className="container">
        <div className="section-title">
          <h2>Nos Activités</h2>
          <p>Découvrez nos programmes culturels, éducatifs et sportifs pour la jeunesse camerounaise</p>
          <div className="accent" />
        </div>
        <div className="grid-3">
          {activities.map(a => (
            <div className="card activity-card" key={a.id}>
              <div className="activity-img">
                <img src={getImageUrl(a.image_url)} alt={a.title} />
                <span className={`badge ${catColor[a.category] || catColor.default}`}>{a.category}</span>
              </div>
              <div className="activity-body">
                <h3>{a.title}</h3>
                <p>{a.description?.slice(0, 100)}...</p>
              </div>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <Link to="/activites" className="btn btn-outline">Voir toutes les activités <FaArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get('/events/public').then(r => setEvents(r.data.data?.slice(0, 3) || [])).catch(() => {
      setEvents([
        { id: 1, title: 'Journée Culturelle 2025', location: 'Yaoundé', event_date: '2025-05-20', image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400' },
        { id: 2, title: 'Tournoi de Football', location: 'Douala', event_date: '2025-04-15', image_url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400' },
        { id: 3, title: 'Atelier Cuisine Locale', location: 'Douala', event_date: '2025-05-03', image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
      ]);
    });
  }, []);

  const formatDate = d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section className="events-section">
      <div className="container">
        <div className="section-title">
          <h2>Prochains Événements</h2>
          <p>Rejoignez-nous pour nos événements et activités culturelles à venir</p>
          <div className="accent" />
        </div>
        <div className="events-list">
          {events.map(e => (
            <div className="event-card" key={e.id}>
              <div className="event-img">
                <img src={getImageUrl(e.image_url)} alt={e.title} />
              </div>
              <div className="event-info">
                <h3>{e.title}</h3>
                <div className="event-meta">
                  <span><FaCalendarAlt /> {formatDate(e.event_date)}</span>
                  <span><FaMapMarkerAlt /> {e.location}</span>
                </div>
              </div>
              <Link to="/evenements" className="btn btn-blue event-btn">Voir <FaArrowRight /></Link>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <Link to="/evenements" className="btn btn-outline">Tous les événements <FaArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

function DonateSection() {
  return (
    <section className="donate-section">
      <div className="donate-bg" />
      <div className="container donate-content">
        <div className="donate-text">
          <span className="section-tag light">Soutenez Little Dream</span>
          <h2>Chaque don compte, chaque geste transforme une vie</h2>
          <p>Votre générosité permet à Little Dream de continuer ses actions auprès des enfants et jeunes Camerounais dans le besoin.</p>
          <Link to="/don" className="btn btn-primary">
            <FaHandHoldingHeart /> Faire un don maintenant
          </Link>
        </div>
        <div className="donate-amounts">
          {[5000, 10000, 25000, 50000].map(a => (
            <Link to="/don" key={a} className="amount-pill">
              {a.toLocaleString()} FCFA
            </Link>
          ))}
          <span className="donate-currency">Mobile Money · Carte · Virement</span>
        </div>
      </div>
    </section>
  );
}

function VolunteerSection() {
  return (
    <section className="volunteer-section">
      <div className="container">
        <div className="volunteer-grid">
          <div className="vol-text">
            <span className="section-tag">Rejoignez-nous</span>
            <h2>Devenez bénévole et changez des vies</h2>
            <p>Little Dream a besoin de vous ! Que vous soyez enseignant, artiste, sportif ou simplement motivé à aider, votre contribution compte énormément.</p>
            <div className="vol-features">
              {['Accompagner des enfants', 'Partager vos talents', 'Promouvoir la culture', 'Créer du lien social'].map((f, i) => (
                <div className="vol-feature" key={i}>
                  <span className="vol-check">✓</span> {f}
                </div>
              ))}
            </div>
            <Link to="/benevole" className="btn btn-blue">
              <FaUsers /> Devenir bénévole
            </Link>
          </div>
          <div className="vol-image">
            <img src="/WhatsApp Image 2026-05-06 at 12.41.22.jpeg" alt="Bénévoles" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useDocumentMeta({
    description: "Little Dream, association camerounaise pour l'épanouissement et l'autonomisation des enfants et jeunes vulnérables : éducation, santé, culture, sport, mentorat.",
    path: '/',
  });
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <MissionSection />
      <ActivitiesSection />
      <EventsSection />
      <DonateSection />
      <VolunteerSection />
    </main>
  );
}
