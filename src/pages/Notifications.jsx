import { useState, useEffect } from 'react'
import { Bell, Check, Trash2, Calendar, User, Package, ShoppingCart, Send, TestTube } from 'lucide-react'
import { adminAPI } from '../api/endpoints'
import { formatDate } from '../utils/helpers'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import axiosInstance from '../api/axios'

const Notifications = () => {
  const { showToast } = useToast()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, read

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await adminAPI.getNotifications(params)

      // Debug: Log the full response
      console.log('Notifications API Response:', response.data)

      // Handle multiple possible response structures
      let notificationsArray = []

      if (response.data) {
        const data = response.data

        // Structure 1: { success: true, data: [...] }
        if (Array.isArray(data.data)) {
          notificationsArray = data.data
        }
        // Structure 2: { success: true, data: { data: [...] } } (pagination)
        else if (data.data && Array.isArray(data.data.data)) {
          notificationsArray = data.data.data
        }
        // Structure 3: { success: true, notifications: [...] }
        else if (Array.isArray(data.notifications)) {
          notificationsArray = data.notifications
        }
        // Structure 4: Direct array at root
        else if (Array.isArray(data)) {
          notificationsArray = data
        }
      }

      console.log('Extracted notifications:', notificationsArray)
      setNotifications(notificationsArray)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      if (error.response?.status === 404) {
        setNotifications([])
      } else {
        setNotifications([])
      }
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      const response = await adminAPI.markNotificationRead(id)
      if (response.data.success) {
        setNotifications(notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ))
        showToast('Notification marked as read', 'success')
      }
    } catch (error) {
      showToast('Failed to mark as read', 'error')
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await adminAPI.markAllNotificationsRead()
      if (response.data.success) {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
        showToast('All notifications marked as read', 'success')
      }
    } catch (error) {
      showToast('Failed to mark all as read', 'error')
    }
  }

  const deleteNotification = async (id) => {
    try {
      const response = await adminAPI.deleteNotification(id)
      if (response.data.success) {
        setNotifications(notifications.filter(n => n.id !== id))
        showToast('Notification deleted', 'success')
      }
    } catch (error) {
      showToast('Failed to delete notification', 'error')
    }
  }

  const sendTestNotificationToAdmin = async () => {
    try {
      const response = await axiosInstance.post('/admin/notifications/test', {
        type: 'system',
        title: 'Test Admin Notification',
        message: 'This is a test notification for admin at ' + new Date().toLocaleString(),
      })
      if (response.data.success) {
        showToast('Test notification sent to admin', 'success')
        fetchNotifications()
      }
    } catch (error) {
      showToast('Failed to send test notification', 'error')
    }
  }

  const sendTestNotificationToUser = async () => {
    try {
      const response = await axiosInstance.post('/notifications/test', {
        type: 'system',
        title: 'Test User Notification',
        message: 'This is a test notification for user at ' + new Date().toLocaleString(),
      })
      if (response.data.success) {
        showToast('Test notification sent to user', 'success')
        fetchNotifications()
      }
    } catch (error) {
      showToast('Failed to send test notification', 'error')
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      user: User,
      order: ShoppingCart,
      item: Package,
      driver: Package,
      system: Bell,
    }
    return icons[type] || Bell
  }

  const getNotificationColor = (type) => {
    const colors = {
      user: 'bg-blue-100 text-blue-600',
      order: 'bg-green-100 text-green-600',
      item: 'bg-purple-100 text-purple-600',
      driver: 'bg-orange-100 text-orange-600',
      system: 'bg-gray-100 text-gray-600',
    }
    return colors[type] || 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading notifications..." />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with platform activities</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={sendTestNotificationToAdmin}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            <TestTube className="w-4 h-4" />
            Test Admin
          </button>
          <button
            onClick={sendTestNotificationToUser}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <Send className="w-4 h-4" />
            Test User
          </button>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
            >
              <Check className="w-4 h-4" />
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'read'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications Yet</h3>
          <p className="text-gray-500 mb-4">
            Check the browser console to see the API response structure
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-blue-800">
              <strong>Expected endpoint:</strong> GET /api/admin/notifications
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow border p-4 transition-colors ${
                notification.read ? 'border-gray-200' : 'border-primary-200 bg-primary-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                  {React.createElement(getNotificationIcon(notification.type), { className: "w-5 h-5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(notification.created_at)}
                    </p>
                    {!notification.read && (
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notifications
