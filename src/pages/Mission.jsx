import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHandHoldingHeart, FaEye, FaBullseye, FaUsers } from 'react-icons/fa';
import API, { getImageUrl } from '../api';
import useDocumentMeta from '../hooks/useDocumentMeta';
import './Mission.css';

const values = [
  { icon: '🌍', color: 'var(--blue)', title: 'Solidarité', desc: "Nous croyons que la force d'une communauté réside dans son unité et dans l'entraide entre ses membres." },
  { icon: '🎓', color: 'var(--green)', title: 'Éducation', desc: "Nous croyons que l’éducation est un levier essentiel pour transformer des vies et ouvrir des perspectives d’avenir." },
  { icon: '🎭', color: 'var(--purple)', title: 'Inclusion', desc: "Nous œuvrons pour une société plus inclusive, où chaque enfant et jeune, quelle que soit sa situation, se sent valorisé, accompagné et a sa place." },
  { icon: '🔍', color: 'var(--orange)', title: 'Transparence', desc: "Nous gérons les ressources qui nous sont confiées avec honnêteté, rigueur et redevabilité." },
  { icon: '⚖️', color: 'var(--red)', title: 'Équité', desc: "Chaque enfant mérite les mêmes chances, indépendamment de son origine ou de sa condition sociale." },
  { icon: '💪', color: 'var(--dark)', title: 'Engagement', desc: "Nos bénévoles et partenaires s'investissent avec passion et détermination pour notre mission." },
];

