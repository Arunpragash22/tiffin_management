import api from './axios';

export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  register: (formData) => api.post('/api/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  verifyEmail: (token) => api.get('/api/auth/verify-email', { params: { token } }),
  resendVerification: (email) => api.post('/api/auth/resend-verification', { email }),
  logout: () => api.post('/api/auth/logout'),
};

export const dashboardAPI = {
  getStats: () => api.get('/api/admin/dashboard'),
};

export const studentAPI = {
  getProfile: () => api.get('/api/student/profile'),
  updateProfile: (data) => api.put('/api/student/profile', data),
  updateAadhaar: (formData) => api.put('/api/student/profile/aadhaar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: (params) => api.get('/api/admin/students', { params }),
  getById: (id) => api.get(`/api/admin/students/${id}`),
  update: (id, data) => api.put(`/api/admin/students/${id}`, data),
  delete: (id) => api.delete(`/api/admin/students/${id}`),
  toggleStatus: (id, active) => api.patch(`/api/admin/students/${id}/status`, null, { params: { active } }),
  getAadhaarUrl: (id) => `${api.defaults.baseURL}/api/files/aadhaar/${id}`,
};

export const attendanceAPI = {
  mark: (data) => api.post('/api/admin/attendance', data),
  getAll: (params) => api.get('/api/admin/attendance', { params }),
  getById: (id) => api.get(`/api/admin/attendance/${id}`),
  update: (id, data) => api.put(`/api/admin/attendance/${id}`, data),
  delete: (id) => api.delete(`/api/admin/attendance/${id}`),
  getMy: (params) => api.get('/api/student/attendance', { params }),
  getMyCalendar: (year, month) => api.get('/api/student/attendance/calendar', { params: { year, month } }),
};

export const menuAPI = {
  create: (data) => api.post('/api/admin/menus', data),
  getAll: (params) => api.get('/api/admin/menus', { params }),
  getById: (id) => api.get(`/api/admin/menus/${id}`),
  update: (id, data) => api.put(`/api/admin/menus/${id}`, data),
  delete: (id) => api.delete(`/api/admin/menus/${id}`),
  getDaily: (date) => api.get('/api/student/menus/daily', { params: { date } }),
  getWeekly: (startDate) => api.get('/api/student/menus/weekly', { params: { startDate } }),
};

export const orderAPI = {
  place: (data) => api.post('/api/student/orders', data),
  getMy: (params) => api.get('/api/student/orders', { params }),
  cancel: (id) => api.patch(`/api/student/orders/${id}/cancel`),
  getAll: (params) => api.get('/api/admin/orders', { params }),
  getStats: () => api.get('/api/admin/orders/stats'),
  getById: (id) => api.get(`/api/admin/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/admin/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/admin/orders/${id}`),
};

export const reportAPI = {
  downloadOrdersPdf: (params) => api.get('/api/admin/reports/orders/pdf', { params, responseType: 'blob' }),
  downloadStudentsPdf: (params) => api.get('/api/admin/reports/students/pdf', { params, responseType: 'blob' }),
  downloadAttendancePdf: (params) => api.get('/api/admin/reports/attendance/pdf', { params, responseType: 'blob' }),
};

export const adminAPI = {
  getAll: (params) => api.get('/api/admin/admins', { params }),
  create: (data) => api.post('/api/admin/admins', data),
  toggleStatus: (id, active) => api.patch(`/api/admin/admins/${id}/status`, null, { params: { active } }),
  delete: (id) => api.delete(`/api/admin/admins/${id}`),
};
