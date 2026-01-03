// Login Page

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthPage.css';

export const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, name);
            }
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            await login('agent@crm.com', 'agent123');
            navigate('/');
        } catch (err: any) {
            setError('Demo login failed. Make sure the server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-background">
                <div className="bg-gradient"></div>
                <div className="bg-grid"></div>
            </div>

            <div className="auth-container">
                <div className="auth-card">
                    {/* Logo */}
                    <div className="auth-logo">
                        <div className="logo-icon">
                            <Sparkles size={32} />
                        </div>
                        <h1>CRM Pro</h1>
                        <p>AI-Powered Customer Relationship Management</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(true)}
                        >
                            <LogIn size={18} />
                            Giriş Yap
                        </button>
                        <button
                            className={`auth-tab ${!isLogin ? 'active' : ''}`}
                            onClick={() => setIsLogin(false)}
                        >
                            <UserPlus size={18} />
                            Kayıt Ol
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="auth-form">
                        {!isLogin && (
                            <div className="form-group">
                                <label>
                                    <User size={16} />
                                    Ad Soyad
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Adınızı girin"
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label>
                                <Mail size={16} />
                                E-posta
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <Lock size={16} />
                                Şifre
                            </label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : isLogin ? (
                                <>
                                    <LogIn size={18} />
                                    Giriş Yap
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Kayıt Ol
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo Login */}
                    <div className="auth-divider">
                        <span>veya</span>
                    </div>

                    <button
                        className="demo-login"
                        onClick={handleDemoLogin}
                        disabled={isLoading}
                    >
                        <Sparkles size={18} />
                        Demo Hesabı ile Giriş
                    </button>

                    <p className="demo-hint">
                        Demo: agent@crm.com / agent123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
