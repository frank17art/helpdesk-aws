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

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const navStyle = (path) => ({
    display: 'block', padding: '10px 16px', borderRadius: '8px',
    textDecoration: 'none', marginBottom: '4px',
    background: location.pathname === path ? '#2563eb' : 'transparent',
    color: location.pathname === path ? '#fff' : '#374151',
    fontWeight: '500', fontSize: '14px'
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      <aside style={{
        width: '240px', background: '#fff', borderRight: '1px solid #e5e7eb',
        padding: '24px 16px', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2563eb' }}>HelpDesk Pro</h1>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Systeme de tickets</p>
        </div>
        <nav style={{ flex: 1 }}>
          <Link to="/" style={navStyle('/')}>Dashboard</Link>
          <Link to="/tickets" style={navStyle('/tickets')}>
            Tickets {notifCount > 0 && (
              <span style={{
                background: '#dc2626', color: '#fff', borderRadius: '10px',
                padding: '1px 6px', fontSize: '11px', marginLeft: '6px'
              }}>{notifCount}</span>
            )}
          </Link>
          {user?.role === 'admin' && (
            <Link to="/users" style={navStyle('/users')}>Utilisateurs</Link>
          )}
        </nav>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>{user?.name}</p>
          <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{user?.role}</p>
          <button onClick={logout} style={{
            width: '100%', padding: '8px', background: '#fee2e2',
            color: '#dc2626', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontSize: '13px', fontWeight: '500'
          }}>Deconnexion</button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
