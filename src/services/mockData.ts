// Mock Data Service for Enterprise CRM

import {
    Agent,
    AgentSkill,
    AgentStatus,
    Case,
    CaseStatus,
    Conversation,
    ConversationChannel,
    ConversationStatus,
    Intent,
    AIInsight,
    Sentiment,
    Priority,
    Ticket,
    TicketStatus,
    User,
    UserTier,
    KPIData,
    TrendData,
    IntentDistribution,
    SentimentDistribution,
    AgentPerformanceData,
    Message,
    DecisionRule,
    SLAConfig,
    AuditLog
} from '../types';

// Helper function to generate random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper function to get random item from array
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// ============ MOCK USERS ============

export const mockUsers: User[] = [
    {
        id: 'user-1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet.yilmaz@email.com',
        phone: '+90 532 123 4567',
        tier: UserTier.VIP,
        createdAt: new Date('2022-03-15'),
        lastActiveAt: new Date(),
        metadata: { preferredChannel: 'web', language: 'tr' }
    },
    {
        id: 'user-2',
        name: 'Fatma Kaya',
        email: 'fatma.kaya@email.com',
        phone: '+90 533 234 5678',
        tier: UserTier.PREMIUM,
        createdAt: new Date('2023-01-20'),
        lastActiveAt: new Date(),
        metadata: { preferredChannel: 'mobile', language: 'tr' }
    },
    {
        id: 'user-3',
        name: 'Mehmet Demir',
        email: 'mehmet.demir@email.com',
        phone: '+90 534 345 6789',
        tier: UserTier.STANDARD,
        createdAt: new Date('2023-06-10'),
        lastActiveAt: new Date(),
        metadata: { preferredChannel: 'whatsapp', language: 'tr' }
    },
    {
        id: 'user-4',
        name: 'Ayşe Öztürk',
        email: 'ayse.ozturk@email.com',
        phone: '+90 535 456 7890',
        tier: UserTier.ENTERPRISE,
        createdAt: new Date('2021-11-05'),
        lastActiveAt: new Date(),
        metadata: { preferredChannel: 'web', language: 'tr' }
    }
];

// ============ MOCK AGENTS ============

export const mockAgents: Agent[] = [
    {
        id: 'agent-1',
        name: 'Ali Vural',
        email: 'ali.vural@company.com',
        avatar: undefined,
        skills: [AgentSkill.TECHNICAL, AgentSkill.FIBER],
        status: AgentStatus.ONLINE,
        currentLoad: 3,
        maxLoad: 5,
        performanceScore: 94,
        teams: ['Teknik Destek'],
        isOnline: true,
        lastActiveAt: new Date()
    },
    {
        id: 'agent-2',
        name: 'Zeynep Arslan',
        email: 'zeynep.arslan@company.com',
        avatar: undefined,
        skills: [AgentSkill.BILLING, AgentSkill.SALES],
        status: AgentStatus.BUSY,
        currentLoad: 5,
        maxLoad: 5,
        performanceScore: 89,
        teams: ['Fatura', 'Satış'],
        isOnline: true,
        lastActiveAt: new Date()
    },
    {
        id: 'agent-3',
        name: 'Can Yıldız',
        email: 'can.yildiz@company.com',
        avatar: undefined,
        skills: [AgentSkill.CANCELLATION, AgentSkill.GENERAL],
        status: AgentStatus.ONLINE,
        currentLoad: 2,
        maxLoad: 5,
        performanceScore: 91,
        teams: ['İptal', 'Genel Destek'],
        isOnline: true,
        lastActiveAt: new Date()
    },
    {
        id: 'agent-4',
        name: 'Elif Şahin',
        email: 'elif.sahin@company.com',
        avatar: undefined,
        skills: [AgentSkill.TECHNICAL, AgentSkill.MOBILE],
        status: AgentStatus.AWAY,
        currentLoad: 0,
        maxLoad: 5,
        performanceScore: 87,
        teams: ['Teknik Destek', 'Mobil'],
        isOnline: false,
        lastActiveAt: new Date(Date.now() - 3600000)
    },
    {
        id: 'agent-5',
        name: 'Burak Koç',
        email: 'burak.koc@company.com',
        avatar: undefined,
        skills: [AgentSkill.BILLING, AgentSkill.GENERAL],
        status: AgentStatus.ONLINE,
        currentLoad: 4,
        maxLoad: 5,
        performanceScore: 92,
        teams: ['Fatura', 'Genel Destek'],
        isOnline: true,
        lastActiveAt: new Date()
    }
];

