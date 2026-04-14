import React, { useState, useEffect } from 'react'
import api from '../api.js'

const roleConfig = {
  admin: { label: 'Administrateur', bg: '#ede9fe', color: '#6d28d9' },
  tech:  { label: 'Technicien',     bg: '#dbeafe', color: '#1d4ed8' },
  user:  { label: 'Collaborateur',  bg: '#f1f5f9', color: '#475569' }
}

export default function Users() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const filtered = users
    .filter(u => filterRole === 'all' || u.role === filterRole)
    .filter(u => search === '' || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  const toggleActive = async (u) => {
    const res = await api.patch(`/users/${u.id}`, { is_active: !u.is_active })
    setUsers(users.map(x => x.id === u.id ? res.data : x))
  }

  const changeRole = async (u, role) => {
    const res = await api.patch(`/users/${u.id}`, { role })
    setUsers(users.map(x => x.id === u.id ? res.data : x))
  }

  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    tech: users.filter(u => u.role === 'tech').length,
    user: users.filter(u => u.role === 'user').length
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1B2B5E', margin: 0 }}>
          Gestion des collaborateurs
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
          {users.length} utilisateur{users.length > 1 ? 's' : ''} — NEXUS Conseil & Associes
        </p>
      </div>

      {/* Stats rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Administrateurs', count: counts.admin, icon: '👑', color: '#6d28d9' },
          { label: 'Techniciens IT', count: counts.tech, icon: '🔧', color: '#1d4ed8' },
          { label: 'Collaborateurs', count: counts.user, icon: '👤', color: '#475569' }
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: '12px', padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex',
            alignItems: 'center', gap: '16px'
          }}>
            <span style={{ fontSize: '28px' }}>{s.icon}</span>
            <div>
              <p style={{ fontSize: '28px', fontWeight: '800', color: s.color, margin: 0 }}>{s.count}</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'all', label: 'Tous' },
            { key: 'admin', label: 'Admins' },
            { key: 'tech', label: 'Techniciens' },
            { key: 'user', label: 'Collaborateurs' }
          ].map(f => (
            <button key={f.key} onClick={() => setFilterRole(f.key)} style={{
              padding: '7px 16px', borderRadius: '20px', border: 'none',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              background: filterRole === f.key ? '#1B2B5E' : '#f1f5f9',
              color: filterRole === f.key ? '#fff' : '#64748b'
            }}>
              {f.label} ({counts[f.key] || filtered.length})
            </button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un collaborateur..."
          style={{ padding: '8px 16px', border: '2px solid #e2e8f0', borderRadius: '20px', fontSize: '13px', outline: 'none', width: '240px' }}
        />
      </div>

      {/* Tableau */}
      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px 160px 120px', padding: '12px 20px', background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
          {['Collaborateur', 'Email', 'Role', 'Statut', 'Derniere connexion', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>

        {filtered.map((u, i) => {
          const r = roleConfig[u.role] || roleConfig.user
          return (
            <div key={u.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px 160px 120px',
              padding: '16px 20px', borderBottom: '1px solid #f8fafc',
              alignItems: 'center', background: i % 2 === 0 ? '#fff' : '#fafafa'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#1B2B5E', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#C9A84C', fontSize: '14px', fontWeight: '700'
                }}>
                  {u.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1B2B5E', margin: 0 }}>{u.name}</p>
                </div>
              </div>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{u.email}</span>
              <div>
                <select value={u.role} onChange={e => changeRole(u, e.target.value)}
                  style={{
                    padding: '5px 10px', border: `1px solid ${r.color}`,
                    borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                    color: r.color, background: r.bg, cursor: 'pointer', outline: 'none'
                  }}>
                  <option value="user">Collaborateur</option>
                  <option value="tech">Technicien</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                background: u.is_active ? '#dcfce7' : '#fee2e2',
                color: u.is_active ? '#166534' : '#991b1b', width: 'fit-content'
              }}>
                {u.is_active ? 'Actif' : 'Inactif'}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {u.last_login ? new Date(u.last_login).toLocaleString('fr-CA') : 'Jamais connecte'}
              </span>
              <button onClick={() => toggleActive(u)} style={{
                padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
                border: 'none', borderRadius: '6px', fontWeight: '600',
                background: u.is_active ? '#fee2e2' : '#dcfce7',
                color: u.is_active ? '#dc2626' : '#16a34a'
              }}>
                {u.is_active ? 'Suspendre' : 'Activer'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Note ITIL */}
      <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', borderLeft: '3px solid #C9A84C' }}>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
          <strong>Note ITIL :</strong> La gestion des acces est conforme aux pratiques ITIL v4 — Gestion des identites et des acces (IAM). Toute modification de role est tracee dans le journal d'activite.
        </p>
      </div>
    </div>
  )
}
