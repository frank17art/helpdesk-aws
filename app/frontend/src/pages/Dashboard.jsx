import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import api from '../api.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const StatCard = ({ label, value, color, icon, sub }) => (
  <div style={{
    background: '#fff', borderRadius: '14px', padding: '24px',
    borderTop: `4px solid ${color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    display: 'flex', flexDirection: 'column', gap: '8px'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <p style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
      <span style={{ fontSize: '24px' }}>{icon}</span>
    </div>
    <p style={{ fontSize: '36px', fontWeight: '800', color, margin: 0 }}>{value}</p>
    {sub && <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{sub}</p>}
  </div>
)

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/tickets').then(r => setTickets(r.data.slice(0, 5))).catch(() => {})
  }, [])

  if (!stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid #1B2B5E', borderTopColor: '#C9A84C', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6b7280' }}>Chargement du tableau de bord...</p>
      </div>
    </div>
  )

  const doughnutData = {
    labels: ['Ouverts', 'En cours', 'Resolus', 'Fermes'],
    datasets: [{
      data: [stats.open, stats.in_progress, stats.resolved, stats.closed],
      backgroundColor: ['#1B2B5E', '#C9A84C', '#16a34a', '#6b7280'],
      borderWidth: 0, hoverOffset: 4
    }]
  }

  const priorityBadge = (p) => {
    const map = { critical: ['#fee2e2','#991b1b'], high: ['#ffedd5','#9a3412'], medium: ['#fef9c3','#854d0e'], low: ['#dcfce7','#166534'] }
    return map[p] || ['#f3f4f6','#374151']
  }

  const statusBadge = (s) => {
    const map = { open: ['#dbeafe','#1d4ed8'], in_progress: ['#fef3c7','#92400e'], resolved: ['#dcfce7','#166534'], closed: ['#f3f4f6','#374151'] }
    return map[s] || ['#f3f4f6','#374151']
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#1B2B5E', margin: 0 }}>
            Tableau de bord
          </h2>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
            Bonjour, <strong>{user.name}</strong> — Portail IT NEXUS Conseil
          </p>
        </div>
        <Link to="/tickets" style={{
          padding: '12px 24px', background: '#1B2B5E', color: '#fff',
          borderRadius: '10px', textDecoration: 'none', fontSize: '14px',
          fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          + Nouveau ticket
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
        <StatCard label="Total incidents" value={stats.total} color="#1B2B5E" icon="📋" sub="Tous les tickets" />
        <StatCard label="Ouverts" value={stats.open} color="#1B2B5E" icon="🔵" sub="En attente" />
        <StatCard label="En cours" value={stats.in_progress} color="#C9A84C" icon="⚡" sub="Traitement actif" />
        <StatCard label="Resolus" value={stats.resolved} color="#16a34a" icon="✅" sub="Ce mois-ci" />
      </div>

      {/* Graphiques */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px', color: '#1B2B5E' }}>
            Repartition des incidents
          </h3>
          <Doughnut data={doughnutData} options={{
            plugins: { legend: { position: 'bottom', labels: { padding: 20, font: { size: 13 } } } },
            cutout: '65%'
          }} />
        </div>

        <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '24px', color: '#1B2B5E' }}>
            Indicateurs cles
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Taux de resolution', value: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) + '%' : '0%', color: '#16a34a' },
              { label: 'Incidents critiques', value: stats.critical, color: '#dc2626' },
              { label: 'Notifications non lues', value: stats.unread_notifications, color: '#C9A84C' },
              { label: 'Incidents fermes', value: stats.closed, color: '#6b7280' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px' }}>
                <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{item.label}</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Derniers tickets */}
      <div style={{ background: '#fff', borderRadius: '14px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1B2B5E', margin: 0 }}>Incidents recents</h3>
          <Link to="/tickets" style={{ fontSize: '13px', color: '#C9A84C', fontWeight: '600', textDecoration: 'none' }}>
            Voir tout →
          </Link>
        </div>
        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            <p style={{ fontSize: '40px', margin: '0 0 8px' }}>📭</p>
            <p>Aucun incident pour le moment</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f3f4f6' }}>
                {['ID', 'Titre', 'Categorie', 'Priorite', 'Statut', 'Date'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '12px', color: '#9ca3af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => {
                const [pbg, pc] = priorityBadge(t.priority)
                const [sbg, sc] = statusBadge(t.status)
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#9ca3af', fontWeight: '600' }}>#{t.id}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <Link to={`/tickets/${t.id}`} style={{ fontSize: '14px', fontWeight: '600', color: '#1B2B5E', textDecoration: 'none' }}>{t.title}</Link>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#6b7280' }}>{t.category?.name || 'N/A'}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: pbg, color: pc }}>{t.priority}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: sbg, color: sc }}>{t.status}</span>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#9ca3af' }}>
                      {new Date(t.created_at).toLocaleDateString('fr-CA')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
