import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const logout = () => api.post('/auth/logout');
export const getUser = () => api.get('/auth/me');

// Course APIs
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const createCourse = (data) => api.post('/courses', data);
export const updateCourse = (id, data) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const enrollCourse = (id) => api.post(`/courses/${id}/enroll`);

// Assignment APIs
export const getAssignments = () => api.get('/assignments');
export const getAssignment = (id) => api.get(`/assignments/${id}`);
export const createAssignment = (data) => api.post('/assignments', data);
export const submitAssignment = (assignmentId, data) => api.post(`/assignments/${assignmentId}/submit`, data);

// Submission APIs
export const getSubmissions = () => api.get('/submissions');
export const gradeSubmission = (id, data) => api.put(`/submissions/${id}`, data);

// Chat APIs
export const getGroups = () => api.get('/groups');
export const createGroup = (data) => api.post('/groups', data);
export const getMessages = (groupId) => api.get(`/groups/${groupId}/messages`);
export const sendMessage = (groupId, data) => api.post(`/groups/${groupId}/messages`, data);

export default api;