// ============ MOCK CONVERSATIONS ============

export const mockConversations: Conversation[] = [
    {
        id: 'conv-1',
        userId: 'user-1',
        sessionId: 'session-abc123',
        channel: ConversationChannel.WEB,
        status: ConversationStatus.AGENT_ASSIGNED,
        startTime: new Date(Date.now() - 1800000),
        messages: [
            {
                id: 'msg-1',
                conversationId: 'conv-1',
                sender: 'user',
                content: 'Merhaba, internetim çok yavaş çalışıyor. Fiber bağlantım var ama sürekli kesiliyor.',
                timestamp: new Date(Date.now() - 1800000)
            },
            {
                id: 'msg-2',
                conversationId: 'conv-1',
                sender: 'ai',
                content: 'Merhaba! Fiber internet bağlantınızda yaşadığınız kesinti sorunu için üzgünüm. Size yardımcı olmak için birkaç soru sormam gerekiyor.',
                timestamp: new Date(Date.now() - 1740000)
            },
            {
                id: 'msg-3',
                conversationId: 'conv-1',
                sender: 'user',
                content: 'Modem ışıkları normal görünüyor ama hız testi yaptığımda 5 Mbps çıkıyor. Paketim 100 Mbps!',
                timestamp: new Date(Date.now() - 1680000)
            },
            {
                id: 'msg-4',
                conversationId: 'conv-1',
                sender: 'ai',
                content: 'Anlıyorum, hız düşüklüğü ciddi bir sorun. Teknik ekibimize bağlanmanız gerekiyor. Bir temsilcimiz hemen size yardımcı olacak.',
                timestamp: new Date(Date.now() - 1620000)
            }
        ],
        pageUrl: '/internet-paketleri',
        device: 'web',
        language: 'tr',
        assignedAgentId: 'agent-1'
    },
    {
        id: 'conv-2',
        userId: 'user-2',
        sessionId: 'session-def456',
        channel: ConversationChannel.MOBILE,
        status: ConversationStatus.AI_HANDLING,
        startTime: new Date(Date.now() - 900000),
        messages: [
            {
                id: 'msg-5',
                conversationId: 'conv-2',
                sender: 'user',
                content: 'Faturama itiraz etmek istiyorum. Geçen ay kullanmadığım servisler için ücret kesilmiş.',
                timestamp: new Date(Date.now() - 900000)
            },
            {
                id: 'msg-6',
                conversationId: 'conv-2',
                sender: 'ai',
                content: 'Fatura itirazınızı alıyorum. Hangi servislerin yanlış faturalandığını belirtir misiniz?',
                timestamp: new Date(Date.now() - 840000)
            }
        ],
        pageUrl: '/faturalar',
        device: 'mobile',
        language: 'tr'
    },
    {
        id: 'conv-3',
        userId: 'user-3',
        sessionId: 'session-ghi789',
        channel: ConversationChannel.WHATSAPP,
        status: ConversationStatus.ACTIVE,
        startTime: new Date(Date.now() - 300000),
        messages: [
            {
                id: 'msg-7',
                conversationId: 'conv-3',
                sender: 'user',
                content: 'Paketimi değiştirmek istiyorum. Daha fazla internet kotası olan bir paket var mı?',
                timestamp: new Date(Date.now() - 300000)
            }
        ],
        pageUrl: '/paketler',
        device: 'mobile',
        language: 'tr'
    }
];

