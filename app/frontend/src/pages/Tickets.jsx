import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'

const priorityConfig = {
  critical: { label: 'P1 - Critique', bg: '#fee2e2', color: '#991b1b', dot: '#dc2626' },
  high:     { label: 'P2 - Haut',     bg: '#ffedd5', color: '#9a3412', dot: '#ea580c' },
  medium:   { label: 'P3 - Moyen',    bg: '#fef9c3', color: '#854d0e', dot: '#ca8a04' },
  low:      { label: 'P4 - Bas',      bg: '#dcfce7', color: '#166534', dot: '#16a34a' }
}

const statusConfig = {
  open:        { label: 'Ouvert',    bg: '#dbeafe', color: '#1d4ed8' },
  in_progress: { label: 'En cours', bg: '#fef3c7', color: '#92400e' },
  resolved:    { label: 'Resolu',   bg: '#dcfce7', color: '#166534' },
  closed:      { label: 'Ferme',    bg: '#f3f4f6', color: '#374151' }
}

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', category_id: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/tickets').then(r => setTickets(r.data)).catch(() => {})
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  const filtered = tickets
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => search === '' || t.title.toLowerCase().includes(search.toLowerCase()))

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

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1B2B5E', margin: 0 }}>
            Gestion des incidents
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>
            {tickets.length} incident{tickets.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '12px 24px', background: showForm ? '#64748b' : '#1B2B5E',
          color: '#fff', border: 'none', borderRadius: '10px',
          cursor: 'pointer', fontSize: '14px', fontWeight: '700',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          {showForm ? '✕ Annuler' : '+ Nouvel incident'}
        </button>
      </div>

      {/* Formulaire nouveau ticket */}
      {showForm && (
        <div style={{
          background: '#fff', borderRadius: '14px', padding: '28px',
          marginBottom: '24px', boxShadow: '0 4px 20px rgba(27,43,94,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '4px', height: '24px', background: '#C9A84C', borderRadius: '2px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1B2B5E', margin: 0 }}>
              Declarer un nouvel incident
            </h3>
          </div>
          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Titre de l'incident *
                </label>
                <input required value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  placeholder="Ex: VPN inaccessible bureau Toronto"
                  style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Priorite ITIL
                </label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                  <option value="critical">P1 — Critique</option>
                  <option value="high">P2 — Haut</option>
                  <option value="medium">P3 — Moyen</option>
                  <option value="low">P4 — Bas</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Service concerne
                </label>
                <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                  style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
                  <option value="">Selectionner...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Description detaillee
              </label>
              <textarea value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                rows={3} placeholder="Decrivez l'impact, les utilisateurs affectes, les etapes deja tentees..."
                style={{ width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" disabled={loading} style={{
                padding: '11px 28px', background: '#1B2B5E', color: '#fff',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '700'
              }}>
                {loading ? 'Enregistrement...' : 'Declarer l\'incident'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{
                padding: '11px 20px', background: '#f1f5f9', color: '#64748b',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
              }}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres + Recherche */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Tous' },
            { key: 'open', label: 'Ouverts' },
            { key: 'in_progress', label: 'En cours' },
            { key: 'resolved', label: 'Resolus' },
            { key: 'closed', label: 'Fermes' }
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '7px 16px', borderRadius: '20px', border: 'none',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              background: filter === f.key ? '#1B2B5E' : '#f1f5f9',
              color: filter === f.key ? '#fff' : '#64748b'
            }}>
              {f.label} <span style={{ opacity: 0.7 }}>({counts[f.key]})</span>
            </button>
          ))}
        </div>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un incident..."
          style={{
            padding: '8px 16px', border: '2px solid #e2e8f0', borderRadius: '20px',
            fontSize: '13px', outline: 'none', width: '220px'
          }}
        />
      </div>

      {/* Liste des tickets */}
      <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* En-tete tableau */}
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 160px 130px 130px 100px',
          padding: '12px 20px', background: '#f8fafc',
          borderBottom: '2px solid #f1f5f9'
        }}>
          {['ID', 'Incident', 'Service', 'Priorite', 'Statut', 'Date'].map(h => (
            <span key={h} style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '40px', margin: '0 0 12px' }}>📭</p>
            <p style={{ fontWeight: '600' }}>Aucun incident trouve</p>
          </div>
        ) : filtered.map((t, i) => {
          const p = priorityConfig[t.priority] || priorityConfig.medium
          const s = statusConfig[t.status] || statusConfig.open
          return (
            <div key={t.id} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 160px 130px 130px 100px',
              padding: '16px 20px', borderBottom: '1px solid #f8fafc',
              alignItems: 'center', background: i % 2 === 0 ? '#fff' : '#fafafa'
            }}>
              <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700' }}>#{t.id}</span>
              <div>
                <Link to={`/tickets/${t.id}`} style={{ fontSize: '14px', fontWeight: '600', color: '#1B2B5E', textDecoration: 'none', display: 'block', marginBottom: '3px' }}>
                  {t.title}
                </Link>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {t.user?.name || 'N/A'}
                  {t.assignee && ` → ${t.assignee.name}`}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>{t.category?.name || 'N/A'}</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                background: p.bg, color: p.color, width: 'fit-content'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.dot }} />
                {p.label}
              </span>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                background: s.bg, color: s.color, width: 'fit-content'
              }}>{s.label}</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {new Date(t.created_at).toLocaleDateString('fr-CA')}
              </span>
            </div>
          )
        })}
      </div>

      {/* SLA Legend */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {Object.entries(priorityConfig).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: v.dot }} />
            {v.label} — SLA: {k === 'critical' ? '4h' : k === 'high' ? '8h' : k === 'medium' ? '24h' : '72h'}
          </div>
        ))}
      </div>
    </div>
  )
}
