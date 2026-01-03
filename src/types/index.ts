// Core Types for Enterprise AI-First CRM

// ============ ENUMS ============

export enum ConversationChannel {
  WEB = 'web',
  MOBILE = 'mobile',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram'
}

export enum ConversationStatus {
  ACTIVE = 'active',
  AI_HANDLING = 'ai_handling',
  AGENT_ASSIGNED = 'agent_assigned',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum Intent {
  FATURA_ITIRAZ = 'fatura_itiraz',
  PAKET_DEGISIM = 'paket_degisim',
  TEKNIK_ARIZA = 'teknik_ariza',
  IPTAL = 'iptal',
  BILGI_TALEBI = 'bilgi_talebi',
  SIKAYET = 'sikayet',
  ODEME = 'odeme',
  AKTIVASYON = 'aktivasyon'
}

export enum Sentiment {
  ANGRY = 'angry',
  FRUSTRATED = 'frustrated',
  NEUTRAL = 'neutral',
  SATISFIED = 'satisfied',
  HAPPY = 'happy'
}

export enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum CaseStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  PENDING_CUSTOMER = 'pending_customer',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum AgentStatus {
  ONLINE = 'online',
  BUSY = 'busy',
  AWAY = 'away',
  OFFLINE = 'offline'
}

export enum TicketStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum UserTier {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  VIP = 'vip',
  ENTERPRISE = 'enterprise'
}

export enum AgentSkill {
  TECHNICAL = 'technical',
  BILLING = 'billing',
  SALES = 'sales',
  CANCELLATION = 'cancellation',
  FIBER = 'fiber',
  MOBILE = 'mobile',
  GENERAL = 'general'
}

// ============ INTERFACES ============

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tier: UserTier;
  createdAt: Date;
  lastActiveAt: Date;
  metadata: Record<string, unknown>;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'user' | 'ai' | 'agent';
  content: string;
  timestamp: Date;
  metadata?: {
    agentId?: string;
    isAutoReply?: boolean;
  };
}

export interface Conversation {
  id: string;
  userId?: string;
  sessionId: string;
  channel: ConversationChannel;
  status: ConversationStatus;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
  pageUrl?: string;
  device: string;
  language: string;
  assignedAgentId?: string;
}

export interface AIInsight {
  id: string;
  conversationId: string;
  intent: Intent;
  sentiment: Sentiment;
  confidence: number;
  autoResolved: boolean;
  summary: string;
  entities: Record<string, string>;
  suggestedActions: string[];
  timestamp: Date;
}

export interface Case {
  id: string;
  conversationId: string;
  userId?: string;
  problemType: Intent;
  priority: Priority;
  status: CaseStatus;
  assignedTeam?: string;
  assignedAgentId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  aiInsight?: AIInsight;
  notes: CaseNote[];
  tags: string[];
}

export interface CaseNote {
  id: string;
  caseId: string;
  agentId: string;
  content: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface Ticket {
  id: string;
  caseId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  slaDeadline: Date;
  escalationLevel: number;
  assignedAgentId?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: AgentSkill[];
  status: AgentStatus;
  currentLoad: number;
  maxLoad: number;
  performanceScore: number;
  teams: string[];
  isOnline: boolean;
  lastActiveAt: Date;
}

export interface DecisionRule {
  id: string;
  name: string;
  conditions: DecisionCondition[];
  action: 'route_to_agent' | 'auto_resolve' | 'escalate' | 'queue';
  priority: number;
  isActive: boolean;
}

export interface DecisionCondition {
  field: 'intent' | 'sentiment' | 'confidence' | 'user_tier' | 'sla_status';
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: string | number;
}

export interface RoutingResult {
  conversationId: string;
  assignedAgentId?: string;
  routingReason: string;
  skillMatch: AgentSkill[];
  queuePosition?: number;
  estimatedWaitTime?: number;
  timestamp: Date;
}

export interface SLAConfig {
  problemType: Intent;
  maxResponseTime: number; // in minutes
  maxResolutionTime: number; // in minutes
  escalationLevels: {
    level: number;
    afterMinutes: number;
    notifyRoles: string[];
  }[];
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  targetType: 'case' | 'ticket' | 'conversation' | 'agent' | 'setting';
  targetId: string;
  changes: Record<string, { old: unknown; new: unknown }>;
  timestamp: Date;
  ipAddress?: string;
}

// ============ DASHBOARD TYPES ============

export interface KPIData {
  aiResolutionRate: number;
  agentTransferRate: number;
  avgHandleTime: number;
  avgFirstResponseTime: number;
  customerSatisfaction: number;
  totalConversations: number;
  activeCases: number;
  pendingTickets: number;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface IntentDistribution {
  intent: Intent;
  count: number;
  percentage: number;
}

export interface SentimentDistribution {
  sentiment: Sentiment;
  count: number;
  percentage: number;
}

export interface AgentPerformanceData {
  agentId: string;
  agentName: string;
  casesHandled: number;
  avgHandleTime: number;
  satisfactionScore: number;
  resolutionRate: number;
}

// ============ WIDGET TYPES ============

export interface WidgetConfig {
  sessionId: string;
  userId?: string;
  pageUrl: string;
  device: 'web' | 'mobile';
  language: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}