export default function Mission() {
  useDocumentMeta({
    title: 'Notre Mission',
    description: "Mission, vision et valeurs de Little Dream : épanouissement et autonomisation des enfants et jeunes vulnérables au Cameroun par l'éducation, la santé et le mentorat.",
    path: '/mission',
  });
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    API.get('/team')
      .then(r => {
        setTeam(r.data.data || []);
      })
      .catch(err => console.error('Erreur chargement équipe:', err))
      .finally(() => setLoadingTeam(false));
  }, []);


  return (
    <main>
      <div className="page-header">
        <h1>Notre Mission</h1>
        <p>Découvrez les valeurs et les engagements qui guident chacune de nos actions</p>
      </div>

      {/* Vision & Mission */}
      <section className="vm-section">
        <div className="container">
          <div className="vm-grid">
            <div className="vm-card vm-vision">
              <div className="vm-icon"><FaEye /></div>
              <h3>Notre Vision</h3>
              <p>Un Cameroun où chaque enfant et jeune en situation de vulnérabilité a accès à des opportunités durables d’éducation, de santé et d’autonomisation, lui permettant de s’épanouir pleinement, de rêver et de construire un avenir digne et indépendant.</p>
            </div>
            <div className="vm-card vm-mission">
              <div className="vm-icon"><FaBullseye /></div>
              <h3>Notre Mission</h3>
              <p>Little Dream agit pour l’épanouissement et l’autonomisation des enfants et jeunes en situation de vulnérabilité au Cameroun à travers des actions durables dans l’éducation, la santé et l’inclusion sociale.</p><br />
              <p>Nous menons des projets concrets (collectes, sensibilisations, kits, jardin solidaire, formations) et plaçons le mentorat au cœur de notre démarche pour accompagner vers l’autonomie et un avenir meilleur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story (inchangée) */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-images">
              <img src="/WhatsApp Image 2026-05-06 at 12.41.18.jpeg" alt="Histoire" />
            </div>
            <div className="story-text">
              <span className="section-tag">Notre Histoire</span>
              <h2>Née d'un rêve, grandie grâce à vous</h2>
              <p>Little Dream est née en 2019 à Yaoundé, de l’initiative d’un groupe de jeunes Camerounais animés par une même conviction : le changement commence à la base, auprès des enfants et des communautés les plus vulnérables.</p>
              <p style={{marginTop: 14}}>Au départ, l’association menait principalement des actions ponctuelles de solidarité. Mais très vite, une réflexion s’est imposée : comment aller au-delà de l’aide immédiate et créer un impact réel et durable dans la vie des bénéficiaires ?</p>
              <p style={{marginTop: 14}}>C’est ainsi que Little Dream a progressivement construit une vision centrée sur l’épanouissement et surtout l’autonomisation. L’objectif n’est pas seulement d’aider, mais de transmettre, d’accompagner et de donner aux enfants et aux jeunes les moyens de devenir acteurs de leur propre avenir.</p>
              <p style={{marginTop: 14}}>À travers des initiatives dans les domaines de l’éducation, de la santé, du mentorat et des projets durables, l’association œuvre aujourd’hui à bâtir des solutions qui laissent une empreinte positive sur le long terme.</p>
              <p style={{marginTop: 14}}>Depuis sa création, Little Dream a réalisé une dizaine d’activités et accompagné plus de 300 enfants grâce à l’engagement de bénévoles passionnés, de partenaires et de personnes qui croient, comme nous, qu’un simple rêve peut devenir une véritable source de changement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives (inchangé) */}
      <section className="objectives-section">
        <div className="container">
          <div className="section-title">
            <h2>Nos Objectifs</h2>
            <p>Ce que Little Dream s'engage à accomplir chaque jour</p>
            <div className="accent" />
          </div>
          <div className="obj-grid">
            {[
              { num: '01', title: 'Communication & sensibilisation', desc: 'Informer le public sur nos actions, sensibiliser et partager notre impact.' },
              { num: '02', title: 'Accès à l\'éducation', desc: 'Favoriser l’accès au savoir à travers nos initiatives éducatives et d’accompagnement.' },
              { num: '03', title: 'Collecte de fonds', desc: 'Mobiliser des ressources pour soutenir nos programmes, activités et projets durables.' },
              { num: '04', title: 'Recrutement bénévoles', desc: 'Encourager la participation citoyenne et faciliter l\'implication de bénévoles et partenaires.' },
              { num: '05', title: 'Impact & réalisations', desc: 'Valoriser nos actions et mettre en lumière les résultats obtenus sur le terrain.' },
              { num: '06', title: 'Visibilité', desc: 'Renforcer la présence de l\'association pour toucher davantage de bénéficiaires.' },
            ].map((o, i) => (
              <div className="obj-card" key={i}>
                <span className="obj-num">{o.num}</span>
                <h4>{o.title}</h4>
                <p>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values (inchangé) */}
      <section className="values-section">
        <div className="container">
          <div className="section-title">
            <h2>Nos Valeurs</h2>
            <p>Les principes fondamentaux qui guident nos actions et nos décisions</p>
            <div className="accent" />
          </div>
          <div className="grid-3">
            {values.map((v, i) => (
              <div className="value-card" key={i} style={{ borderTopColor: v.color }}>
                <div className="value-icon">{v.icon}</div>
                <h4 style={{ color: v.color }}>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team - Version dynamique */}
      <section className="team-section">
        <div className="container">
          <div className="section-title">
            <h2>Notre Équipe</h2>
            <p>Les personnes dévouées qui portent la mission Little Dream au quotidien</p>
            <div className="accent" />
          </div>
          
          {loadingTeam ? (
            <div className="team-loading">Chargement de l'équipe...</div>
          ) : team.length === 0 ? (
            <div className="team-empty">Aucun membre pour le moment</div>
          ) : (
            <div className="team-grid">
              {team.map((member, i) => (
                <div className="team-card" key={member.id}>
                  {member.image_url ? (
                    <img 
                      src={getImageUrl(member.image_url)} 
                      alt={member.name}
                      onError={(e) => {
                        e.target.src = `https://placehold.co/200x200?text=${member.name[0]}`;
                      }}
                    />
                  ) : (
                    <div className="team-placeholder">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h4>{member.name}</h4>
                  <span>{member.position}</span>
                  {member.bio && <p className="team-bio-small">{member.bio.substring(0, 80)}...</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mission-cta">
        <div className="container">
          <FaHandHoldingHeart className="cta-icon" />
          <h2>Ensemble, nous pouvons faire la différence</h2>
          <p>Rejoignez Little Dream en tant que bénévole, donateur ou partenaire</p>
          <Link to="/comment-aider" className="btn btn-primary">Nous soutenir</Link>
        </div>
      </section>
    </main>
  );
}