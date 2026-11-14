"use client";

import { useState, type FormEvent } from "react";
import {
  BellRing,
  Building2,
  Check,
  Globe,
  Radio,
  ShieldCheck,
  Tv,
  Volume2,
} from "lucide-react";

import { getTondeEnv, tondeWs } from "@/lib/tonde-client";
import { useTondeStore } from "@/store/tonde-store";
import type { Language, Organization, UserRole } from "@/types/tonde";

const RBAC_ROLES: {
  role: UserRole;
  title: string;
  scope: string;
  permissions: string[];
}[] = [
  {
    role: "SUPER_ADMIN",
    title: "Super Administrateur (SaaS)",
    scope: "Toutes les organisations & infrastructure",
    permissions: [
      "Provisionnement multi-tenant",
      "Gestion des agences & SLA",
      "Exports analytiques globaux",
      "Diffusion TV & Webhooks",
    ],
  },
  {
    role: "ADMIN_ORG",
    title: "Administrateur Organisation",
    scope: "Ensemble des agences de l’institution",
    permissions: [
      "Création et édition d’agences",
      "Configuration des seuils SLA",
      "Gestion des superviseurs et agents",
      "Rapports direction PDF / CSV",
    ],
  },
  {
    role: "ADMIN_AGENCE",
    title: "Administrateur d’Agence",
    scope: "Agence locale assignée uniquement",
    permissions: [
      "Ouverture / fermeture des guichets",
      "Gestion des horaires locaux",
      "Affectation des agents aux services",
    ],
  },
  {
    role: "SUPERVISEUR",
    title: "Superviseur de Salle",
    scope: "Pilotage temps réel de la file",
    permissions: [
      "Réaffectation de tickets en attente",
      "Suivi des alertes SLA en direct",
      "Consultation des statistiques d’équipe",
    ],
  },
  {
    role: "AGENT",
    title: "Agent de Guichet",
    scope: "Poste guichet assigné",
    permissions: [
      "Appel du prochain ticket",
      "Transfert vers un autre service",
      "Signalement absent (no-show)",
    ],
  },
];

