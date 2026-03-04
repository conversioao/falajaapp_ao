import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';

if ('serviceWorker' in navigator) {
    registerSW({ immediate: true });
}
import {
    Mic, FileText, Users, GraduationCap, Zap, Lightbulb, Subtitles, Globe, Play,
    CheckCircle, Menu, X, ArrowRight, Target, Gavel, ListTodo, AlertCircle, Clock,
    CheckSquare, Calendar, MessageSquare, Send, Sparkles, Bot, Search, Lock, Shield,
    FileKey, Home, History, Settings, User, LogOut, UploadCloud, MoreVertical,
    ChevronRight, StopCircle, FileAudio, Bell, PieChart, CreditCard, BookOpen,
    LayoutDashboard, PlusCircle, Activity, TrendingUp, ArrowUpRight, Filter,
    Download, Trash2, Share2, ChevronLeft, MoreHorizontal, Copy, Mail, MessageCircle,
    Check, Smartphone, FileCheck, Loader2, Receipt, Camera, Eye, EyeOff, Save,
    Github, Chrome, HelpCircle, ArrowDownLeft, ArrowUp, Pause, PlayCircle, FileDown,
    Printer, ChevronDown, Edit, AlignLeft, List, SkipBack, SkipForward, Volume2,
    Wand2, Instagram, Briefcase, Gift, ShieldCheck, Key, UserCog, Twitter, Facebook,
    Linkedin, AlertTriangle, Info, Upload, Database, ArrowLeftCircle, Plus,
    Presentation, Stethoscope, Scale, Headphones, Radio, Webhook, Braces, Cpu, Phone, RefreshCw, ArrowLeft
} from 'lucide-react';

const API_URL = (import.meta as any).env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? "http://localhost:3003"
    : "https://falajaao-falaja-backend.11ynya.easypanel.host");

// --- TYPES ---

interface PrescriptionRecord {
    id: number;
    medicine: string;
    dosage: string;
    instructions: string;
}

interface TranscriptionMode {
    id: number;
    name: string;
    multiplier: number;
    description: string;
}

interface CreditPackage {
    id: number;
    name: string;
    price_kz: string | number;
    minutes: number;
    is_active: boolean;
}

interface AdminData {
    payments: any[];
    users: UserProfile[];
    stats: any;
    plans: Plan[];
    modes: TranscriptionMode[];
    creditPackages?: CreditPackage[];
    onlineUsers?: any[];
    suggestions?: any[];
    analytics?: any[];
}

interface Recording {
    id: number;
    title: string;
    date: string;
    duration: string;
    durationSec: number;
    status: 'completed' | 'processing' | 'failed';
    type: string;
    transcription?: string;
    summary?: string;
    actionItems?: string[];
    audioUrl?: string;
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    whatsapp?: string;
    phone: string;
    plan: 'Gratuito' | 'Básico' | 'Premium' | 'Business' | 'Enterprise' | 'Free' | 'Basic';
    credits: number; // minutes available
    usedMinutes: number;
    avatarUrl: string;
    appMode?: 'simple' | 'professional';
    role?: 'user' | 'admin';
}

interface Transaction {
    id: number;
    type: 'credits' | 'plan_upgrade';
    planName?: string;
    amountKz: string;
    transactionId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    proof_url?: string;
}

interface Plan {
    id: number;
    name: string;
    price_kz: number;
    minutes: number;
    features: string[];
    is_popular: boolean;
}

interface ToastMessage {
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
}

// --- UTILS ---

const ToastContainer = ({ toasts, removeToast }: { toasts: ToastMessage[], removeToast: (id: number) => void }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="animate-slide-left pointer-events-auto bg-[#1a1a1a] border border-white/10 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
                    {toast.type === 'success' && <CheckCircle className="text-neon" size={20} />}
                    {toast.type === 'error' && <AlertTriangle className="text-red-500" size={20} />}
                    {toast.type === 'info' && <Info className="text-blue-400" size={20} />}
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="ml-auto text-gray-500 hover:text-white"><X size={16} /></button>
                </div>
            ))}
        </div>
    );
};

// --- LANDING PAGE COMPONENTS ---

const Navbar = ({ onLogin, onSignUp }: { onLogin: () => void, onSignUp: () => void }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                    <img src="/logo.png" alt="falajá.ao" className="h-10 object-contain hover:scale-105 transition-transform" />
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-gray-400 hover:text-neon transition-colors">Funcionalidades</a>
                    <a href="#modes" className="text-sm font-medium text-gray-400 hover:text-neon transition-colors">Modos</a>
                    <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-neon transition-colors">Preços</a>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button onClick={onLogin} className="text-sm font-semibold text-white hover:text-neon transition-colors">
                        Login
                    </button>
                    <button onClick={onSignUp} className="px-6 py-3 rounded-full bg-neon text-black text-sm font-bold hover:bg-neon-hover transition-all hover:scale-105 active:scale-95">
                        Começar Agora
                    </button>
                </div>

                <button
                    className="md:hidden text-gray-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 p-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
                    <a href="#features" className="text-gray-300 hover:text-neon font-medium p-2">Funcionalidades</a>
                    <a href="#modes" className="text-gray-300 hover:text-neon font-medium p-2">Modos</a>
                    <a href="#pricing" className="text-gray-300 hover:text-neon font-medium p-2">Preços</a>
                    <button onClick={onLogin} className="text-left text-white font-medium p-2">Login</button>
                    <button onClick={onSignUp} className="w-full py-4 rounded-full bg-neon text-black font-bold text-center">
                        Começar Agora
                    </button>
                </div>
            )}
        </nav>
    );
};