// ============ MOCK AI INSIGHTS ============

export const mockAIInsights: AIInsight[] = [
    {
        id: 'insight-1',
        conversationId: 'conv-1',
        intent: Intent.TEKNIK_ARIZA,
        sentiment: Sentiment.FRUSTRATED,
        confidence: 0.94,
        autoResolved: false,
        summary: 'Kullanıcı fiber internet bağlantısında ciddi hız düşüklüğü yaşıyor. 100 Mbps paket olmasına rağmen 5 Mbps hız alıyor. Teknik müdahale gerekiyor.',
        entities: {
            expectedSpeed: '100 Mbps',
            actualSpeed: '5 Mbps',
            connectionType: 'fiber'
        },
        suggestedActions: [
            'Modem reset prosedürü uygulayın',
            'Hat kalitesi kontrolü yapın',
            'Gerekirse teknisyen randevusu oluşturun'
        ],
        timestamp: new Date(Date.now() - 1500000)
    },
    {
        id: 'insight-2',
        conversationId: 'conv-2',
        intent: Intent.FATURA_ITIRAZ,
        sentiment: Sentiment.ANGRY,
        confidence: 0.89,
        autoResolved: false,
        summary: 'Müşteri kullanmadığını iddia ettiği servisler için faturalandırıldığından şikayet ediyor. İnceleme gerekiyor.',
        entities: {
            issueMonth: 'Kasım 2024',
            disputeType: 'Yanlış faturalandırma'
        },
        suggestedActions: [
            'Fatura detaylarını inceleyin',
            'Servis kullanım loglarını kontrol edin',
            'Gerekirse iade işlemi başlatın'
        ],
        timestamp: new Date(Date.now() - 800000)
    },
    {
        id: 'insight-3',
        conversationId: 'conv-3',
        intent: Intent.PAKET_DEGISIM,
        sentiment: Sentiment.NEUTRAL,
        confidence: 0.92,
        autoResolved: false,
        summary: 'Müşteri mevcut paketindeki internet kotasını yetersiz buluyor ve yükseltme yapmak istiyor.',
        entities: {
            requestType: 'Upgrade',
            focus: 'İnternet kotası'
        },
        suggestedActions: [
            'Mevcut kullanım analizi gösterin',
            'Uygun paket önerilerini sunun',
            'Kampanya fırsatlarından bahsedin'
        ],
        timestamp: new Date(Date.now() - 250000)
    }
];

// ============ MOCK CASES ============

export const mockCases: Case[] = [
    {
        id: 'case-1',
        conversationId: 'conv-1',
        userId: 'user-1',
        problemType: Intent.TEKNIK_ARIZA,
        priority: Priority.HIGH,
        status: CaseStatus.IN_PROGRESS,
        assignedTeam: 'Teknik Destek',
        assignedAgentId: 'agent-1',
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 600000),
        aiInsight: mockAIInsights[0],
        notes: [
            {
                id: 'note-1',
                caseId: 'case-1',
                agentId: 'agent-1',
                content: 'Müşteri ile iletişime geçildi. Modem reset denendi ancak sorun çözülmedi.',
                createdAt: new Date(Date.now() - 600000),
                isInternal: true
            }
        ],
        tags: ['fiber', 'hız-sorunu', 'vip-müşteri']
    },
    {
        id: 'case-2',
        conversationId: 'conv-2',
        userId: 'user-2',
        problemType: Intent.FATURA_ITIRAZ,
        priority: Priority.MEDIUM,
        status: CaseStatus.OPEN,
        assignedTeam: 'Fatura',
        createdAt: new Date(Date.now() - 900000),
        updatedAt: new Date(Date.now() - 900000),
        aiInsight: mockAIInsights[1],
        notes: [],
        tags: ['fatura', 'itiraz']
    },
    {
        id: 'case-3',
        conversationId: 'conv-3',
        userId: 'user-3',
        problemType: Intent.PAKET_DEGISIM,
        priority: Priority.LOW,
        status: CaseStatus.OPEN,
        assignedTeam: 'Satış',
        createdAt: new Date(Date.now() - 300000),
        updatedAt: new Date(Date.now() - 300000),
        aiInsight: mockAIInsights[2],
        notes: [],
        tags: ['paket-değişikliği', 'upgrade']
    },
    {
        id: 'case-4',
        conversationId: 'conv-4',
        userId: 'user-4',
        problemType: Intent.IPTAL,
        priority: Priority.CRITICAL,
        status: CaseStatus.ESCALATED,
        assignedTeam: 'İptal',
        assignedAgentId: 'agent-3',
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(Date.now() - 3600000),
        notes: [
            {
                id: 'note-2',
                caseId: 'case-4',
                agentId: 'agent-3',
                content: 'VIP müşteri iptal talebinde bulunuyor. Retention teklifi sunuldu, düşünecek.',
                createdAt: new Date(Date.now() - 3600000),
                isInternal: true
            }
        ],
        tags: ['iptal', 'enterprise', 'retention']
    }
];

