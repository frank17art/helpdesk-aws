import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'))

  useEffect(() => {
    api.get(`/tickets/${id}`).then(r => setTicket(r.data)).catch(() => navigate('/tickets'))
    api.get(`/comments/ticket/${id}`).then(r => setComments(r.data)).catch(() => {})
  }, [id])

  const updateStatus = async (status) => {
    const res = await api.patch(`/tickets/${id}`, { status })
    setTicket(res.data)
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    const res = await api.post(`/comments/ticket/${id}`, { message: comment })
    setComments([...comments, res.data])
    setComment('')
  }

  if (!ticket) return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Chargement...</div>

  return (
    <div>
      <button onClick={() => navigate('/tickets')} style={{ padding: '8px 16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '24px', fontSize: '14px' }}>
        Retour aux tickets
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>#{ticket.id} {ticket.title}</h2>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{ticket.description}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Commentaires ({comments.length})</h3>
            {comments.map(c => (
              <div key={c.id} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{c.user?.name}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(c.created_at).toLocaleString('fr-CA')}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#1f2937' }}>{c.message}</p>
              </div>
            ))}
            <form onSubmit={addComment} style={{ marginTop: '16px' }}>
              <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Ajouter un commentaire..."
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', marginBottom: '8px' }} />
              <button type="submit" style={{ padding: '8px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Commenter</button>
            </form>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Informations</h3>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>STATUT</p>
            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '13px', background: '#dbeafe', color: '#1d4ed8' }}>{ticket.status}</span>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>PRIORITE</p>
            <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{ticket.priority}</p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>CATEGORIE</p>
            <p style={{ fontSize: '14px', color: '#1f2937' }}>{ticket.category?.name || 'N/A'}</p>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>CREE PAR</p>
            <p style={{ fontSize: '14px', color: '#1f2937' }}>{ticket.user?.name}</p>
          </div>
          {(user.role === 'admin' || user.role === 'tech') && (
            <div>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>CHANGER LE STATUT</p>
              {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                <button key={s} onClick={() => updateStatus(s)} disabled={ticket.status === s}
                  style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '6px', background: ticket.status === s ? '#e5e7eb' : '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', color: ticket.status === s ? '#9ca3af' : '#374151' }}>
                  {s === 'in_progress' ? 'En cours' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
