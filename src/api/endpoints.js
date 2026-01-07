import axiosInstance from './axios'

export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/me'),
  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh-token', { refresh_token: refreshToken }),
}

export const adminAPI = {
  getStats: () => axiosInstance.get('/admin/stats'),

  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  createUser: (userData) => axiosInstance.post('/admin/users', userData),
  deleteUser: (userId) => axiosInstance.delete(`/admin/users/${userId}`),

  getCharities: (params) => axiosInstance.get('/admin/charities', { params }),
  createCharity: (data) => axiosInstance.post('/admin/charity/create', data),

  getDriverApplications: (params) => axiosInstance.get('/admin/driver-applications', { params }),
  getDriverApplicationDetail: (driverId) => 
    axiosInstance.get(`/admin/drivers/applications/${driverId}`),
  setDriverAppointment: (driverId, appointmentData) =>
    axiosInstance.post(`/admin/drivers/applications/${driverId}/appointment`, appointmentData),
  approveDriver: (driverId, notes) => 
    axiosInstance.post(`/admin/drivers/${driverId}/approve`, { notes }),
  rejectDriver: (driverId, reason) =>
    axiosInstance.post(`/admin/drivers/${driverId}/reject`, { reason }),
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
    axiosInstance.post(`/deliveries/${deliveryId}/assign`, { driver_id: driverId }),
}

export default axiosInstance