// ============ MOCK TICKETS ============

export const mockTickets: Ticket[] = [
    {
        id: 'ticket-1',
        caseId: 'case-1',
        title: 'Fiber Hız Sorunu - Teknisyen Randevusu',
        description: 'Müşterinin fiber bağlantısında ciddi hız düşüklüğü var. Saha ekibi müdahalesi gerekiyor.',
        status: TicketStatus.ASSIGNED,
        priority: Priority.HIGH,
        slaDeadline: new Date(Date.now() + 3600000), // 1 saat sonra
        escalationLevel: 0,
        assignedAgentId: 'agent-1',
        createdAt: new Date(Date.now() - 1200000),
        updatedAt: new Date(Date.now() - 600000)
    },
    {
        id: 'ticket-2',
        caseId: 'case-4',
        title: 'Enterprise Müşteri İptal Talebi - Acil',
        description: 'Enterprise segment müşteri iptal talebinde. Retention süreci başlatıldı.',
        status: TicketStatus.IN_PROGRESS,
        priority: Priority.CRITICAL,
        slaDeadline: new Date(Date.now() + 1800000), // 30 dakika sonra
        escalationLevel: 1,
        assignedAgentId: 'agent-3',
        createdAt: new Date(Date.now() - 5400000),
        updatedAt: new Date(Date.now() - 1800000)
    },
    {
        id: 'ticket-3',
        caseId: 'case-2',
        title: 'Fatura İtirazı İnceleme',
        description: 'Müşteri Kasım 2024 faturasına itiraz ediyor. Servis kullanım logları incelenmeli.',
        status: TicketStatus.OPEN,
        priority: Priority.MEDIUM,
        slaDeadline: new Date(Date.now() + 86400000), // 24 saat sonra
        escalationLevel: 0,
        createdAt: new Date(Date.now() - 600000),
        updatedAt: new Date(Date.now() - 600000)
    }
];

// ============ MOCK DECISION RULES ============

export const mockDecisionRules: DecisionRule[] = [
    {
        id: 'rule-1',
        name: 'Teknik Arıza - Sinirli Müşteri',
        conditions: [
            { field: 'intent', operator: 'equals', value: 'teknik_ariza' },
            { field: 'sentiment', operator: 'equals', value: 'angry' }
        ],
        action: 'route_to_agent',
        priority: 1,
        isActive: true
    },
    {
        id: 'rule-2',
        name: 'VIP Müşteri - Hızlı Yönlendirme',
        conditions: [
            { field: 'user_tier', operator: 'equals', value: 'vip' }
        ],
        action: 'route_to_agent',
        priority: 2,
        isActive: true
    },
    {
        id: 'rule-3',
        name: 'Basit Bilgi Talebi - AI Çözüm',
        conditions: [
            { field: 'intent', operator: 'equals', value: 'bilgi_talebi' },
            { field: 'confidence', operator: 'greater_than', value: 0.9 }
        ],
        action: 'auto_resolve',
        priority: 3,
        isActive: true
    },
    {
        id: 'rule-4',
        name: 'Düşük Güven - Agent Yönlendir',
        conditions: [
            { field: 'confidence', operator: 'less_than', value: 0.7 }
        ],
        action: 'route_to_agent',
        priority: 4,
        isActive: true
    },
    {
        id: 'rule-5',
        name: 'İptal Talebi - Retention',
        conditions: [
            { field: 'intent', operator: 'equals', value: 'iptal' }
        ],
        action: 'route_to_agent',
        priority: 1,
        isActive: true
    }
];

