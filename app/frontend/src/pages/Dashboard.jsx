import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import api from '../api.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const Sparkline = ({ color = '#4F46E5' }) => (
  <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
    <polyline points="0,20 15,16 30,18 45,10 60,14 75,8 90,12 100,6"
      fill="none" stroke={color} strokeWidth="1.5" opacity="0.5"/>
    <circle cx="100" cy="6" r="2.5" fill={color}/>
  </svg>
)

const RingChart = ({ value, max, color }) => {
  const r = 22
  const circ = 2 * Math.PI * r
  const fill = (value / max) * circ
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6"/>
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}/>
    </svg>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [tickets, setTickets] = useState([])
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/tickets').then(r => setTickets(r.data.slice(0, 3))).catch(() => {})
  }, [])

  const now = new Date().toLocaleDateString('fr-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  if (!stats) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #F3F4F6', borderTopColor: '#111827', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }}/>
        <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Chargement...</p>
      </div>
    </div>
  )

  const priorityMap = {
    critical: { label: 'P1', bg: '#FEF2F2', color: '#B91C1C', dot: '#EF4444' },
    high:     { label: 'P2', bg: '#FFF7ED', color: '#C2410C', dot: '#F97316' },
    medium:   { label: 'P3', bg: '#FEFCE8', color: '#A16207', dot: '#EAB308' },
    low:      { label: 'P4', bg: '#F0FDF4', color: '#15803D', dot: '#22C55E' }
  }
  const statusMap = {
    open:        { label: 'Ouvert',    bg: '#EFF6FF', color: '#1D4ED8' },
    in_progress: { label: 'En cours', bg: '#FFFBEB', color: '#92400E' },
    resolved:    { label: 'Résolu',   bg: '#ECFDF5', color: '#065F46' },
    closed:      { label: 'Fermé',    bg: '#F3F4F6', color: '#374151' }
  }

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.3px' }}>
            Tableau de bord
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '3px' }}>
            Bonjour, <strong style={{ color: '#374151' }}>{user.name}</strong> — {now}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '99px', padding: '4px 12px' }}>
            <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}/>
            <span style={{ color: '#059669', fontSize: '11px', fontWeight: '600' }}>Systèmes opérationnels</span>
          </div>
          <Link to="/tickets" style={{
            background: '#111827', color: '#fff', borderRadius: '9px',
            padding: '0 16px', height: '34px', fontSize: '12px', fontWeight: '600',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            + Nouvel incident
          </Link>
        </div>
      </div>

      {/* BENTO KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.5fr', gap: '12px', marginBottom: '14px' }}>

        {/* Total */}
        <div style={{ background: '#fff', border: '1px solid #E4E7EC', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', background: '#EEF2FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
            <span style={{ background: '#F0FDF4', color: '#15803D', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px' }}>+12%</span>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827', letterSpacing: '-1.5px', lineHeight: '1' }}>{stats.total}</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '3px', fontWeight: '500' }}>Total incidents</div>
          </div>
          <Sparkline color="#4F46E5" />
        </div>

        {/* Critiques */}
        <div style={{ background: '#fff', border: '1px solid #E4E7EC', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', background: '#FEF2F2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <span style={{ background: '#FEF2F2', color: '#DC2626', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px' }}>SLA: 4h</span>
          </div>
          <div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#DC2626', letterSpacing: '-1.5px', lineHeight: '1' }}>{stats.critical}</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '3px', fontWeight: '500' }}>P1 — Critiques</div>
          </div>
          <div style={{ height: '4px', background: '#FEE2E2', borderRadius: '99px' }}>
            <div style={{ height: '100%', width: `${Math.min((stats.critical / stats.total) * 100, 100)}%`, background: '#DC2626', borderRadius: '99px' }}/>
          </div>
        </div>

        {/* Ring résolution */}
        <div style={{ background: '#fff', border: '1px solid #E4E7EC', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>Taux résolution</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RingChart value={resolutionRate} max={100} color="#16A34A" />
            <div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#111827', letterSpacing: '-1px', lineHeight: '1' }}>{resolutionRate}%</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '3px' }}>{stats.resolved} / {stats.total} résolus</div>
            </div>
          </div>
          <span style={{ background: '#F0FDF4', color: '#15803D', fontSize: '10px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', width: 'fit-content' }}>ITIL v4 ✓</span>
        </div>

        {/* MTTR dark card */}
        <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: '500', marginBottom: '4px' }}>MTTR — ITIL v4</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#F9FAFB', letterSpacing: '-1px', lineHeight: '1' }}>
                6h <span style={{ fontSize: '13px', color: '#C9A84C', fontWeight: '600' }}>/ 8h obj.</span>
              </div>
            </div>
            <span style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px' }}>SLA ✓</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '36px' }}>
            {[40, 65, 30, 80, 55, 45, 75].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 6 ? '#C9A84C' : '#374151', borderRadius: '3px', height: `${h}%` }}/>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {['L', 'M', 'M', 'J', 'V', 'S', 'A'].map((d, i) => (
              <span key={i} style={{ fontSize: '9px', color: i === 6 ? '#C9A84C' : '#4B5563', fontWeight: i === 6 ? '700' : '400' }}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '12px', marginBottom: '14px' }}>

        {/* Distribution */}
        <div style={{ background: '#fff', border: '1px solid #E4E7EC', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>Par service ITIL</div>
          <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '16px' }}>Catalogue de services</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Accès & Identité', pct: 25, color: '#7C3AED', count: 2 },
              { label: 'Applications métier', pct: 25, color: '#2563EB', count: 2 },
              { label: 'Postes de travail', pct: 25, color: '#D97706', count: 2 },
              { label: 'Sécurité & Conformité', pct: 12, color: '#DC2626', count: 1 },
              { label: 'Réseau', pct: 12, color: '#059669', count: 1 }
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#374151', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color, display: 'inline-block' }}/>
                    {s.label}
                  </span>
                  <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{s.count}</span>
                </div>
                <div style={{ height: '5px', background: '#F3F4F6', borderRadius: '99px' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: '99px' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity timeline */}
        <div style={{ background: '#fff', border: '1px solid #E4E7EC', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Activité temps réel</div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>Équipe IT NEXUS</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#ECFDF5', border: '1px solid #BBF7D0', borderRadius: '99px', padding: '4px 10px' }}>
              <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }}/>
              <span style={{ color: '#059669', fontSize: '10px', fontWeight: '600' }}>Live</span>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '13px', top: 0, bottom: 0, width: '1px', background: '#F3F4F6' }}/>
            {[
              { init: '⚠', bg: '#FEF2F2', border: '#FEE2E2', msg: 'Breach SLA — Ticket #2', sub: 'TaxCycle P1 dépassé • 30 min', alert: true },
              { init: 'MC', bg: '#ECFDF5', border: '#BBF7D0', color: '#065F46', msg: 'Marie-Claire B. a résolu #4', sub: 'Imprimante HP • 4h', status: 'Résolu', sBg: '#ECFDF5', sC: '#065F46' },
              { init: 'JP', bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8', msg: 'Jean-Philippe T. a pris #1', sub: 'VPN Montréal • 1h', status: 'En cours', sBg: '#FFFBEB', sC: '#92400E' },
              { init: 'SN', bg: '#F5F3FF', border: '#DDD6FE', color: '#5B21B6', msg: 'Sophie N. a ouvert #8', sub: 'Certificat SSL • 30 min', status: 'Ouvert', sBg: '#EFF6FF', sC: '#1D4ED8' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < 3 ? '14px' : 0, position: 'relative' }}>
                <div style={{ width: '28px', height: '28px', background: item.bg, border: `2px solid ${item.border}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, fontSize: '10px', fontWeight: '800', color: item.alert ? '#DC2626' : item.color }}>
                  {item.init}
                </div>
                <div style={{ flex: 1, paddingTop: '3px' }}>
                  <div style={{ fontSize: '12px', color: item.alert ? '#DC2626' : '#111827', fontWeight: item.alert ? '600' : '500', marginBottom: '3px' }}>{item.msg}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.status && <span style={{ background: item.sBg, color: item.sC, fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '99px' }}>{item.status}</span>}
                    <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{item.sub}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table incidents */}
      <div style={{ background: '#fff', border: '1px solid #E4E7EC', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>Incidents actifs</span>
            <span style={{ background: '#F3F4F6', color: '#667085', borderRadius: '99px', padding: '2px 8px', fontSize: '11px', fontWeight: '600' }}>
              {stats.open + stats.in_progress} en cours
            </span>
          </div>
          <Link to="/tickets" style={{ color: '#C9A84C', fontSize: '11px', fontWeight: '600', textDecoration: 'none' }}>Voir tout →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 100px 110px 88px 110px', padding: '8px 18px', background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
          {['ID', 'Incident', 'Priorité', 'Statut', 'SLA', 'Assigné'].map(h => (
            <span key={h} style={{ fontSize: '10px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{h}</span>
          ))}
        </div>

        {tickets.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
            <p style={{ fontSize: '32px', margin: '0 0 8px' }}>📭</p>
            <p style={{ fontSize: '13px' }}>Aucun incident actif</p>
          </div>
        ) : tickets.map((t, i) => {
          const p = priorityMap[t.priority] || priorityMap.medium
          const s = statusMap[t.status] || statusMap.open
          return (
            <div key={t.id} style={{
              display: 'grid', gridTemplateColumns: '44px 1fr 100px 110px 88px 110px',
              padding: '12px 18px', borderBottom: i < tickets.length - 1 ? '1px solid #F9FAFB' : 'none',
              alignItems: 'center', background: t.priority === 'critical' && i === 0 ? '#FFFBFB' : '#fff'
            }}>
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: '600' }}>#{t.id}</span>
              <div>
                <Link to={`/tickets/${t.id}`} style={{ fontSize: '12px', color: '#111827', fontWeight: '600', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {t.title}
                </Link>
                <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '1px' }}>{t.category?.name || 'N/A'}</div>
              </div>
              <span style={{ background: p.bg, color: p.color, fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '5px', width: 'fit-content' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: p.dot }}/>
                {p.label}
              </span>
              <span style={{ background: s.bg, color: s.color, fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '99px', width: 'fit-content' }}>{s.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={t.priority === 'critical' ? '#EF4444' : '#D97706'} strokeWidth="2.5">
                  {t.priority === 'critical'
                    ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
                    : <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
                  }
                </svg>
                <span style={{ fontSize: '11px', color: t.priority === 'critical' ? '#EF4444' : '#D97706', fontWeight: '700' }}>
                  {t.priority === 'critical' ? '−2h' : '3h restants'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: '800', color: '#1D4ED8' }}>
                  {t.assignee?.name?.charAt(0) || '?'}
                </div>
                <span style={{ fontSize: '11px', color: '#374151' }}>{t.assignee?.name?.split(' ')[0] || 'N/A'}</span>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