const Hero = ({ onSignUp }: { onSignUp: () => void }) => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-black">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 hover:border-neon/30 transition-colors cursor-default">
                        <span className="w-2 h-2 rounded-full bg-neon animate-pulse"></span>
                        <span className="text-xs font-bold text-white tracking-wide">NOVA VERSÃO 2.0</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight md:leading-tight mb-6 text-white tracking-tight break-words">
                        Transcrição <br />
                        <span className="text-neon">Inteligente</span> de Áudios.
                    </h1>

                    <p className="text-base md:text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                        Não perca tempo ouvindo. Transforme reuniões, aulas e entrevistas em texto acionável com IA de última geração.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button onClick={onSignUp} className="px-8 py-4 rounded-full bg-neon text-black font-bold text-lg hover:bg-neon-hover transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                            Começar Agora <ArrowRight className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 text-white font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:border-white/20">
                            <Play className="w-5 h-5 fill-white" /> Ver Demo
                        </button>
                    </div>

                    <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="font-medium text-gray-400">Usado por <span className="text-white font-bold">+10k</span> profissionais</p>
                    </div>
                </div>

                <div className="relative lg:h-[600px] flex items-center justify-center animate-float mt-12 lg:mt-0">
                    <div className="relative w-full max-w-lg aspect-[4/5] bg-card-dark rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden p-0 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none z-20"></div>

                        <div className="h-14 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 border-b border-white/5 relative z-10">
                            <div className="text-[10px] font-mono text-gray-500">REC • 04:20</div>
                            <div className="w-16 h-1 bg-white/20 rounded-full"></div>
                            <div className="text-[10px] font-mono text-neon flex items-center gap-1"><div className="w-2 h-2 bg-neon rounded-full animate-pulse"></div> LIVE</div>
                        </div>

                        <div className="p-8 flex flex-col h-full relative">
                            <div className="h-1/3 flex items-center justify-center gap-1.5 mb-8 relative">
                                {[...Array(20)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-2 bg-neon rounded-full animate-pulse"
                                        style={{
                                            height: `${Math.random() * 80 + 20}%`,
                                            animationDelay: `${i * 0.05}s`,
                                            animationDuration: '0.8s',
                                            opacity: Math.random() > 0.5 ? 1 : 0.5
                                        }}
                                    ></div>
                                ))}
                                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                            </div>

                            <div className="flex-1 space-y-4 overflow-hidden mask-gradient-bottom">
                                <div className="flex gap-4 opacity-50">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-2 w-full bg-gray-800 rounded-full"></div>
                                        <div className="h-2 w-3/4 bg-gray-800 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-neon/20 flex items-center justify-center text-neon text-xs font-bold flex-shrink-0">IA</div>
                                    <div className="space-y-2 flex-1">
                                        <p className="text-sm text-white font-medium leading-relaxed">
                                            <span className="text-gray-400">Identificamos 3 pontos chave na reunião: </span>
                                            <br />
                                            1. Otimização do app mobile.<br />
                                            2. Campanha de marketing para Q3.<br />
                                            3. Revisão do orçamento anual.
                                            <span className="inline-block w-1.5 h-4 ml-1 bg-neon animate-pulse align-middle"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 animate-slide-up shadow-lg">
                                <div className="w-10 h-10 rounded-full overflow-hidden shadow-[0_0_15px_rgba(204,255,0,0.4)]">
                                    <img src="/favicon.png" alt="Icon" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Processando</p>
                                    <p className="text-sm text-white font-bold">Gerando Relatório...</p>
                                </div>
                                <div className="ml-auto">
                                    <Loader2 className="text-neon animate-spin w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SocialProof = () => (
    <section className="py-12 border-y border-white/5 bg-black">
        <div className="container mx-auto px-6 text-center">
            <p className="text-xs font-bold text-gray-600 mb-10 tracking-[0.2em] uppercase">Empresas que confiam na Fala Já</p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {"TechGlobal AudioGen PodcastPro EduTech CorpSpeak MediaFlow".split(" ").map((c, i) => (
                    <div key={i} className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full"></div>{c}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Features = () => (
    <section className="py-24 bg-black relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="inline-block px-4 py-2 rounded-full bg-neon/10 border border-neon/20 mb-6">
                <span className="text-neon font-bold text-xs uppercase tracking-wider">TECNOLOGIA</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Eficiência Explicada</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Descubra como a nossa tecnologia de Inteligência Artificial simplifica, organiza e agiliza suas transcrições diariamente.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
                {[
                    { icon: <FileText size={24} />, title: "Rápido", desc: "Transcrições em tempo real e entrega imediata dos resultados." },
                    { icon: <Users size={24} />, title: "Colaborativo", desc: "Compartilhe facilmente resumos e insights com a sua equipe." },
                    { icon: <Mic size={24} />, title: "Eficaz", desc: "Captação nítida do áudio mesmo em ambientes com barulho de fundo." },
                    { icon: <GraduationCap size={24} />, title: "Intuitivo", desc: "Plataforma fácil de usar, feita para poupar o máximo do seu tempo." }
                ].map((feature, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-left hover:bg-white/10 transition-colors group">
                        <div className="w-12 h-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-neon mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                        <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const SmartSummary = () => (
    <section id="features" className="py-24 relative bg-[#080808] border-y border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
                <div className="inline-block p-3 rounded-2xl bg-neon/10 text-neon mb-6"><Sparkles size={24} /></div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Resumo Inteligente</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Transformamos horas de áudio em segundos de leitura. Nossa tecnologia lê o conteúdo, entende o contexto e extrai apenas o que realmente importa.
                </p>
                <ul className="space-y-4">
                    {["Destaque de pontos chave", "Eliminação de redundâncias", "Formatação estruturada"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-white font-medium">
                            <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center text-neon"><Check size={14} /></div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="relative">
                <div className="absolute top-0 left-4 right-4 h-full bg-white/5 rounded-3xl border border-white/5 p-6 opacity-50 scale-95 -translate-y-4 blur-[1px]"></div>

                <div className="relative bg-card-dark rounded-3xl border border-white/10 p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neon flex items-center justify-center text-black font-bold"><Bot size={20} /></div>
                            <div>
                                <p className="text-white font-bold text-sm">IA Fala Já</p>
                                <p className="text-xs text-gray-500">Resumo Gerado</p>
                            </div>
                        </div>
                        <span className="text-xs font-mono text-neon bg-neon/10 px-2 py-1 rounded">2s atrás</span>
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 w-3/4 bg-gray-700 rounded-full"></div>
                        <div className="h-2 w-full bg-gray-800 rounded-full"></div>
                        <div className="h-2 w-5/6 bg-gray-800 rounded-full"></div>
                        <div className="mt-4 flex gap-2">
                            <span className="h-6 w-20 bg-blue-500/20 rounded-md border border-blue-500/30"></span>
                            <span className="h-6 w-24 bg-purple-500/20 rounded-md border border-purple-500/30"></span>
                        </div>
                    </div>
                    <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/5">
                        <p className="text-sm text-gray-300 italic">"O projeto foi aprovado com um orçamento de 15k e o prazo final é para a próxima sexta-feira."</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const DecisionsSection = () => (
    <section className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="order-2 lg:order-1 relative">
                    <div className="absolute inset-0 bg-neon/5 blur-3xl rounded-full"></div>
                    <div className="relative bg-[#111] border border-white/10 rounded-[2rem] p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/5 rounded-xl"><ListTodo className="text-white" /></div>
                            <h3 className="text-white font-bold">Plano de Ação</h3>
                        </div>
                        <div className="space-y-3">
                            {[
                                { text: "Enviar contrato para cliente", checked: true },
                                { text: "Agendar reunião de follow-up", checked: false },
                                { text: "Revisar métricas de Q3", checked: false },
                            ].map((task, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-black border border-white/5">
                                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${task.checked ? 'bg-neon border-neon text-black' : 'border-gray-600'}`}>
                                        {task.checked && <Check size={14} />}
                                    </div>
                                    <span className={`text-sm ${task.checked ? 'text-gray-500 line-through' : 'text-white'}`}>{task.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                        <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">Action Items</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Insights Automáticos</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Não deixe nada passar. O Fala Já identifica automaticamente tarefas, datas importantes e decisões tomadas durante a conversa, criando uma lista de tarefas pronta para uso.
                    </p>
                    <button className="flex items-center gap-2 text-neon font-bold hover:gap-4 transition-all">
                        Ver exemplo de Insights <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    </section>
);

const LiveDemo = () => (
    <section className="py-24 bg-[#080808] border-y border-white/5">
        <div className="container mx-auto px-6 text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Demonstração ao Vivo</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Veja com seus próprios olhos a velocidade e precisão da nossa transcrição em tempo real.</p>
        </div>
        <div className="container mx-auto px-6 flex justify-center">
            <div className="w-full max-w-4xl bg-black border border-white/10 rounded-[2rem] p-1 shadow-2xl relative overflow-hidden group hover:border-neon/30 transition-colors">
                <div className="bg-[#050505] rounded-[1.8rem] p-8 h-[400px] flex flex-col md:flex-row gap-8 relative">
                    <div className="w-full md:w-1/3 flex flex-col items-center justify-center border-r border-white/5 pr-8 relative">
                        <div className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 rounded-full border border-neon/20 animate-ping opacity-20"></div>
                            <img src="/favicon.png" alt="Demo" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> AO VIVO
                            </span>
                            <div className="mt-4 flex items-center justify-center gap-1 h-8">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="w-1 bg-white/20 rounded-full animate-bounce" style={{ height: Math.random() * 20 + 10 + 'px', animationDelay: i * 0.1 + 's' }}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#050505] to-transparent z-10"></div>
                        <div className="space-y-4 mt-8 animate-slide-up-slow opacity-90">
                            <p className="text-gray-500 text-sm font-mono">[00:01] Sistema iniciado com sucesso.</p>
                            <p className="text-gray-300 text-lg leading-relaxed"><span className="text-neon font-bold">Orador 1:</span> Bem-vindos à apresentação. Hoje vamos demonstrar a capacidade do nosso motor de IA.</p>
                            <p className="text-gray-300 text-lg leading-relaxed"><span className="text-blue-400 font-bold">Orador 2:</span> Exatamente. Reparem como a pontuação é aplicada automaticamente enquanto eu falo.</p>
                            <p className="text-white text-lg leading-relaxed font-medium"><span className="text-neon font-bold">Orador 1:</span> E não é só isso. Termos técnicos como <span className="underline decoration-neon decoration-dashed">React</span>, <span className="underline decoration-neon decoration-dashed">TypeScript</span> e <span className="underline decoration-neon decoration-dashed">LLMs</span> são reconhecidos instantaneamente.</p>
                            <div className="h-4 w-2 bg-neon animate-pulse inline-block"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#050505] to-transparent z-10"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const ModesShowcase = () => {
    const [modes, setModes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModes = async () => {
            try {
                const res = await fetch(`${API_URL}/api/modes`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
                const data = await res.json();
                setModes((data.modes || []).slice(0, 8));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchModes();
    }, []);

    const fallbackIcons = [<Users size={24} />, <Mic size={24} />, <Radio size={24} />, <Presentation size={24} />, <Stethoscope size={24} />, <Scale size={24} />, <TrendingUp size={24} />, <Headphones size={24} />];

    return (
        <section id="modes" className="py-24 bg-black relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon/5 via-transparent to-transparent pointer-events-none"></div>
            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-3xl font-bold text-white mb-6 animate-fade-in text-shadow-sm">Nossos {modes.length > 0 ? modes.length : '8'} Modelos Principais</h2>
                <p className="text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up">Temos a inteligência exata para o seu tipo de áudio. Escolha o modo perfeito para a sua necessidade.</p>
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-neon w-10 h-10" /></div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {modes.map((m, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-neon hover:bg-neon/5 transition-all text-left group hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(204,255,0,0.15)] animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="text-neon mb-4 group-hover:scale-125 transition-transform origin-left group-hover:animate-pulse">
                                    {fallbackIcons[i % fallbackIcons.length]}
                                </div>
                                <h3 className="text-white font-bold mb-2 group-hover:text-neon transition-colors">{m.name}</h3>
                                <p className="text-gray-500 text-xs leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {m.description || 'Nossa inteligência avançada foi treinada em milhares de horas para reconhecer com precisão esse formato.'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const AutomationShowcase = () => (
    <section className="py-24 bg-card-dark border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <div className="inline-block p-3 rounded-2xl bg-purple-500/10 text-purple-400 mb-6"><Zap size={32} /></div>
                    <h2 className="text-3xl font-bold text-white mb-6">Integrações e Automações Avançadas</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Vá além da transcrição. Com integração a webhooks, envie resumos automaticamente para o Slack, crie tarefas no Trello ou salve no Google Drive sem esforço.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <Webhook size={20} className="text-purple-400" />
                            <span className="text-white font-medium">Webhooks Globais</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Braces size={20} className="text-purple-400" />
                            <span className="text-white font-medium">API Rest Aberta</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Database size={20} className="text-purple-400" />
                            <span className="text-white font-medium">Armazenamento em Nuvem</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-lg h-64 bg-black border border-white/10 rounded-2xl relative p-6 shadow-2xl flex items-center justify-center">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
                        <div className="flex items-center justify-center w-full gap-4 relative z-10">
                            <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-lg"><Mic size={28} className="text-white" /></div>
                            <div className="h-0.5 flex-1 bg-neon/50 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-neon shadow-[0_0_10px_#ccff00]"></div></div>
                            <div className="h-20 w-20 bg-neon/10 border border-neon/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.1)]"><Cpu size={36} className="text-neon" /></div>
                            <div className="h-0.5 flex-1 bg-purple-500/50 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div></div>
                            <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shadow-lg"><MessageSquare size={28} className="text-white" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Pricing = ({ onSelectPlan }: { onSelectPlan: () => void }) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch(`${API_URL}/api/plans`);
                const data = await res.json();
                setPlans(data.plans || []);
            } catch (error) {
                console.error('Error fetching plans:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    return (
        <section id="pricing" className="py-24 bg-black relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-neon/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl font-bold text-white mb-4">Planos Simples</h2>
                <p className="text-gray-400 mb-16">Comece grátis, faça upgrade quando precisar.</p>

                {loading ? (
                    <div className="text-white text-xl">Carregando planos...</div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan) => (
                            <div key={plan.id} className={`p-8 rounded-[2rem] flex flex-col items-center ${plan.is_popular ? 'bg-[#111] border border-neon/50 relative scale-105 shadow-2xl shadow-neon/10' : 'bg-card-dark border border-white/10'}`}>
                                {plan.is_popular && (
                                    <div className="absolute top-0 -translate-y-1/2 bg-neon text-black px-4 py-1 rounded-full text-xs font-bold uppercase">Mais Popular</div>
                                )}
                                <span className={`${plan.is_popular ? 'text-neon' : 'text-gray-400'} font-bold uppercase text-xs tracking-wider mb-4`}>{plan.name}</span>
                                <h3 className={`text-${plan.is_popular ? '5xl' : '4xl'} font-bold text-white mb-6`}>Kz {plan.price_kz.toLocaleString('pt-AO')}</h3>
                                <ul className="space-y-4 mb-8 w-full text-left">
                                    {plan.features.map((feature, idx) => {
                                        const isNegative = feature.startsWith('-');
                                        const text = isNegative ? feature.substring(1) : feature;
                                        return (
                                            <li key={idx} className={`flex items-center gap-3 ${plan.is_popular ? 'text-white' : 'text-gray-400'} text-sm`}>
                                                {isNegative ? (
                                                    <X size={16} className="text-red-500" />
                                                ) : (
                                                    plan.is_popular ? <CheckCircle size={16} className="text-neon" /> : <Check size={16} />
                                                )}
                                                {text}
                                            </li>
                                        );
                                    })}
                                </ul>
                                <button onClick={onSelectPlan} className={`w-full py-${plan.is_popular ? '4' : '3'} rounded-full font-bold transition-transform ${plan.is_popular ? 'bg-neon text-black hover:scale-105 shadow-neon' : 'border border-white/20 text-white hover:bg-white/5'}`}>
                                    {plan.name === 'Enterprise' ? 'Falar com Vendas' : (plan.is_popular ? 'Assinar Agora' : 'Assinar Básico')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const HowItWorks = () => (
    <section className="py-24 bg-[#080808] border-y border-white/5">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-16">Como Funciona</h2>
            <div className="grid md:grid-cols-3 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                {[
                    { step: "01", title: "Grave ou Envie", desc: "Use nosso gravador ou faça upload de arquivos mp3/wav." },
                    { step: "02", title: "IA Processa", desc: "Nossos algoritmos transcrevem e resumem em segundos." },
                    { step: "03", title: "Exporte e Use", desc: "Copie o texto, baixe em PDF ou compartilhe o link." }
                ].map((s, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-black border-4 border-white/10 flex items-center justify-center text-2xl font-bold text-neon mb-6 shadow-2xl">
                            {s.step}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                        <p className="text-gray-400 max-w-xs">{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const faqs = [
        { q: "O Fala Já funciona offline?", a: "Atualmente, é necessária uma conexão com a internet para processar os áudios em nossa nuvem segura." },
        { q: "Meus áudios são privados?", a: "Absolutamente. Utilizamos criptografia de ponta e deletamos arquivos brutos após o processamento, se assim desejar." },
        { q: "Posso cancelar a qualquer momento?", a: "Sim, nossos planos não possuem fidelidade. Você pode cancelar a renovação quando quiser." },
        { q: "Quais formatos de arquivo são aceitos?", a: "Aceitamos MP3, WAV, M4A, MP4 e OGG com até 200MB por arquivo." },
    ];

    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-3xl font-bold text-white mb-12 text-center">Perguntas Frequentes</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="text-white font-medium">{faq.q}</span>
                                <ChevronDown className={`text-gray-400 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                            </button>
                            {openIndex === i && (
                                <div className="p-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-white/5 mt-2">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTA = ({ onSignUp }: { onSignUp: () => void }) => (
    <section className="py-32 bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-neon/5 blur-3xl opacity-20 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">Pronto para transformar <br /> suas reuniões?</h2>
            <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">Junte-se a milhares de profissionais que economizam 10 horas por semana com o Fala Já.</p>
            <button onClick={onSignUp} className="px-12 py-5 rounded-full bg-neon text-black font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(204,255,0,0.4)]">
                Criar Conta Grátis
            </button>
            <p className="mt-6 text-sm text-gray-500">Não requer cartão de crédito para começar.</p>
        </div>
    </section>
);

const Footer = () => (
    <footer className="pt-24 pb-12 bg-[#050505] border-t border-white/5 text-sm">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="falajá.ao" className="h-10 object-contain" />
                    </div>
                    <p className="text-gray-400 leading-relaxed max-w-xs">
                        A plataforma de inteligência artificial que transforma suas conversas em conhecimento acionável. Seguro, rápido e preciso.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-neon hover:text-black transition-all"><Twitter size={18} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-neon hover:text-black transition-all"><Instagram size={18} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-neon hover:text-black transition-all"><Linkedin size={18} /></a>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Produto</h4>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Funcionalidades</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Preços</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Integrações</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Enterprise</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Changelog</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Recursos</h4>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Blog</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Comunidade</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Ajuda</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">API Docs</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Status</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6">Empresa</h4>
                    <ul className="space-y-4">
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Sobre Nós</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Carreiras</a> <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white ml-2">Hiring</span></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Legal</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-neon transition-colors">Contato</a></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500">© 2024 Fala Já Inc. Todos os direitos reservados.</p>
                <div className="flex gap-8">
                    <a href="#" className="text-gray-500 hover:text-white transition-colors">Termos de Uso</a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacidade</a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors">Cookies</a>
                </div>
            </div>
        </div>
    </footer>
);

// --- AUTH PAGE ---

const AuthPage = ({ onLoginSuccess, onBack, initialIsLogin = true }: { onLoginSuccess: (u: UserProfile) => void, onBack: () => void, initialIsLogin?: boolean }) => {
    const [isLogin, setIsLogin] = useState(initialIsLogin);
    const [isLoading, setIsLoading] = useState(false);
    const [whatsapp, setWhatsapp] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [verificationStep, setVerificationStep] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let timer: any;
        if (verificationStep && cooldown > 0) {
            timer = setInterval(() => setCooldown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [verificationStep, cooldown]);

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/resend-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ whatsapp: `244${whatsapp}` }),
            });
            if (response.ok) {
                setMsg("Código enviado com sucesso!");
                setError('');
                setCooldown(120); // Inicia os 120 segundos
            } else {
                const data = await response.json();
                setError(data.error || "Ocorreu um erro ao reenviar o código.");
            }
        } catch (err) {
            setError("Falha na conexão.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMsg("");

        try {
            if (verificationStep) {
                const response = await fetch(`${API_URL}/api/auth/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                    body: JSON.stringify({ whatsapp: `244${whatsapp}`, code: verificationCode }),
                });
                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    onLoginSuccess(data.user);
                } else {
                    setError(data.error || "Código inválido. Tente novamente.");
                }
            } else {
                if (!isLogin && !acceptedTerms) {
                    setError("Você precisa aceitar os Termos e Condições para criar uma conta.");
                    setIsLoading(false);
                    return;
                }

                const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
                const body = isLogin ? { whatsapp: `244${whatsapp}`, password } : { name, whatsapp: `244${whatsapp}`, password };

                const response = await fetch(`${API_URL}${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                    body: JSON.stringify(body),
                });
                const data = await response.json();

                if (response.ok) {
                    if (data.needsVerification) {
                        setVerificationStep(true);
                        setCooldown(0); // Começa em 0 para forçar clique no botão Enviar
                    } else if (data.token) {
                        localStorage.setItem('token', data.token);
                        onLoginSuccess(data.user);
                    }
                } else {
                    setError(data.error || "Ocorreu um erro. Tente novamente.");
                }
            }
        } catch (err) {
            setError("Erro ao conectar ao servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon/10 via-black to-black"></div>

            <button onClick={onBack} className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 z-10 font-bold text-sm"><ChevronLeft /> Voltar</button>

            <div className="w-full max-w-sm z-10 animate-fade-in mx-auto">
                <div className="text-center mb-10 w-full flex flex-col items-center">
                    <div className="flex justify-center w-full mb-8 hover:scale-105 transition-transform duration-500">
                        <img src="/logo.png" alt="Fala Já Logo" className="h-16 w-auto object-contain mx-auto block" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 text-center w-full">
                        {verificationStep ? "Verificação" : (isLogin ? "Bem-vindo" : "Criar conta")}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {verificationStep ? "Digite o código recebido no WhatsApp" : (isLogin ? "Acesse para continuar" : "Comece sua jornada hoje com WhatsApp")}
                    </p>
                    {error && (
                        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold animate-shake">
                            {error}
                        </div>
                    )}
                    {msg && (
                        <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold">
                            {msg}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {verificationStep ? (
                        <div className="space-y-4">
                            <div className="relative group">
                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Código de 6 dígitos"
                                    maxLength={6}
                                    className="w-full bg-input-dark border border-white/5 focus:border-neon/50 rounded-[20px] pl-14 pr-6 py-5 text-center text-2xl text-white placeholder-gray-600 focus:outline-none focus:bg-black transition-all font-bold tracking-[0.5em]"
                                    value={verificationCode} onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isLoading || cooldown > 0}
                                className={`w-full py-4 rounded-[20px] font-bold text-sm transition-all border flex items-center justify-center tracking-wide ${cooldown > 0 ? 'bg-white/5 text-gray-500 border-white/5 cursor-not-allowed' : 'bg-white/5 text-neon hover:bg-white/10 border-neon/20 hover:border-neon'}`}
                            >
                                <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                {cooldown > 0 ? `Aguarde ${cooldown}s para reenviar` : 'Enviar Código via WhatsApp'}
                            </button>
                        </div>
                    ) : (
                        <>
                            {!isLogin && (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Nome completo"
                                            className="w-full bg-input-dark border border-white/5 focus:border-neon/50 rounded-[20px] pl-14 pr-6 py-5 text-sm text-white placeholder-gray-600 focus:outline-none focus:bg-black transition-all font-medium"
                                            value={name} onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon transition-colors" size={20} />
                                <span className="absolute left-14 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+244</span>
                                <input
                                    type="tel"
                                    placeholder="900000000"
                                    maxLength={9}
                                    className="w-full bg-input-dark border border-white/5 focus:border-neon/50 rounded-[20px] pl-[6.5rem] pr-6 py-5 text-sm text-white placeholder-gray-600 focus:outline-none focus:bg-black transition-all font-medium tracking-wide"
                                    value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon transition-colors" size={20} />
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    className="w-full bg-input-dark border border-white/5 focus:border-neon/50 rounded-[20px] pl-14 pr-6 py-5 text-sm text-white placeholder-gray-600 focus:outline-none focus:bg-black transition-all font-medium"
                                    value={password} onChange={e => setPassword(e.target.value)}
                                />
                                <EyeOff className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer hover:text-gray-400" size={20} />
                            </div>

                            {!isLogin && (
                                <label className="flex items-center gap-3 pt-2 pl-2 text-sm text-gray-400 cursor-pointer group w-full">
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${acceptedTerms ? 'bg-neon border-neon text-black' : 'border-gray-600 group-hover:border-neon'}`}>
                                        {acceptedTerms && <Check size={14} strokeWidth={3} />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
                                    <span>Eu concordo com os <a href="/termos.html" target="_blank" className="text-neon hover:underline" onClick={e => e.stopPropagation()}>Termos e Condições</a></span>
                                </label>
                            )}
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-5 rounded-[20px] bg-neon text-black font-bold text-sm hover:bg-neon-hover transition-all hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center tracking-wide uppercase"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (verificationStep ? "Validar" : (isLogin ? "Entrar" : "Cadastrar"))}
                    </button>
                </form>

                {!verificationStep && (
                    <>
                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-black px-4 text-gray-600">Ou</span></div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-gray-400 hover:text-neon text-sm font-bold transition-all"
                            >
                                {isLogin ? "Novo aqui? Crie uma conta gratuita" : "Já tem uma conta? Faça login"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- MODERN GLASS DASHBOARD COMPONENTS ---

const AnimatedWaveLogo = ({ className, isRecording = false }: { className?: string, isRecording?: boolean }) => {
    return (
        <svg viewBox="0 0 120 100" className={`${className} overflow-visible`} fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
            <g style={{ transformOrigin: '50% 50%' }}>
                <path d="M 5 50 L 18 50 L 30 20 L 48 85 L 60 50" className={!isRecording ? 'animate-pulse' : ''} style={{ animationDuration: '1.5s' }} />
                <line x1="75" y1="10" x2="75" y2="90" className={!isRecording ? 'animate-pulse' : ''} style={{ animationDelay: '200ms', animationDuration: '1.5s' }} />
                <line x1="95" y1="30" x2="95" y2="70" className={!isRecording ? 'animate-pulse' : ''} style={{ animationDelay: '400ms', animationDuration: '1.5s' }} />
                <line x1="110" y1="50" x2="115" y2="50" className={!isRecording ? 'animate-pulse' : ''} style={{ animationDelay: '600ms', animationDuration: '1.5s' }} />
            </g>
        </svg>
    );
};

const AudioOrb = ({ onSave, userMode, userPlan, userCredits }: { onSave: (recording: Recording) => void, userMode: 'simple' | 'professional', userPlan?: string, userCredits?: number }) => {
    // Use the user's selected mode consistently
    const effectiveMode = userMode;
    const isLowBalance = userCredits !== undefined && userCredits <= 10;
    const isBlocked = userCredits !== undefined && userCredits <= 2;

    const [step, setStep] = useState<'idle' | 'recording' | 'selecting_mode' | 'processing'>('idle');
    const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef<number | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const durationRef = useRef(0); // To store the duration when recording stops
    const [modes, setModes] = useState<TranscriptionMode[]>([]);

    useEffect(() => {
        const fetchModes = async () => {
            try {
                const res = await fetch(`${API_URL}/api/modes`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
                const data = await res.json();
                setModes(data.modes || []);
            } catch (err) {
                console.error("Erro ao buscar modos:", err);
            }
        };
        fetchModes();
    }, []);

    const startRecording = async () => {
        if (isBlocked) {
            alert('Saldo insuficiente. Você tem 2 minutos ou menos de crédito. Recarregue para gravar novos áudios.');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(blob);

                if (effectiveMode === 'simple') {
                    setStep('processing');
                    processAudioWithWebhook('Transcrição Padrão', blob);
                } else {
                    setStep('selecting_mode');
                }
            };

            mediaRecorder.start();
            setStep('recording');
            setSeconds(0);
            intervalRef.current = window.setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Permissão de microfone necessária para gravar.");
        }
    };

    const stopRecording = () => {
        // Capture final duration
        durationRef.current = seconds;

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        // Processing will be triggered by onstop event
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAudioBlob(file);

            // Get actual duration for uploaded files
            const audio = new Audio();
            const objectUrl = URL.createObjectURL(file);
            audio.src = objectUrl;
            audio.onloadedmetadata = () => {
                durationRef.current = Math.round(audio.duration);
                URL.revokeObjectURL(objectUrl);

                if (effectiveMode === 'simple') {
                    setStep('processing');
                    processAudioWithWebhook('Transcrição Padrão', file);
                } else {
                    setStep('selecting_mode');
                }
            };
            audio.onerror = () => {
                console.warn("Could not determine audio duration, using default.");
                durationRef.current = 0; // Or some fallback
                if (effectiveMode === 'simple') {
                    setStep('processing');
                    processAudioWithWebhook('Transcrição Padrão', file);
                } else {
                    setStep('selecting_mode');
                }
            };
        }
    };

    const processAudioWithWebhook = async (mode: string, blob: Blob) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/transcribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': blob.type || 'audio/wav',
                    'Authorization': `Bearer ${token}`,
                    'X-Mode': mode
                },
                body: blob
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Webhook error (${response.status}):`, errorText);
                let errorMessage = 'Falha no processamento do webhook';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.details ? `${errorMessage}: ${errorData.details}` : (errorData.error || errorMessage);
                } catch (e) {
                    errorMessage = errorText.substring(0, 100) || errorMessage;
                }
                throw new Error(`${errorMessage} (${response.status})`);
            }

            const rawData = await response.json();
            const data = Array.isArray(rawData) ? (rawData[0] || {}) : (rawData || {});

            console.log('Webhook normalized data:', data);

            // Handle different possible field names from n8n
            let transcription = data.output || data.text || data.transcription || data.transcript || "";
            let summary = data.summary || data.resumo || "";
            let actionItems = data.actionItems || data.action_items || data.insights || [];
            let title = data.title || "";

            // Intelligent splitting if only 'output' is provided and it looks structured
            if (transcription && !summary && !title) {
                const lines = transcription.split('\n').filter((l: string) => l.trim() !== '');
                if (lines.length > 0) {
                    title = lines[0]; // Assume first line is title
                    if (lines.length > 2) {
                        summary = lines.slice(1, 4).join(' '); // Assume next few lines could be a summary
                    }
                }
            }

            // Fallbacks
            transcription = transcription || "Transcrição não disponível.";
            summary = summary || "Resumo não disponível.";
            let finalTitle = title || `${mode} - ${new Date().toLocaleDateString()}`;

            // Limit title to 50 characters
            if (finalTitle.length > 50) {
                finalTitle = finalTitle.substring(0, 47) + "...";
            }

            const newRecording: Recording = {
                id: Date.now(),
                title: finalTitle,
                date: new Date().toISOString(),
                duration: formatTime(durationRef.current),
                durationSec: durationRef.current,
                status: 'completed',
                type: mode,
                transcription,
                summary,
                actionItems: Array.isArray(actionItems) ? actionItems : [],
                audioUrl: URL.createObjectURL(blob)
            };

            // Auto-copy for simple mode or standard transcription
            if (effectiveMode === 'simple' || mode === 'Transcrição Padrão') {
                try {
                    await navigator.clipboard.writeText(transcription);
                    console.log('Transcription auto-copied to clipboard');
                } catch (err) {
                    console.error('Failed to auto-copy:', err);
                }
            }

            try {
                await onSave(newRecording);
                setStep('idle');
                setSeconds(0);
                setAudioBlob(null);
            } catch (saveErr: any) {
                console.error("Erro ao salvar gravação:", saveErr);
                alert("Áudio processado, mas não foi possível salvar no histórico: " + (saveErr.message || 'Erro desconhecido'));
                setStep('idle');
            }

        } catch (error: any) {
            console.error("Erro no webhook:", error);
            alert(error.message || "Erro ao processar o áudio. Tente novamente.");
            setStep('idle');
        }
    };

    const selectMode = (mode: string) => {
        setStep('processing');
        if (audioBlob) {
            processAudioWithWebhook(mode, audioBlob);
        }
    };

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (step === 'processing') {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in relative z-10">
                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-neon border-t-transparent animate-spin"></div>
                    <Loader2 className="absolute inset-0 m-auto text-neon animate-spin" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Processando Áudio...</h2>
                <p className="text-gray-400">Enviando para análise inteligente.</p>
            </div>
        );
    }


    if (step === 'selecting_mode') {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in relative z-10 p-8 w-full max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Escolha o Modo</h2>
                <p className="text-gray-400 mb-8 text-center text-sm">Modos avançados possuem multiplicadores de consumo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 w-full h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {modes.map((mode) => (
                        <button key={mode.id} onClick={() => selectMode(mode.name)} className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-neon/10 hover:border-neon/50 transition-all group text-left backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3">
                                <span className="text-[10px] font-bold bg-black/40 px-2 py-1 rounded-lg border border-white/5 text-neon">
                                    {mode.multiplier}x
                                </span>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-white group-hover:bg-neon group-hover:text-black transition-colors shadow-lg flex-shrink-0">
                                <Zap size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-neon transition-colors">{mode.name}</h3>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{mode.description}</p>
                            </div>
                        </button>
                    ))}
                    {modes.length === 0 && <p className="text-gray-500 text-center col-span-2">Carregando modos...</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
            {isLowBalance && !isBlocked && (
                <div className="absolute top-8 w-full max-w-sm px-4 z-50">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold px-4 py-3 rounded-xl text-center shadow-[0_0_15px_rgba(234,179,8,0.2)] flex items-center justify-center gap-2">
                        <AlertTriangle size={16} /> Você tem {userCredits} minutos restantes.
                    </div>
                </div>
            )}

            {/* Fundo removido para não criar caixa de blur em alguns dispositivos móviles */}
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-16 relative z-10 tracking-tight transition-all drop-shadow-lg text-center">
                {step === 'idle' ? "Toque para gravar" : <span className="text-neon font-mono tracking-widest drop-shadow-[0_0_15px_rgba(204,255,0,0.5)]">{formatTime(seconds)}</span>}
            </h2>
            <div className="relative z-10 cursor-pointer group" onClick={step === 'idle' ? startRecording : stopRecording}>
                <div className="w-[320px] h-[320px] relative flex items-center justify-center">
                    <style>
                        {`
                        @keyframes particle-pulse {
                            0% { transform: scale(0.8); opacity: 0; }
                            50% { opacity: 0.5; }
                            100% { transform: scale(1.5); opacity: 0; }
                        }
                        .particle-layer {
                            position: absolute;
                            inset: 0;
                            border-radius: 50%;
                            border: 2px dashed rgba(204, 255, 0, 0.4);
                            animation: particle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        }
                        .particle-layer-2 {
                            animation-delay: 1s;
                            border: 2px dotted rgba(204, 255, 0, 0.2);
                        }
                        `}
                    </style>

                    {step === 'recording' ? (
                        <div className="absolute flex flex-col items-center justify-center z-10 w-full h-full">
                            <div className="particle-layer"></div>
                            <div className="particle-layer particle-layer-2"></div>
                            <div className="w-[400px] h-[400px] rounded-full flex items-center justify-center group-hover:scale-95 transition-transform z-20">
                                <AnimatedWaveLogo className="text-neon w-[300px] h-[300px] drop-shadow-[0_0_20px_rgba(204,255,0,0.6)] animate-pulse" isRecording={true} />
                            </div>
                        </div>
                    ) : (
                        <div className="absolute flex flex-col items-center justify-center z-10 w-full h-full">
                            <div className="w-[400px] h-[400px] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                <AnimatedWaveLogo className="text-neon/70 group-hover:text-neon w-[240px] h-[240px] transition-colors duration-300 drop-shadow-[0_0_15px_rgba(204,255,0,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(204,255,0,0.5)]" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 text-center relative z-10 flex flex-col items-center gap-4">
                {step === 'idle' && (
                    <>
                        <p className="text-gray-500 font-bold text-xs tracking-[0.2em] uppercase">Toque no anel para iniciar</p>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept="audio/*"
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-colors mt-4"
                        >
                            <Upload size={18} /> Carregar Áudio
                        </button>
                    </>
                )}
                {step === 'recording' && <p className="text-neon font-bold text-xs tracking-[0.2em] uppercase animate-pulse">Gravando... Toque para parar</p>}
            </div>
        </div>
    );
};

const TranscriptionView = ({ recording, onBack, onUpdate }: { recording: Recording, onBack: () => void, onUpdate: (id: number, updates: Partial<Recording>) => void }) => {
    const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'actions'>('transcript');
    const [copyToast, setCopyToast] = useState(false);
    const [editValues, setEditValues] = useState({
        title: recording.title,
        transcription: recording.transcription || "",
        summary: recording.summary || "",
        actionItems: recording.actionItems || []
    });

    useEffect(() => {
        setEditValues({
            title: recording.title,
            transcription: recording.transcription || "",
            summary: recording.summary || "",
            actionItems: recording.actionItems || []
        });
    }, [recording]);

    const handleSaveField = (field: keyof typeof editValues, value: any) => {
        onUpdate(recording.id, { [field]: value });
    };

    const getActiveText = () => {
        if (activeTab === 'transcript') return recording.transcription || '';
        if (activeTab === 'summary') return recording.summary || '';
        if (activeTab === 'actions') return (recording.actionItems || []).map((a, i) => `${i + 1}. ${a}`).join('\n');
        return '';
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getActiveText());
        setCopyToast(true);
        setTimeout(() => setCopyToast(false), 2000);
    };

    const handleEmail = () => {
        const subject = encodeURIComponent(recording.title);
        const body = encodeURIComponent(getActiveText());
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: recording.title, text: getActiveText() });
            } catch (e) { }
        } else {
            navigator.clipboard.writeText(getActiveText());
            setCopyToast(true);
            setTimeout(() => setCopyToast(false), 2000);
        }
    };

    const handlePDF = () => {
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(`<!DOCTYPE html><html><head><title>${recording.title}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;color:#111;line-height:1.7}h1{font-size:24px;margin-bottom:8px}p{margin:0 0 16px;white-space:pre-wrap}.meta{color:#888;font-size:13px;margin-bottom:24px;display:flex;gap:16px}</style></head><body><h1>${recording.title}</h1><div class="meta"><span>${recording.date}</span><span>${recording.duration}</span><span>${recording.type}</span></div><pre style="white-space:pre-wrap;font-family:sans-serif">${getActiveText()}</pre></body></html>`);
        w.document.close();
        w.focus();
        setTimeout(() => { w.print(); }, 400);
    };

    return (
        <div className="h-full flex flex-col animate-fade-in relative z-10 w-full max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeftCircle size={24} /> <span className="text-sm font-bold">Voltar</span>
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${copyToast ? 'bg-neon text-black' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                        title="Copiar texto"
                    >
                        {copyToast ? <Check size={15} /> : <Copy size={15} />}
                        <span className="hidden sm:inline">{copyToast ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                    <button
                        onClick={handleEmail}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all"
                        title="Enviar por Email"
                    >
                        <Mail size={15} />
                        <span className="hidden sm:inline">Email</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all"
                        title="Compartilhar"
                    >
                        <Share2 size={15} />
                        <span className="hidden sm:inline">Compartilhar</span>
                    </button>
                    <button
                        onClick={handlePDF}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all"
                        title="Exportar PDF"
                    >
                        <FileDown size={15} />
                        <span className="hidden sm:inline">PDF</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 flex justify-between items-start">
                        <div className="flex-1 mr-4">
                            <h1 className="text-2xl font-bold text-white mb-2">
                                {recording.title.length > 50 ? recording.title.substring(0, 47) + '...' : recording.title}
                            </h1>
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {recording.date}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {recording.duration}</span>
                                <span className="bg-neon/10 text-neon px-2 py-0.5 rounded border border-neon/20">{recording.type}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex border-b border-white/5 px-6 items-center justify-between">
                        <div className="flex">
                            {[
                                { id: 'transcript', label: 'Transcrição', icon: AlignLeft },
                                { id: 'summary', label: 'Resumo IA', icon: Sparkles },
                                { id: 'actions', label: 'Insights', icon: ListTodo }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-neon text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                                >
                                    <tab.icon size={16} /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-black/20">
                        {activeTab === 'transcript' && (
                            <div className="space-y-6">
                                {(recording.transcription || '').split('\n').map((line, i) => {
                                    if (!line.trim()) return null;
                                    const isSpeakerLine = line.includes('[') && line.includes(':');
                                    if (!isSpeakerLine) return <p key={i} className="text-gray-300 ml-14 leading-relaxed">{line}</p>;

                                    const metaParts = line.split(']:');
                                    if (metaParts.length < 2) return <p key={i} className="text-gray-300 ml-14 leading-relaxed">{line}</p>;

                                    const meta = metaParts[0];
                                    const text = metaParts.slice(1).join(']:'); // Rejoin in case of extra ]:
                                    const timestamp = meta.includes(']') ? meta.split(']')[0].replace('[', '') : '--:--';
                                    const speaker = meta.includes(']') ? meta.split(']')[1].trim() : 'Desconhecido';

                                    return (
                                        <div key={i} className="flex gap-4 group">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                {speaker.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-3 mb-1">
                                                    <span className="text-neon font-bold text-sm">{speaker}</span>
                                                    <span className="text-xs text-gray-500 font-mono hover:text-white cursor-pointer hover:underline">{timestamp}</span>
                                                </div>
                                                <p className="text-gray-200 leading-relaxed p-2 -ml-2 rounded-lg transition-colors border border-transparent">
                                                    {text}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!recording.transcription || recording.transcription.split('\n').every(line => !line.includes(']:'))) && (
                                    <p
                                        className="text-gray-200 leading-relaxed p-4 rounded-xl hover:bg-white/5 transition-colors focus:bg-white/10 outline-none cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleSaveField('transcription', e.currentTarget.innerText)}
                                    >
                                        {recording.transcription}
                                    </p>
                                )}
                            </div>
                        )}

                        {activeTab === 'summary' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-neon/5 border border-neon/20 rounded-2xl p-6">
                                    <h3 className="text-neon font-bold mb-4 flex items-center gap-2"><Bot size={18} /> Resumo Executivo</h3>
                                    <p
                                        className="text-white leading-relaxed p-4 rounded-xl hover:bg-white/5 transition-colors focus:bg-white/10 outline-none cursor-text"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => handleSaveField('summary', e.currentTarget.innerText)}
                                    >
                                        {recording.summary || "Resumo não disponível."}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'actions' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-white font-bold">Tarefas Identificadas</h3>
                                    <button
                                        onClick={() => {
                                            const newItem = prompt("Adicionar nova tarefa:");
                                            if (newItem) {
                                                const updated = [...editValues.actionItems, newItem];
                                                setEditValues({ ...editValues, actionItems: updated });
                                                handleSaveField('actionItems', updated);
                                            }
                                        }}
                                        className="text-xs bg-neon/10 text-neon px-3 py-1 rounded-full border border-neon/20 hover:bg-neon/20 transition-all font-bold"
                                    >
                                        + Adicionar
                                    </button>
                                </div>
                                {editValues.actionItems.length === 0 ? (
                                    <p className="text-gray-500 text-sm italic">Nenhuma tarefa identificada.</p>
                                ) : (
                                    editValues.actionItems.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-white/20 transition-colors">
                                            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-600 bg-black text-neon focus:ring-neon" />
                                            <span className="flex-1 text-gray-300 text-sm">{item}</span>
                                            <button
                                                onClick={() => {
                                                    const updated = editValues.actionItems.filter((_, idx) => idx !== i);
                                                    setEditValues({ ...editValues, actionItems: updated });
                                                    handleSaveField('actionItems', updated);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden lg:flex w-80 flex-col gap-6">
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Participantes</h3>
                        <div className="space-y-4">
                            {['Você'].map((p, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white border border-white/5">
                                        {p.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-gray-300">{p}</span>
                                    <span className="text-xs text-gray-600 ml-auto">100%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 flex-1">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Palavras-Chave</h3>
                        <div className="flex flex-wrap gap-2">
                            {['IA', 'Transcrição', 'Teste', 'Funcional'].map((tag, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-neon/30 cursor-pointer transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const HistoryView = ({ recordings, onDelete, onView }: { recordings: Recording[], onDelete: (id: number) => void, onView: (r: Recording) => void }) => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = recordings.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' ? true : r.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 border border-white/10 min-h-[600px] animate-fade-in shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Histórico</h2>
                    <p className="text-gray-400 text-sm">Gerencie seus arquivos transcritos</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-12 pr-4 py-3 rounded-full bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-neon/50 backdrop-blur-sm transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/5 transition-colors"><Filter size={20} /></button>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Nenhuma gravação encontrada.</div>
                ) : (
                    filtered.map(rec => (
                        <div key={rec.id} onClick={() => onView(rec)} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 backdrop-blur-md transition-all cursor-pointer group hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
                            <div className="flex items-center gap-5 mb-4 md:mb-0">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-black transition-all shadow-inner">
                                    {rec.type === 'meeting' ? <Users size={24} /> : <FileAudio size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold group-hover:text-neon transition-all">
                                        {rec.title.length > 50 ? rec.title.substring(0, 47) + '...' : rec.title}
                                    </h3>
                                    <p className="text-xs text-gray-400 flex items-center gap-2 font-medium">
                                        <Clock size={12} /> {rec.duration} • {rec.date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 justify-between md:justify-end">
                                <span className={`text-xs font-bold px-4 py-2 rounded-full border ${rec.status === 'completed' ? 'text-neon bg-neon/5 border-neon/20' : 'text-yellow-400 bg-yellow-400/5 border-yellow-400/20'
                                    }`}>
                                    {rec.status === 'completed' ? 'Processado' : 'Processando'}
                                </span>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><PlayCircle size={20} /></button>
                                    <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Download size={20} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(rec.id); }} className="p-2 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const ReferralView = ({ onBack }: { onBack: () => void }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText("falaja.ai/invite/RICARDO99");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                <ArrowLeftCircle size={24} /> <span className="text-sm font-bold">Voltar</span>
            </button>

            <div className="bg-gradient-to-br from-neon/10 to-transparent border border-neon/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="flex-1 relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-4">Convide amigos, <br />ganhe <span className="text-neon">minutos grátis</span>.</h2>
                    <p className="text-gray-400 text-lg mb-8">Para cada amigo que se cadastrar e fizer a primeira transcrição, vocês dois ganham 30 minutos extras.</p>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex items-center gap-2">
                        <div className="flex-1 px-4 font-mono text-white tracking-wider text-sm md:text-base truncate">falaja.ai/invite/RICARDO99</div>
                        <button onClick={handleCopy} className={`px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-neon text-black hover:bg-neon-hover'}`}>
                            {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                </div>

                <div className="w-full md:w-1/3 flex justify-center relative z-10">
                    <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative">
                        <div className="absolute inset-0 bg-neon/20 rounded-full animate-pulse blur-2xl"></div>
                        <Gift className="text-neon w-24 h-24" />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Share2 size={20} className="text-gray-400" /> Compartilhar</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-blue-500/20 hover:border-blue-500/30 border border-transparent transition-all group">
                            <Twitter className="text-gray-400 group-hover:text-blue-400" size={24} />
                            <span className="text-xs font-bold text-gray-400 group-hover:text-blue-400">Twitter</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-blue-600/20 hover:border-blue-600/30 border border-transparent transition-all group">
                            <Facebook className="text-gray-400 group-hover:text-blue-600" size={24} />
                            <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600">Facebook</span>
                        </button>
                        <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 hover:bg-blue-700/20 hover:border-blue-700/30 border border-transparent transition-all group">
                            <Linkedin className="text-gray-400 group-hover:text-blue-700" size={24} />
                            <span className="text-xs font-bold text-gray-400 group-hover:text-blue-700">LinkedIn</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-6">Suas Indicações</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">JD</div>
                                <div>
                                    <p className="text-sm font-bold text-white">João D.</p>
                                    <p className="text-xs text-gray-500">Convite enviado</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full">Pendente</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neon text-black flex items-center justify-center text-xs font-bold">MA</div>
                                <div>
                                    <p className="text-sm font-bold text-white">Maria A.</p>
                                    <p className="text-xs text-gray-500">Cadastrou-se</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-neon bg-neon/10 px-3 py-1 rounded-full">+30 min</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileSecurityView = ({ user, onUpdateUser, onBack }: { user: UserProfile, onUpdateUser: (u: Partial<UserProfile>) => void, onBack: () => void }) => {
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({ name: user.name, email: user.email, phone: user.phone });

    const handleSave = () => {
        onUpdateUser(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in relative z-10 pb-12">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                <ArrowLeftCircle size={24} /> <span className="text-sm font-bold">Voltar</span>
            </button>

            <h2 className="text-3xl font-bold text-white mb-8">Dados Pessoais e Segurança</h2>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10">
                <div className="flex items-center gap-2 mb-6 text-neon">
                    <UserCog size={24} />
                    <h3 className="text-xl font-bold text-white">Perfil</h3>
                </div>

                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-black border border-white/10 relative group cursor-pointer overflow-hidden">
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                    <div>
                        <button className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">Alterar Foto</button>
                        <p className="text-xs text-gray-500 mt-2">JPG ou PNG. Max 2MB.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Nome Completo</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Telefone</label>
                            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-2">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleSave} className={`px-6 py-3 rounded-full font-bold transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                        {saved ? 'Salvo com Sucesso!' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10">
                <div className="flex items-center gap-2 mb-6 text-neon">
                    <ShieldCheck size={24} />
                    <h3 className="text-xl font-bold text-white">Segurança</h3>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-white/5 text-gray-400"><Key size={20} /></div>
                            <div>
                                <p className="text-sm font-bold text-white">Alterar Senha</p>
                                <p className="text-xs text-gray-500">Última alteração há 3 meses</p>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-white hover:text-neon transition-colors px-4 py-2 border border-white/10 rounded-lg hover:border-white/30">Atualizar</button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-white/5 text-gray-400"><Smartphone size={20} /></div>
                            <div>
                                <p className="text-sm font-bold text-white">Autenticação em 2 Fatores</p>
                                <p className="text-xs text-gray-500">Adicione uma camada extra de segurança</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer transition-colors hover:bg-gray-600">
                            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border border-red-500/20 rounded-[2.5rem] p-8">
                <h3 className="text-red-500 font-bold mb-4">Zona de Perigo</h3>
                <p className="text-gray-400 text-sm mb-6">Uma vez que você deletar sua conta, não há volta. Por favor tenha certeza.</p>
                <button className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-sm transition-colors">
                    <Trash2 size={16} /> Deletar minha conta
                </button>
            </div>
        </div>
    );
};

const PlansView = ({ activePlan, onUpgrade, transactions, plans }: { activePlan: string, onUpgrade: (planName: string) => void; transactions: Transaction[]; plans: Plan[] }) => {
    // Helper to normalize plan names for comparison
    const normalizePlanName = (name: string) => name.toLowerCase().replace('ásico', 'asic').replace('gratuito', 'free');

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Planos e Créditos</h2>
                <p className="text-gray-400">Escolha o melhor plano para sua produtividade.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                    const isActive = normalizePlanName(activePlan) === normalizePlanName(plan.name) ||
                        (activePlan === 'Gratuito' && plan.name === 'Free') ||
                        (activePlan === 'Básico' && plan.name === 'Basic');

                    return (
                        <div key={plan.id} className={`relative p-8 rounded-[2.5rem] border ${plan.is_popular ? 'border-neon bg-neon/5' : 'border-white/10 bg-white/5'} ${isActive ? 'ring-2 ring-neon' : ''} backdrop-blur-xl flex flex-col`}>
                            {plan.is_popular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-neon text-black text-xs font-bold uppercase tracking-widest">Mais Popular</div>
                            )}
                            {isActive && (
                                <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">Plano Atual</div>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">{plan.price_kz.toLocaleString()}</span>
                                <span className="text-gray-400 text-sm">Kz/mês</span>
                            </div>
                            <p className="text-neon font-bold mb-6 flex items-center gap-2 italic">
                                <Zap size={16} /> {plan.minutes} minutos inclusos
                            </p>
                            <div className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <CheckCircle size={18} className="text-neon flex-shrink-0 mt-0.5" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => onUpgrade(plan.name)}
                                disabled={isActive}
                                className={`w-full py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10' : plan.is_popular ? 'bg-neon text-black hover:bg-neon-hover' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            >
                                {isActive ? 'Seu Plano Atual' : 'Assinar Agora'}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Transaction History */}
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 mt-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-neon/10 flex items-center justify-center text-neon">
                        <History size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Histórico de Transações</h3>
                        <p className="text-sm text-gray-400">Suas compras e upgrades recentes</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="pb-4 font-bold text-gray-400 text-sm">Data</th>
                                <th className="pb-4 font-bold text-gray-400 text-sm">Tipo</th>
                                <th className="pb-4 font-bold text-gray-400 text-sm">Valor</th>
                                <th className="pb-4 font-bold text-gray-400 text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">Nenhuma transação encontrada.</td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="group">
                                        <td className="py-5 text-sm text-white">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td className="py-5 text-sm text-white">
                                            {tx.type === 'plan_upgrade' ? `Upgrade: ${tx.planName}` : 'Compra de Créditos'}
                                        </td>
                                        <td className="py-5 text-sm text-neon font-bold">Kz {tx.amountKz}</td>
                                        <td className="py-5">
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${tx.status === 'approved' ? 'bg-neon/10 text-neon border border-neon/20' :
                                                tx.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                    'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                                                }`}>
                                                {tx.status === 'approved' ? 'Aprovado' : tx.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const UsageView = ({ stats, setActivePage, onAddCredits, transactions, recordings, modes }: { stats: UserProfile; setActivePage: (p: string) => void; onAddCredits: () => void; transactions: Transaction[]; recordings: Recording[]; modes: TranscriptionMode[]; }) => {
    const totalCredits = stats.credits + stats.usedMinutes;
    const percentage = totalCredits > 0 ? Math.round((stats.usedMinutes / totalCredits) * 100) : 0;
    const strokeDashoffset = 251 - (251 * percentage) / 100;

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-white/10 flex flex-col justify-center items-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <h2 className="text-2xl font-bold text-white mb-8 w-full text-left flex items-center gap-2 relative z-10"><PieChart className="text-neon" /> Consumo Atual</h2>

                    <div className="flex items-center gap-12 relative z-10">
                        <div className="relative w-48 h-48">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
                                <circle cx="50" cy="50" r="40" stroke="#ccff00" strokeWidth="10" fill="none" strokeDasharray="251" strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(204,255,0,0.5)] transition-all duration-1000" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-white drop-shadow-md">{percentage}%</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Disponível</p>
                                <p className="text-2xl font-bold text-white">{stats.credits} <span className="text-sm text-gray-500">min</span></p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Usado</p>
                                <p className="text-2xl font-bold text-neon drop-shadow-sm">{stats.usedMinutes} <span className="text-sm text-neon/50">min</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/10 flex-1 relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-white mb-2">Créditos Extra</h2>
                            <p className="text-gray-400 text-sm mb-6">Seus créditos acabaram? Adicione mais sem mudar de plano.</p>
                            <button onClick={onAddCredits} className="w-full py-4 rounded-full border border-white/10 hover:bg-white/10 text-white font-bold transition-colors flex items-center justify-center gap-2 backdrop-blur-md">
                                <PlusCircle size={18} /> Adicionar Créditos
                            </button>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"></div>
                    </div>

                    <div onClick={() => setActivePage('referral')} className="bg-gradient-to-br from-neon to-[#a3cc00] rounded-[2.5rem] p-6 md:p-8 border border-white/10 flex-1 flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(204,255,0,0.15)]">
                        <div>
                            <h2 className="text-xl font-bold text-black mb-1">Indique Amigos</h2>
                            <p className="text-black/70 text-sm font-medium">Ganhe 30min por cada indicação</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-black">
                            <ArrowUpRight size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">Histórico de Créditos</h3>
                    <button className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">Ver Tudo</button>
                </div>

                <div className="space-y-2">
                    {transactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm italic">Nenhuma transação recente.</div>
                    ) : (
                        transactions.slice(0, 5).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 ${item.status === 'approved' ? 'text-neon' : 'text-gray-400'}`}>
                                        {item.status === 'approved' ? <ArrowUp size={18} /> : <ArrowDownLeft size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{item.planName ? `Upgrade: ${item.planName}` : 'Recarga de Créditos'}</h4>
                                        <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className={`font-mono font-bold ${item.status === 'approved' ? 'text-neon' : 'text-gray-400'}`}>
                                    {item.status === 'approved' ? '+' : ''} Kz {item.amountKz}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-xl mt-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">Histórico de Uso (Transcrições)</h3>
                    <button className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">Ver Tudo</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="pb-4 font-bold text-gray-400 text-sm">Gravação</th>
                                <th className="pb-4 font-bold text-gray-400 text-sm">Data</th>
                                <th className="pb-4 font-bold text-gray-400 text-sm">Modo Aplicado</th>
                                <th className="pb-4 font-bold text-gray-400 text-sm whitespace-nowrap">Duração Bruta</th>
                                <th className="pb-4 font-bold text-gray-400 text-sm text-right">Custo (Créditos)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recordings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500 text-sm italic">Nenhuma transcrição recente.</td>
                                </tr>
                            ) : (
                                recordings.slice(0, 10).map((rec, i) => {
                                    const mode = modes.find(m => m.name === rec.type) || { multiplier: 1.0 };
                                    const baseMins = Math.ceil(rec.durationSec / 60);
                                    const creditsUsed = Math.ceil(baseMins * mode.multiplier);
                                    return (
                                        <tr key={i} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 pr-4">
                                                <div className="text-sm text-white font-bold truncate max-w-[200px]">{rec.title}</div>
                                            </td>
                                            <td className="py-4 text-sm text-gray-400 whitespace-nowrap">{rec.date}</td>
                                            <td className="py-4">
                                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-neon/10 text-neon border border-neon/20 whitespace-nowrap">
                                                    {rec.type} ({mode.multiplier}x)
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-gray-400">{rec.duration}</td>
                                            <td className="py-4 text-sm font-mono text-red-400 font-bold text-right align-middle">
                                                -{creditsUsed} min
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ user, onUpdateUser, onLogout }: { user: UserProfile, onUpdateUser: (u: Partial<UserProfile>) => void, onLogout: () => void }) => {
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({ name: user.name, email: user.email, whatsapp: user.whatsapp || user.phone, avatarUrl: user.avatarUrl });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        onUpdateUser(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData(prev => ({ ...prev, avatarUrl: result }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in relative z-10 pb-12">
            <h2 className="text-3xl font-bold text-white mb-8">Seu Perfil</h2>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10">
                <div className="flex items-center gap-2 mb-6 text-neon">
                    <UserCog size={24} />
                    <h3 className="text-xl font-bold text-white">Dados da Conta</h3>
                </div>

                <div className="flex items-center gap-6 mb-8">
                    <div
                        className="w-24 h-24 rounded-full bg-black border border-white/10 relative group cursor-pointer overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img src={formData.avatarUrl || user.avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                    <div>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors">Alterar Foto</button>
                        <p className="text-xs text-gray-500 mt-2">JPG ou PNG. Max 2MB.</p>

                        <div className="flex items-center gap-2 mt-4">
                            <span className="px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-neon text-[10px] font-bold uppercase tracking-wider">
                                {user.plan} Active
                            </span>
                            {user.plan === 'Gratuito' && (
                                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                    Selo Plano Grátis
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Nome Completo</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-2">WhatsApp</label>
                            <div className="relative group">
                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="text" value={formData.whatsapp || ''} readOnly className="w-full bg-black/40 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-gray-400 focus:outline-none cursor-default font-mono" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleSave} className={`px-6 py-3 rounded-full font-bold transition-colors ${saved ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                        {saved ? 'Salvo com Sucesso!' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 flex items-center justify-between">
                <div>
                    <h3 className="text-red-500 font-bold mb-1">Encerrar Sessão</h3>
                    <p className="text-gray-400 text-sm">Sair com segurança da sua conta.</p>
                </div>
                <button onClick={onLogout} className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold transition-colors">
                    <LogOut size={18} /> Sair da Conta
                </button>
            </div>
        </div>
    );
};

const ReferralsView = ({ user }: { user: UserProfile }) => {
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const referralLink = `https://falaja.ao/?ref=${user.id}`;

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/referrals`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
                });
                if (res.ok) {
                    const data = await res.json();
                    setReferrals(data.referrals || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReferrals();
    }, []);

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        alert('Link de convite copiado!');
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Indique e Ganhe</h2>
                <p className="text-gray-400">Convide amigos e ganhe créditos quando eles validarem a conta.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-neon/5 rounded-2xl border border-neon/20">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-1">Seu Link de Convite</h3>
                        <p className="text-gray-400 text-sm">Compartilhe este link com quem precisa acelerar suas transcrições.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 p-2 pl-4 rounded-xl">
                        <span className="text-white font-mono text-sm max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{referralLink}</span>
                        <button onClick={copyLink} className="p-2 bg-neon rounded-lg text-black hover:bg-neon-hover transition-colors font-bold"><Copy size={16} /></button>
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-bold text-lg mb-4">Suas Indicações ({referrals.length})</h3>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-neon" /></div>
                    ) : referrals.length === 0 ? (
                        <div className="text-center p-8 text-gray-500 bg-black/20 rounded-xl border border-white/5">
                            Você ainda não convidou nenhum amigo.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {referrals.map((ref: any) => (
                                <div key={ref.id} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neon"><User size={18} /></div>
                                        <div>
                                            <p className="text-white font-bold text-sm">{ref.name}</p>
                                            <p className="text-gray-500 text-xs">{ref.whatsapp}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-bold uppercase">{ref.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const IntegrationsConfigView = () => {
    const [config, setConfig] = useState<any>({
        n8nApiUrl: '',
        n8nId: '',
        n8nWebhookUrl: '',
        n8nWebhookSimple: '',
        paymentWebhookUrl: '',
        storageProvider: 'S3',
        storageBucket: '',
        webhookCadastro: '',
        notifyUserWebhook: '',
        welcomeBonus: '10'
    });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/admin/settings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    const s = data.settings || {};
                    setConfig(prev => ({
                        ...prev,
                        n8nApiUrl: s.n8nApiUrl || '',
                        n8nId: s.n8nId || '',
                        n8nWebhookUrl: s.n8n_webhook_url || s.n8nWebhookUrl || '',
                        n8nWebhookSimple: s.n8n_webhook_simple || 'https://falajaao-n8n-falaja.11ynya.easypanel.host/webhook-test/transcricao_simples',
                        paymentWebhookUrl: s.payment_webhook_url || s.paymentWebhookUrl || '',
                        storageProvider: s.storageProvider || 'S3',
                        storageBucket: s.storageBucket || '',
                        webhookCadastro: s.webhook_cadastro || s.webhookCadastro || '',
                        notifyUserWebhook: s.notify_user_webhook || 'https://falajaao-n8n-falaja.11ynya.easypanel.host/webhook-test/notificar_user',
                        welcomeBonus: s.welcome_bonus || '10'
                    }));
                }
            } catch (err) {
                console.error('Erro ao carregar configurações', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            const payloadToSave = {
                n8nApiUrl: config.n8nApiUrl,
                n8nId: config.n8nId,
                n8n_webhook_url: config.n8nWebhookUrl,
                n8n_webhook_simple: config.n8nWebhookSimple,
                payment_webhook_url: config.paymentWebhookUrl,
                storageProvider: config.storageProvider,
                storageBucket: config.storageBucket,
                webhook_cadastro: config.webhookCadastro,
                notify_user_webhook: config.notifyUserWebhook,
                welcome_bonus: config.welcomeBonus
            };

            const res = await fetch(`${API_URL}/api/admin/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payloadToSave)
            });
            if (res.ok) {
                alert('Configurações salvas com sucesso!');
            } else {
                alert('Erro ao salvar as configurações.');
            }
        } catch (error) {
            console.error(error);
            alert('Falha na conexão com o servidor.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="animate-pulse flex items-center justify-center p-12"><div className="w-8 h-8 rounded-full border-2 border-neon border-t-transparent animate-spin"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-neon/10 rounded-2xl text-neon"><Database size={24} /></div>
                    <div>
                        <h3 className="text-white font-bold text-xl">Integrações & Webhooks</h3>
                        <p className="text-gray-400 text-sm">Configure o n8n e o armazenamento de áudios</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-2">URL da API n8n</label>
                            <input type="text" value={config.n8nApiUrl} onChange={e => setConfig({ ...config, n8nApiUrl: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-2">ID n8n</label>
                            <input type="text" value={config.n8nId} onChange={e => setConfig({ ...config, n8nId: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" />
                        </div>
                        <div className="space-y-2 text-neon">
                            <label className="text-xs font-bold text-neon uppercase ml-2">Bônus de Boas-vindas (Minutos)</label>
                            <input type="number" value={config.welcomeBonus} onChange={e => setConfig({ ...config, welcomeBonus: e.target.value })} className="w-full bg-neon/10 border border-neon/30 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors font-bold" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-4">
                            <h4 className="text-sm font-bold text-neon mb-2">Webhooks de Processamento IA</h4>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Modo Profissional / Padrão (n8n)</label>
                                <input type="text" value={config.n8nWebhookUrl} onChange={e => setConfig({ ...config, n8nWebhookUrl: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" placeholder="https://seu-n8n.com/webhook/padrao..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Modo Simples (n8n)</label>
                                <input type="text" value={config.n8nWebhookSimple} onChange={e => setConfig({ ...config, n8nWebhookSimple: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" placeholder="https://falajaao-n8n-falaja.11ynya.easypanel.host/webhook-test/transcricao_simples..." />
                            </div>
                        </div>

                        <div className="p-4 bg-black/20 border border-white/5 rounded-2xl space-y-4">
                            <h4 className="text-sm font-bold text-neon mb-2">Webhooks Administrativos e Notificações</h4>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Notificação de Usuário (Aprovação Msc)</label>
                                <input type="text" value={config.notifyUserWebhook} onChange={e => setConfig({ ...config, notifyUserWebhook: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" placeholder="https://falajaao-n8n-falaja.11ynya.easypanel.host/webhook-test/notificar_user" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Notificação de Novo Pagamento (Sistema)</label>
                                <input type="text" value={config.paymentWebhookUrl} onChange={e => setConfig({ ...config, paymentWebhookUrl: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" placeholder="Usado internamente para novos pagamentos submetidos..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase ml-2">Novo Cadastro / Envio de Código</label>
                                <input type="text" value={config.webhookCadastro} onChange={e => setConfig({ ...config, webhookCadastro: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" placeholder="https://seu-n8n.com/webhook/..." />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Provedor de Storage Automático</label>
                            <select value={config.storageProvider} onChange={e => setConfig({ ...config, storageProvider: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors appearance-none cursor-pointer">
                                <option value="S3" className="bg-black text-white">AWS S3</option>
                                <option value="GCS" className="bg-black text-white">Google Cloud Storage</option>
                                <option value="Local" className="bg-black text-white">Disco Local</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase ml-2">Bucket / Diretório Base</label>
                            <input type="text" value={config.storageBucket} onChange={e => setConfig({ ...config, storageBucket: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <button onClick={handleSave} disabled={saving} className="w-full bg-neon text-black font-bold py-4 rounded-xl hover:bg-neon-hover transition-colors disabled:opacity-50 flex justify-center items-center gap-2">
                            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {saving ? 'Guardando...' : 'Salvar Configurações de Integração'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, icon: Icon, trend, trendColor }: any) => (
    <div className="relative p-6 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden group hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-neon/5">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">{title}</p>
                <h4 className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">{value}</h4>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 text-neon group-hover:bg-neon group-hover:text-black transition-colors shadow-inner">
                <Icon size={24} />
            </div>
        </div>
        <div className="flex items-center gap-2 relative z-10">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${trend.includes('+') ? 'bg-neon/10 text-neon border border-neon/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'}`}>
                {trend}
            </span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">vs mês anterior</span>
        </div>
    </div>
);

const IaModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 max-w-lg w-full relative overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center text-neon mb-6">
                    <Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Poder da IA 2.0</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                    Nossa IA agora possui novas capacidades para acelerar sua produtividade:
                </p>
                <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-sm text-gray-300 font-medium">
                        <CheckCircle size={20} className="text-neon flex-shrink-0" />
                        <span>Resumo Automático de Reuniões: Destaca pontos importantes.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-300 font-medium">
                        <CheckCircle size={20} className="text-neon flex-shrink-0" />
                        <span>Identificação de Oradores: Saiba exatamente quem falou o quê.</span>
                    </li>
                    <li className="flex gap-3 text-sm text-gray-300 font-medium">
                        <CheckCircle size={20} className="text-neon flex-shrink-0" />
                        <span>Extração Automática de Tarefas (Action Items) direto do áudio.</span>
                    </li>
                </ul>
                <button onClick={onClose} className="w-full py-4 rounded-full bg-neon text-black font-bold hover:bg-neon-hover transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                    Entendi, fantástico!
                </button>
            </div>
        </div>
    );
};

const SuggestionView = ({ onBack }: { onBack: () => void }) => {
    const [suggestionText, setSuggestionText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!suggestionText.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ message: suggestionText })
            });
            if (res.ok) {
                alert('Obrigado pela sua sugestão! Ela nos ajuda muito a melhorar.');
                setSuggestionText('');
                onBack();
            } else {
                alert('Erro ao enviar sugestão. Tente novamente mais tarde.');
            }
        } catch (err) {
            alert('Erro de conexão ao enviar sugestão.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto md:mt-8 pb-8 px-4 md:px-0">
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-6 font-bold text-sm bg-white/5 px-5 py-2.5 rounded-full border border-white/10 w-fit touch-manipulation">
                <ArrowLeft size={16} /> Voltar ao Início
            </button>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/20">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Sugerir Melhoria</h2>
                        <p className="text-sm md:text-base text-gray-400">Toda grande ideia nos ajuda a evoluir. Solte sua voz!</p>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">Sua Ideia / Diagnóstico</label>
                        <textarea
                            value={suggestionText}
                            onChange={(e) => setSuggestionText(e.target.value)}
                            placeholder="Descreva detalhadamente a sua ideia, um problema que encontrou ou alguma nova função que gostaria que criássemos..."
                            className="w-full h-64 bg-black/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-purple-500 focus:outline-none resize-none custom-scrollbar text-base md:text-lg leading-relaxed placeholder-gray-600 transition-all focus:bg-black"
                        ></textarea>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row justify-end gap-4 pt-4">
                        <button onClick={onBack} className="w-full md:w-auto px-8 py-4 rounded-full font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors touch-manipulation">
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !suggestionText.trim()}
                            className="w-full md:w-auto px-10 py-4 rounded-full bg-purple-500 hover:bg-purple-600 border border-purple-400/50 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] touch-manipulation transform md:hover:-translate-y-1"
                        >
                            {isSubmitting ? 'Enviando...' : (
                                <>
                                    Enviar Ideia <Send size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardOverview = ({ setActivePage, user, recentRecordings, totalRecordings, onSwitchMode, onViewRecording }: { setActivePage: (page: string) => void, user: UserProfile, recentRecordings: Recording[], totalRecordings: number, onSwitchMode: (mode: 'simple' | 'professional') => void, onViewRecording: (r: Recording) => void }) => {
    const timeSavedMin = Math.round(user.usedMinutes * 0.75);
    const timeSavedH = Math.floor(timeSavedMin / 60);
    const timeSavedM = timeSavedMin % 60;
    const timeSavedLabel = timeSavedH > 0 ? `${timeSavedH}h${timeSavedM > 0 ? ` ${timeSavedM}m` : ''}` : `${timeSavedM}m`;
    const [iaModalOpen, setIaModalOpen] = useState(false);

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Olá, {user.name.split(' ')[0]}! 👋</h1>
                    <p className="text-sm md:text-base text-gray-400">Aqui está o resumo da sua atividade hoje.</p>
                </div>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <div className="flex w-full md:w-auto bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
                        <button
                            onClick={() => onSwitchMode('simple')}
                            className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-full text-[11px] md:text-xs font-bold transition-all flex items-center gap-1.5 ${user.appMode === 'simple' ? 'bg-neon text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Zap size={14} /> Simples
                        </button>
                        <button
                            onClick={() => {
                                if (user.plan === 'Básico' || user.plan === 'Basic' || user.plan === 'Gratuito') {
                                    alert('O Modo Profissional está disponível apenas em planos superiores. Faça upgrade para acessar!');
                                    return;
                                }
                                onSwitchMode('professional');
                            }}
                            className={`flex-1 md:flex-none justify-center px-4 py-2.5 rounded-full text-[11px] md:text-xs font-bold transition-all flex items-center gap-1.5 ${(user.plan === 'Básico' || user.plan === 'Basic' || user.plan === 'Gratuito') ? 'opacity-50 cursor-not-allowed' : ''} ${user.appMode === 'professional' ? 'bg-neon text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Briefcase size={14} /> Profissional
                            {(user.plan === 'Básico' || user.plan === 'Basic' || user.plan === 'Gratuito') && <Lock size={10} className="ml-1" />}
                        </button>
                    </div>
                    <button
                        onClick={() => setActivePage('suggestions')}
                        className="w-full md:w-auto justify-center px-4 py-3 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white font-bold transition-all flex items-center gap-2"
                        title="Tem uma ideia de melhoria? Conta pra gente!"
                    >
                        <MessageSquare size={18} /> Sugerir Melhoria
                    </button>
                    <button
                        onClick={() => setActivePage('new')}
                        className="w-full md:w-auto justify-center px-6 py-3 rounded-full bg-neon text-black font-bold hover:bg-neon-hover transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105"
                    >
                        <PlusCircle size={20} /> Nova Gravação
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Minutos Usados"
                    value={`${user.usedMinutes} min`}
                    icon={PieChart}
                    trend={user.usedMinutes > 0 ? `+${user.usedMinutes} min` : '+0 min'}
                />
                <SummaryCard
                    title="Gravações"
                    value={totalRecordings}
                    icon={Mic}
                    trend={totalRecordings > 0 ? `+${totalRecordings}` : '+0'}
                />
                <SummaryCard
                    title="Tempo Economizado"
                    value={user.usedMinutes > 0 ? timeSavedLabel : '0m'}
                    icon={Clock}
                    trend={user.usedMinutes > 0 ? `+${timeSavedLabel}` : '+0m'}
                />
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Recentes</h2>
                    <button onClick={() => setActivePage('history')} className="text-sm font-bold text-neon hover:text-white transition-colors">Ver Todos</button>
                </div>

                <div className="space-y-4">
                    {recentRecordings.map((rec) => (
                        <div key={rec.id} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => onViewRecording(rec)}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${rec.type === 'meeting' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                    {rec.type === 'meeting' ? <Users size={20} /> : <FileText size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm group-hover:text-neon transition-colors">
                                        {rec.title.length > 50 ? rec.title.substring(0, 47) + '...' : rec.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">{rec.date} • {rec.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="hidden md:inline-flex px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-gray-400 border border-white/5 uppercase tracking-wider">
                                    {rec.status === 'completed' ? 'Processado' : 'Processando'}
                                </span>
                                <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                    <PlayCircle size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {recentRecordings.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            Nenhuma gravação recente.
                        </div>
                    )}
                </div>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden p-6 md:p-8 flex items-center justify-between border border-white/10 group cursor-pointer hover:border-neon/30 transition-all" onClick={() => setIaModalOpen(true)}>
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 max-w-lg">
                    <h3 className="text-2xl font-bold text-white mb-2">Descubra o Poder da IA 2.0</h3>
                    <p className="text-gray-400 mb-6">Novos recursos de resumo automático e identificação de oradores já disponíveis.</p>
                    <button className="px-6 py-3 rounded-full bg-white/10 text-white font-bold border border-white/10 hover:bg-white/20 transition-all backdrop-blur-md">Saiba Mais</button>
                </div>
                <div className="relative z-10 hidden md:block">
                    <div className="w-32 h-32 bg-neon rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.3)] group-hover:scale-110 transition-transform">
                        <Sparkles className="text-black w-12 h-12 animate-pulse" />
                    </div>
                </div>
            </div>

            <IaModal isOpen={iaModalOpen} onClose={() => setIaModalOpen(false)} />

            <IaModal isOpen={iaModalOpen} onClose={() => setIaModalOpen(false)} />
        </div>
    );
};

const Sidebar = ({ activePage, setActivePage, mobileOpen, setMobileOpen, onLogout, user }: any) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'new', icon: PlusCircle, label: 'Gravar' },
        { id: 'history', icon: History, label: 'Histórico' },
        { id: 'usage', icon: PieChart, label: 'Uso' },
        { id: 'plans', icon: CreditCard, label: 'Planos' },
        { id: 'referrals', icon: Gift, label: 'Indique e Ganhe' },
    ];

    if (user.role === 'admin') {
        menuItems.push({ id: 'admin', icon: ShieldCheck, label: 'Admin' });
    }

    return (
        <aside className={`fixed md:relative z-50 w-80 h-full bg-black/60 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} overflow-y-auto`}>
            <div className="p-10 pb-0 shrink-0">
                <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => setActivePage('dashboard')}>
                    <img src="/logo.png" alt="falajá.ao" className="h-10 object-contain hover:rotate-3 transition-transform" />
                </div>
            </div>

            <nav className="flex-1 px-6 space-y-4">
                <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Menu</p>
                {menuItems.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => { setActivePage(item.id); setMobileOpen(false); }}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                                ? 'bg-neon text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] scale-105'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            {item.label}
                        </button>
                    )
                })}

                <div className="pt-8 mb-8 shrink-0">
                    <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Conta</p>
                    <button
                        onClick={() => { setActivePage('settings'); setMobileOpen(false); }}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-full text-sm font-bold transition-all ${activePage === 'settings' ? 'bg-neon text-black shadow-neon scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <User size={20} /> Perfil
                    </button>
                </div>
            </nav>

            <div className="p-6 shrink-0 mt-auto">
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 p-4 rounded-full bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm group border border-transparent hover:border-red-500/20">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sair
                </button>
            </div>
        </aside>
    );
};

const CheckoutModal = ({ isOpen, onClose, plan, onSubmit }: { isOpen: boolean, onClose: () => void, plan: { name: string, price: string } | null, onSubmit: (id: string, proof?: any) => Promise<boolean | number | string> }) => {
    const [step, setStep] = useState(1);
    const [transId, setTransId] = useState('');
    const [proof, setProof] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dbTransactionId, setDbTransactionId] = useState<number | string | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setTransId('');
            setProof(null);
            setIsUploading(false);
            setDbTransactionId(null);
        }
    }, [isOpen]);

    if (!isOpen || !plan) return null;

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsUploading(true);
        try {
            let base64Proof: string | undefined = undefined;
            if (proof) {
                base64Proof = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target?.result as string;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const MAX_WIDTH = 800;
                            const MAX_HEIGHT = 800;
                            let width = img.width;
                            let height = img.height;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.drawImage(img, 0, 0, width, height);
                                resolve(canvas.toDataURL('image/jpeg', 0.7));
                            } else {
                                resolve(event.target?.result as string); // fallback
                            }
                        };
                        img.onerror = () => resolve(event.target?.result as string); // fallback
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(proof);
                });
            }

            // Await submission
            const success = await onSubmit(transId, base64Proof);

            if (success) {
                if (success !== true) {
                    setDbTransactionId(success);
                }
                setIsUploading(false);
                setStep(4); // Success step
            } else {
                setIsUploading(false);
            }
        } catch (error) {
            setIsUploading(false);
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#111] border border-white/10 rounded-[3rem] p-6 md:p-10 max-w-md w-full relative shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"><X size={24} /></button>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-8 px-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-neon shadow-[0_0_10px_rgba(204,255,0,0.5)]' : 'bg-white/10'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neon/20 shadow-inner">
                                <Zap className="text-neon" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Resumo do Pedido</h2>
                            <p className="text-gray-400 text-sm">Você está prestes a assinar o plano <span className="text-white font-bold">{plan.name}</span></p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Plano</span>
                                <span className="text-white font-bold">{plan.name}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-gray-400">Total a Pagar</span>
                                <span className="text-neon text-xl font-bold">Kz {plan.price}</span>
                            </div>
                        </div>
                        <button onClick={handleNext} className="w-full py-4 rounded-full bg-neon text-black font-bold hover:scale-[1.02] active:scale-95 transition-all">Confirmar Detalhes</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <Smartphone className="text-gray-300" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Pagamento</h2>
                            <p className="text-gray-400 text-sm">Siga os passos abaixo no Multicaixa Express</p>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Número MCX Express</p>
                                <p className="text-xl font-mono font-bold text-white flex items-center justify-between">944442149 <button className="text-neon p-1 hover:bg-neon/10 rounded"><Copy size={16} /></button></p>
                            </div>
                            <div className="text-xs text-gray-400 space-y-2 px-2">
                                <p className="flex gap-2"><span>1.</span> Selecione "Transferência" ou "Pagamento por Referência"</p>
                                <p className="flex gap-2"><span>2.</span> Insira o valor exato: <strong className="text-white">Kz {plan.price}</strong></p>
                                <p className="flex gap-2"><span>3.</span> Guardar o comprovativo (print/PDF) para o próximo passo</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleBack} className="flex-1 py-4 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 transition-colors">Voltar</button>
                            <button onClick={handleNext} className="flex-[2] py-4 rounded-full bg-neon text-black font-bold hover:scale-[1.02] transition-all">Já paguei</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <FileCheck className="text-neon" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Verificação</h2>
                            <p className="text-gray-400 text-sm">Insira o ID e anexe o comprovativo</p>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 mb-1 block">ID da Transação</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 572910384"
                                    value={transId}
                                    onChange={(e) => setTransId(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none transition-colors font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 mb-1 block">Comprovativo (Opcional)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        id="proof-upload"
                                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                        onChange={(e) => setProof(e.target.files?.[0] || null)}
                                    />
                                    <div className="w-full border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 group-hover:border-neon/30 transition-colors bg-black/20">
                                        <UploadCloud size={20} className={proof ? "text-neon" : "text-gray-600"} />
                                        <span className="text-[10px] font-bold text-gray-500">{proof ? proof.name : "Clique ou arraste o comprovativo"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleBack}
                                disabled={isUploading}
                                className="flex-1 py-4 rounded-full bg-white/5 text-white font-bold hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!transId || isUploading}
                                className="flex-[2] py-4 rounded-full bg-neon text-black font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={20} /> : "Finalizar Pedido"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center text-center py-6">
                        <div className="w-24 h-24 rounded-full bg-neon/10 border-4 border-neon/30 flex items-center justify-center text-neon mb-6">
                            <Check size={48} className="animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Pedido Enviado!</h2>
                        <p className="text-gray-400 mb-8 max-w-sm">
                            Sua transação ({transId}) foi recebida com sucesso. Faremos a verificação e liberação do seu pacote/plano o mais breve possível.
                        </p>
                        <button
                            onClick={async () => {
                                if (dbTransactionId) {
                                    const token = localStorage.getItem('token');
                                    await fetch(`${API_URL}/api/payments/${dbTransactionId}/trigger-webhook`, {
                                        method: 'POST',
                                        headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' }
                                    }).catch(console.error);
                                }
                                onClose();
                            }}
                            className="w-full py-4 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/10 select-none"
                        >
                            Ok, Voltar ao Painel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const AdminDashboard = ({ data, onReviewPayment, onDeletePayment, onPlanAction, onModeAction, onPackageAction, onRefresh, onNotifyUser, onLoadAnalytics }: {
    data: AdminData,
    onReviewPayment: (id: number, status: 'approved' | 'rejected') => void,
    onDeletePayment?: (id: number) => void,
    onPlanAction?: (action: 'add' | 'edit' | 'delete', plan?: Plan) => void,
    onModeAction?: (action: 'add' | 'edit' | 'delete', mode?: TranscriptionMode) => void,
    onPackageAction?: (action: 'add' | 'edit' | 'delete', pkg?: CreditPackage) => void,
    onRefresh?: () => void,
    onNotifyUser?: (id: number) => void,
    onLoadAnalytics?: (period: string) => void
}) => {
    const [subTab, setSubTab] = useState<'overview' | 'payments' | 'faturamento' | 'users' | 'plans' | 'modes' | 'integrations' | 'analytics' | 'online_users' | 'suggestions'>('overview');
    const [countdown, setCountdown] = useState(30);
    const [viewingProof, setViewingProof] = useState<string | null>(null);

    // Auto-refresh every 30 seconds with countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    onRefresh?.();
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [onRefresh]);

    const pendingCount = data.payments?.filter((p: any) => p.status === 'pending').length || 0;
    const stats = data.stats;

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Painel Admin</h2>
                    <p className="text-gray-400 text-sm">Gerencie pagamentos, usuários e planos</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { onRefresh?.(); setCountdown(30); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all hover:bg-white/10"
                    >
                        <Activity size={14} className={countdown <= 5 ? 'text-neon animate-pulse' : ''} />
                        Atualizar <span className="font-mono text-neon">{countdown}s</span>
                    </button>
                    <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
                        {['overview', 'payments', 'faturamento', 'users', 'plans', 'modes', 'integrations', 'analytics', 'online_users', 'suggestions'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setSubTab(tab as any)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize whitespace-nowrap ${subTab === tab ? 'bg-neon text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                            >
                                {tab === 'overview' ? 'Geral' : tab === 'payments' ? 'Pagamentos' : tab === 'faturamento' ? 'Faturamento' : tab === 'users' ? 'Usuários' : tab === 'plans' ? 'Planos' : tab === 'integrations' ? 'Integrações' : tab === 'analytics' ? 'Estatísticas' : tab === 'online_users' ? 'Online' : tab === 'suggestions' ? 'Sugestões' : 'Modos IA'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* OVERVIEW TAB */}
            {subTab === 'overview' && (
                <div className="space-y-6">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Usuários Totais', value: stats?.users ?? '—', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                            { label: 'Gravações (24h)', value: stats?.activeRecordings24h ?? '—', icon: Mic, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                            { label: 'Minutos Consumidos', value: stats?.totalMinutesUsed ?? '—', icon: Clock, color: 'text-neon', bg: 'bg-neon/10 border-neon/20' },
                            { label: 'Pagamentos Pendentes', value: stats?.pendingPayments ?? '—', icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6">
                                <div className={`inline-flex p-3 rounded-2xl border mb-4 ${s.bg}`}>
                                    <s.icon className={s.color} size={22} />
                                </div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{s.label}</p>
                                <p className="text-3xl font-bold text-white">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Revenue Summary */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Receipt size={18} className="text-neon" /> Receita por Plano</h3>
                            <div className="space-y-3">
                                {data.plans?.map((p: Plan) => {
                                    const planUsers = data.users?.filter((u: UserProfile) => u.plan === p.name).length || 0;
                                    const revenue = planUsers * p.price_kz;
                                    return (
                                        <div key={p.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-neon" />
                                                <span className="text-sm text-gray-300">{p.name}</span>
                                                <span className="text-xs text-gray-600">({planUsers} users)</span>
                                            </div>
                                            <span className="text-sm font-bold text-white font-mono">Kz {revenue.toLocaleString()}</span>
                                        </div>
                                    );
                                })}
                                {(!data.plans || data.plans.length === 0) && <p className="text-gray-600 text-sm">Sem dados de planos</p>}
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Activity size={18} className="text-green-400" /> Pagamentos Recentes</h3>
                            <div className="space-y-3">
                                {data.payments?.slice(0, 5).map((tx: any) => (
                                    <div key={tx.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-white font-bold">{tx.userName}</p>
                                            <p className="text-xs text-gray-500">{tx.plan_name || tx.type}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold font-mono text-white">Kz {tx.amount_kz}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${(tx.status || 'pending') === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : (tx.status || 'pending') === 'approved' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {(tx.status || 'pending').toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {(!data.payments || data.payments.length === 0) && <p className="text-gray-600 text-sm">Sem pagamentos</p>}
                            </div>
                        </div>
                    </div>

                    {/* Plan Distribution */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><PieChart size={18} className="text-purple-400" /> Distribuição de Usuários por Plano</h3>
                        <div className="flex flex-wrap gap-4">
                            {['Gratuito', ...(data.plans?.map((p: Plan) => p.name) || [])].map(planName => {
                                const count = data.users?.filter((u: UserProfile) => (u.plan || 'Gratuito') === planName).length || 0;
                                const total = data.users?.length || 1;
                                const pct = Math.round((count / total) * 100);
                                return (
                                    <div key={planName} className="flex-1 min-w-[120px]">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-gray-400 font-bold">{planName}</span>
                                            <span className="text-white font-mono">{count}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-neon rounded-full transition-all" style={{ width: `${pct}%` }} />
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-1">{pct}%</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'payments' && (
                <div className="space-y-4">
                    {/* Filter tabs */}
                    <div className="flex gap-2">
                        {['Todos', 'Pendentes', 'Aprovados', 'Rejeitados'].map((f) => {
                            const filterMap: Record<string, string> = { 'Todos': 'all', 'Pendentes': 'pending', 'Aprovados': 'approved', 'Rejeitados': 'rejected' };
                            const count = f === 'Todos' ? data.payments?.length : data.payments?.filter((p: any) => p.status === filterMap[f]).length;
                            return (
                                <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-400">
                                    {f} <span className="bg-white/10 px-1.5 py-0.5 rounded">{count || 0}</span>
                                </span>
                            );
                        })}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="py-6 px-8">Usuário</th>
                                        <th className="py-6">Plano / Tipo</th>
                                        <th className="py-6">Valor</th>
                                        <th className="py-6">ID Transação</th>
                                        <th className="py-6">Data</th>
                                        <th className="py-6">Status</th>
                                        <th className="py-6 px-8 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.payments.map((tx: any) => (
                                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-8">
                                                <p className="text-white font-bold text-sm">{tx.userName}</p>
                                                <p className="text-xs text-gray-500">{tx.userEmail}</p>
                                            </td>
                                            <td className="py-4">
                                                <span className="text-xs font-bold text-gray-300 uppercase">{tx.plan_name || tx.type}</span>
                                            </td>
                                            <td className="py-4 text-white font-mono">Kz {tx.amount_kz}</td>
                                            <td className="py-4 text-gray-400 font-mono text-xs">{tx.transaction_id}</td>
                                            <td className="py-4 text-gray-500 text-xs">{tx.created_at ? new Date(tx.created_at).toLocaleDateString('pt-AO') : '—'}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    tx.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {(tx.status || 'pending').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-8 text-right">
                                                <div className="flex justify-end gap-2 items-center">
                                                    {(tx.status || 'pending') === 'pending' && (
                                                        <>
                                                            {tx.proof_url && (
                                                                <button
                                                                    onClick={() => setViewingProof(tx.proof_url)}
                                                                    className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all flex items-center gap-1 border border-blue-500/10 hover:border-blue-500/30"
                                                                    title="Ver Comprovativo"
                                                                >
                                                                    <FileText size={14} /> Comprovativo
                                                                </button>
                                                            )}
                                                            <button onClick={() => onReviewPayment(tx.id, 'rejected')} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all" title="Rejeitar"><X size={16} /></button>
                                                            <button onClick={() => onReviewPayment(tx.id, 'approved')} className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all" title="Aprovar"><Check size={16} /></button>
                                                        </>
                                                    )}
                                                    {(tx.status || 'pending') !== 'pending' && (
                                                        <>
                                                            {tx.status === 'approved' && onNotifyUser && (
                                                                <button onClick={() => onNotifyUser(tx.id)} className="px-3 py-1.5 rounded-lg bg-neon/10 text-neon hover:bg-neon/20 text-xs font-bold transition-all flex items-center gap-1 border border-neon/10 hover:border-neon/30 hover:scale-105" title="Notificar Usuário via Webhook">
                                                                    <Send size={14} /> Notificar
                                                                </button>
                                                            )}
                                                            {tx.proof_url && tx.status === 'rejected' && (
                                                                <button
                                                                    onClick={() => setViewingProof(tx.proof_url)}
                                                                    className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all flex items-center gap-1 border border-blue-500/10 hover:border-blue-500/30"
                                                                    title="Ver Comprovativo"
                                                                >
                                                                    <FileText size={14} /> Histórico
                                                                </button>
                                                            )}
                                                            <button onClick={() => onDeletePayment?.(tx.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all" title="Excluir Transação Permanentemente"><Trash2 size={16} /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {data.payments.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-20 text-center text-gray-500 font-bold">Nenhum pagamento registrado</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'faturamento' && (
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-5 md:p-8">
                        <h3 className="text-white font-bold text-2xl mb-2 flex items-center gap-2"><Receipt className="text-neon" /> Relatório de Faturamento</h3>
                        <p className="text-gray-400 text-sm mb-8">Detalhamento completo de todas as receitas geradas pela plataforma.</p>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 md:p-6">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Receita Total</p>
                                <p className="text-3xl font-bold text-neon font-mono">
                                    Kz {data.payments.filter((p: any) => p.status === 'approved').reduce((acc: number, curr: any) => {
                                        const val = typeof curr.amount_kz === 'string' ? parseFloat(curr.amount_kz.replace(/[^\d.-]/g, '')) : curr.amount_kz;
                                        return acc + (isNaN(val) ? 0 : val);
                                    }, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 md:p-6">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Pagamentos Aprovados</p>
                                <p className="text-3xl font-bold text-white font-mono">
                                    {data.payments.filter((p: any) => p.status === 'approved').length}
                                </p>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 md:p-6">
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Receita Pendente</p>
                                <p className="text-xl font-bold text-yellow-500 font-mono">
                                    Kz {data.payments.filter((p: any) => p.status === 'pending').reduce((acc: number, curr: any) => {
                                        const val = typeof curr.amount_kz === 'string' ? parseFloat(curr.amount_kz.replace(/[^\d.-]/g, '')) : curr.amount_kz;
                                        return acc + (isNaN(val) ? 0 : val);
                                    }, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="py-4">Transação</th>
                                        <th className="py-4">Cliente</th>
                                        <th className="py-4">Serviço</th>
                                        <th className="py-4">Status</th>
                                        <th className="py-4 text-right">Valor Pago</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.payments.map((tx: any) => (
                                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 text-gray-400 font-mono text-xs">{tx.transaction_id}</td>
                                            <td className="py-4 text-white font-bold text-sm">{tx.userName}</td>
                                            <td className="py-4 text-xs font-bold text-gray-300 uppercase">{tx.plan_name || tx.type}</td>
                                            <td className="py-4 text-xs">
                                                <span className={`${tx.status === 'pending' ? 'text-yellow-500' : tx.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {(tx.status || 'pending').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className={`py-4 text-right font-mono font-bold ${tx.status === 'approved' ? 'text-neon' : 'text-gray-500'}`}>
                                                Kz {tx.amount_kz}
                                            </td>
                                        </tr>
                                    ))}
                                    {data.payments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-10 text-center text-gray-500">Nenhuma receita registrada ainda.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'modes' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
                        <div>
                            <h3 className="text-white font-bold text-xl">Configuração de Modos IA</h3>
                            <p className="text-gray-400 text-sm">Gerencie multiplicadores de consumo para cada tipo de processamento.</p>
                        </div>
                        <button
                            onClick={() => onModeAction?.('add')}
                            className="bg-neon text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-[0_0_20px_rgba(180,255,0,0.3)] transition-all"
                        >
                            <Plus size={18} /> Novo Modo
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.modes?.map((mode: TranscriptionMode) => (
                            <div key={mode.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 hover:border-neon/30 transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-neon/10 rounded-2xl text-neon group-hover:bg-neon group-hover:text-black transition-all">
                                            <Zap size={24} />
                                        </div>
                                        <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 text-neon font-mono font-bold">
                                            {mode.multiplier}x
                                        </div>
                                    </div>
                                    <h4 className="text-white font-bold text-lg mb-2">{mode.name}</h4>
                                    <p className="text-gray-400 text-xs lines-clamp-2 mb-4 h-8">{mode.description}</p>
                                </div>
                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                    <button onClick={() => onModeAction?.('edit', mode)} className="flex-1 py-2 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">Editar</button>
                                    <button onClick={() => onModeAction?.('delete', mode)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><X size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {subTab === 'integrations' && (
                <IntegrationsConfigView />
            )}

            {subTab === 'users' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm">{data.users?.length || 0} usuários registados</p>
                        <div className="flex gap-3 text-xs">
                            {['admin', 'user'].map(role => (
                                <span key={role} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold">
                                    {role === 'admin' ? '👑' : '👤'} {role} — {data.users?.filter((u: UserProfile) => u.role === role).length || 0}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-4">
                        {data.users.map((u: UserProfile) => (
                            <div key={u.email} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-white font-bold text-lg">
                                        {u.name ? u.name.substring(0, 1) : '?'}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{u.name}</h4>
                                        <p className="text-xs text-gray-500">{u.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Plano</p>
                                        <p className="text-xs text-neon font-bold">{u.plan}</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Uso</p>
                                        <p className="text-xs text-white font-mono">{u.usedMinutes} / {u.credits} min</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/5">
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Nível</p>
                                        <p className="text-xs text-blue-400 font-bold uppercase">{u.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {subTab === 'plans' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Gestão de Planos</h3>
                        <button onClick={() => onPlanAction?.('add')} className="px-6 py-3 rounded-full bg-neon text-black font-bold flex items-center gap-2 hover:scale-105 transition-all">
                            <Plus size={18} /> Novo Plano
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.plans.map((p: Plan) => (
                            <div key={p.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{p.name}</h4>
                                        <p className="text-neon font-bold">Kz {p.price_kz}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onPlanAction?.('edit', p)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"><Edit size={16} /></button>
                                        <button onClick={() => onPlanAction?.('delete', p)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-6 flex-1">
                                    <p className="text-xs text-gray-400 flex items-center gap-2"><Clock size={14} /> {p.minutes} minutos</p>
                                    <div className="flex flex-wrap gap-1">
                                        {p.features.slice(0, 3).map((f: string, i: number) => (
                                            <span key={i} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500">{f}</span>
                                        ))}
                                    </div>
                                </div>
                                {p.is_popular && <span className="text-[10px] text-neon font-bold uppercase tracking-widest">Destaque Ativo</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {subTab === 'packages' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Gestão de Pacotes de Crédito</h3>
                        <button onClick={() => onPackageAction?.('add')} className="px-6 py-3 rounded-full bg-neon text-black font-bold flex items-center gap-2 hover:scale-105 transition-all">
                            <Plus size={18} /> Novo Pacote
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.creditPackages?.map((p: CreditPackage) => (
                            <div key={p.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{p.name}</h4>
                                        <p className="text-neon font-bold text-xl mt-1">Kz {p.price_kz}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => onPackageAction?.('edit', p)} className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors"><Edit size={16} /></button>
                                        <button onClick={() => onPackageAction?.('delete', p)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div>
                                    <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neon/10 flex items-center justify-center text-neon">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400 font-medium">Bônus de Gravação</p>
                                            <p className="text-lg text-white font-bold">+{p.minutes} Minutos</p>
                                        </div>
                                    </div>
                                    {!p.is_active && <p className="text-xs text-red-400 mt-4 text-center font-bold uppercase tracking-wider">Pacote Inativo</p>}
                                </div>
                            </div>
                        ))}
                        {(!data.creditPackages || data.creditPackages.length === 0) && (
                            <div className="col-span-full py-12 text-center border border-dashed border-white/20 rounded-3xl">
                                <p className="text-gray-500 font-medium">Nenhum pacote de crédito criado.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {subTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Activity size={20} className="text-neon" /> Estatísticas (Visitas)</h3>
                            <select onChange={(e) => onLoadAnalytics?.(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-neon focus:outline-none text-xs font-bold">
                                <option value="weekly">Última Semana</option>
                                <option value="monthly">Último Mês</option>
                                <option value="semiannual">Último Semestre</option>
                                <option value="annual">Último Ano</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-end gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {data.analytics && data.analytics.length > 0 ? data.analytics.map((v: any, i: number) => {
                                const maxCount = Math.max(...data.analytics!.map((a: any) => a.count), 1);
                                const height = (v.count / maxCount) * 100;
                                return (
                                    <div key={i} className="flex flex-col items-center flex-1 min-w-[30px] group transition-all">
                                        <div className="w-full bg-neon/20 rounded-t-sm hover:bg-neon transition-all relative" style={{ height: `${height}%`, minHeight: '4px' }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                                {v.count} acessos
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-500 mt-2 truncate max-w-full" title={new Date(v.date).toLocaleDateString('pt-AO')}>{new Date(v.date).toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit' })}</span>
                                    </div>
                                );
                            }) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                    <Activity size={32} className="mb-2 opacity-50" />
                                    <span className="font-bold text-sm">Sem visitas no período selecionado</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'online_users' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Activity size={24} className="text-green-400" />
                            <h3 className="text-xl font-bold text-white">Usuários Online</h3>
                            <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                {data.onlineUsers?.length || 0} online (5min)
                            </span>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.onlineUsers?.map((u: any) => (
                                <div key={u.id} className="bg-black/30 border border-white/5 p-4 rounded-2xl flex items-center gap-4 hover:border-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center relative shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                                        <User size={20} />
                                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#111]"></div>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm truncate">{u.name}</p>
                                        <p className="text-xs text-gray-500 font-mono">Ativo às {new Date(u.last_active_at).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))}
                            {(!data.onlineUsers || data.onlineUsers.length === 0) && (
                                <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                                    <p className="text-gray-500 font-medium text-sm">Nenhum usuário ativo recentemente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {subTab === 'suggestions' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><AlertCircle size={20} className="text-purple-400" /> Sugestões e Melhorias</h3>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-gray-400 border border-white/10">{data.suggestions?.length || 0} Total</span>
                    </div>
                    <div className="grid gap-4">
                        {data.suggestions?.map((s: any) => (
                            <div key={s.id} className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-5 relative group">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-3 border-b border-white/5 gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5">
                                            <User size={14} className="text-gray-300" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-wide">{s.userName}</p>
                                            <p className="text-[10px] text-gray-500 font-mono">{s.whatsapp || '—'}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                                        {new Date(s.created_at).toLocaleDateString('pt-AO')}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{s.message}</p>
                            </div>
                        ))}
                        {(!data.suggestions || data.suggestions.length === 0) && (
                            <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl">
                                <AlertCircle size={48} className="text-gray-600 mb-4 mx-auto" />
                                <p className="text-gray-500 font-bold">Nenhuma sugestão recebida ainda.</p>
                                <p className="text-xs text-gray-600 mt-2">Assim que os usuários enviarem ideias, elas aparecerão aqui.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}



            {/* View Proof Modal */}
            {viewingProof && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setViewingProof(null)}>
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <a href={viewingProof} download="comprovativo.png" className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-xl border border-white/10 transition-colors">
                                <Download size={24} />
                            </a>
                            <button onClick={() => setViewingProof(null)} className="bg-black/50 hover:bg-red-500/20 text-white hover:text-red-500 p-3 rounded-full backdrop-blur-xl border border-white/10 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <img
                            src={viewingProof}
                            alt="Comprovativo"
                            className="max-w-full max-h-[85vh] object-contain rounded-xl border border-white/10 shadow-2xl"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                alert('Erro ao carregar o comprovativo. Pode estar corrompido ou o formato não é suportado.');
                                setViewingProof(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const ModeModal = ({ isOpen, mode, onClose, onSave }: { isOpen: boolean, mode?: TranscriptionMode | null, onClose: () => void, onSave: (data: Partial<TranscriptionMode>) => void }) => {
    const [name, setName] = useState('');
    const [multiplier, setMultiplier] = useState('1.0');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(mode?.name || '');
            setMultiplier(mode?.multiplier?.toString() || '1.0');
            setDescription(mode?.description || '');
        }
    }, [isOpen, mode]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
                <h3 className="text-xl font-bold text-white mb-6">{mode ? 'Editar Modo' : 'Novo Modo IA'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Nome do Modo</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Multiplicador (Ex: 1.5)</label>
                        <input type="number" step="0.1" value={multiplier} onChange={e => setMultiplier(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Descrição</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none h-24 resize-none" />
                    </div>
                </div>
                <button onClick={() => onSave({ name, multiplier: parseFloat(multiplier) || 1.0, description })} className="w-full mt-8 py-3 rounded-xl bg-neon text-black font-bold hover:scale-[1.02] transition-transform">Salvar Modo</button>
            </div>
        </div>
    );
};

const PackageModal = ({ isOpen, pkg, onClose, onSave }: { isOpen: boolean, pkg?: CreditPackage | null, onClose: () => void, onSave: (data: Partial<CreditPackage>) => void }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [minutes, setMinutes] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setName(pkg?.name || '');
            setPrice(pkg?.price_kz?.toString() || '');
            setMinutes(pkg?.minutes?.toString() || '');
            setIsActive(pkg?.is_active ?? true);
        }
    }, [isOpen, pkg]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>
                <h3 className="text-2xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {pkg ? 'Editar Pacote' : 'Novo Pacote'}
                </h3>
                <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div>
                        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Nome do Pacote</label>
                        <input type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Pacote 60 Minutos" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Preço (Kz)</label>
                            <input type="number" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none" value={price} onChange={e => setPrice(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 block">Minutos</label>
                            <input type="number" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none" value={minutes} onChange={e => setMinutes(e.target.value)} />
                        </div>
                    </div>
                    <label className="flex items-center gap-3 mt-4 text-sm text-gray-400 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-neon border-neon text-black' : 'border-gray-600 group-hover:border-neon'}`}>
                            {isActive && <Check size={14} strokeWidth={3} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        <span className="text-white">Pacote Ativo</span>
                    </label>
                    <button onClick={() => onSave({ name, price_kz: price, minutes: Number(minutes), is_active: isActive })} className="w-full py-4 rounded-xl bg-neon text-black font-bold hover:bg-neon-hover mt-6">
                        Salvar Pacote
                    </button>
                </div>
            </div>
        </div>
    );
};

const PlanModal = ({ isOpen, plan, onClose, onSave }: { isOpen: boolean, plan?: Plan | null, onClose: () => void, onSave: (data: Partial<Plan>) => void }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('0');
    const [minutes, setMinutes] = useState('0');
    const [features, setFeatures] = useState('');
    const [isPopular, setIsPopular] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(plan?.name || '');
            setPrice(plan?.price_kz?.toString() || '0');
            setMinutes(plan?.minutes?.toString() || '0');
            setFeatures(plan?.features?.join(', ') || '');
            setIsPopular(plan?.is_popular || false);
        }
    }, [isOpen, plan]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 max-w-md w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
                <h3 className="text-xl font-bold text-white mb-6">{plan ? 'Editar Plano' : 'Novo Plano'}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Nome do Plano</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Preço (Kz)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Minutos</label>
                            <input type="number" value={minutes} onChange={e => setMinutes(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase font-bold ml-1 mb-1 block">Recursos (separados por vírgula)</label>
                        <textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="Ex: 60 minutos/mês, Só Modo Simples, -Sem Suporte" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon focus:outline-none h-24 resize-none" />
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                        <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} className="w-5 h-5 accent-neon" />
                        <span className="text-sm font-bold text-white">Destacar como Mais Popular</span>
                    </label>
                </div>
                <button onClick={() => onSave({ name, price_kz: parseFloat(price) || 0, minutes: parseInt(minutes) || 0, features: features.split(',').map(f => f.trim()).filter(f => f !== ''), is_popular: isPopular })} className="w-full mt-8 py-3 rounded-xl bg-neon text-black font-bold hover:scale-[1.02] transition-transform">Salvar Plano</button>
            </div>
        </div>
    );
};

const Dashboard = ({ user, onLogout }: { user: UserProfile, onLogout: () => void }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');
    const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<{ name: string, price: string } | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [globalModes, setGlobalModes] = useState<TranscriptionMode[]>([]);

    const [adminData, setAdminData] = useState<AdminData>({ payments: [], users: [], stats: null, plans: [], modes: [] });

    const [modeModalData, setModeModalData] = useState<{ isOpen: boolean, mode?: TranscriptionMode | null }>({ isOpen: false, mode: null });
    const [planModalData, setPlanModalData] = useState<{ isOpen: boolean, plan?: Plan | null }>({ isOpen: false, plan: null });
    const [packageModalData, setPackageModalData] = useState<{ isOpen: boolean, pkg?: CreditPackage | null }>({ isOpen: false, pkg: null });

    // --- LOCAL STATE ---
    const [userProfile, setUserProfile] = useState<UserProfile>(user);
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    // Using global API_URL

    // --- DATA FETCHING ---
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            const [recRes, transRes, plansRes, modesRes, meRes] = await Promise.all([
                fetch(`${API_URL}/api/recordings`, { headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }),
                fetch(`${API_URL}/api/payments/my`, { headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } }),
                fetch(`${API_URL}/api/plans`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                fetch(`${API_URL}/api/modes`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                fetch(`${API_URL}/api/auth/me`, { headers: { 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' } })
            ]);

            if (recRes.ok) {
                const data = await recRes.json();
                setRecordings(data.recordings);
            }
            if (transRes.ok) {
                const data = await transRes.json();
                setTransactions(data.transactions);
            }
            if (plansRes.ok) {
                const data = await plansRes.json();
                setPlans(data.plans);
            }
            if (modesRes.ok) {
                const data = await modesRes.json();
                setGlobalModes(data.modes);
            }
            if (meRes.ok) {
                const data = await meRes.json();
                setUserProfile(data.user);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const role = userProfile.role || user.role;
        if (role === 'admin') {
            const fetchAdminData = async () => {
                try {
                    const [pData, uData, sData, plansResAdmin, modesRes, packagesRes, onlineData, suggData] = await Promise.all([
                        apiCall('/api/admin/payments', 'GET').catch(e => ({ transactions: [] })),
                        apiCall('/api/admin/users', 'GET').catch(e => ({ users: [] })),
                        apiCall('/api/admin/stats', 'GET').catch(e => ({ stats: null })),
                        fetch(`${API_URL}/api/plans`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
                            .then(r => r.json())
                            .catch(e => ({ plans: [] })),
                        apiCall('/api/admin/modes', 'GET').catch(e => ({ modes: [] })),
                        apiCall('/api/admin/credit-packages', 'GET').catch(e => ({ packages: [] })),
                        apiCall('/api/admin/online-users', 'GET').catch(e => ({ onlineUsers: [] })),
                        apiCall('/api/admin/suggestions', 'GET').catch(e => ({ suggestions: [] }))
                    ]);
                    setAdminData({
                        payments: pData.transactions || [],
                        users: uData.users || [],
                        stats: sData || null,
                        plans: plansResAdmin.plans || [],
                        modes: modesRes.modes || [],
                        creditPackages: packagesRes.packages || [],
                        onlineUsers: onlineData.onlineUsers || [],
                        suggestions: suggData.suggestions || [],
                        analytics: []
                    });
                } catch (err) {
                    console.error('Error fetching admin data:', err);
                }
            };
            fetchAdminData();
        }
    }, [userProfile.role, user.role]);

    // --- ACTIONS ---

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const apiCall = async (endpoint: string, method: string, body?: any) => {
        const token = localStorage.getItem('token');
        const url = `${API_URL}${endpoint}`;
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
        };
        if (body) {
            headers['Content-Type'] = 'application/json';
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`API Error on ${url} (${response.status}):`, errorText);
                let msg = 'Erro na requisição';
                try {
                    const errorData = JSON.parse(errorText);
                    msg = errorData.error || msg;
                } catch (e) {
                    msg = `Erro do servidor (${response.status}). Verifique o link do ngrok.`;
                }
                throw new Error(msg);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                const text = await response.text();
                console.error(`Expected JSON but got ${contentType} from ${url}:`, text.substring(0, 100));
                throw new Error("A resposta do servidor não é um JSON válido. Verifique se o backend está rodando e se o ngrok está correto.");
            }
        } catch (err: any) {
            console.error(`Fetch failed for ${url}:`, err);
            showToast(err.message || 'Erro de conexão', 'error');
            throw err;
        }
    };

    const handleSaveRecording = async (newRecording: Recording) => {
        try {
            const data = await apiCall('/api/recordings', 'POST', {
                title: newRecording.title,
                duration: newRecording.duration,
                durationSec: newRecording.durationSec,
                type: newRecording.type,
                transcription: newRecording.transcription,
                summary: newRecording.summary,
                actionItems: newRecording.actionItems
            });

            setRecordings([data.recording, ...recordings]);

            // Refresh user profile for usedMinutes
            const meData = await apiCall('/api/auth/me', 'GET');
            setUserProfile(meData.user);

            setCurrentRecording(data.recording);
            setActivePage('view_recording');
            showToast('Gravação salva com sucesso!');
        } catch (err: any) {
            console.error('handleSaveRecording error:', err);
            showToast(err.message || 'Erro ao salvar gravação no servidor', 'error');
            throw err;
        }
    };

    const handleDeleteRecording = async (id: number) => {
        try {
            await apiCall(`/api/recordings/${id}`, 'DELETE');
            setRecordings(recordings.filter(r => r.id !== id));
            showToast('Gravação excluída', 'info');
            if (currentRecording?.id === id) setActivePage('history');
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewRecording = (recording: Recording) => {
        setCurrentRecording(recording);
        setActivePage('view_recording');
    };

    const handleUpdateUser = async (updates: Partial<UserProfile>) => {
        try {
            const data = await apiCall('/api/user/profile', 'PATCH', updates);
            setUserProfile(data.user);
            showToast('Perfil atualizado com sucesso!');
        } catch (err) {
            console.error(err);
        }
    };

    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

    const handleAddCredits = () => {
        setIsCreditModalOpen(true);
    };

    const handleSelectCreditPackage = (pkg: { name: string, price: string }) => {
        setIsCreditModalOpen(false);
        setPendingPlan(pkg);
        setIsCheckoutModalOpen(true);
    };

    const handleUpgradePlan = async (plan: 'Premium' | 'Business') => {
        if (userProfile.plan === plan) {
            showToast(`Você já possui o plano ${plan}`, 'info');
            return;
        }
        // This function is now deprecated as PlansView handles the logic directly
        // via its onUpgrade prop which sets pendingPlan and opens the modal.
        // Keeping it for now in case it's called from somewhere else.
        try {
            const price = plan === 'Premium' ? '15.000' : '45.000';
            setPendingPlan({ name: plan, price });
            setIsCheckoutModalOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitTransaction = async (transId: string, proofBase64?: any) => {
        if (!pendingPlan) return false;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/payments/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    type: 'plan_upgrade',
                    planName: pendingPlan?.name,
                    amountKz: pendingPlan?.price,
                    transactionId: transId,
                    proofBase64
                })
            });

            if (res.ok) {
                const data = await res.json();

                // Refresh ALL data to ensure immediate visibility everywhere
                await fetchData();

                // If user is admin, also refresh admin view
                if (userProfile.role === 'admin') {
                    const [pData, uData, sData, plansResAdmin] = await Promise.all([
                        apiCall('/api/admin/payments', 'GET'),
                        apiCall('/api/admin/users', 'GET'),
                        apiCall('/api/admin/stats', 'GET'),
                        fetch(`${API_URL}/api/plans`, { headers: { 'ngrok-skip-browser-warning': 'true' } }).then(r => r.json())
                    ]);
                    setAdminData({ payments: pData.transactions, users: uData.users, stats: sData, plans: plansResAdmin.plans, modes: adminData.modes });
                }
                return data.transaction?.id || true;
            } else {
                const error = await res.json();
                showToast(error.error || 'Erro ao submeter pagamento', 'error');
                return false;
            }
        } catch (error) {
            showToast('Erro de conexão com o servidor', 'error');
            return false;
        }
    };

    const handleSwitchMode = async (mode: 'simple' | 'professional') => {
        try {
            const data = await apiCall('/api/user/mode', 'PATCH', { mode });
            setUserProfile(prev => ({ ...prev, appMode: data.user.appMode }));
            showToast(`Modo alterado para: ${mode === 'simple' ? 'Simples' : 'Profissional'}`, 'success');
        } catch (err) {
            showToast('Erro ao alterar modo', 'error');
        }
    };

    const handleReviewPayment = async (id: number, status: 'approved' | 'rejected') => {
        try {
            await apiCall(`/api/admin/payments/${id}/review`, 'POST', { status });
            showToast(`Pagamento ${status === 'approved' ? 'aprovado' : 'rejeitado'}`, 'success');
            // Refresh admin data and user profile
            const [pData, uData, sData, plansResAdmin, meData] = await Promise.all([
                apiCall('/api/admin/payments', 'GET'),
                apiCall('/api/admin/users', 'GET'),
                apiCall('/api/admin/stats', 'GET'),
                fetch(`${API_URL}/api/plans`).then(r => r.json()),
                apiCall('/api/auth/me', 'GET')
            ]);
            setAdminData(prev => ({ ...prev, payments: pData.transactions, users: uData.users, stats: sData, plans: plansResAdmin.plans }));
            setUserProfile(meData.user);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNotifyUser = async (id: number) => {
        try {
            await apiCall(`/api/admin/payments/${id}/notify-user`, 'POST');
            showToast('Usuário notificado com sucesso via webhook!', 'success');
        } catch (err: any) {
            showToast(err.message || 'Erro ao notificar usuário', 'error');
        }
    };

    const fetchAnalytics = async (period: string) => {
        try {
            const res = await apiCall(`/api/admin/analytics?period=${period}`, 'GET');
            setAdminData(prev => ({ ...prev, analytics: res.visits || [] }));
        } catch (err) {
            showToast('Erro ao carregar estatísticas', 'error');
        }
    };

    const handleDeletePayment = async (id: number) => {
        if (!confirm('Deseja realmente excluir esta transação?')) return;
        try {
            await apiCall(`/api/admin/payments/${id}`, 'DELETE');
            showToast('Pagamento excluído', 'info');
            // Refresh admin data
            const [pData, sData] = await Promise.all([
                apiCall('/api/admin/payments', 'GET'),
                apiCall('/api/admin/stats', 'GET')
            ]);
            setAdminData(prev => ({ ...prev, payments: pData.transactions, stats: sData }));
        } catch (err: any) {
            showToast(err.message || 'Erro ao excluir pagamento', 'error');
        }
    };

    const handleModeAction = async (action: 'add' | 'edit' | 'delete', mode?: TranscriptionMode) => {
        try {
            if (action === 'delete' && mode) {
                if (!confirm(`Tem certeza que deseja excluir o modo ${mode.name}?`)) return;
                await apiCall(`/api/admin/modes/${mode.id}`, 'DELETE');
                showToast('Modo excluído com sucesso!', 'success');
                const modesRes = await apiCall('/api/admin/modes', 'GET');
                setAdminData(prev => ({ ...prev, modes: modesRes.modes }));
            } else if (action === 'add' || action === 'edit') {
                setModeModalData({ isOpen: true, mode: action === 'edit' ? mode : null });
            }
        } catch (err: any) {
            showToast(err.message || 'Erro ao processar ação no modo', 'error');
        }
    };

    const handlePlanAction = async (action: 'add' | 'edit' | 'delete', plan?: Plan) => {
        const token = localStorage.getItem('token');
        try {
            if (action === 'delete' && plan) {
                if (!confirm(`Tem certeza que deseja excluir o plano ${plan.name}?`)) return;
                const res = await fetch(`${API_URL}/api/admin/plans/${plan.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    showToast('Plano excluído com sucesso!', 'success');
                    const plansRes = await fetch(`${API_URL}/api/plans`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
                    if (plansRes.ok) {
                        const plansData = await plansRes.json();
                        setPlans(plansData.plans);
                        setAdminData(prev => ({ ...prev, plans: plansData.plans }));
                    }
                }
            } else if (action === 'add' || action === 'edit') {
                setPlanModalData({ isOpen: true, plan: action === 'edit' ? plan : null });
            }
        } catch (error) {
            showToast('Erro ao processar ação do plano', 'error');
        }
    };

    const handleSaveModeModal = async (data: Partial<TranscriptionMode>) => {
        try {
            if (modeModalData.mode) {
                await apiCall(`/api/admin/modes/${modeModalData.mode.id}`, 'PATCH', data);
                showToast('Modo atualizado com sucesso!', 'success');
            } else {
                await apiCall('/api/admin/modes', 'POST', data);
                showToast('Modo criado com sucesso!', 'success');
            }
            setModeModalData({ isOpen: false, mode: null });
            const modesRes = await apiCall('/api/admin/modes', 'GET');
            setAdminData(prev => ({ ...prev, modes: modesRes.modes }));
        } catch (err: any) {
            showToast(err.message || 'Erro ao salvar modo', 'error');
        }
    };

    const handleSavePlanModal = async (data: Partial<Plan>) => {
        const token = localStorage.getItem('token');
        const url = planModalData.plan ? `${API_URL}/api/admin/plans/${planModalData.plan.id}` : `${API_URL}/api/admin/plans`;
        const method = planModalData.plan ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                showToast(`Plano ${planModalData.plan ? 'atualizado' : 'criado'} com sucesso!`, 'success');
                setPlanModalData({ isOpen: false, plan: null });
                const plansRes = await fetch(`${API_URL}/api/plans`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
                if (plansRes.ok) {
                    const plansData = await plansRes.json();
                    setPlans(plansData.plans);
                    setAdminData(prev => ({ ...prev, plans: plansData.plans }));
                }
            } else {
                const error = await res.json();
                showToast(error.error || 'Erro ao salvar plano', 'error');
            }
        } catch (error) {
            showToast('Erro ao salvar plano', 'error');
        }
    };

    const handlePackageAction = async (action: 'add' | 'edit' | 'delete', pkg?: CreditPackage) => {
        try {
            if (action === 'delete' && pkg) {
                if (!confirm(`Tem certeza que deseja excluir o pacote ${pkg.name}?`)) return;
                await apiCall(`/api/admin/credit-packages/${pkg.id}`, 'DELETE');
                showToast('Pacote excluído com sucesso!', 'success');
                const pRes = await apiCall('/api/admin/credit-packages', 'GET');
                setAdminData(prev => ({ ...prev, creditPackages: pRes.packages }));
            } else if (action === 'add' || action === 'edit') {
                setPackageModalData({ isOpen: true, pkg: action === 'edit' ? pkg : null });
            }
        } catch (err: any) {
            showToast(err.message || 'Erro ao processar ação no pacote', 'error');
        }
    };

    const handleSavePackageModal = async (data: Partial<CreditPackage>) => {
        try {
            if (packageModalData.pkg) {
                await apiCall(`/api/admin/credit-packages/${packageModalData.pkg.id}`, 'PATCH', data);
                showToast('Pacote atualizado com sucesso!', 'success');
            } else {
                await apiCall('/api/admin/credit-packages', 'POST', data);
                showToast('Pacote criado com sucesso!', 'success');
            }
            setPackageModalData({ isOpen: false, pkg: null });
            const pRes = await apiCall('/api/admin/credit-packages', 'GET');
            setAdminData(prev => ({ ...prev, creditPackages: pRes.packages }));
        } catch (err: any) {
            showToast(err.message || 'Erro ao processar pacote', 'error');
        }
    };

    const handleUpdateRecording = async (id: number, updates: Partial<Recording>) => {
        try {
            const data = await apiCall(`/api/recordings/${id}`, 'PATCH', updates);
            setRecordings(prev => prev.map(r => r.id === id ? { ...r, ...data.recording } : r));
            if (currentRecording && currentRecording.id === id) {
                setCurrentRecording({ ...currentRecording, ...data.recording });
            }
            showToast('Alterações salvas');
        } catch (err) {
            console.error(err);
        }
    };

    const renderContent = () => {
        if (isInitialLoading) return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-neon w-12 h-12" />
            </div>
        );

        switch (activePage) {
            case 'new': return <AudioOrb onSave={handleSaveRecording} userMode={userProfile.appMode || 'professional'} userPlan={userProfile.plan} userCredits={userProfile.credits} />;
            case 'suggestions': return <SuggestionView onBack={() => setActivePage('dashboard')} />;
            case 'dashboard': return <DashboardOverview setActivePage={setActivePage} user={userProfile} recentRecordings={recordings.slice(0, 3)} totalRecordings={recordings.length} onSwitchMode={handleSwitchMode} onViewRecording={handleViewRecording} />;
            case 'history': return <HistoryView recordings={recordings} onDelete={handleDeleteRecording} onView={handleViewRecording} />;
            case 'usage': return <UsageView stats={userProfile} setActivePage={setActivePage} onAddCredits={handleAddCredits} transactions={transactions} recordings={recordings} modes={globalModes} />;
            case 'plans':
                return <PlansView
                    activePlan={userProfile.plan || 'Gratuito'}
                    plans={plans}
                    transactions={transactions}
                    onUpgrade={(planName) => {
                        const plan = plans.find(p => p.name === planName);
                        if (plan) {
                            setPendingPlan({ name: plan.name, price: plan.price_kz.toString() });
                            setIsCheckoutModalOpen(true);
                        }
                    }}
                />;
            case 'admin': return <AdminDashboard data={adminData} onReviewPayment={handleReviewPayment} onDeletePayment={handleDeletePayment} onPlanAction={handlePlanAction} onModeAction={handleModeAction} onPackageAction={handlePackageAction} onRefresh={() => { /* implicit via fetchData */ }} onNotifyUser={handleNotifyUser} onLoadAnalytics={fetchAnalytics} />;
            case 'settings': return <ProfileView user={userProfile} onUpdateUser={handleUpdateUser} onLogout={onLogout} />;
            case 'view_recording': return currentRecording ? <TranscriptionView recording={currentRecording} onBack={() => setActivePage('history')} onUpdate={handleUpdateRecording} /> : <HistoryView recordings={recordings} onDelete={handleDeleteRecording} onView={handleViewRecording} />;
            case 'referrals': return <ReferralsView user={userProfile} />;

            default: return <div className="text-white">Página não encontrada</div>;
        }
    }

    return (
        <div className="h-screen bg-black text-slate-100 font-sans flex overflow-hidden relative">
            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-black to-black pointer-events-none"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-neon/5 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none opacity-50"></div>

            <Sidebar activePage={activePage} setActivePage={setActivePage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={onLogout} user={userProfile} />

            <ModeModal isOpen={modeModalData.isOpen} mode={modeModalData.mode} onClose={() => setModeModalData({ isOpen: false, mode: null })} onSave={handleSaveModeModal} />
            <PlanModal isOpen={planModalData.isOpen} plan={planModalData.plan} onClose={() => setPlanModalData({ isOpen: false, plan: null })} onSave={handleSavePlanModal} />
            <PackageModal isOpen={packageModalData.isOpen} pkg={packageModalData.pkg} onClose={() => setPackageModalData({ isOpen: false, pkg: null })} onSave={handleSavePackageModal} />

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => {
                    setIsCheckoutModalOpen(false);
                    setTimeout(() => setPendingPlan(null), 300); // aguarda a animação sair
                }}
                plan={pendingPlan}
                onSubmit={handleSubmitTransaction}
            />

            {/* Credits Package Modal */}
            {isCreditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#111] border border-white/10 rounded-[3rem] p-10 max-w-md w-full relative shadow-2xl">
                        <button onClick={() => setIsCreditModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-all"><X size={24} /></button>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-neon/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neon/20">
                                <PlusCircle className="text-neon" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Adicionar Créditos</h2>
                            <p className="text-gray-400 text-sm">Escolha um pacote de minutos adicional</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Pacote 15 min', minutes: 15, price: '2.500', desc: 'Ideal para pequenas recargas', features: ['Soma aos minutos atuais', 'Sem data de expiração', 'Acesso a todos os modelos IA'] },
                                { label: 'Pacote 30 min', minutes: 30, price: '5.000', desc: 'Melhor custo-benefício', features: ['Soma aos minutos atuais', 'Sem data de expiração', 'Acesso VIP aos modelos IA', 'Suporte Prioritário'] },
                            ].map(pkg => (
                                <button
                                    key={pkg.minutes}
                                    onClick={() => handleSelectCreditPackage({ name: pkg.label, price: pkg.price.replace('.', '') })}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all group text-left"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-12 h-12 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon group-hover:bg-neon group-hover:text-black transition-colors shrink-0">
                                                <Clock size={22} />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold">{pkg.label}</p>
                                                <p className="text-xs text-gray-500">{pkg.desc}</p>
                                            </div>
                                        </div>
                                        <ul className="pl-16 space-y-1">
                                            {pkg.features.map((f, i) => (
                                                <li key={i} className="text-[10px] text-gray-400 flex items-center gap-1.5"><Check size={10} className="text-neon" /> {f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-neon font-bold text-lg">Kz {pkg.price}</p>
                                        <p className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-md inline-block mt-1">Avulso</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
                <div className="md:hidden h-20 flex items-center justify-between px-6 border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
                    <div className="flex items-center gap-2"><img src="/logo.png" alt="falajá.ao" className="h-8 object-contain" /></div>
                    <button onClick={() => setMobileOpen(true)}><Menu className="text-white" /></button>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar scroll-smooth">
                    {renderContent()}
                </main>

                <div className="md:hidden h-24 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-4 rounded-t-[2rem] shadow-2xl z-50">
                    <button onClick={() => setActivePage('dashboard')} className={`p-4 rounded-full transition-all ${activePage === 'dashboard' ? 'bg-neon text-black shadow-neon -translate-y-2' : 'text-gray-500 hover:text-white'}`}><LayoutDashboard size={24} /></button>
                    <button onClick={() => setActivePage('new')} className={`p-4 rounded-full transition-all ${activePage === 'new' ? 'bg-neon text-black shadow-neon -translate-y-2' : 'text-gray-500 hover:text-white'}`}><PlusCircle size={24} /></button>
                    <button onClick={() => setActivePage('history')} className={`p-4 rounded-full transition-all ${activePage === 'history' ? 'bg-neon text-black shadow-neon -translate-y-2' : 'text-gray-500 hover:text-white'}`}><History size={24} /></button>
                    <button onClick={() => setActivePage('settings')} className={`p-4 rounded-full transition-all ${activePage === 'settings' ? 'bg-neon text-black shadow-neon -translate-y-2' : 'text-gray-500 hover:text-white'}`}><User size={24} /></button>
                    <button onClick={onLogout} className="p-4 rounded-full transition-all text-red-500 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"><LogOut size={24} /></button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'dashboard'>('landing');
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);
    // Using global API_URL

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'ngrok-skip-browser-warning': 'true'
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                        setCurrentPage('dashboard');
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (err) {
                    console.error("Auth check failed", err);
                }
            }
            setIsInitializing(false);
        };
        checkAuth();
    }, []);

    const goToAuth = (mode: 'login' | 'signup' = 'login') => {
        setAuthMode(mode);
        window.scrollTo(0, 0);
        setCurrentPage('auth');
    };
    const handleLoginSuccess = (userData: UserProfile) => {
        setUser(userData);
        window.scrollTo(0, 0);
        setCurrentPage('dashboard');
    };
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.scrollTo(0, 0);
        setCurrentPage('landing');
    };
    const goToLanding = () => { window.scrollTo(0, 0); setCurrentPage('landing'); };

    if (isInitializing) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-4 border-neon border-t-transparent animate-spin"></div>
        </div>
    );

    if (currentPage === 'dashboard' && user) return <Dashboard user={user} onLogout={handleLogout} />;
    if (currentPage === 'auth') return <AuthPage onLoginSuccess={handleLoginSuccess} onBack={goToLanding} initialIsLogin={authMode === 'login'} />;

    return (
        <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-neon selection:text-black">
            <Navbar onLogin={() => goToAuth('login')} onSignUp={() => goToAuth('signup')} />
            <Hero onSignUp={() => goToAuth('signup')} />
            <SocialProof />
            <Features />
            <SmartSummary />
            <DecisionsSection />
            <LiveDemo />
            <ModesShowcase />
            <AutomationShowcase />
            <Pricing onSelectPlan={() => goToAuth('signup')} />
            <HowItWorks />
            <FAQSection />
            <CTA onSignUp={() => goToAuth('signup')} />
            <Footer />
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);