// ============ MOCK SLA CONFIGS ============

export const mockSLAConfigs: SLAConfig[] = [
    {
        problemType: Intent.TEKNIK_ARIZA,
        maxResponseTime: 15,
        maxResolutionTime: 120,
        escalationLevels: [
            { level: 1, afterMinutes: 60, notifyRoles: ['supervisor'] },
            { level: 2, afterMinutes: 90, notifyRoles: ['supervisor', 'manager'] }
        ]
    },
    {
        problemType: Intent.FATURA_ITIRAZ,
        maxResponseTime: 30,
        maxResolutionTime: 1440,
        escalationLevels: [
            { level: 1, afterMinutes: 720, notifyRoles: ['supervisor'] }
        ]
    },
    {
        problemType: Intent.IPTAL,
        maxResponseTime: 5,
        maxResolutionTime: 60,
        escalationLevels: [
            { level: 1, afterMinutes: 30, notifyRoles: ['supervisor', 'retention_manager'] },
            { level: 2, afterMinutes: 45, notifyRoles: ['director'] }
        ]
    }
];

// ============ MOCK KPI DATA ============

export const mockKPIData: KPIData = {
    aiResolutionRate: 68.5,
    agentTransferRate: 31.5,
    avgHandleTime: 8.2,
    avgFirstResponseTime: 12,
    customerSatisfaction: 4.3,
    totalConversations: 1247,
    activeCases: 43,
    pendingTickets: 18
};

// ============ MOCK TREND DATA ============

export const mockConversationTrend: TrendData[] = [
    { date: '2024-12-09', value: 156 },
    { date: '2024-12-10', value: 189 },
    { date: '2024-12-11', value: 167 },
    { date: '2024-12-12', value: 201 },
    { date: '2024-12-13', value: 178 },
    { date: '2024-12-14', value: 145 },
    { date: '2024-12-15', value: 211 }
];

export const mockResolutionTrend: TrendData[] = [
    { date: '2024-12-09', value: 65 },
    { date: '2024-12-10', value: 71 },
    { date: '2024-12-11', value: 68 },
    { date: '2024-12-12', value: 74 },
    { date: '2024-12-13', value: 69 },
    { date: '2024-12-14', value: 72 },
    { date: '2024-12-15', value: 68 }
];

// ============ MOCK INTENT DISTRIBUTION ============

export const mockIntentDistribution: IntentDistribution[] = [
    { intent: Intent.TEKNIK_ARIZA, count: 342, percentage: 27.4 },
    { intent: Intent.FATURA_ITIRAZ, count: 289, percentage: 23.2 },
    { intent: Intent.BILGI_TALEBI, count: 256, percentage: 20.5 },
    { intent: Intent.PAKET_DEGISIM, count: 178, percentage: 14.3 },
    { intent: Intent.SIKAYET, count: 98, percentage: 7.9 },
    { intent: Intent.IPTAL, count: 84, percentage: 6.7 }
];

// ============ MOCK SENTIMENT DISTRIBUTION ============

