"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  Check,
  Clock,
  MapPin,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  UserCheck,
  X,
} from "lucide-react";

import { useTondeStore } from "@/store/tonde-store";
import type { Branch } from "@/types/tonde";

const branchSchema = z.object({
  name: z.string().min(3, "Le nom de l’agence doit comporter au moins 3 caractères."),
  code: z
    .string()
    .regex(/^[A-Z]{3}-\d{3}$/, "Format attendu : 3 lettres majuscules + tiret + 3 chiffres (ex. BUJ-003)."),
  city: z.string().min(2, "La ville est requise."),
  address: z.string().min(5, "L’adresse complète est requise."),
  manager: z.string().min(3, "Le nom du responsable d’agence est requis."),
  phone: z.string().min(6, "Le numéro de téléphone est requis."),
  countersCount: z.coerce.number().int().min(1, "Minimum 1 guichet.").max(40, "Maximum 40 guichets."),
  weekdays: z.string().min(5, "Précisez les horaires de semaine."),
  saturday: z.string().min(3, "Précisez les horaires du samedi."),
  servicesRaw: z.string().min(3, "Indiquez au moins un service séparé par une virgule."),
});

type BranchFormValues = z.infer<typeof branchSchema>;

const STATUS_META: Record<
  Branch["status"],
  { label: string; dot: string; text: string; bg: string }
> = {
  active: {
    label: "Opérationnelle",
    dot: "#10b981",
    text: "#10b981",
    bg: "rgba(16,185,129,0.10)",
  },
  maintenance: {
    label: "Maintenance",
    dot: "#f59e0b",
    text: "#f59e0b",
    bg: "rgba(245,158,11,0.10)",
  },
  closed: {
    label: "Fermée",
    dot: "#f43f5e",
    text: "#f43f5e",
    bg: "rgba(244,63,94,0.10)",
  },
};

