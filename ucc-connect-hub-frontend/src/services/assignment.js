import api from './api';

export const assignmentService = {
    // Get all assignments
    getAllAssignments: async () => {
        try {
            const response = await api.get('/assignments');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch assignments' };
        }
    },

    // Get assignments by course
    getByCourse: async (courseId) => {
        try {
            const response = await api.get(`/assignments/course/${courseId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch course assignments' };
        }
    },

    // Get single assignment
    getAssignment: async (id) => {
        try {
            const response = await api.get(`/assignments/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch assignment' };
        }
    },

    // Create assignment
    createAssignment: async (assignmentData) => {
        try {
            const response = await api.post('/assignments', assignmentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to create assignment' };
        }
    },

    // Submit assignment
    submitAssignment: async (id, data) => {
        try {
            const response = await api.post(`/assignments/${id}/submit`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to submit assignment' };
        }
    },

    // Get submissions
    getSubmissions: async (assignmentId) => {
        try {
            const response = await api.get(`/assignments/${assignmentId}/submissions`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch submissions' };
        }
    }
};