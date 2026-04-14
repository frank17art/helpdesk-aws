import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api.js'

const NexusLogo = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="#C9A84C"/>
    <path d="M10 36V12L24 30V12" stroke="#1B2B5E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 12L38 36" stroke="#1B2B5E" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M10 24H22" stroke="#1B2B5E" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
  </svg>
)

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Identifiants invalides')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Panel gauche - Brand */}
      <div style={{
        width: '42%', background: '#1B2B5E', position: 'relative',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* Pattern géométrique */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.06 }} viewBox="0 0 400 800">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A84C" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="400" height="800" fill="url(#grid)"/>
        </svg>

        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.15)' }}/>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.1)' }}/>
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', border: '1px solid rgba(201,168,76,0.08)' }}/>

        {/* Contenu */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 50px', position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
              <NexusLogo size={52} />
              <div>
                <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>NEXUS Conseil</h1>
                <p style={{ color: '#C9A84C', fontSize: '12px', margin: 0, letterSpacing: '3px', textTransform: 'uppercase' }}>& Associés</p>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div style={{ marginBottom: '48px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Portail IT Service Desk
            </p>
            <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: '700', lineHeight: '1.3', margin: 0 }}>
              Clarté.<br/>
              <span style={{ color: '#C9A84C' }}>Stratégie.</span><br/>
              Excellence.
            </h2>
          </div>

          {/* Services */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
            {[
              { icon: '🏛️', label: 'Conseil fiscal & planification' },
              { icon: '🔍', label: 'Audit & assurance' },
              { icon: '⚡', label: 'Transformation numérique' },
              { icon: '🛡️', label: 'Gestion des risques & conformité' }
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '16px' }}>{s.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Bureaux */}
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Toronto', 'Montréal', 'Vancouver'].map(city => (
              <div key={city} style={{
                padding: '6px 14px', border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.4)'
              }}>
                {city}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 50px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', margin: 0 }}>
            © 2026 NEXUS Conseil & Associés — Confidentiel
          </p>
        </div>
      </div>

      {/* Panel droit - Formulaire */}
      <div style={{
        flex: 1, background: '#fafafa', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '60px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Header form */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ width: '40px', height: '3px', background: '#C9A84C', borderRadius: '2px', marginBottom: '24px' }} />
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Connexion
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              Accès sécurisé au portail IT NEXUS
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '12px 16px', borderRadius: '10px', marginBottom: '24px',
              fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={submit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '700',
                color: '#475569', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase'
              }}>
                Adresse email
              </label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                placeholder="prenom.nom@nexusconseil.ca"
                style={{
                  width: '100%', padding: '13px 16px',
                  border: `2px solid ${focused === 'email' ? '#1B2B5E' : '#e2e8f0'}`,
                  borderRadius: '10px', fontSize: '14px', outline: 'none',
                  background: '#fff', color: '#0f172a',
                  transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block', fontSize: '12px', fontWeight: '700',
                color: '#475569', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase'
              }}>
                Mot de passe
              </label>
              <input
                type="password" required value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                placeholder="••••••••••••"
                style={{
                  width: '100%', padding: '13px 16px',
                  border: `2px solid ${focused === 'password' ? '#1B2B5E' : '#e2e8f0'}`,
                  borderRadius: '10px', fontSize: '14px', outline: 'none',
                  background: '#fff', color: '#0f172a',
                  transition: 'border-color 0.2s', boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                background: loading ? '#94a3b8' : '#1B2B5E', color: '#fff',
                fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.3px', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  Authentification...
                </>
              ) : (
                <>Se connecter →</>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#94a3b8' }}>
            Nouveau collaborateur ?{' '}
            <Link to="/register" style={{ color: '#1B2B5E', fontWeight: '700', textDecoration: 'none' }}>
              Créer un accès
            </Link>
          </p>

          {/* Support info */}
          <div style={{
            marginTop: '40px', padding: '16px 20px',
            background: '#f1f5f9', borderRadius: '10px',
            borderLeft: '3px solid #C9A84C'
          }}>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px', fontWeight: '600' }}>
              Support IT 24/7
            </p>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
              it-support@nexusconseil.ca • Ext. 4800
            </p>
          </div>

          {/* ITIL badge */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {['ITIL v4', 'ISO 27001', 'SOC 2'].map(badge => (
              <span key={badge} style={{
                padding: '4px 10px', background: '#f8fafc',
                border: '1px solid #e2e8f0', borderRadius: '6px',
                fontSize: '11px', color: '#94a3b8', fontWeight: '600'
              }}>{badge}</span>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
