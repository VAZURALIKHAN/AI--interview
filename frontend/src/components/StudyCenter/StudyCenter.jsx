import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Brain, BookOpen, GraduationCap, ChevronRight, Zap, Target, Book, Database, Bug, Layout, Map, Layers } from 'lucide-react';
import './StudyCenter.css';

export default function StudyCenter() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('practice'); // 'practice' or 'learn'

    const studySections = {
        practice: [
            {
                id: 'coding-practice',
                title: 'Coding Practice',
                description: 'Sharpen your coding skills with AI-generated problems and real-time validation.',
                icon: <Code size={32} />,
                color: 'var(--primary)',
                path: '/practice/coding',
                stats: '50+ Problems'
            },
            {
                id: 'aptitude-practice',
                title: 'Aptitude Practice',
                description: 'Test your logical, quantitative, and verbal skills with adaptive timed tests.',
                icon: <Brain size={32} />,
                color: 'var(--secondary)',
                path: '/aptitude',
                stats: '3 Categories'
            },
            {
                id: 'sql-practice',
                title: 'SQL Practice',
                description: 'Master database queries with AI-generated SQL challenges and validation.',
                icon: <Database size={32} />,
                color: 'var(--info)',
                path: '/practice/sql',
                stats: 'Intermediate'
            },
            {
                id: 'bug-fixing',
                title: 'Bug Fixing',
                description: 'Find and fix complex bugs in existing codebases to sharpen debugging skills.',
                icon: <Bug size={32} />,
                color: 'var(--error)',
                path: '/practice/debugging',
                stats: 'Advanced'
            },
            {
                id: 'flashcards',
                title: 'Quick Flashcards',
                description: 'Rapid-fire questions to master definitions, shortcuts, and syntax.',
                icon: <Layers size={32} />,
                color: 'var(--accent)',
                path: '/practice/flashcards',
                stats: 'Fast Learning'
            }
        ],
        learn: [
            {
                id: 'coding-learn',
                title: 'Coding Courses',
                description: 'Structured learning paths for Python, DSA, Web Dev, and more.',
                icon: <BookOpen size={32} />,
                color: 'var(--success)',
                path: '/courses',
                stats: '10+ Courses'
            },
            {
                id: 'aptitude-learn',
                title: 'Aptitude Tutorials',
                description: 'Master shortcuts and concepts with AI-powered interactive tutorials.',
                icon: <GraduationCap size={32} />,
                color: 'var(--warning)',
                path: '/learn/aptitude',
                stats: 'Comprehensive Lessons'
            },
            {
                id: 'system-design',
                title: 'System Design',
                description: 'Understand high-level architecture, scalability, and distributed systems.',
                icon: <Layout size={32} />,
                color: 'var(--primary)',
                path: '/learn/system-design',
                stats: 'Intermediate'
            },
            {
                id: 'roadmaps-hub',
                title: 'Career Roadmaps',
                description: 'Step-by-step guides for 20+ careers in Tech, Design, and Marketing.',
                icon: <Map size={32} />,
                color: 'var(--accent)',
                path: '/roadmaps',
                stats: '20 Roadmaps'
            }
        ]
    };

    return (
        <div className="study-center fade-in">
            <div className="study-header">
                <h1 className="gradient-text">Study Center</h1>
                <p>Your one-stop place for learning and mastering interview skills.</p>
            </div>

            <div className="tab-switcher glass-card">
                <button
                    className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
                    onClick={() => setActiveTab('practice')}
                >
                    <Target size={20} />
                    Practice Place
                </button>
                <button
                    className={`tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
                    onClick={() => setActiveTab('learn')}
                >
                    <Book size={20} />
                    Learning Place
                </button>
            </div>

            <div className="study-grid">
                {studySections[activeTab].map((section, index) => (
                    <div
                        key={section.id}
                        className={`study-card card hover-lift fade-in stagger-${index + 1}`}
                        onClick={() => navigate(section.path)}
                    >
                        <div className="card-icon" style={{ backgroundColor: `${section.color}20`, color: section.color }}>
                            {section.icon}
                        </div>
                        <div className="card-content">
                            <h3>{section.title}</h3>
                            <p>{section.description}</p>
                            <div className="card-footer">
                                <span className="stats-badge"><Zap size={14} /> {section.stats}</span>
                                <span className="action-text">Explore <ChevronRight size={16} /></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="daily-goals card glass-card mt-4">
                <div className="goals-header">
                    <Target className="text-primary" />
                    <h3>Daily Goals</h3>
                </div>
                <div className="goals-list">
                    <div className="goal-item">
                        <input type="checkbox" readOnly checked={false} />
                        <span>Complete 1 Coding Problem</span>
                        <span className="goal-reward">+50 XP</span>
                    </div>
                    <div className="goal-item">
                        <input type="checkbox" readOnly checked={false} />
                        <span>Finish 1 Aptitude Lesson</span>
                        <span className="goal-reward">+30 XP</span>
                    </div>
                    <div className="goal-item">
                        <input type="checkbox" readOnly checked={false} />
                        <span>Take a Mock Interview</span>
                        <span className="goal-reward">+100 XP</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