export default function LocationsPage() {
  const { branches, activeBranch, setActiveBranchId, addBranch, updateBranch, role } =
    useTondeStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Branch["status"]>("all");
  const [selectedId, setSelectedId] = useState<string>(activeBranch.id);
  const [modalOpen, setModalOpen] = useState(false);

  const canManage = role === "SUPER_ADMIN" || role === "ADMIN_ORG" || role === "ADMIN_AGENCE";

  const filtered = useMemo(() => {
    return branches.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.manager.toLowerCase().includes(q)
      );
    });
  }, [branches, search, statusFilter]);

  const selected = useMemo(
    () => branches.find((b) => b.id === selectedId) ?? branches[0],
    [branches, selectedId]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      code: "BUJ-003",
      city: "Bujumbura",
      address: "",
      manager: "",
      phone: "+257 ",
      countersCount: 6,
      weekdays: "07:30 – 17:00",
      saturday: "08:00 – 12:00",
      servicesRaw: "Ouverture de compte, Retrait caisse, Dépôt espèces, Mobile Money",
    },
  });

  const onSubmit = async (values: BranchFormValues) => {
    const services = values.servicesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    addBranch({
      name: values.name,
      code: values.code,
      city: values.city,
      address: values.address,
      manager: values.manager,
      phone: values.phone,
      status: "active",
      countersCount: values.countersCount,
      activeCounters: Math.max(1, values.countersCount - 1),
      services,
      schedule: {
        weekdays: values.weekdays,
        saturday: values.saturday,
        sunday: "Fermé",
      },
    });

    reset();
    setModalOpen(false);
  };

  const totalCounters = branches.reduce((acc, b) => acc + b.countersCount, 0);
  const totalActiveCounters = branches.reduce((acc, b) => acc + b.activeCounters, 0);
  const totalWaiting = branches.reduce((acc, b) => acc + b.waitingTickets, 0);

  return (
    <div className="p-5 sm:p-7">
      {/* En-tête */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="app-label">Réseau multi-sites</p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-brand-deep sm:text-3xl">
            Agences &amp; Guichets
          </h1>
          <p className="mt-1 text-xs text-brand-soil/60">
            Référentiel des implantations physiques, capacité de guichets, services rattachés et horaires.
          </p>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="app-btn app-btn-primary self-start sm:self-auto"
          >
            <Plus size={14} />
            Nouvelle agence
          </button>
        )}
      </div>

      {/* Synthèse KPI Réseau */}
      <div className="mt-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="app-surface p-4">
          <p className="app-label">Sites rattachés</p>
          <p className="app-num mt-2 font-serif text-2xl font-bold text-brand-deep">
            {branches.length}
          </p>
          <p className="mt-1 text-[11px] text-brand-soil/50">
            {branches.filter((b) => b.status === "active").length} opérationnels en direct
          </p>
        </div>
        <div className="app-surface p-4">
          <p className="app-label">Guichets ouverts</p>
          <p className="app-num mt-2 font-serif text-2xl font-bold text-brand-forest">
            {totalActiveCounters} <span className="text-sm font-normal text-brand-soil/40">/ {totalCounters}</span>
          </p>
          <p className="mt-1 text-[11px] text-brand-soil/50">
            Taux d’ouverture {Math.round((totalActiveCounters / Math.max(1, totalCounters)) * 100)} %
          </p>
        </div>
        <div className="app-surface p-4">
          <p className="app-label">Usagers en attente</p>
          <p className="app-num mt-2 font-serif text-2xl font-bold text-brand-deep">
            {totalWaiting}
          </p>
          <p className="mt-1 text-[11px] text-brand-soil/50">Cumul temps réel multi-agences</p>
        </div>
        <div className="app-surface p-4">
          <p className="app-label">Agence active (Cockpit)</p>
          <p className="mt-2 truncate text-sm font-bold text-brand-deep">{activeBranch.name}</p>
          <p className="app-num mt-1 text-[11px] font-semibold text-brand-leaf">
            Code {activeBranch.code} · {activeBranch.city}
          </p>
        </div>
      </div>

      {/* Barre de recherche & filtres */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-soil/40"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par ville, code (BUJ-001) ou responsable…"
            className="app-input pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "active", "maintenance", "closed"] as const).map((st) => {
            const labels = {
              all: "Toutes",
              active: "Opérationnelles",
              maintenance: "Maintenance",
              closed: "Fermées",
            };
            const isCurr = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`app-btn !min-h-[34px] !px-3 ${
                  isCurr ? "app-btn-primary" : "app-btn-outline"
                }`}
              >
                {labels[st]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grille principale : Liste des agences + Fiche détaillée */}
      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          {filtered.map((branch) => {
            const st = STATUS_META[branch.status];
            const isSelected = branch.id === selected.id;
            const isCockpitActive = branch.id === activeBranch.id;

            return (
              <div
                key={branch.id}
                onClick={() => setSelectedId(branch.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedId(branch.id);
                }}
                className={`app-surface cursor-pointer p-5 transition-all ${
                  isSelected
                    ? "ring-2 ring-brand-forest shadow-[0_18px_40px_-24px_rgba(108,71,255,0.35)]"
                    : "hover:border-brand-forest/30"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="app-num rounded-md bg-brand-deep px-2 py-0.5 text-[10px] font-extrabold text-brand-sprout">
                        {branch.code}
                      </span>
                      <span className="text-xs font-semibold text-brand-soil/55">
                        {branch.city}
                      </span>
                      {isCockpitActive && (
                        <span className="rounded-full bg-brand-forest/10 px-2 py-0.5 text-[10px] font-bold text-brand-forest">
                          Cible Cockpit
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 text-base font-bold text-brand-deep">{branch.name}</h2>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-brand-soil/55">
                      <MapPin size={12} className="shrink-0 text-brand-leaf" />
                      {branch.address}
                    </p>
                  </div>

                  <span
                    className="app-badge"
                    style={{ backgroundColor: st.bg, color: st.text }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: st.dot }}
                    />
                    {st.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-brand-forest/10 pt-3.5 text-xs">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-soil/45">
                      Guichets actifs
                    </p>
                    <p className="app-num mt-0.5 font-bold text-brand-deep">
                      {branch.activeCounters} / {branch.countersCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-soil/45">
                      Attente moy. (AWT)
                    </p>
                    <p className="app-num mt-0.5 font-bold text-brand-deep">
                      {branch.avgWaitMinutes} min
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-soil/45">
                      En file
                    </p>
                    <p className="app-num mt-0.5 font-bold text-brand-forest">
                      {branch.waitingTickets} tickets
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Panneau latéral de configuration de l'agence sélectionnée */}
        <div className="lg:col-span-5">
          {selected && (
            <div className="app-surface sticky top-6 p-6">
              <div className="flex items-start justify-between gap-3 border-b border-brand-forest/10 pb-4">
                <div>
                  <span className="app-num text-xs font-extrabold text-brand-leaf">
                    {selected.code} · {selected.city}
                  </span>
                  <h2 className="mt-1 font-serif text-xl font-bold text-brand-deep">
                    {selected.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBranchId(selected.id)}
                  disabled={selected.id === activeBranch.id}
                  className={`app-btn !min-h-[34px] !px-3 ${
                    selected.id === activeBranch.id
                      ? "bg-brand-green/15 text-brand-green"
                      : "app-btn-primary"
                  }`}
                >
                  <Check size={13} />
                  {selected.id === activeBranch.id ? "Agence active" : "Piloter cette agence"}
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-brand-soil/60">
                    <UserCheck size={14} className="text-brand-leaf" />
                    Responsable d’agence
                  </span>
                  <span className="font-semibold text-brand-deep">{selected.manager}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-brand-soil/60">
                    <Phone size={14} className="text-brand-leaf" />
                    Contact direct
                  </span>
                  <span className="app-num font-semibold text-brand-deep">{selected.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-brand-soil/60">
                    <Clock size={14} className="text-brand-leaf" />
                    Lundi – Vendredi
                  </span>
                  <span className="app-num font-semibold text-brand-deep">
                    {selected.schedule.weekdays}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-brand-soil/60">
                    <Clock size={14} className="text-brand-leaf" />
                    Samedi
                  </span>
                  <span className="app-num font-semibold text-brand-deep">
                    {selected.schedule.saturday}
                  </span>
                </div>
              </div>

              {/* Services activés */}
              <div className="mt-6 border-t border-brand-forest/10 pt-5">
                <p className="app-label">Services configurés ({selected.services.length})</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {selected.services.map((srv) => (
                    <span
                      key={srv}
                      className="rounded-lg border border-brand-forest/15 bg-brand-canvas px-2.5 py-1 text-xs font-medium text-brand-deep"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contrôle rapide d'état et de capacité */}
              {canManage && (
                <div className="mt-6 border-t border-brand-forest/10 pt-5">
                  <p className="app-label flex items-center gap-1.5">
                    <SlidersHorizontal size={12} />
                    Pilotage rapide du site
                  </p>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(["active", "maintenance", "closed"] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateBranch(selected.id, { status: st })}
                        className={`rounded-xl border px-3 py-2 text-[11px] font-bold transition-colors ${
                          selected.status === st
                            ? "border-brand-forest bg-brand-forest text-white"
                            : "border-brand-forest/15 text-brand-soil/70 hover:border-brand-forest/40"
                        }`}
                      >
                        {STATUS_META[st].label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-brand-canvas p-3">
                    <span className="text-xs font-medium text-brand-soil/75">
                      Guichets ouverts ({selected.activeCounters}/{selected.countersCount})
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateBranch(selected.id, {
                            activeCounters: Math.max(0, selected.activeCounters - 1),
                          })
                        }
                        className="app-btn app-btn-outline !min-h-[30px] !px-2.5"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateBranch(selected.id, {
                            activeCounters: Math.min(
                              selected.countersCount,
                              selected.activeCounters + 1
                            ),
                          })
                        }
                        className="app-btn app-btn-primary !min-h-[30px] !px-2.5"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de création d'agence (React Hook Form + Zod) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-deep/50 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Créer une nouvelle agence"
        >
          <div className="app-surface max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-forest/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-forest">
                  <Building2 size={18} />
                </span>
                <div>
                  <h2 className="font-serif text-lg font-bold text-brand-deep">
                    Nouvelle agence
                  </h2>
                  <p className="text-xs text-brand-soil/55">
                    Validation stricte Zod · Rattachement multi-tenant automatique
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
                className="rounded-full p-1.5 text-brand-soil/50 hover:bg-brand-forest/10 hover:text-brand-deep"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
              <div className="grid gap-3.5 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                    Nom de l’agence
                  </label>
                  <input
                    {...register("name")}
                    placeholder="Agence Kamenge — Nord"
                    className="app-input"
                  />
                  {errors.name && (
                    <p className="mt-1 text-[11px] text-[#f43f5e]">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                    Code site
                  </label>
                  <input
                    {...register("code")}
                    placeholder="BUJ-003"
                    className="app-input app-num uppercase"
                  />
                  {errors.code && (
                    <p className="mt-1 text-[11px] text-[#f43f5e]">{errors.code.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                    Ville
                  </label>
                  <input {...register("city")} placeholder="Bujumbura" className="app-input" />
                  {errors.city && (
                    <p className="mt-1 text-[11px] text-[#f43f5e]">{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                    Nombre de guichets
                  </label>
                  <input
                    type="number"
                    {...register("countersCount")}
                    className="app-input app-num"
                  />
                  {errors.countersCount && (
                    <p className="mt-1 text-[11px] text-[#f43f5e]">
                      {errors.countersCount.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Adresse physique
                </label>
                <input
                  {...register("address")}
                  placeholder="Avenue de l’Université, Bujumbura"
                  className="app-input"
                />
                {errors.address && (
                  <p className="mt-1 text-[11px] text-[#f43f5e]">{errors.address.message}</p>
                )}
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                    Responsable d’agence
                  </label>
                  <input
                    {...register("manager")}
                    placeholder="Prénom & Nom"
                    className="app-input"
                  />
                  {errors.manager && (
                    <p className="mt-1 text-[11px] text-[#f43f5e]">{errors.manager.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                    Téléphone
                  </label>
                  <input {...register("phone")} className="app-input app-num" />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] text-[#f43f5e]">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                    Horaires Lun – Ven
                  </label>
                  <input {...register("weekdays")} className="app-input app-num" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                    Horaires Samedi
                  </label>
                  <input {...register("saturday")} className="app-input app-num" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-brand-soil/75">
                  Services offerts (séparés par une virgule)
                </label>
                <input {...register("servicesRaw")} className="app-input" />
                {errors.servicesRaw && (
                  <p className="mt-1 text-[11px] text-[#f43f5e]">{errors.servicesRaw.message}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-brand-forest/10 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="app-btn app-btn-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="app-btn app-btn-primary"
                >
                  Enregistrer l’agence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
