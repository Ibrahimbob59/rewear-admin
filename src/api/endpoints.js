import axiosInstance from './axios'

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  getProfile: () => axiosInstance.get('/auth/me'),
  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refresh-token', { refresh_token: refreshToken }),
}

// ==================== ADMIN ENDPOINTS ====================
export const adminAPI = {
  // Statistics
  getStats: () => axiosInstance.get('/admin/stats'),

  // Users Management
  getUsers: (params) => axiosInstance.get('/admin/users', { params }),
  deleteUser: (userId) => axiosInstance.delete(`/admin/users/${userId}`),

  // Charities Management
  getCharities: (params) => axiosInstance.get('/admin/charities', { params }),
  createCharity: (data) => axiosInstance.post('/admin/charity/create', data),

  // Driver Verification
  getDriverApplications: (params) => axiosInstance.get('/admin/driver-applications', { params }),
  approveDriver: (driverId) => axiosInstance.post(`/admin/drivers/${driverId}/approve`),
  rejectDriver: (driverId, reason) =>
    axiosInstance.post(`/admin/drivers/${driverId}/reject`, { reason }),
}

// ==================== ITEMS ENDPOINTS ====================
export const itemsAPI = {
  getItems: (params) => axiosInstance.get('/items', { params }),
  getItemById: (itemId) => axiosInstance.get(`/items/${itemId}`),
  deleteItem: (itemId) => axiosInstance.delete(`/items/${itemId}`),
  updateItem: (itemId, data) => axiosInstance.put(`/items/${itemId}`, data),
}

// ==================== ORDERS ENDPOINTS ====================
export const ordersAPI = {
  getOrders: (params) => axiosInstance.get('/orders', { params }),
  getOrderById: (orderId) => axiosInstance.get(`/orders/${orderId}`),
  updateOrderStatus: (orderId, status) =>
    axiosInstance.put(`/orders/${orderId}`, { status }),
  cancelOrder: (orderId, reason) =>
    axiosInstance.put(`/orders/${orderId}/cancel`, { reason }),
}

// ==================== DELIVERIES ENDPOINTS ====================
export const deliveriesAPI = {
  getDeliveries: (params) => axiosInstance.get('/deliveries', { params }),
  getDeliveryById: (deliveryId) => axiosInstance.get(`/deliveries/${deliveryId}`),
  assignDriver: (deliveryId, driverId) =>
    axiosInstance.post(`/deliveries/${deliveryId}/assign`, { driver_id: driverId }),
}

export default axiosInstance