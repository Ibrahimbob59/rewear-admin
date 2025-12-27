import { useState, useEffect } from 'react'
import { Search, Eye, Filter, XCircle } from 'lucide-react'
import { ordersAPI } from '../../api/endpoints'
import { formatDate, formatCurrency, getStatusColor, capitalize } from '../../utils/helpers'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/pagination'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import OrderDetailsModal from '../../components/orders/OrderDetailsModal'

const OrdersList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = { page: currentPage }
      if (statusFilter) params.status = statusFilter

      const response = await ordersAPI.getOrders(params)
      const data = response.data.data
      setOrders(data.data || data)
      setTotalPages(data.last_page || 1)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (order) => {
    const reason = prompt('Enter cancellation reason:')
    if (!reason) return

    try {
      await ordersAPI.cancelOrder(order.id, reason)
      fetchOrders()
    } catch (error) {
      console.error('Failed to cancel order:', error)
      alert('Failed to cancel order')
    }
  }

  const columns = [
    {
      header: 'Order #',
      render: (row) => (
        <div>
          <p className="font-medium text-primary-600">#{row.order_number}</p>
          <p className="text-xs text-gray-500">{formatDate(row.created_at)}</p>
        </div>
      ),
    },
    {
      header: 'Item',
      render: (row) => (
        <div className="flex items-center">
          <img
            src={row.item?.images?.[0]?.image_url || '/placeholder.jpg'}
            alt={row.item?.title}
            className="w-10 h-10 object-cover rounded mr-3"
          />
          <div>
            <p className="font-medium text-sm">{row.item?.title}</p>
            <p className="text-xs text-gray-500">{row.item?.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Buyer',
      render: (row) => (
        <div>
          <p className="text-sm font-medium">{row.buyer?.name}</p>
          <p className="text-xs text-gray-500">{row.buyer?.email}</p>
        </div>
      ),
    },
    {
      header: 'Seller',
      render: (row) => (
        <div>
          <p className="text-sm font-medium">{row.seller?.name}</p>
          <p className="text-xs text-gray-500">{row.seller?.email}</p>
        </div>
      ),
    },
    {
      header: 'Total',
      render: (row) => (
        <span className="font-semibold">{formatCurrency(row.total_amount)}</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {capitalize(row.status)}
        </span>
      ),
    },
    {
      header: 'Payment',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {capitalize(row.payment_status)}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => { setSelectedOrder(row); setShowDetailsModal(true); }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status !== 'cancelled' && row.status !== 'completed' && (
            <button
              onClick={() => handleCancelOrder(row)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              title="Cancel Order"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-1">Manage all platform orders</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_delivery">In Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={fetchOrders} size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      <Table columns={columns} data={orders} loading={loading} emptyMessage="No orders found" />

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedOrder(null); }}
      />
    </div>
  )
}

export default OrdersList