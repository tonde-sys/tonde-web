export type Language = "FR" | "EN" | "RN" | "SW";

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN_ORG"
  | "ADMIN_AGENCE"
  | "SUPERVISEUR"
  | "AGENT"
  | "CLIENT";

export type TicketStatus =
  | "WAITING"
  | "CALLED"
  | "SERVING"
  | "DONE"
  | "ABSENT"
  | "INCOMPLETE";

export type PriorityLevel = "standard" | "priority" | "urgent" | "vip";

export type WsEventType =
  | "TICKET_CREATED"
  | "TICKET_CALLED"
  | "QUEUE_UPDATE"
  | "TICKET_ABSENT"
  | "TICKET_TRANSFERRED"
  | "GUICHET_STATUS"
  | "AGENT_PAUSE"
  | "BROADCAST_MESSAGE";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  detail: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Organization {
  id: string;
  name: string;
  sector: "BANKING" | "HEALTHCARE" | "PUBLIC_ADMIN" | "TELECOM";
  country: string;
  timezone: string;
  defaultLanguage: Language;
  contactEmail: string;
}

export interface BranchSchedule {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string;
  status: "active" | "maintenance" | "closed";
  countersCount: number;
  activeCounters: number;
  services: string[];
  waitingTickets: number;
  avgWaitMinutes: number;
  avgHandleMinutes: number;
  noShowRate: number;
  satisfaction: number;
  schedule: BranchSchedule;
  manager: string;
  phone: string;
}

export interface SlaThresholds {
  maxWaitMinutes: number;
  maxHandleMinutes: number;
  maxCounterIdleMinutes: number;
  maxNoShowPercent: number;
  audioAnnouncement: boolean;
  smsFallback: boolean;
  broadcastBanner: string;
}

export interface WsMessage<TPayload = unknown> {
  event: WsEventType;
  timestamp: string;
  payload: TPayload;
}
