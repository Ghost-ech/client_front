// src/components/admin/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import API from '../../api';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking'); // checking | ok | denied

  useEffect(() => {
    const token = localStorage.getItem('ld_token');
    if (!token) { setStatus('denied'); return; }
    API.get('/auth/me')
      .then(() => setStatus('ok'))
      .catch(() => { localStorage.removeItem('ld_token'); setStatus('denied'); });
  }, []);

  if (status === 'checking') return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:16 }}>
      <div style={{ width:48, height:48, border:'4px solid #e5e7eb', borderTopColor:'#e63946', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color:'#6b7280' }}>Vérification de session...</p>
    </div>
  );

  if (status === 'denied') return <Navigate to="/admin/login" replace />;
  return children;
}
