import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', category_id: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/tickets').then(r => setTickets(r.data)).catch(() => {})
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/tickets', form)
      setTickets([res.data, ...tickets])
      setShowForm(false)
      setForm({ title: '', description: '', priority: 'medium', category_id: '' })
    } catch { alert('Erreur creation ticket') }
    finally { setLoading(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>Tickets</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
          {showForm ? 'Annuler' : '+ Nouveau ticket'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Nouveau ticket</h3>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Titre *</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Priorite</label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                  <option value="low">Bas</option>
                  <option value="medium">Moyen</option>
                  <option value="high">Haut</option>
                  <option value="critical">Critique</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Categorie</label>
              <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}>
                <option value="">Selectionnez une categorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})
              } rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }} />
            </div>
            <button type="submit" disabled={loading} style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
              {loading ? 'Creation...' : 'Creer le ticket'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
            background: filter === s ? '#2563eb' : '#e5e7eb', color: filter === s ? '#fff' : '#374151'
          }}>
            {s === 'all' ? 'Tous' : s === 'in_progress' ? 'En cours' : s.charAt(0).toUpperCase() + s.slice(1)}
            {' '}({s === 'all' ? tickets.length : tickets.filter(t => t.status === s).length})
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        {filtered.length === 0 ? <p style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Aucun ticket</p>
        : filtered.map(t => (
          <div key={t.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <Link to={`/tickets/${t.id}`} style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                #{t.id} {t.title}
              </Link>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{t.category?.name || 'Sans categorie'} • {t.user?.name} • {new Date(t.created_at).toLocaleDateString('fr-CA')}</p>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', background: t.priority === 'critical' ? '#fee2e2' : '#f3f4f6', color: t.priority === 'critical' ? '#991b1b' : '#374151' }}>{t.priority}</span>
            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', background: t.status === 'open' ? '#dbeafe' : '#fef3c7', color: t.status === 'open' ? '#1d4ed8' : '#92400e' }}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
