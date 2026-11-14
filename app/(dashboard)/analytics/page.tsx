"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Download,
  FileSpreadsheet,
  Printer,
  Timer,
  TrendingDown,
  Users,
} from "lucide-react";

import { useTondeStore } from "@/store/tonde-store";

type Period = "7d" | "30d" | "90d";

const WEEKLY_SERIES: Record<
  Period,
  { day: string; awt: number; aht: number; tickets: number; noshow: number }[]
> = {
  "7d": [
    { day: "Lun", awt: 14, aht: 7.4, tickets: 420, noshow: 5.2 },
    { day: "Mar", awt: 12, aht: 7.1, tickets: 390, noshow: 4.6 },
    { day: "Mer", awt: 11, aht: 6.9, tickets: 410, noshow: 4.1 },
    { day: "Jeu", awt: 13, aht: 7.2, tickets: 445, noshow: 4.8 },
    { day: "Ven", awt: 15, aht: 7.8, tickets: 510, noshow: 5.6 },
    { day: "Sam", awt: 9, aht: 6.3, tickets: 230, noshow: 3.2 },
    { day: "Aujourd’hui", awt: 11, aht: 6.8, tickets: 388, noshow: 3.9 },
  ],
  "30d": [
    { day: "Sem 1", awt: 15, aht: 7.9, tickets: 2410, noshow: 5.9 },
    { day: "Sem 2", awt: 13, aht: 7.4, tickets: 2580, noshow: 5.1 },
    { day: "Sem 3", awt: 12, aht: 7.0, tickets: 2690, noshow: 4.5 },
    { day: "Sem 4", awt: 11, aht: 6.8, tickets: 2793, noshow: 4.1 },
  ],
  "90d": [
    { day: "Mois M-2", awt: 17, aht: 8.3, tickets: 9840, noshow: 6.8 },
    { day: "Mois M-1", awt: 14, aht: 7.5, tickets: 10420, noshow: 5.2 },
    { day: "Mois en cours", awt: 11, aht: 6.9, tickets: 11120, noshow: 4.2 },
  ],
};

const SERVICE_BREAKDOWN = [
  { service: "Retrait caisse", volume: 1140, awt: 13, aht: 5, noshow: 4.8 },
  { service: "Ouverture de compte", volume: 520, awt: 16, aht: 14, noshow: 3.1 },
  { service: "Dépôt espèces", volume: 890, awt: 9, aht: 4, noshow: 2.9 },
  { service: "Virements", volume: 430, awt: 11, aht: 8, noshow: 3.7 },
  { service: "Prêts & Crédit", volume: 215, awt: 18, aht: 19, noshow: 5.4 },
  { service: "VIP Conseil", volume: 165, awt: 5, aht: 12, noshow: 1.4 },
];

