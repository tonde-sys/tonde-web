'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, type ReactNode } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { AlertTriangle, Clock, Users, TrendingDown, BarChart2, ChevronRight, Pause, Circle, MapPin } from 'lucide-react';

const AgencyMapClient = dynamic(() => import('./AgencyMapClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center bg-brand-cream">
      <p className="text-[13px] text-brand-soil/40">Chargement de la carte…</p>
    </div>
  ),
});

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const affluenceData = [
  { h: '07h', tickets: 12, avg7j: 10 }, { h: '08h', tickets: 34, avg7j: 29 },
  { h: '09h', tickets: 61, avg7j: 55 }, { h: '10h', tickets: 89, avg7j: 82 },
  { h: '11h', tickets: 74, avg7j: 70 }, { h: '12h', tickets: 48, avg7j: 51 },
  { h: '13h', tickets: 39, avg7j: 42 }, { h: '14h', tickets: 93, avg7j: 85 },
  { h: '15h', tickets: 81, avg7j: 79 }, { h: '16h', tickets: 67, avg7j: 63 },
  { h: '17h', tickets: 44, avg7j: 48 }, { h: '18h', tickets: 21, avg7j: 25 },
];

type AgentStatus = 'online' | 'pause' | 'offline';
type Priority = 'standard' | 'priority' | 'urgent' | 'vip';

const agentsData: { id: string; name: string; service: string; status: AgentStatus; tickets: number; guichet: string }[] = [
  { id: 'AGT-01', name: 'Isabelle M.', service: 'Ouverture de compte', status: 'online', tickets: 14, guichet: 'G-01' },
  { id: 'AGT-02', name: 'Rodrigue K.', service: 'Retrait caisse', status: 'online', tickets: 11, guichet: 'G-02' },
  { id: 'AGT-03', name: 'Chantal N.', service: 'Renseignements', status: 'pause', tickets: 9, guichet: 'G-03' },
  { id: 'AGT-04', name: 'Eric B.', service: 'Virements', status: 'offline', tickets: 0, guichet: 'G-04' },
  { id: 'AGT-05', name: 'Diane U.', service: 'Prêts', status: 'online', tickets: 16, guichet: 'G-05' },
  { id: 'AGT-06', name: 'Patrick N.', service: 'Retrait caisse', status: 'online', tickets: 12, guichet: 'G-06' },
  { id: 'AGT-07', name: 'Marie K.', service: 'Ouverture de compte', status: 'pause', tickets: 7, guichet: 'G-07' },
  { id: 'AGT-08', name: 'Jean-Claude M.', service: 'VIP', status: 'online', tickets: 8, guichet: 'G-08' },
];

const alerts = [
  { id: 1, level: 'critical', msg: 'Guichet G-04 inactif depuis plus de 8 minutes', time: 'il y a 3 min' },
  { id: 2, level: 'critical', msg: "File 'Retrait' saturée : temps d'attente > 45 minutes", time: 'il y a 7 min' },
  { id: 3, level: 'warning', msg: 'Note de satisfaction < 2/5 sur 3 dernières interactions', time: 'il y a 12 min' },
  { id: 4, level: 'warning', msg: "Agence Buyenzi — taux d'abandon à 22 %", time: 'il y a 18 min' },
  { id: 5, level: 'info', msg: '3 tickets VIP en attente sans agent assigné', time: 'il y a 21 min' },
];

const ticketsQueue: { id: string; name: string; service: string; wait: string; priority: Priority }[] = [
  { id: 'T-047', name: 'Marie Nkurunziza', service: 'Ouverture de compte', wait: '12:04', priority: 'vip' },
  { id: 'T-048', name: 'Jean-Pierre Habimana', service: 'Retrait caisse', wait: '08:32', priority: 'urgent' },
  { id: 'T-049', name: 'Aline Mukamana', service: 'Renseignements', wait: '05:10', priority: 'priority' },
  { id: 'T-050', name: 'Eric Bizimana', service: "Dépôt d'espèces", wait: '03:45', priority: 'standard' },
  { id: 'T-051', name: 'Diane Uwera', service: 'Virement bancaire', wait: '02:20', priority: 'standard' },
];

// ─────────────────────────────────────────────────────────────────────────────
// STYLE CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  standard: { label: 'Standard', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  priority: { label: 'Prioritaire', color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  urgent: { label: 'Urgence', color: '#f43f5e', bg: 'rgba(244,63,94,0.10)' },
  vip: { label: 'VIP', color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)' },
};

