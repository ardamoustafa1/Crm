// Chat Widget - Floating Button and Container

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Minimize2 } from 'lucide-react';
import { useConversationStore } from '../../store/conversationStore';
import './ChatWidget.css';

export const ChatWidget: React.FC = () => {
    const { isChatOpen, toggleChat, chatMessages, sendChatMessage } = useConversationStore();
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        sendChatMessage(inputValue);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI typing
        setTimeout(() => setIsTyping(false), 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                className={`chat-widget-button ${isChatOpen ? 'chat-widget-button-hidden' : ''}`}
                onClick={toggleChat}
                aria-label="Open chat"
            >
                <div className="chat-button-inner">
                    <MessageCircle size={24} />
                </div>
                <span className="chat-button-pulse" />
            </button>

            {/* Chat Container */}
            <div className={`chat-widget-container ${isChatOpen ? 'chat-widget-open' : ''}`}>
                {/* Header */}
                <div className="chat-widget-header">
                    <div className="chat-header-info">
                        <div className="chat-header-avatar">
                            <Bot size={20} />
                        </div>
                        <div className="chat-header-text">
                            <span className="chat-header-title">AI Assistant</span>
                            <span className="chat-header-status">
                                <span className="status-dot status-dot-online" />
                                Online
                            </span>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        <button className="chat-header-btn" onClick={toggleChat} aria-label="Minimize">
                            <Minimize2 size={18} />
                        </button>
                        <button className="chat-header-btn" onClick={toggleChat} aria-label="Close">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="chat-widget-messages">
                    {/* Welcome Message */}
                    {chatMessages.length === 0 && (
                        <div className="chat-welcome">
                            <div className="chat-welcome-icon">
                                <Bot size={32} />
                            </div>
                            <h3>Merhaba! 👋</h3>
                            <p>Size nasıl yardımcı olabilirim? Fatura, internet, paket değişikliği veya diğer konularda soru sorabilirsiniz.</p>

                            <div className="chat-quick-actions">
                                <button className="quick-action-btn" onClick={() => sendChatMessage('Fatura sorgulama yapmak istiyorum')}>
                                    📄 Fatura Sorgulama
                                </button>
                                <button className="quick-action-btn" onClick={() => sendChatMessage('İnternet hızımda sorun var')}>
                                    🌐 İnternet Sorunu
                                </button>
                                <button className="quick-action-btn" onClick={() => sendChatMessage('Paket değişikliği yapmak istiyorum')}>
                                    📦 Paket Değişikliği
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Message List */}
                    {chatMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`chat-message ${message.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'}`}
                        >
                            {message.sender === 'ai' && (
                                <div className="message-avatar">
                                    <Bot size={16} />
                                </div>
                            )}
                            <div className="message-bubble">
                                <p className="message-content">{message.content}</p>
                                <span className="message-time">
                                    {new Date(message.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="chat-message chat-message-ai">
                            <div className="message-avatar">
                                <Bot size={16} />
                            </div>
                            <div className="message-bubble typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chat-widget-input">
                    <input
                        type="text"
                        placeholder="Mesajınızı yazın..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="chat-input"
                    />
                    <button
                        className="chat-send-btn"
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatWidget;
