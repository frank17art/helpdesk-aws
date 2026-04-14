import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import api from '../api.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const StatCard = ({ label, value, color }) => (
  <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', borderLeft: `4px solid ${color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>{label}</p>
    <p style={{ fontSize: '32px', fontWeight: '700', color }}>{value}</p>
  </div>
)

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/tickets').then(r => setTickets(r.data.slice(0, 5))).catch(() => {})
  }, [])

  if (!stats) return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Chargement...</div>

  const doughnutData = {
    labels: ['Ouverts', 'En cours', 'Resolus', 'Fermes'],
    datasets: [{ data: [stats.open, stats.in_progress, stats.resolved, stats.closed], backgroundColor: ['#2563eb', '#d97706', '#16a34a', '#6b7280'], borderWidth: 0 }]
  }

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>Dashboard</h2>
        <Link to="/tickets" style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>+ Nouveau ticket</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Total" value={stats.total} color="#2563eb" />
        <StatCard label="Ouverts" value={stats.open} color="#2563eb" />
        <StatCard label="En cours" value={stats.in_progress} color="#d97706" />
        <StatCard label="Resolus" value={stats.resolved} color="#16a34a" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Repartition par statut</h3>
          <Doughnut data={doughnutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Tickets critiques</h3>
          <p style={{ fontSize: '64px', fontWeight: '700', color: '#dc2626', marginTop: '40px' }}>{stats.critical}</p>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>tickets critiques actifs</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Derniers tickets</h3>
        {tickets.length === 0 ? <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>Aucun ticket</p> : tickets.map(t => (
          <div key={t.id} style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to={`/tickets/${t.id}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>#{t.id} {t.title}</Link>
            <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', background: '#dbeafe', color: '#1d4ed8' }}>{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
