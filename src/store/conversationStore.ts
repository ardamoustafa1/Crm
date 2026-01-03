// Conversation Store - Zustand State Management

import { create } from 'zustand';
import {
    Conversation,
    Case,
    AIInsight,
    Message,
    ConversationStatus
} from '../types';
import {
    mockConversations,
    mockCases,
    mockAIInsights,
    getCaseById
} from '../services/mockData';

interface ConversationState {
    // Data
    conversations: Conversation[];
    cases: Case[];
    aiInsights: AIInsight[];

    // Selection
    selectedConversationId: string | null;
    selectedCaseId: string | null;

    // Actions
    setConversations: (conversations: Conversation[]) => void;
    setCases: (cases: Case[]) => void;
    selectConversation: (id: string | null) => void;
    selectCase: (id: string | null) => void;
    addMessage: (conversationId: string, message: Message) => void;
    updateConversationStatus: (id: string, status: ConversationStatus) => void;
    updateCaseStatus: (id: string, status: Case['status']) => void;

    // Chat Widget
    isChatOpen: boolean;
    chatMessages: Message[];
    toggleChat: () => void;
    sendChatMessage: (content: string) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
    // Initial Data
    conversations: mockConversations,
    cases: mockCases,
    aiInsights: mockAIInsights,

    // Selection State
    selectedConversationId: null,
    selectedCaseId: null,

    // Actions
    setConversations: (conversations) => set({ conversations }),

    setCases: (cases) => set({ cases }),

    selectConversation: (id) => set({
        selectedConversationId: id,
        selectedCaseId: id ? mockCases.find(c => c.conversationId === id)?.id || null : null
    }),

    selectCase: (id) => {
        const caseItem = id ? getCaseById(id) : null;
        set({
            selectedCaseId: id,
            selectedConversationId: caseItem?.conversationId || null
        });
    },

    addMessage: (conversationId, message) => set((state) => ({
        conversations: state.conversations.map(conv =>
            conv.id === conversationId
                ? { ...conv, messages: [...conv.messages, message] }
                : conv
        )
    })),

    updateConversationStatus: (id, status) => set((state) => ({
        conversations: state.conversations.map(conv =>
            conv.id === id ? { ...conv, status } : conv
        )
    })),

    updateCaseStatus: (id, status) => set((state) => ({
        cases: state.cases.map(c =>
            c.id === id ? { ...c, status, updatedAt: new Date() } : c
        )
    })),

    // Chat Widget State
    isChatOpen: false,
    chatMessages: [],

    toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

    sendChatMessage: (content) => {
        const message: Message = {
            id: `msg-${Date.now()}`,
            conversationId: 'widget-session',
            sender: 'user',
            content,
            timestamp: new Date()
        };

        set((state) => ({
            chatMessages: [...state.chatMessages, message]
        }));

        // Simulate AI response after delay
        setTimeout(() => {
            const aiResponse: Message = {
                id: `msg-${Date.now()}`,
                conversationId: 'widget-session',
                sender: 'ai',
                content: getAIResponse(content),
                timestamp: new Date()
            };

            useConversationStore.setState((state) => ({
                chatMessages: [...state.chatMessages, aiResponse]
            }));
        }, 1000);
    }
}));

// Enhanced AI Response System
interface AIResponseResult {
    response: string;
    suggestions?: string[];
    intent?: string;
    shouldEscalate?: boolean;
}

