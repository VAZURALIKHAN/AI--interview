import { useState } from 'react';
import { useAuthStore } from '../../store/store';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Auth.css';

export default function Auth() {
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        resetToken: '',
        newPassword: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);

    const { login, signup, loading, error: storeError } = useAuthStore();
    const navigate = useNavigate();

    const isLoading = loading || localLoading;
    const error = view === 'login' || view === 'signup' ? storeError : localError;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (storeError) {
            useAuthStore.setState({ error: null });
        }
        if (localError) setLocalError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setLocalError(null);

        if (view === 'login') {
            const result = await login({
                email: formData.email,
                password: formData.password
            });
            if (result.success) {
                navigate('/dashboard');
            }
        } else if (view === 'signup') {
            const result = await signup({
                email: formData.email,
                password: formData.password,
                name: formData.name
            });
            if (result.success) {
                setSuccessMessage('Account created! You can now log in.');
                setView('login');
            }
        } else if (view === 'forgot') {
            setLocalLoading(true);
            try {
                await authAPI.forgotPassword(formData.email);
                setSuccessMessage('Password reset instructions sent to your email.');
            } catch (err) {
                setLocalError(err.response?.data?.detail || 'Failed to send reset email');
            } finally {
                setLocalLoading(false);
            }
        } else if (view === 'reset') {
            setLocalLoading(true);
            try {
                await authAPI.resetPassword(formData.resetToken, formData.newPassword);
                setSuccessMessage('Password reset successful! You can now log in.');
                setView('login');
            } catch (err) {
                setLocalError(err.response?.data?.detail || 'Failed to reset password');
            } finally {
                setLocalLoading(false);
            }
        }
    };

    const toggleView = (newView) => {
        setView(newView);
        setSuccessMessage('');
        setLocalError(null);
        useAuthStore.setState({ error: null });
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } },
        exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
    };

    return (
        <div className="auth-container">
            <div className="auth-bg-blobs">
                <div className="auth-blob auth-blob-1"></div>
                <div className="auth-blob auth-blob-2"></div>
                <div className="auth-blob auth-blob-3"></div>
            </div>

            <motion.div
                className="auth-card"
                initial="hidden"
                animate="visible"
                variants={cardVariants}
            >
                <div className="auth-header">
                    <motion.h1
                        key={view}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {view === 'login' && 'Welcome Back'}
                        {view === 'signup' && 'Create Account'}
                        {view === 'forgot' && 'Reset Password'}
                        {view === 'reset' && 'New Password'}
                    </motion.h1>
                    <motion.p
                        key={`${view}-p`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {view === 'login' && 'Ready to ace your next interview?'}
                        {view === 'signup' && 'Start your journey to success'}
                        {view === 'forgot' && 'Enter your email to receive instructions'}
                        {view === 'reset' && 'Enter your new strong password'}
                    </motion.p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            className="auth-message error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    {successMessage && (
                        <motion.div
                            className="auth-message success"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <CheckCircle size={20} />
                            <span>{successMessage}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={formVariants}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        >
                            {view === 'signup' && (
                                <div className="form-group">
                                    <label><User size={16} /> Full Name</label>
                                    <div className="input-wrapper">
                                        <User size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            className="auth-input"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {(view === 'login' || view === 'signup' || view === 'forgot') && (
                                <div className="form-group">
                                    <label><Mail size={16} /> Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            className="auth-input"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="name@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {view === 'reset' && (
                                <div className="form-group">
                                    <label><Lock size={16} /> Reset Token</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} />
                                        <input
                                            type="text"
                                            name="resetToken"
                                            className="auth-input"
                                            value={formData.resetToken}
                                            onChange={handleChange}
                                            placeholder="Enter token"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {(view === 'login' || view === 'signup' || view === 'reset') && (
                                <div className="form-group">
                                    <label><Lock size={16} /> Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={18} />
                                        <input
                                            type="password"
                                            name={view === 'reset' ? 'newPassword' : 'password'}
                                            className="auth-input"
                                            value={view === 'reset' ? formData.newPassword : formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <Loader2 className="spinner" size={20} />
                        ) : (
                            <>
                                <span>
                                    {view === 'login' && 'Sign In'}
                                    {view === 'signup' && 'Create Account'}
                                    {view === 'forgot' && 'Send Email'}
                                    {view === 'reset' && 'Reset Password'}
                                </span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    {view === 'login' && (
                        <>
                            <p>Don't have an account? <span onClick={() => toggleView('signup')}>Sign Up</span></p>
                            <p className="forgot-password" onClick={() => toggleView('forgot')}>Forgot password?</p>
                        </>
                    )}
                    {(view === 'signup' || view === 'forgot' || view === 'reset') && (
                        <p>Already have an account? <span onClick={() => toggleView('login')}>Sign In</span></p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