export default function SettingsPage() {
  const {
    organization,
    updateOrganization,
    sla,
    updateSla,
    role,
    setRole,
    lang,
    setLang,
  } = useTondeStore();

  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const envInfo = getTondeEnv();

  const notifySaved = (msg: string) => {
    setSavedNotice(msg);
    window.setTimeout(() => setSavedNotice(null), 2800);
  };

  const handleOrgSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    notifySaved("Paramètres de l’institution enregistrés.");
  };

  const handleSlaSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    tondeWs.emitLocal("BROADCAST_MESSAGE", { message: sla.broadcastBanner });
    notifySaved("Seuils SLA et bandeau TV mis à jour en temps réel.");
  };

  return (
    <div className="p-5 sm:p-7">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="app-label">Gouvernance &amp; Configuration</p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-brand-deep sm:text-3xl">
            Paramètres de l’institution
          </h1>
          <p className="mt-1 text-xs text-brand-soil/60">
            Identité multi-tenant, contrôle d’accès RBAC, seuils d’alerte SLA et diffusion salle d’attente.
          </p>
        </div>

        {savedNotice && (
          <div
            role="status"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green/15 px-4 py-2 text-xs font-bold text-brand-green"
          >
            <Check size={14} />
            {savedNotice}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Colonne Gauche : Identité Organisation + Seuils SLA */}
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Identité de l'institution */}
          <form onSubmit={handleOrgSubmit} className="app-surface p-6">
            <div className="flex items-center gap-2.5 border-b border-brand-forest/10 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-forest">
                <Building2 size={18} />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-deep">
                  Identité de l’institution
                </h2>
                <p className="text-xs text-brand-soil/55">
                  Paramètres appliqués à l’ensemble des agences rattachées
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Raison sociale / Institution
                </label>
                <input
                  value={organization.name}
                  onChange={(e) => updateOrganization({ name: e.target.value })}
                  className="app-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Secteur d’activité
                </label>
                <select
                  value={organization.sector}
                  onChange={(e) =>
                    updateOrganization({
                      sector: e.target.value as Organization["sector"],
                    })
                  }
                  className="app-input"
                >
                  <option value="BANKING">Banque &amp; Microfinance</option>
                  <option value="HEALTHCARE">Hôpital &amp; Santé</option>
                  <option value="PUBLIC_ADMIN">Administration publique</option>
                  <option value="TELECOM">Télécoms &amp; Services</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Pays principal
                </label>
                <input
                  value={organization.country}
                  onChange={(e) => updateOrganization({ country: e.target.value })}
                  className="app-input"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Fuseau horaire
                </label>
                <input
                  value={organization.timezone}
                  onChange={(e) => updateOrganization({ timezone: e.target.value })}
                  className="app-input app-num"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Langue par défaut de l’interface
                </label>
                <select
                  value={lang}
                  onChange={(e) => {
                    const nextLang = e.target.value as Language;
                    setLang(nextLang);
                    updateOrganization({ defaultLanguage: nextLang });
                  }}
                  className="app-input"
                >
                  <option value="FR">Français (FR)</option>
                  <option value="EN">English (EN)</option>
                  <option value="RN">Kirundi (RN)</option>
                  <option value="SW">Kiswahili (SW)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  E-mail d’alerte opérationnelle
                </label>
                <input
                  type="email"
                  value={organization.contactEmail}
                  onChange={(e) => updateOrganization({ contactEmail: e.target.value })}
                  className="app-input"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end border-t border-brand-forest/10 pt-4">
              <button type="submit" className="app-btn app-btn-primary">
                Enregistrer l’organisation
              </button>
            </div>
          </form>

          {/* 2. Seuils SLA & Diffusion Écran Salle (TV) */}
          <form onSubmit={handleSlaSubmit} className="app-surface p-6">
            <div className="flex items-center gap-2.5 border-b border-brand-forest/10 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-forest">
                <BellRing size={18} />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-deep">
                  Seuils d’alerte SLA &amp; Diffusion TV
                </h2>
                <p className="text-xs text-brand-soil/55">
                  Déclenchement automatique des alertes superviseur et bandeau salle d’attente
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Attente critique max (AWT en minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={sla.maxWaitMinutes}
                  onChange={(e) =>
                    updateSla({ maxWaitMinutes: Number(e.target.value) || 15 })
                  }
                  className="app-input app-num"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Durée traitement cible (AHT en minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={sla.maxHandleMinutes}
                  onChange={(e) =>
                    updateSla({ maxHandleMinutes: Number(e.target.value) || 10 })
                  }
                  className="app-input app-num"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Inactivité guichet max (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={sla.maxCounterIdleMinutes}
                  onChange={(e) =>
                    updateSla({ maxCounterIdleMinutes: Number(e.target.value) || 5 })
                  }
                  className="app-input app-num"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Seuil d’alerte No-Show (%)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={sla.maxNoShowPercent}
                  onChange={(e) =>
                    updateSla({ maxNoShowPercent: Number(e.target.value) || 8 })
                  }
                  className="app-input app-num"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-brand-forest/15 bg-brand-canvas px-3.5 py-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-brand-deep">
                  <Volume2 size={15} className="text-brand-leaf" />
                  Annonce vocale sur écran TV
                </span>
                <input
                  type="checkbox"
                  checked={sla.audioAnnouncement}
                  onChange={(e) => updateSla({ audioAnnouncement: e.target.checked })}
                  className="h-4 w-4 accent-brand-forest"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-brand-forest/15 bg-brand-canvas px-3.5 py-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-brand-deep">
                  <Globe size={15} className="text-brand-leaf" />
                  Relais SMS hors-ligne
                </span>
                <input
                  type="checkbox"
                  checked={sla.smsFallback}
                  onChange={(e) => updateSla({ smsFallback: e.target.checked })}
                  className="h-4 w-4 accent-brand-forest"
                />
              </label>
            </div>

            <div className="mt-4">
              <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-brand-soil/75">
                <Tv size={13} className="text-brand-leaf" />
                Message diffusé au bas de l’écran TV salle d’attente (/tv)
              </label>
              <input
                value={sla.broadcastBanner}
                onChange={(e) => updateSla({ broadcastBanner: e.target.value })}
                className="app-input"
              />
            </div>

            <div className="mt-5 flex justify-end border-t border-brand-forest/10 pt-4">
              <button type="submit" className="app-btn app-btn-primary">
                Appliquer les seuils &amp; diffuser
              </button>
            </div>
          </form>
        </div>

        {/* Colonne Droite : RBAC & Infrastructure */}
        <div className="space-y-6 lg:col-span-5">
          {/* 3. Rôles RBAC */}
          <div className="app-surface p-6">
            <div className="flex items-center gap-2.5 border-b border-brand-forest/10 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-forest">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-deep">
                  Contrôle d’accès (RBAC)
                </h2>
                <p className="text-xs text-brand-soil/55">
                  Testez les permissions actives dans le cockpit selon le rôle
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {RBAC_ROLES.map((item) => {
                const isSelected = role === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setRole(item.role)}
                    className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-brand-forest bg-brand-forest/6 ring-1 ring-brand-forest"
                        : "border-brand-forest/12 hover:border-brand-forest/35"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-brand-deep">{item.title}</span>
                      <span className="app-num rounded bg-brand-deep px-2 py-0.5 text-[10px] font-extrabold text-brand-sprout">
                        {item.role}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-brand-soil/60">{item.scope}</p>
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {item.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="rounded bg-white px-2 py-0.5 text-[10px] font-medium text-brand-soil/75"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. État de la liaison API & WebSocket */}
          <div className="app-surface p-6">
            <div className="flex items-center gap-2.5 border-b border-brand-forest/10 pb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-deep text-brand-sprout">
                <Radio size={18} />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-brand-deep">
                  Infrastructure &amp; Temps réel
                </h2>
                <p className="text-xs text-brand-soil/55">
                  Points de terminaison configurés pour l’écosystème TONDE
                </p>
              </div>
            </div>

            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-brand-canvas p-3">
                <dt className="font-semibold text-brand-soil/65">Environnement</dt>
                <dd className="app-num rounded bg-brand-forest/12 px-2 py-0.5 font-extrabold uppercase text-brand-forest">
                  {envInfo.mode}
                </dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-canvas p-3">
                <dt className="font-semibold text-brand-soil/65">REST API</dt>
                <dd className="app-num font-bold text-brand-deep">{envInfo.apiUrl}</dd>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-brand-canvas p-3">
                <dt className="font-semibold text-brand-soil/65">WebSocket</dt>
                <dd className="app-num font-bold text-brand-deep">{envInfo.wsUrl}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
