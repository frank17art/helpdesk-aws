import React, { useState, useEffect } from 'react'
import api from '../api.js'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const toggleActive = async (u) => {
    const res = await api.patch(`/users/${u.id}`, { is_active: !u.is_active })
    setUsers(users.map(x => x.id === u.id ? res.data : x))
  }

  const changeRole = async (u, role) => {
    const res = await api.patch(`/users/${u.id}`, { role })
    setUsers(users.map(x => x.id === u.id ? res.data : x))
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '24px' }}>Utilisateurs ({users.length})</h2>
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              {['Nom', 'Email', 'Role', 'Statut', 'Derniere connexion', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#6b7280', fontWeight: '600' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{u.name}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6b7280' }}>{u.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <select value={u.role} onChange={e => changeRole(u, e.target.value)}
                    style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}>
                    <option value="user">User</option>
                    <option value="tech">Tech</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', background: u.is_active ? '#dcfce7' : '#fee2e2', color: u.is_active ? '#166534' : '#991b1b' }}>
                    {u.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>
                  {u.last_login ? new Date(u.last_login).toLocaleString('fr-CA') : 'Jamais'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => toggleActive(u)} style={{ padding: '5px 12px', fontSize: '12px', cursor: 'pointer', border: 'none', borderRadius: '4px', background: u.is_active ? '#fee2e2' : '#dcfce7', color: u.is_active ? '#dc2626' : '#16a34a' }}>
                    {u.is_active ? 'Desactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