function analyzeIntent(message: string): AIResponseResult {
    const lowerMessage = message.toLowerCase().trim();

    // Greeting patterns
    if (/^(merhaba|selam|hey|günaydın|iyi günler|iyi akşamlar)/i.test(lowerMessage)) {
        return {
            response: 'Merhaba! 👋 Size nasıl yardımcı olabilirim?',
            suggestions: ['Fatura sorgulama', 'İnternet sorunu', 'Paket değiştir'],
            intent: 'greeting'
        };
    }

    // Bill/Invoice related
    if (/fatura|ödeme|borç|bakiye|hesap özeti/i.test(lowerMessage)) {
        return {
            response: '📄 Fatura işlemleri için size yardımcı olabilirim.\n\nMevcut fatura tutarınız: ₺189,90\nSon ödeme tarihi: 25 Aralık 2024\n\nÖdeme yapmak veya detaylı bilgi almak ister misiniz?',
            suggestions: ['Hemen öde', 'Fatura detayı', 'Ödeme geçmişi'],
            intent: 'billing'
        };
    }

    // Internet/Speed issues
    if (/internet|hız|yavaş|bağlantı|kopuyor|çalışmıyor|online/i.test(lowerMessage)) {
        return {
            response: '🌐 İnternet bağlantınızla ilgili hızlı çözümler:\n\n1. Modeminizi yeniden başlatın (30 saniye bekleyin)\n2. WiFi yerine kablo bağlantısı deneyin\n3. Diğer cihazları kontrol edin\n\nSorun devam ediyor mu?',
            suggestions: ['Evet, devam ediyor', 'Hayır, düzeldi', 'Teknisyen talep et'],
            intent: 'technical_support'
        };
    }

    // Package/Plan change
    if (/paket|tarife|değiştir|yükselt|indirim|kampanya/i.test(lowerMessage)) {
        return {
            response: '📦 Mevcut paketiniz: 100 Mbps Fiber\n\nSize özel fırsatlar:\n• 200 Mbps - ₺179/ay (%20 indirimli)\n• 500 Mbps - ₺229/ay (1 ay ücretsiz)\n• 1000 Mbps - ₺299/ay (modem hediye)\n\nHangi paket ilginizi çekti?',
            suggestions: ['200 Mbps seç', '500 Mbps seç', 'Mevcut kalayım'],
            intent: 'package_change'
        };
    }

    // Cancellation (escalation trigger)
    if (/iptal|kapat|vazgeç|sonlandır|çıkmak/i.test(lowerMessage)) {
        return {
            response: '😔 Bizi bırakmanızı istemiyoruz! Size özel bir teklif hazırlamak için müşteri temsilcimize bağlıyorum...',
            suggestions: ['Temsilci ile görüş', 'Önce teklifi duymak istiyorum'],
            intent: 'cancellation',
            shouldEscalate: true
        };
    }

    // Technical issue
    if (/arıza|bozuk|çalışmıyor|sorun|hata|problem/i.test(lowerMessage)) {
        return {
            response: '🔧 Teknik destek için hattınızı kontrol ediyorum...\n\n✅ Hat durumu: Aktif\n✅ Modem: Bağlı\n⚠️ Son 24 saatte 2 kısa kesinti tespit edildi\n\nDetaylı inceleme için arıza kaydı açmamı ister misiniz?',
            suggestions: ['Arıza kaydı aç', 'Daha fazla bilgi', 'Sorun değil'],
            intent: 'technical_issue'
        };
    }

    // Thank you / Positive
    if (/teşekkür|sağol|harika|mükemmel|çok iyi/i.test(lowerMessage)) {
        return {
            response: '😊 Rica ederim! Başka bir konuda yardımcı olabilir miyim?',
            suggestions: ['Hayır, teşekkürler', 'Başka bir sorum var'],
            intent: 'thanks'
        };
    }

    // Complaint / Angry
    if (/şikayet|memnun değil|kötü|berbat|rezalet|kızgın/i.test(lowerMessage)) {
        return {
            response: 'Yaşadığınız sorun için çok üzgünüm. 😔 Şikayetinizi önemsiyoruz ve en kısa sürede çözmek istiyoruz.\n\nSizi hemen bir müşteri temsilcisine bağlıyorum.',
            intent: 'complaint',
            shouldEscalate: true
        };
    }

    // Default / Unknown
    return {
        response: 'Anlıyorum. Size en iyi şekilde yardımcı olabilmem için konuyu biraz daha açar mısınız? 🤔',
        suggestions: ['Fatura işlemleri', 'Teknik destek', 'Paket değişikliği', 'Temsilciye bağlan'],
        intent: 'unknown'
    };
}

function getAIResponse(userMessage: string): string {
    const result = analyzeIntent(userMessage);
    return result.response;
}

