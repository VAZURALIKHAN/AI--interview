import { useEffect, useState } from 'react';
import { dashboardAPI, gamificationAPI } from '../../services/api';
import MotionCard from '../Common/MotionCard';
import {
    TrendingUp,
    Brain,
    MessageSquare,
    BookOpen,
    Trophy,
    Zap,
    Flame,
    Target,
    Clock
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [gamificationStats, setGamificationStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, activityRes, gamificationRes] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getRecentActivity(),
                gamificationAPI.getStats()
            ]);

            setStats(statsRes.data);
            setActivities(activityRes.data.activities);
            setGamificationStats(gamificationRes.data);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Tests',
            value: stats?.overview?.total_tests || 0,
            icon: Brain,
            color: 'primary',
            subtitle: `Avg Score: ${stats?.overview?.avg_test_score?.toFixed(1) || 0}%`
        },
        {
            title: 'Mock Interviews',
            value: stats?.overview?.total_interviews || 0,
            icon: MessageSquare,
            color: 'secondary',
            subtitle: `Avg Score: ${stats?.overview?.avg_interview_score?.toFixed(1) || 0}%`
        },
        {
            title: 'Courses',
            value: `${stats?.overview?.completed_courses || 0}/${stats?.overview?.enrolled_courses || 0}`,
            icon: BookOpen,
            color: 'success',
            subtitle: 'Completed'
        },
        {
            title: 'Current Level',
            value: stats?.user?.level || 1,
            icon: Trophy,
            color: 'warning',
            subtitle: `${stats?.user?.total_xp || 0} XP`
        }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1 className="gradient-text">Welcome back, {stats?.user?.name}! 👋</h1>
                    <p className="dashboard-subtitle">Here's your learning progress</p>
                </div>
            </div>

            {/* Gamification Banner */}
            {gamificationStats && (
                <div className="gamification-banner glass-card">
                    <div className="gamification-content">
                        <div className="level-badge">
                            <Trophy size={32} />
                            <div>
                                <h2>Level {gamificationStats.level}</h2>
                                <p>{gamificationStats.total_xp} XP</p>
                            </div>
                        </div>

                        <div className="progress-section">
                            <div className="flex justify-between mb-1">
                                <span>Progress to Level {gamificationStats.level + 1}</span>
                                <span>{gamificationStats.progress_percentage?.toFixed(0)}%</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${gamificationStats.progress_percentage}%` }}
                                ></div>
                            </div>
                            <p className="xp-info">
                                {gamificationStats.xp_progress} / {gamificationStats.xp_for_next_level} XP
                            </p>
                        </div>

                        <div className="streak-badge">
                            <Flame size={28} />
                            <div>
                                <h3>{stats?.user?.streak_count || 0}</h3>
                                <p>Day Streak</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="stats-grid">
                {statCards.map((card, index) => (
                    <MotionCard
                        key={index}
                        className={`stat-card stat-${card.color}`}
                    >
                        <div className="stat-icon">
                            <card.icon size={28} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-value">{card.value}</h3>
                            <p className="stat-title">{card.title}</p>
                            <p className="stat-subtitle">{card.subtitle}</p>
                        </div>
                    </MotionCard>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="dashboard-grid">
                {/* Recent Activity */}
                <MotionCard className="card">
                    <h2 className="section-title">
                        <Clock size={24} />
                        Recent Activity
                    </h2>

                    {activities.length === 0 ? (
                        <div className="empty-state">
                            <Target size={48} />
                            <p>No activities yet</p>
                            <p className="text-tertiary">Start taking tests or interviews to see your progress!</p>
                        </div>
                    ) : (
                        <div className="activity-list">
                            {activities.map((activity, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon">
                                        {activity.type === 'test' ? <Brain size={20} /> : <MessageSquare size={20} />}
                                    </div>
                                    <div className="activity-content">
                                        <h4>{activity.title}</h4>
                                        <p className="activity-time">
                                            {new Date(activity.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="activity-score">
                                        <span className={`badge ${activity.score >= 80 ? 'badge-success' : activity.score >= 60 ? 'badge-warning' : 'badge-error'}`}>
                                            {activity.score?.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </MotionCard>

                {/* This Week */}
                <MotionCard className="card">
                    <h2 className="section-title">
                        <TrendingUp size={24} />
                        This Week
                    </h2>

                    <div className="week-stats">
                        <div className="week-stat-item">
                            <div className="week-stat-icon">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h3>{stats?.recent_activity?.tests_this_week || 0}</h3>
                                <p>Tests Completed</p>
                            </div>
                        </div>

                        <div className="week-stat-item">
                            <div className="week-stat-icon">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3>{stats?.recent_activity?.interviews_this_week || 0}</h3>
                                <p>Interviews</p>
                            </div>
                        </div>

                        <div className="week-stat-item">
                            <div className="week-stat-icon">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3>+50</h3>
                                <p>XP Earned</p>
                            </div>
                        </div>
                    </div>

                    <div className="quick-tips">
                        <h3>💡 Quick Tip</h3>
                        <p>Maintain your daily streak to earn bonus XP and unlock achievements!</p>
                    </div>
                </MotionCard>
            </div>
        </div>
    );
}
