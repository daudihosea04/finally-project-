import api from './api';

export const courseService = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch courses' };
    }
  },

  // Get courses by lecturer
  getLecturerCourses: async () => {
    try {
      const response = await api.get('/courses/lecturer');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch lecturer courses' };
    }
  },

  // Get single course
  getCourse: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch course details' };
    }
  },

  // Get course students
  getCourseStudents: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/students`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch students' };
    }
  },

  // Get course assignments
  getCourseAssignments: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/assignments`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch assignments' };
    }
  },
};