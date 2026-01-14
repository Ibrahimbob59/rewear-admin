import axiosInstance from './axios'

export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/me'),
  updateProfile: (userData) => axiosInstance.put('/auth/profile', userData),
  changePassword: (passwordData) => axiosInstance.put('/auth/password', passwordData),
  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh-token', { refresh_token: refreshToken }),
}

export const adminAPI = {
  getStats: () => axiosInstance.get('/admin/stats'),

  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  createUser: (userData) => axiosInstance.post('/admin/create-user', userData),
  deleteUser: (userId) => axiosInstance.delete(`/admin/users/${userId}`),

  getCharities: (params) => axiosInstance.get('/admin/charities', { params }),
  createCharity: (data) => axiosInstance.post('/admin/charity/create', data),

  // Admin notifications
  getNotifications: (params) => axiosInstance.get('/admin/notifications', { params }),
  markNotificationRead: (id) => axiosInstance.post(`/admin/notifications/${id}/read`),
  deleteNotification: (id) => axiosInstance.delete(`/admin/notifications/${id}`),
  markAllNotificationsRead: () => axiosInstance.post('/admin/notifications/read-all'),

  getDriverApplications: (params) =>
    axiosInstance.get('/admin/driver-applications', { params }),
  getDriverApplicationDetail: (id) =>
    axiosInstance.get(`/admin/driver-applications/${id}`),
  // WARNING: This endpoint is NOT in the backend API docs (api-docs.json)
  // Backend team needs to add: POST /api/admin/driver-applications/{id}/appointment
  setDriverAppointment: (id, appointmentData) =>
    axiosInstance.post(`/admin/driver-applications/${id}/appointment`, appointmentData),
  approveDriver: (id, notes) =>
    axiosInstance.post(`/admin/driver-applications/${id}/approve`, { notes }),
  rejectDriver: (id, reason) =>
    axiosInstance.post(`/admin/driver-applications/${id}/reject`, { reason }),
}

export const itemsAPI = {
  getItems: (params) => axiosInstance.get('/items', { params }),
  getItemById: (itemId) => axiosInstance.get(`/items/${itemId}`),
  deleteItem: (itemId) => axiosInstance.delete(`/items/${itemId}`),
  updateItem: (itemId, data) => axiosInstance.put(`/items/${itemId}`, data),
}

export const ordersAPI = {
  getOrders: (params) => axiosInstance.get('/orders', { params }),
  getOrderById: (orderId) => axiosInstance.get(`/orders/${orderId}`),
  updateOrderStatus: (orderId, status) =>
    axiosInstance.put(`/orders/${orderId}`, { status }),
  cancelOrder: (orderId, reason) =>
    axiosInstance.put(`/orders/${orderId}/cancel`, { reason }),
}

export const deliveriesAPI = {
  getDeliveries: (params) => axiosInstance.get('/deliveries', { params }),
  getDeliveryById: (deliveryId) => axiosInstance.get(`/deliveries/${deliveryId}`),
  assignDriver: (deliveryId, driverId) =>
    axiosInstance.post(`/deliveries/${deliveryId}/assign-driver`, { driver_id: driverId }),

  // Cancel delivery
  cancelDelivery: async (deliveryId, reason) => {
    const response = await axiosInstance.post(`/deliveries/${deliveryId}/cancel`, { reason })
    return response
  },
}

export default axiosInstance