const agentStatusConfig: Record<AgentStatus, { label: string; color: string; bg: string }> = {
  online: { label: 'En ligne', color: '#10b981', bg: 'rgba(16,185,129,0.10)' },
  pause: { label: 'En pause', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  offline: { label: 'Déconnecté', color: '#f43f5e', bg: 'rgba(244,63,94,0.10)' },
};

const alertColor: Record<string, string> = { critical: '#f43f5e', warning: '#f59e0b', info: '#0ea5e9' };

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`app-surface overflow-hidden ${className}`}>{children}</div>;
}

function SectionHeader({ title, meta, action }: { title: string; meta?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-brand-forest/10 px-5 py-3.5">
      <div className="flex items-baseline gap-3">
        <h2 className="font-sans text-[13px] font-semibold text-brand-deep">{title}</h2>
        {meta && <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-soil/35">{meta}</span>}
      </div>
      {action}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  return (
    <span className="app-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-brand-forest/12 bg-white px-3.5 py-2.5 text-[12px] shadow-[0_16px_40px_-24px_rgba(10,14,26,0.4)]">
      <p className="mb-1.5 font-semibold text-brand-soil/50">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-medium" style={{ color: p.color }}>
          {p.name} : <span className="app-num font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE COUNTERS
// ─────────────────────────────────────────────────────────────────────────────

function LiveCounters() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick((t) => t + 1), 5000); return () => clearInterval(id); }, []);

  const waitingCount = 142 + (tick % 3) - 1;
  const kpis = [
    { label: 'Tickets en attente', value: String(waitingCount), icon: Users, tone: '#6c47ff', sub: '+3 depuis 5 min', subTone: 'text-[#f59e0b]' },
    { label: 'Temps moyen de traitement', value: '12m 34s', icon: Clock, tone: '#10b981', sub: '−1 min vs hier', subTone: 'text-[#10b981]' },
    { label: "Taux d'abandon (no-show)", value: '17,4 %', icon: TrendingDown, tone: '#f43f5e', sub: 'Seuil dépassé (> 15 %)', subTone: 'text-[#f43f5e]' },
    { label: 'Productivité horaire', value: '4,2', icon: BarChart2, tone: '#0ea5e9', sub: 'tickets / agent / h', subTone: 'text-brand-soil/40' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {kpis.map((k) => {
        const Icon = k.icon;
        return (
          <div key={k.label} className="app-surface p-5">
            <div className="flex items-start justify-between gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: `${k.tone}12`, color: k.tone }}
              >
                <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className={`max-w-[110px] text-right text-[10px] font-semibold leading-tight ${k.subTone}`}>
                {k.sub}
              </span>
            </div>
            <p className="app-num mt-4 text-[26px] font-semibold leading-none" style={{ color: k.tone }}>
              {k.value}
            </p>
            <p className="mt-2 text-[12px] text-brand-soil/55">{k.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PANELS
// ─────────────────────────────────────────────────────────────────────────────

function AgencyMap() {
  return (
    <Card>
      <SectionHeader title="Carte de santé des agences" meta="5 sites" />
      <AgencyMapClient />
    </Card>
  );
}

function AffluenceChart() {
  return (
    <Card>
      <SectionHeader
        title="Courbe d’affluence"
        meta="aujourd’hui vs moy. 7 jours"
        action={
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-brand-soil/50">
              <span className="h-px w-3 bg-brand-forest" aria-hidden="true" />
              Aujourd’hui
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-brand-soil/50">
              <span className="h-px w-3 bg-brand-soil/25" aria-hidden="true" />
              Moy. 7j
            </span>
          </div>
        }
      />
      <div className="px-2 pb-2 pt-4">
        <ResponsiveContainer width="100%" height={210}>
          <LineChart data={affluenceData} margin={{ top: 5, right: 16, bottom: 0, left: -12 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(108,71,255,0.10)" vertical={false} />
            <XAxis dataKey="h" tick={{ fontSize: 11, fill: 'rgba(11,15,23,0.42)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(11,15,23,0.42)' }} axisLine={false} tickLine={false} />
            <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(108,71,255,0.2)' }} />
            <ReferenceLine x="10h" stroke="#6c47ff" strokeDasharray="4 4" strokeOpacity={0.35} label={{ value: 'Pic matin', fill: '#6c47ff', fontSize: 10, dy: -6 }} />
            <ReferenceLine x="14h" stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.35} label={{ value: 'Pic après-midi', fill: '#f59e0b', fontSize: 10, dy: -6 }} />
            <Line type="monotone" dataKey="tickets" name="Aujourd’hui" stroke="#6c47ff" strokeWidth={2.4} dot={false} activeDot={{ r: 4, fill: '#6c47ff' }} />
            <Line type="monotone" dataKey="avg7j" name="Moy. 7 jours" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function AlertsPanel() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  return (
    <Card>
      <SectionHeader
        title="Alertes & anomalies"
        action={
          visible.length > 0 ? (
            <span className="app-badge bg-[#f43f5e]/10 text-[#f43f5e]">{visible.length}</span>
          ) : undefined
        }
      />
      <div className="space-y-2 p-4">
        {visible.length === 0 && (
          <div className="app-surface-muted px-4 py-6 text-center">
            <p className="text-[13px] text-brand-soil/45">Aucune alerte active</p>
          </div>
        )}
        {visible.map((alert) => (
          <div key={alert.id} className="app-surface-muted flex items-start gap-3 px-3.5 py-3">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" style={{ color: alertColor[alert.level] }} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] leading-relaxed text-brand-soil/85">{alert.msg}</p>
              <p className="mt-0.5 text-[10px] text-brand-soil/40">{alert.time}</p>
            </div>
            <button
              type="button"
              onClick={() => setDismissed((d) => [...d, alert.id])}
              aria-label="Ignorer l’alerte"
              className="shrink-0 text-[15px] leading-none text-brand-soil/30 transition-colors hover:text-brand-forest"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AgentsPanel() {
  return (
    <Card>
      <SectionHeader title="État des guichets & agents" meta={`${agentsData.length} postes`} />
      <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
        {agentsData.map((agent) => {
          const cfg = agentStatusConfig[agent.status];
          return (
            <div key={agent.id} className="app-surface-muted flex items-center gap-3 px-3.5 py-3">
              {agent.status === 'online' && <Circle size={8} className="shrink-0" fill="#10b981" color="#10b981" aria-hidden="true" />}
              {agent.status === 'pause' && <Pause size={11} className="shrink-0 text-[#f59e0b]" aria-hidden="true" />}
              {agent.status === 'offline' && <Circle size={8} className="shrink-0" fill="#f43f5e" color="#f43f5e" aria-hidden="true" />}

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[13px] font-medium text-brand-deep">{agent.name}</p>
                  <span className="app-num shrink-0 text-[10px] text-brand-soil/40">{agent.guichet}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="truncate text-[11px] text-brand-soil/50">{agent.service}</p>
                  <span className="app-badge shrink-0" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
              </div>

              {agent.status !== 'offline' && (
                <div className="shrink-0 text-right">
                  <p className="app-num text-[15px] font-semibold leading-none text-brand-forest">{agent.tickets}</p>
                  <p className="text-[9px] text-brand-soil/40">tickets</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function QueueTable() {
  return (
    <Card>
      <SectionHeader
        title="File d’attente active"
        meta={`${ticketsQueue.length} tickets`}
        action={
          <a href="/queue" className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-leaf hover:text-brand-forest">
            Gérer <ChevronRight size={13} />
          </a>
        }
      />
      <div className="overflow-x-auto">
        <table className="app-table">
          <thead>
            <tr>
              {['Ticket', 'Client', 'Service', 'Attente', 'Priorité'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ticketsQueue.map((t) => {
              const waitMins = parseInt(t.wait.split(':')[0], 10);
              const late = waitMins > 10;
              return (
                <tr key={t.id}>
                  <td className="app-num font-semibold text-brand-forest">{t.id}</td>
                  <td className="font-medium text-brand-deep">{t.name}</td>
                  <td className="text-brand-soil/55">{t.service}</td>
                  <td>
                    <span className={`app-num ${late ? 'font-bold text-[#f43f5e]' : 'text-brand-soil/60'}`}>{t.wait}</span>
                  </td>
                  <td>
                    <PriorityBadge priority={t.priority} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const now = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mx-auto w-full max-w-[1600px] px-5 py-7 sm:px-7">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">
            <span className="kicker-number">Aperçu</span>
            Cockpit de pilotage
          </span>
          <h1 className="display-md mt-3 text-brand-deep">Vue d’ensemble de l’agence</h1>
          <p className="mt-1 text-[13px] capitalize text-brand-soil/50">{now}</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-brand-forest/15 bg-white px-4 py-2">
          <MapPin size={13} className="text-brand-leaf" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-brand-soil/70">Banque de la République — Siège</span>
          <span className="app-num text-[10px] text-brand-soil/40">BUJ-001</span>
        </div>
      </div>

      <LiveCounters />

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AgencyMap />
        <AffluenceChart />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AlertsPanel />
        <QueueTable />
      </div>

      <div className="mt-6">
        <AgentsPanel />
      </div>
    </div>
  );
}
