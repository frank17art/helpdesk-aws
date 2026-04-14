import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../api.js'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    api.get('/auth/me').then(r => setUser(r.data)).catch(() => {})
    api.get('/notifications').then(r => {
      setNotifCount(r.data.filter(n => !n.is_read).length)
    }).catch(() => {})
  }, [])

  const logout = () => { localStorage.clear(); navigate('/login') }

  const navItem = (path, label, icon) => {
    const active = location.pathname === path
    return (
      <Link to={path} style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '11px 16px', borderRadius: '8px', textDecoration: 'none',
        marginBottom: '4px', fontSize: '14px', fontWeight: '500',
        background: active ? '#C9A84C' : 'transparent',
        color: active ? '#1B2B5E' : 'rgba(255,255,255,0.7)',
        transition: 'all 0.2s'
      }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        {label}
        {label === 'Tickets' && notifCount > 0 && (
          <span style={{
            marginLeft: 'auto', background: '#dc2626', color: '#fff',
            borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: '700'
          }}>{notifCount}</span>
        )}
      </Link>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      <aside style={{
        width: '260px', background: 'linear-gradient(180deg, #1B2B5E 0%, #0d1a3a 100%)',
        display: 'flex', flexDirection: 'column', padding: '0', position: 'fixed',
        height: '100vh', zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', background: '#C9A84C',
              borderRadius: '10px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: '#1B2B5E'
            }}>NCA</div>
            <div>
              <p style={{ color: '#fff', fontWeight: '700', fontSize: '15px', margin: 0 }}>NEXUS Conseil</p>
              <p style={{ color: '#C9A84C', fontSize: '11px', margin: 0, letterSpacing: '1px' }}>& ASSOCIES</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '20px 12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: '600', letterSpacing: '1.5px', padding: '0 8px', marginBottom: '8px' }}>MENU</p>
          {navItem('/', 'Dashboard', '📊')}
          {navItem('/tickets', 'Tickets', '🎫')}
          {user?.role === 'admin' && navItem('/users', 'Utilisateurs', '👥')}
        </nav>

        {/* User info */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px', height: '36px', background: '#C9A84C', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: '700', color: '#1B2B5E'
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p style={{ color: '#fff', fontSize: '13px', fontWeight: '600', margin: 0 }}>{user?.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: 0, textTransform: 'uppercase' }}>{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '9px', background: 'rgba(220,38,38,0.15)',
            color: '#fca5a5', border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500'
          }}>
            Deconnexion
          </button>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', textAlign: 'center', margin: 0 }}>
            IT Support v1.0 — Toronto
          </p>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: '260px', padding: '32px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}