export default function AnalyticsPage() {
  const { branches, activeBranch, sla } = useTondeStore();
  const [period, setPeriod] = useState<Period>("7d");

  const series = WEEKLY_SERIES[period];

  const networkMetrics = useMemo(() => {
    const count = Math.max(1, branches.length);
    const awt = branches.reduce((s, b) => s + b.avgWaitMinutes, 0) / count;
    const aht = branches.reduce((s, b) => s + b.avgHandleMinutes, 0) / count;
    const noshow = branches.reduce((s, b) => s + b.noShowRate, 0) / count;
    const totalVolume = series.reduce((s, d) => s + d.tickets, 0);
    return {
      awt: awt.toFixed(1),
      aht: aht.toFixed(1),
      noshow: noshow.toFixed(1),
      totalVolume,
    };
  }, [branches, series]);

  const exportCsv = () => {
    const headers = [
      "Code Agence",
      "Nom Agence",
      "Ville",
      "Statut",
      "Guichets Actifs",
      "AWT (min)",
      "AHT (min)",
      "No-Show (%)",
      "Satisfaction (/5)",
    ];
    const rows = branches.map((b) => [
      b.code,
      `"${b.name}"`,
      b.city,
      b.status,
      `${b.activeCounters}/${b.countersCount}`,
      b.avgWaitMinutes,
      b.avgHandleMinutes,
      b.noShowRate,
      b.satisfaction,
    ]);
    const csvContent =
      "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tonde-rapport-direction-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 sm:p-7">
      {/* En-tête + Actions d'export */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="app-label">Analytiques &amp; Rapports Direction</p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-brand-deep sm:text-3xl">
            Performance des flux
          </h1>
          <p className="mt-1 text-xs text-brand-soil/60">
            Suivi consolidé AWT, AHT et taux d’absentéisme (no-show) · Focus :{" "}
            <strong className="text-brand-deep">{activeBranch.name}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-brand-forest/15 bg-white p-0.5">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase transition-colors ${
                  period === p
                    ? "bg-brand-forest text-white"
                    : "text-brand-soil/55 hover:text-brand-deep"
                }`}
              >
                {p === "7d" ? "7 jours" : p === "30d" ? "30 jours" : "90 jours"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={exportCsv}
            className="app-btn app-btn-outline"
          >
            <FileSpreadsheet size={14} />
            Export Excel (.CSV)
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="app-btn app-btn-primary"
          >
            <Printer size={14} />
            Rapport PDF
          </button>
        </div>
      </div>

      {/* KPIs Critiques : AWT, AHT, No-Show, Volume */}
      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="app-surface p-5">
          <div className="flex items-center justify-between">
            <span className="app-label">AWT · Attente moyenne</span>
            <Clock size={15} className="text-brand-leaf" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="app-num font-serif text-3xl font-bold text-brand-deep">
              {networkMetrics.awt} <span className="text-sm font-normal text-brand-soil/50">min</span>
            </p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-green/12 px-2 py-0.5 text-[11px] font-bold text-brand-green">
              <ArrowDownRight size={12} />
              −18 %
            </span>
          </div>
          <p className="mt-2 text-[11px] text-brand-soil/50">
            Seuil SLA cible : ≤ {sla.maxWaitMinutes} min
          </p>
        </div>

        <div className="app-surface p-5">
          <div className="flex items-center justify-between">
            <span className="app-label">AHT · Temps traitement</span>
            <Timer size={15} className="text-brand-leaf" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="app-num font-serif text-3xl font-bold text-brand-deep">
              {networkMetrics.aht} <span className="text-sm font-normal text-brand-soil/50">min</span>
            </p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-green/12 px-2 py-0.5 text-[11px] font-bold text-brand-green">
              <ArrowDownRight size={12} />
              −9 %
            </span>
          </div>
          <p className="mt-2 text-[11px] text-brand-soil/50">
            Cible opérationnelle : ≤ {sla.maxHandleMinutes} min
          </p>
        </div>

        <div className="app-surface p-5">
          <div className="flex items-center justify-between">
            <span className="app-label">No-Show · Absentéisme</span>
            <TrendingDown size={15} className="text-brand-leaf" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="app-num font-serif text-3xl font-bold text-brand-deep">
              {networkMetrics.noshow} <span className="text-sm font-normal text-brand-soil/50">%</span>
            </p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-green/12 px-2 py-0.5 text-[11px] font-bold text-brand-green">
              <ArrowDownRight size={12} />
              −2.4 pts
            </span>
          </div>
          <p className="mt-2 text-[11px] text-brand-soil/50">
            Tolérance maximale : {sla.maxNoShowPercent} %
          </p>
        </div>

        <div className="app-surface p-5">
          <div className="flex items-center justify-between">
            <span className="app-label">Tickets servis ({period})</span>
            <Users size={15} className="text-brand-leaf" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="app-num font-serif text-3xl font-bold text-brand-forest">
              {networkMetrics.totalVolume.toLocaleString("fr-FR")}
            </p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-forest/10 px-2 py-0.5 text-[11px] font-bold text-brand-forest">
              <ArrowUpRight size={12} />
              +14 %
            </span>
          </div>
          <p className="mt-2 text-[11px] text-brand-soil/50">
            Sur {branches.length} agences interconnectées
          </p>
        </div>
      </div>

      {/* Graphiques Recharts */}
      <div className="mt-6 grid gap-5 lg:grid-cols-12">
        <div className="app-surface p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="app-label">Trajectoire temporelle</p>
              <h2 className="mt-1 font-serif text-lg font-bold text-brand-deep">
                Évolution AWT (attente) vs AHT (traitement)
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-brand-forest">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-forest" />
                AWT (min)
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#00d4ff]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#00d4ff]" />
                AHT (min)
              </span>
            </div>
          </div>

          <div className="mt-5 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,71,255,0.08)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64708a" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64708a" }} unit="m" />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(108,71,255,0.18)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="awt"
                  name="Attente moy. (AWT)"
                  stroke="#6c47ff"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#6c47ff" }}
                />
                <Line
                  type="monotone"
                  dataKey="aht"
                  name="Traitement moy. (AHT)"
                  stroke="#00d4ff"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#00d4ff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="app-surface p-5 lg:col-span-5">
          <p className="app-label">Charge par guichet métier</p>
          <h2 className="mt-1 font-serif text-lg font-bold text-brand-deep">
            Volume par service
          </h2>

          <div className="mt-5 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={SERVICE_BREAKDOWN}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(108,71,255,0.08)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64708a" }} />
                <YAxis
                  dataKey="service"
                  type="category"
                  width={120}
                  tick={{ fontSize: 11, fill: "#0b0f17" }}
                />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(108,71,255,0.18)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="volume" name="Tickets traités" fill="#6c47ff" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tableau comparatif multi-agences */}
      <div className="app-surface mt-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-forest/10 px-5 py-4">
          <div>
            <p className="app-label">Consolidation multi-tenant</p>
            <h2 className="mt-0.5 font-serif text-lg font-bold text-brand-deep">
              Comparatif des agences du réseau
            </h2>
          </div>
          <button type="button" onClick={exportCsv} className="app-btn app-btn-outline !min-h-[34px]">
            <Download size={13} />
            Télécharger la table
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="app-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Agence</th>
                <th>Ville</th>
                <th>Guichets</th>
                <th>AWT (Attente)</th>
                <th>AHT (Traitement)</th>
                <th>No-Show</th>
                <th>Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => {
                const overSla = b.avgWaitMinutes > sla.maxWaitMinutes;
                return (
                  <tr key={b.id}>
                    <td>
                      <span className="app-num rounded bg-brand-deep px-2 py-0.5 text-[11px] font-extrabold text-brand-sprout">
                        {b.code}
                      </span>
                    </td>
                    <td className="font-semibold text-brand-deep">{b.name}</td>
                    <td className="text-brand-soil/65">{b.city}</td>
                    <td className="app-num font-semibold">
                      {b.activeCounters} / {b.countersCount}
                    </td>
                    <td>
                      <span
                        className={`app-num font-bold ${
                          overSla ? "text-[#f43f5e]" : "text-brand-green"
                        }`}
                      >
                        {b.avgWaitMinutes} min
                      </span>
                    </td>
                    <td className="app-num">{b.avgHandleMinutes} min</td>
                    <td className="app-num">{b.noShowRate} %</td>
                    <td className="app-num font-bold text-brand-forest">{b.satisfaction} / 5</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
