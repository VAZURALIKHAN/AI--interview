import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/store';
import { settingsAPI } from '../../services/api';
import {
    User,
    Lock,
    Settings as SettingsIcon,
    Save,
    Bell,
    Moon,
    Sun,
    Globe,
    Trash2,
    Download,
    Mail
} from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const { user, updateUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [preferences, setPreferences] = useState(() => {
        // Load saved preferences from localStorage
        const saved = localStorage.getItem('preferences');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved preferences', e);
            }
        }
        return {
            darkMode: true,
            emailNotifications: true,
            pushNotifications: false,
            reminderEmails: true,
            language: 'en'
        };
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    // Apply saved theme on mount
    useEffect(() => {
        applyTheme(preferences.darkMode);
    }, []);

    const applyTheme = (isDark) => {
        const root = document.documentElement;
        if (isDark) {
            // Dark theme
            root.style.setProperty('--bg-primary', '#0a0e1a');
            root.style.setProperty('--bg-secondary', '#1a1f35');
            root.style.setProperty('--bg-tertiary', '#252b47');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#a0aec0');
            root.style.setProperty('--text-tertiary', '#718096');
        } else {
            // Light theme
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f7fafc');
            root.style.setProperty('--bg-tertiary', '#edf2f7');
            root.style.setProperty('--text-primary', '#1a202c');
            root.style.setProperty('--text-secondary', '#4a5568');
            root.style.setProperty('--text-tertiary', '#718096');
        }
    };

    const updateProfile = async () => {
        try {
            // Update the user in the store directly (no backend needed for demo mode)
            updateUser({ name: formData.name, email: formData.email });
            showMessage('success', 'Profile updated successfully!');
        } catch (error) {
            showMessage('error', 'Failed to update profile');
        }
    };

    const changePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            showMessage('error', 'Passwords do not match');
            return;
        }
        if (formData.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }
        try {
            await settingsAPI.changePassword({
                current_password: formData.currentPassword,
                new_password: formData.newPassword
            });
            showMessage('success', 'Password changed successfully!');
            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showMessage('error', error.response?.data?.detail || 'Failed to change password');
        }
    };

    const savePreferences = async () => {
        try {
            // Apply dark mode immediately
            applyTheme(preferences.darkMode);

            // Save preferences locally (no backend call needed in demo mode)
            localStorage.setItem('preferences', JSON.stringify(preferences));
            showMessage('success', 'Preferences saved!');
        } catch (error) {
            showMessage('error', 'Failed to save preferences');
        }
    };

    const exportData = () => {
        const data = {
            user: user,
            exportedAt: new Date().toISOString(),
            note: 'Your AI Interview Prep data export'
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-interview-prep-data-${Date.now()}.json`;
        a.click();
        showMessage('success', 'Data exported successfully!');
    };

    const deleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            showMessage('error', 'Account deletion is not available in this demo. Contact support.');
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
        { id: 'data', label: 'Data & Privacy', icon: Download },
    ];

    return (
        <div className="settings fade-in">
            <h1 className="gradient-text">
                <SettingsIcon size={40} /> Settings
            </h1>

            <div className="settings-container">
                {/* Tabs */}
                <div className="settings-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="settings-section card">
                            <h2><User size={24} /> Profile Information</h2>

                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="stats-display">
                                <div className="stat-box">
                                    <h4>Current Level</h4>
                                    <p className="stat-value">{user?.level || 1}</p>
                                </div>
                                <div className="stat-box">
                                    <h4>Total XP</h4>
                                    <p className="stat-value">{user?.total_xp || 0}</p>
                                </div>
                                <div className="stat-box">
                                    <h4>Streak</h4>
                                    <p className="stat-value">{user?.streak_count || 0} days</p>
                                </div>
                            </div>

                            <button onClick={updateProfile} className="btn btn-primary">
                                <Save size={20} /> Save Changes
                            </button>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-section card">
                            <h2><Lock size={24} /> Security Settings</h2>

                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    placeholder="At least 6 characters"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Re-enter new password"
                                />
                            </div>

                            <button onClick={changePassword} className="btn btn-primary">
                                <Lock size={20} /> Change Password
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section card">
                            <h2><Bell size={24} /> Notification Preferences</h2>

                            <div className="toggle-group">
                                <div className="toggle-item">
                                    <div>
                                        <h4><Mail size={20} /> Email Notifications</h4>
                                        <p>Receive updates and news via email</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={preferences.emailNotifications}
                                            onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div>
                                        <h4><Bell size={20} /> Push Notifications</h4>
                                        <p>Browser notifications for reminders</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={preferences.pushNotifications}
                                            onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div>
                                        <h4><Mail size={20} /> Daily Reminders</h4>
                                        <p>Streak and practice reminders</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={preferences.reminderEmails}
                                            onChange={(e) => setPreferences({ ...preferences, reminderEmails: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <button onClick={savePreferences} className="btn btn-primary">
                                <Save size={20} /> Save Preferences
                            </button>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="settings-section card">
                            <h2><SettingsIcon size={24} /> Display Preferences</h2>

                            <div className="toggle-group">
                                <div className="toggle-item">
                                    <div>
                                        <h4>{preferences.darkMode ? <Moon size={20} /> : <Sun size={20} />} Theme</h4>
                                        <p>Switch between light and dark mode</p>
                                    </div>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={preferences.darkMode}
                                            onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label"><Globe size={20} /> Language</label>
                                <select
                                    className="input"
                                    value={preferences.language}
                                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                >
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                    <option value="hi">हिन्दी</option>
                                </select>
                            </div>

                            <button onClick={savePreferences} className="btn btn-primary">
                                <Save size={20} /> Save Preferences
                            </button>
                        </div>
                    )}

                    {activeTab === 'data' && (
                        <div className="settings-section card">
                            <h2><Download size={24} /> Data & Privacy</h2>

                            <div className="data-actions">
                                <div className="data-item">
                                    <div>
                                        <h4>Export Your Data</h4>
                                        <p>Download all your data in JSON format</p>
                                    </div>
                                    <button onClick={exportData} className="btn btn-secondary">
                                        <Download size={20} /> Export Data
                                    </button>
                                </div>

                                <div className="data-item danger-zone">
                                    <div>
                                        <h4>Delete Account</h4>
                                        <p>Permanently delete your account and all data</p>
                                    </div>
                                    <button onClick={deleteAccount} className="btn btn-error">
                                        <Trash2 size={20} /> Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}
