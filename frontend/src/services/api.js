import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to attach auth token
api.interceptors.request.use((config) => {
    // Get token from localStorage (or state which persists to localStorage via zustand)
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Auth API
export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, new_password: newPassword }),
};

// Aptitude API
export const aptitudeAPI = {
    getQuestions: (category, difficulty, count = 10) =>
        api.post('/aptitude/questions', { category, difficulty, count }),

    submitTest: (data) => api.post('/aptitude/submit', data),
    getHistory: () => api.get('/aptitude/history'),
    getCertificate: (testId) => api.get(`/aptitude/${testId}/certificate`),
};

// Interview API
export const interviewAPI = {
    startInterview: (role, difficulty, count = 5) =>
        api.post('/interview/start', { role, difficulty, count }),

    submitResponse: (interviewId, response) =>
        api.post(`/interview/${interviewId}/respond`, response),
    completeInterview: (interviewId) =>
        api.post(`/interview/${interviewId}/complete`),
    getHistory: () => api.get('/interview/history'),
    getFeedback: (interviewId) => api.get(`/interview/${interviewId}/feedback`),
    getCertificate: (interviewId) => api.get(`/interview/${interviewId}/certificate`),
};

// Resume API
export const resumeAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/resume/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    getAnalysis: (resumeId) => api.get(`/resume/${resumeId}`),
    getAll: () => api.get('/resume/all'),
};

// Course API
export const courseAPI = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    enroll: (courseId) => api.post(`/courses/${courseId}/enroll`),
    unenroll: (courseId) => api.post(`/courses/${courseId}/unenroll`),
    getProgress: (courseId) => api.get(`/courses/${courseId}/progress`),
    updateProgress: (courseId, lessonId, completed) =>
        api.post(`/courses/${courseId}/progress`, { lesson_id: lessonId, completed }),
    getMyCourses: () => api.get('/courses/my-courses'),
    getLesson: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}`),
    getExplanation: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}/explain`),
    getCertificate: (courseId) => api.get(`/courses/${courseId}/certificate`),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getRecentActivity: () => api.get('/dashboard/activity'),
};

// Gamification API
export const gamificationAPI = {
    getStats: () => api.get('/gamification/stats'),
    getAchievements: () => api.get('/gamification/achievements'),
    getLeaderboard: () => api.get('/gamification/leaderboard'),
    claimReward: (achievementId) => api.post(`/gamification/claim/${achievementId}`),
};

// Settings API
export const settingsAPI = {
    updateProfile: (data) => api.put('/settings/profile', data),
    changePassword: (data) => api.post('/settings/change-password', data),
    updatePreferences: (data) => api.put('/settings/preferences', data),
};

// FAQ API
export const faqAPI = {
    getAll: () => api.get('/faq'),
    search: (query) => api.get(`/faq/search?q=${query}`),
};

// Practice API
export const practiceAPI = {
    getCodingProblems: (category, difficulty, language, count = 3) =>
        api.post('/practice/coding/problems', { category, difficulty, language, count }),
    getAptitudeTutorial: (category, topic) =>
        api.post('/practice/aptitude/tutorial', { category, topic }),
    submitCodingSolution: (data) => api.post('/practice/coding/submit', data),
};

export default api;
