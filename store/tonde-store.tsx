"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import type { Branch, Language, Organization, SlaThresholds, UserRole } from "@/types/tonde";

const INITIAL_ORG: Organization = {
  id: "org-bcb-01",
  name: "Banque de la République",
  sector: "BANKING",
  country: "Burundi",
  timezone: "Africa/Bujumbura (UTC+2)",
  defaultLanguage: "FR",
  contactEmail: "operations@banque-republique.bi",
};

const INITIAL_BRANCHES: Branch[] = [
  {
    id: "1",
    code: "BUJ-001",
    name: "Banque de la République — Siège",
    city: "Bujumbura",
    address: "Boulevard du 1er Novembre, Centre-Ville",
    status: "active",
    countersCount: 8,
    activeCounters: 6,
    services: ["Ouverture de compte", "Retrait caisse", "Virements", "Prêts & Crédit", "VIP Conseil"],
    waitingTickets: 24,
    avgWaitMinutes: 11,
    avgHandleMinutes: 7,
    noShowRate: 4.2,
    satisfaction: 4.7,
    schedule: {
      weekdays: "07:30 – 17:30",
      saturday: "08:00 – 12:30",
      sunday: "Fermé",
    },
    manager: "Jean-Bosco Ndayishimiye",
    phone: "+257 22 22 51 00",
  },
  {
    id: "2",
    code: "BUJ-002",
    name: "Banque de la République — Rohero",
    city: "Bujumbura",
    address: "Avenue de l’Italie, Rohero I",
    status: "active",
    countersCount: 6,
    activeCounters: 5,
    services: ["Retrait caisse", "Dépôt espèces", "Mobile Money", "Renseignements"],
    waitingTickets: 18,
    avgWaitMinutes: 14,
    avgHandleMinutes: 6,
    noShowRate: 5.8,
    satisfaction: 4.5,
    schedule: {
      weekdays: "08:00 – 17:00",
      saturday: "08:30 – 12:00",
      sunday: "Fermé",
    },
    manager: "Clarisse Niyonzima",
    phone: "+257 22 24 18 40",
  },
  {
    id: "3",
    code: "GIT-001",
    name: "Agence Gitega — Centre",
    city: "Gitega",
    address: "Quartier Musinzira, Route Nationale 2",
    status: "active",
    countersCount: 5,
    activeCounters: 4,
    services: ["Ouverture de compte", "Retrait caisse", "Dépôt espèces", "Microcrédit"],
    waitingTickets: 12,
    avgWaitMinutes: 9,
    avgHandleMinutes: 8,
    noShowRate: 3.1,
    satisfaction: 4.8,
    schedule: {
      weekdays: "07:30 – 16:30",
      saturday: "08:00 – 12:00",
      sunday: "Fermé",
    },
    manager: "Thierry Hakizimana",
    phone: "+257 22 40 21 15",
  },
  {
    id: "4",
    code: "GOM-001",
    name: "Agence Goma Nord",
    city: "Goma",
    address: "Boulevard Kanyamuhanga, Les Volcans",
    status: "active",
    countersCount: 7,
    activeCounters: 5,
    services: ["Change devises", "Retrait caisse", "Virements internationaux", "VIP Conseil"],
    waitingTickets: 31,
    avgWaitMinutes: 17,
    avgHandleMinutes: 9,
    noShowRate: 6.4,
    satisfaction: 4.3,
    schedule: {
      weekdays: "08:00 – 16:30",
      saturday: "08:30 – 13:00",
      sunday: "Fermé",
    },
    manager: "Pascal Kambale",
    phone: "+243 99 410 22 00",
  },
  {
    id: "5",
    code: "NGO-001",
    name: "Agence Ngozi — Marché Central",
    city: "Ngozi",
    address: "Avenue Cathédrale, Ngozi",
    status: "maintenance",
    countersCount: 4,
    activeCounters: 2,
    services: ["Retrait caisse", "Dépôt espèces", "Mobile Money"],
    waitingTickets: 7,
    avgWaitMinutes: 12,
    avgHandleMinutes: 7,
    noShowRate: 4.9,
    satisfaction: 4.4,
    schedule: {
      weekdays: "07:30 – 16:30",
      saturday: "Fermé",
      sunday: "Fermé",
    },
    manager: "Aline Mukamana",
    phone: "+257 22 30 22 90",
  },
];

const INITIAL_SLA: SlaThresholds = {
  maxWaitMinutes: 15,
  maxHandleMinutes: 10,
  maxCounterIdleMinutes: 5,
  maxNoShowPercent: 8,
  audioAnnouncement: true,
  smsFallback: true,
  broadcastBanner:
    "Bienvenue. Munissez-vous de votre pièce d’identité avant de vous présenter au guichet appelé.",
};

interface TondeStoreValue {
  organization: Organization;
  updateOrganization: (patch: Partial<Organization>) => void;
  branches: Branch[];
  activeBranchId: string;
  activeBranch: Branch;
  setActiveBranchId: (id: string) => void;
  addBranch: (branch: Omit<Branch, "id" | "waitingTickets" | "avgWaitMinutes" | "avgHandleMinutes" | "noShowRate" | "satisfaction">) => void;
  updateBranch: (id: string, patch: Partial<Branch>) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  sla: SlaThresholds;
  updateSla: (patch: Partial<SlaThresholds>) => void;
}

const TondeStoreContext = createContext<TondeStoreValue | null>(null);

export function TondeStoreProvider({ children }: { children: React.ReactNode }) {
  const [organization, setOrganization] = useState<Organization>(INITIAL_ORG);
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);
  const [activeBranchId, setActiveBranchId] = useState<string>(INITIAL_BRANCHES[0].id);
  const [lang, setLang] = useState<Language>("FR");
  const [role, setRole] = useState<UserRole>("ADMIN_ORG");
  const [sla, setSla] = useState<SlaThresholds>(INITIAL_SLA);

  const activeBranch = useMemo(
    () => branches.find((b) => b.id === activeBranchId) ?? branches[0],
    [branches, activeBranchId]
  );

  const updateOrganization = (patch: Partial<Organization>) => {
    setOrganization((prev) => ({ ...prev, ...patch }));
  };

  const addBranch: TondeStoreValue["addBranch"] = (input) => {
    const newBranch: Branch = {
      ...input,
      id: `${Date.now()}`,
      waitingTickets: 0,
      avgWaitMinutes: 8,
      avgHandleMinutes: 6,
      noShowRate: 2.5,
      satisfaction: 4.8,
    };
    setBranches((prev) => [newBranch, ...prev]);
    setActiveBranchId(newBranch.id);
  };

  const updateBranch = (id: string, patch: Partial<Branch>) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const updateSla = (patch: Partial<SlaThresholds>) => {
    setSla((prev) => ({ ...prev, ...patch }));
  };

  const value: TondeStoreValue = {
    organization,
    updateOrganization,
    branches,
    activeBranchId,
    activeBranch,
    setActiveBranchId,
    addBranch,
    updateBranch,
    lang,
    setLang,
    role,
    setRole,
    sla,
    updateSla,
  };

  return <TondeStoreContext.Provider value={value}>{children}</TondeStoreContext.Provider>;
}

export function useTondeStore() {
  const ctx = useContext(TondeStoreContext);
  if (!ctx) {
    throw new Error("useTondeStore must be used inside TondeStoreProvider");
  }
  return ctx;
}
