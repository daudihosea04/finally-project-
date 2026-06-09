import api from './api';

export const announcementService = {
  // Get all announcements - GET /api/announcements
  getAllAnnouncements: async () => {
    try {
      const response = await api.get('/announcements');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch announcements' };
    }
  },

  // Get announcements by course - GET /api/courses/{courseId}/announcements
  getCourseAnnouncements: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/announcements`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch course announcements' };
    }
  },

  // Get announcement by ID - GET /api/announcements/{id}
  getAnnouncement: async (id) => {
    try {
      const response = await api.get(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch announcement' };
    }
  },

  // Create announcement (Admin/Lecturer) - POST /api/announcements
  createAnnouncement: async (announcementData) => {
    try {
      const response = await api.post('/announcements', announcementData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create announcement' };
    }
  },

  // Update announcement - PUT /api/announcements/{id}
  updateAnnouncement: async (id, announcementData) => {
    try {
      const response = await api.put(`/announcements/${id}`, announcementData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update announcement' };
    }
  },

  // Delete announcement - DELETE /api/announcements/{id}
  deleteAnnouncement: async (id) => {
    try {
      const response = await api.delete(`/announcements/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete announcement' };
    }
  },

  // Mark announcement as read - POST /api/announcements/{id}/read
  markAsRead: async (id) => {
    try {
      const response = await api.post(`/announcements/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark as read' };
    }
  },
};