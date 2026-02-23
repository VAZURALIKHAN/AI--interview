import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/store';
import {
    LayoutDashboard,
    Brain,
    MessageSquare,
    Video,
    FileText,
    BookOpen,
    Settings,
    LogOut,
    Zap,
    Trophy,
    Flame,
    Mic,
    GraduationCap,
    Map
} from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';
import './Sidebar.css';


export default function Sidebar() {
    const { user, logout } = useAuthStore();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/study-center', icon: GraduationCap, label: 'Study Center' },
        { path: '/roadmaps', icon: Map, label: 'Roadmaps' },
        { path: '/aptitude', icon: Brain, label: 'Aptitude Tests' },
        { path: '/interview', icon: MessageSquare, label: 'Mock Interview' },
        { path: '/video-interview', icon: Video, label: 'Video Interview' },
        { path: '/voice-interview', icon: Mic, label: 'Voice Interview' },
        { path: '/resume', icon: FileText, label: 'Resume Analyzer' },
        { path: '/courses', icon: BookOpen, label: 'Courses' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="flex items-center gap-2">
                    <Zap className="logo-icon" size={32} />
                    <h1 className="gradient-text">AI Interview Prep</h1>
                </div>
            </div>

            {user && (
                <div className="user-card glass-card">
                    <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                        <h3>{user.name}</h3>
                        <p className="user-email">{user.email}</p>
                    </div>
                    <div className="user-stats">
                        <div className="stat-item">
                            <Trophy size={16} />
                            <span>Level {user.level || 1}</span>
                        </div>
                        <div className="stat-item">
                            <Zap size={16} />
                            <span>{user.total_xp || 0} XP</span>
                        </div>
                        <div className="stat-item">
                            <Flame size={16} />
                            <span>{user.streak_count || 0} Day Streak</span>
                        </div>
                    </div>
                </div>
            )}

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <ThemeSwitcher />
                <button onClick={logout} className="nav-item logout-btn mt-2" style={{ border: 'none', background: 'none', width: '100%', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
