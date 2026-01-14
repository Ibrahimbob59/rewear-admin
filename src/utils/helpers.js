// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Truncate text
export const truncate = (text, length = 50) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Get error message from API response
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Delivery Status Helpers
export const getDeliveryStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    assigned: 'blue',
    in_transit: 'indigo',
    delivered: 'green',
    cancelled: 'red',
  }
  return colors[status] || 'gray'
}

export const getDeliveryStatusDisplay = (status) => {
  const displays = {
    pending: 'Pending',
    assigned: 'Assigned',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return displays[status] || status
}

export const getDeliveryStatusBadge = (status) => {
  const colors = {
    pending: 'bg-orange-100 text-orange-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_transit: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return `px-3 py-1 rounded-full text-xs font-medium ${
    colors[status] || 'bg-gray-100 text-gray-800'
  }`
}

// Backward-compat (if any code still uses the old name)
export const getDeliveryStatusBadgeClass = (status) => getDeliveryStatusBadge(status)

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
