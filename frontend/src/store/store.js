import { create } from 'zustand';
import { authAPI } from '../services/api';

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: !!localStorage.getItem('token'), // Start loading if we have a token to check
    error: null,

    // ... (login/signup/logout/updateUser remain same)

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false, user: null, loading: false });
            return;
        }

        // We are already loading from initial state, but in case called manually:
        set({ loading: true });

        try {
            const response = await authAPI.getCurrentUser();
            set({ user: response.data, isAuthenticated: true, loading: false, error: null });
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem('token');
            set({ user: null, token: null, isAuthenticated: false, loading: false, error: null });
        }
    },
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await authAPI.login(credentials);
            const { access_token } = response.data;

            localStorage.setItem('token', access_token);

            // Get user details immediately after login
            const userResponse = await authAPI.getCurrentUser();

            set({
                user: userResponse.data,
                token: access_token,
                isAuthenticated: true,
                loading: false
            });
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.detail;
            const finalError = typeof errorMsg === 'string'
                ? errorMsg
                : (Array.isArray(errorMsg) ? errorMsg[0].msg : 'Login failed');

            set({
                error: finalError,
                loading: false,
                isAuthenticated: false
            });
            return { success: false, error: finalError };
        }
    },

    signup: async (userData) => {
        set({ loading: true, error: null });
        try {
            await authAPI.signup(userData);
            set({ loading: false });
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.detail;
            const finalError = typeof errorMsg === 'string'
                ? errorMsg
                : (Array.isArray(errorMsg) ? errorMsg[0].msg : 'Signup failed');

            set({
                error: finalError,
                loading: false
            });
            return { success: false, error: finalError };
        }
    },

    updateUser: (userData) => {
        set((state) => ({
            user: { ...state.user, ...userData }
        }));
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },


}));

export const useGamificationStore = create((set) => ({
    xp: 0,
    level: 1,
    streak: 0,
    achievements: [],

    addXP: (amount) => set((state) => ({
        xp: state.xp + amount,
        level: Math.floor((state.xp + amount) / 1000) + 1,
    })),

    incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

    setAchievements: (achievements) => set({ achievements }),
}));