export const mockSentimentDistribution: SentimentDistribution[] = [
    { sentiment: Sentiment.HAPPY, count: 156, percentage: 12.5 },
    { sentiment: Sentiment.SATISFIED, count: 389, percentage: 31.2 },
    { sentiment: Sentiment.NEUTRAL, count: 423, percentage: 33.9 },
    { sentiment: Sentiment.FRUSTRATED, count: 189, percentage: 15.2 },
    { sentiment: Sentiment.ANGRY, count: 90, percentage: 7.2 }
];

// ============ MOCK AGENT PERFORMANCE ============

export const mockAgentPerformance: AgentPerformanceData[] = [
    { agentId: 'agent-1', agentName: 'Ali Vural', casesHandled: 156, avgHandleTime: 6.8, satisfactionScore: 4.6, resolutionRate: 94 },
    { agentId: 'agent-2', agentName: 'Zeynep Arslan', casesHandled: 143, avgHandleTime: 7.2, satisfactionScore: 4.4, resolutionRate: 89 },
    { agentId: 'agent-3', agentName: 'Can Yıldız', casesHandled: 134, avgHandleTime: 8.1, satisfactionScore: 4.5, resolutionRate: 91 },
    { agentId: 'agent-4', agentName: 'Elif Şahin', casesHandled: 98, avgHandleTime: 9.2, satisfactionScore: 4.2, resolutionRate: 87 },
    { agentId: 'agent-5', agentName: 'Burak Koç', casesHandled: 167, avgHandleTime: 7.5, satisfactionScore: 4.5, resolutionRate: 92 }
];

// ============ MOCK AUDIT LOGS ============

export const mockAuditLogs: AuditLog[] = [
    {
        id: 'log-1',
        action: 'CASE_ASSIGNED',
        userId: 'agent-1',
        targetType: 'case',
        targetId: 'case-1',
        changes: { assignedAgentId: { old: null, new: 'agent-1' } },
        timestamp: new Date(Date.now() - 1500000),
        ipAddress: '192.168.1.100'
    },
    {
        id: 'log-2',
        action: 'CASE_STATUS_CHANGED',
        userId: 'agent-1',
        targetType: 'case',
        targetId: 'case-1',
        changes: { status: { old: 'open', new: 'in_progress' } },
        timestamp: new Date(Date.now() - 1200000),
        ipAddress: '192.168.1.100'
    },
    {
        id: 'log-3',
        action: 'TICKET_CREATED',
        userId: 'system',
        targetType: 'ticket',
        targetId: 'ticket-1',
        changes: {},
        timestamp: new Date(Date.now() - 1200000)
    },
    {
        id: 'log-4',
        action: 'CASE_ESCALATED',
        userId: 'system',
        targetType: 'case',
        targetId: 'case-4',
        changes: { status: { old: 'in_progress', new: 'escalated' }, escalationLevel: { old: 0, new: 1 } },
        timestamp: new Date(Date.now() - 3600000)
    }
];

// ============ HELPER FUNCTIONS ============

export const getAgentById = (id: string): Agent | undefined =>
    mockAgents.find(agent => agent.id === id);

export const getCaseById = (id: string): Case | undefined =>
    mockCases.find(c => c.id === id);

export const getConversationById = (id: string): Conversation | undefined =>
    mockConversations.find(conv => conv.id === id);

export const getTicketsByCaseId = (caseId: string): Ticket[] =>
    mockTickets.filter(ticket => ticket.caseId === caseId);

export const getAIInsightByConversationId = (conversationId: string): AIInsight | undefined =>
    mockAIInsights.find(insight => insight.conversationId === conversationId);

export const getAgentsBySkill = (skill: AgentSkill): Agent[] =>
    mockAgents.filter(agent => agent.skills.includes(skill));

export const getOnlineAgents = (): Agent[] =>
    mockAgents.filter(agent => agent.isOnline && agent.status !== AgentStatus.OFFLINE);

export const getCasesByStatus = (status: CaseStatus): Case[] =>
    mockCases.filter(c => c.status === status);

export const getTicketsByPriority = (priority: Priority): Ticket[] =>
    mockTickets.filter(ticket => ticket.priority === priority);
