import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Code,
    Brain,
    FileText,
    GraduationCap,
    ChevronRight,
    Zap,
    Star,
    Users,
    Award,
    Play,
    ArrowRight,
    Search,
    Mic,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            title: "AI Voice Interviews",
            description: "Practice verbal communication with our responsive AI recruiter that analyzes tone, pace, and content.",
            icon: <Mic size={32} />,
            color: "#6366f1",
            path: "/voice-interview"
        },
        {
            title: "Coding Mastery",
            description: "Solve complex algorithmic challenges in Python, JS, Java and more with real-time AI guidance.",
            icon: <Code size={32} />,
            color: "#06b6d4",
            path: "/practice/coding"
        },
        {
            title: "Aptitude Engine",
            description: "Master logical reasoning and quantitative skills with thousands of adaptive practice sets.",
            icon: <Brain size={32} />,
            color: "#fed157ff",
            path: "/aptitude"
        },
        {
            title: "ATS Resume Scan",
            description: "Our AI analyzes your resume against job descriptions to help you bypass corporate filters.",
            icon: <FileText size={32} />,
            color: "#10b981",
            path: "/resume"
        },
        {
            title: "Roadmaps & Paths",
            description: "20+ step-by-step career paths from Junior Dev to Security Architect or Project Manager.",
            icon: <Zap size={32} />,
            color: "#f59e0b",
            path: "/roadmaps"
        },
        {
            title: "AI Courses",
            description: "Deep-dive into programming, system design, and behavioral mastery with certified courses.",
            icon: <GraduationCap size={32} />,
            color: "#8b5cf6",
            path: "/courses"
        },
        {
            title: "Video Insights",
            description: "Record video interviews and get advanced facial expression and body language analysis.",
            icon: <Cpu size={32} />,
            color: "#ec4899",
            path: "/video-interview"
        }
    ];

    const stats = [
        { label: "Active Learners", value: "50,000+" },
        { label: "AI Interviews Done", value: "240,000+" },
        { label: "Success Stories", value: "94%" },
        { label: "Certifications Issued", value: "15,000+" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="landing-container">
            {/* Premium Mesh Background */}
            <div className="mesh-background">
                <div className="mesh-sphere sphere-1"></div>
                <div className="mesh-sphere sphere-2"></div>
                <div className="mesh-sphere sphere-3"></div>
            </div>

            {/* Navigation */}
            <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="container flex justify-between items-center px-8 mx-auto">
                    <div className="logo flex items-center gap-2" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <Sparkles size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tight">AI<span className="text-primary">Interview prepareation</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Practice', 'Roadmaps', 'Pricing'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                {item}
                            </a>
                        ))}
                        <button
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full border border-white/10 text-sm font-semibold transition-all"
                            onClick={() => navigate('/auth')}
                        >
                            Login
                        </button>
                        <button
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20"
                            onClick={() => navigate('/auth')}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section text-center relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-indigo-400 text-sm font-bold mb-8">
                            <Zap size={16} /> <span>THE INTERVIEW REVOLUTION IS HERE</span>
                        </div>
                        <h1 className="hero-main-title">
                            Level Up Your Career <br />
                            With <span className="hero-gradient-text">Next-Gen AI</span>
                        </h1>
                        <p className="hero-subtext mx-auto">
                            The worlds most advanced AI platform for students and job seekers.
                            Master interviews, coding, and aptitude with personal AI coaching.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                            <button
                                className="bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform"
                                onClick={() => navigate('/auth')}
                            >
                                Get Started Free <ArrowRight size={20} />
                            </button>
                            <button className="bg-slate-900 border border-slate-800 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-slate-800 transition-all">
                                <Play size={20} fill="currentColor" /> Watch Video
                            </button>
                        </div>
                    </motion.div>

                    {/* Floating Visual Elements */}
                    <div className="relative max-w-5xl mx-auto h-[400px] mt-10">
                        <motion.div
                            className="absolute left-0 top-0 premium-card p-6 w-64 float-element hidden md:block"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><CheckCircle2 size={24} /></div>
                                <span className="font-bold">Resume Score</span>
                            </div>
                            <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[85%]"></div>
                            </div>
                            <span className="text-sm mt-2 block text-slate-400">85% Match for Google</span>
                        </motion.div>

                        <motion.div
                            className="absolute right-0 top-20 premium-card p-6 w-72 float-element hidden md:block"
                            style={{ animationDelay: '-3s' }}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><Mic size={24} /></div>
                                <span className="font-bold">Voice Analysis</span>
                            </div>
                            <div className="flex gap-1 h-8 items-end">
                                {[30, 60, 45, 80, 55, 90, 40].map((h, i) => (
                                    <div key={i} className="flex-1 bg-indigo-500/40 rounded-t" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                            <span className="text-sm mt-3 block text-slate-400">Confidence: Excellent</span>
                        </motion.div>

                        <motion.div
                            className="mx-auto premium-card p-4 max-w-3xl overflow-hidden glass-card shadow-2xl"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="bg-slate-900/50 rounded-xl p-6 text-left font-mono text-sm border border-slate-800">
                                <div className="flex gap-2 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-indigo-400"># Generating SQL Challenge...</div>
                                <div className="text-slate-300">SELECT name, balance FROM accounts</div>
                                <div className="text-slate-300">WHERE balance &gt; 5000</div>
                                <div className="text-emerald-400 mt-2">// AI Suggestion: Index balance for performance</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="stats-container grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <div className="stat-value mb-2">{stat.value}</div>
                                <div className="text-slate-400 font-medium uppercase tracking-widest text-xs">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Everything You Need To <span className="text-indigo-400">Succeed</span></h2>
                        <p className="text-slate-400 text-lg">Powerful AI-driven tools designed by recruiters to give students an unfair advantage in the job market.</p>
                    </div>

                    <div className="features-container">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                className="feature-premium-card premium-card hover-lift cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => navigate(f.path)}
                            >
                                <div className="icon-wrapper" style={{ color: f.color }}>
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                                <p className="text-slate-400 leading-relaxed mb-6">{f.description}</p>
                                <div className="flex items-center text-indigo-400 font-bold gap-2 group">
                                    Start Practicing <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="trusted-by text-center border-y border-white/5 bg-white/[0.01]">
                <div className="container mx-auto px-6">
                    <p className="text-slate-500 uppercase tracking-widest text-xs font-bold mb-8">Trusted by students joining giants</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Deloitte'].map(name => (
                            <div key={name} className="company-logo text-2xl font-bold text-slate-300">{name}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-32 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="testimonial-premium max-w-5xl mx-auto overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl overflow-hidden bg-indigo-500 flex-shrink-0 relative">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=John`} alt="User" />
                                <div className="absolute inset-0 bg-indigo-500/20"></div>
                            </div>
                            <div>
                                <div className="flex gap-1 mb-4 text-warning">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
                                </div>
                                <p className="testimonial-quote">
                                    "SkillElevate's AI voice interviewer felt incredibly real. It picked up on my filler words and suggested better phrasing. Two weeks later, I cleared the McKinsey final round. Absolute game changer!"
                                </p>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl text-white">Ananya Verma</span>
                                    <span className="text-indigo-400">Analyst at McKinsey & Co</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-40 relative z-10 text-center">
                <div className="container mx-auto px-6">
                    <div className="premium-card p-12 md:p-24 relative overflow-hidden bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/10">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black mb-10">Ready to Ace Your <br />Next Interview?</h2>
                            <button
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-indigo-600/30"
                                onClick={() => navigate('/auth')}
                            >
                                Start Your Journey Now
                            </button>
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[100px]"></div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer-premium">
                <div className="container mx-auto px-10">
                    <div className="footer-grid mb-20">
                        <div>
                            <div className="logo flex items-center gap-2 mb-8">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                    <Sparkles size={18} />
                                </div>
                                <span className="text-xl font-bold">AI Recruit</span>
                            </div>
                            <p className="text-slate-400 pr-10">
                                Transforming career preparation through cutting-edge artificial intelligence.
                                Designed for the next generation of global talent.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Platform</h4>
                            <ul className="text-slate-400 flex flex-col gap-4 text-sm font-medium">
                                <li><a href="#" onClick={() => navigate('/interview')} className="hover:text-white transition-all">Mock Interviews</a></li>
                                <li><a href="#" onClick={() => navigate('/practice/coding')} className="hover:text-white transition-all">Coding Arena</a></li>
                                <li><a href="#" onClick={() => navigate('/aptitude')} className="hover:text-white transition-all">Aptitude Tests</a></li>
                                <li><a href="#" onClick={() => navigate('/resume')} className="hover:text-white transition-all">Resume ATS</a></li>
                                <li><a href="#" onClick={() => navigate('/courses')} className="hover:text-white transition-all">AI Courses</a></li>
                                <li><a href="#" onClick={() => navigate('/roadmaps')} className="hover:text-white transition-all">Career Roadmaps</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Company</h4>
                            <ul className="text-slate-400 flex flex-col gap-4 text-sm font-medium">
                                <li><a href="#" className="hover:text-white transition-all">About Our Mission</a></li>
                                <li><a href="#" className="hover:text-white transition-all">Career Opportunities</a></li>
                                <li><a href="#" className="hover:text-white transition-all">Success Stories</a></li>
                                <li><a href="#" className="hover:text-white transition-all">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Stay Connected</h4>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer">
                                    <Zap size={18} />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer">
                                    <Users size={18} />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-all cursor-pointer">
                                    <Search size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 text-slate-500 text-sm">
                        <p>© 2026 AI Recruit Interactive. Built with passion for excellence.</p>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <a href="#" className="hover:text-slate-300 transition-all">Terms of Service</a>
                            <a href="#" className="hover:text-slate-300 transition-all">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
