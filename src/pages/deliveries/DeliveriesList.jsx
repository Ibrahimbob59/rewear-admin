import { useState, useEffect } from 'react'
import { Search, Eye, Filter, Truck, Package, CheckCircle } from 'lucide-react'
import { deliveriesAPI } from '../../api/endpoints'
import { formatDate, formatCurrency, getStatusColor, capitalize } from '../../utils/helpers'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/pagination'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import DeliveryDetailsModal from '../../components/deliveries/DeliveryDetailsModal'

const DeliveriesList = () => {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchDeliveries()
  }, [currentPage, statusFilter])

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      const params = { page: currentPage }
      if (statusFilter) params.status = statusFilter

      const response = await deliveriesAPI.getDeliveries(params)
      const data = response.data.data
      setDeliveries(data.data || data)
      setTotalPages(data.last_page || 1)
    } catch (error) {
      console.error('Failed to fetch deliveries:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: 'Delivery ID',
      render: (row) => (
        <div>
          <p className="font-medium text-primary-600">#{row.id}</p>
          <p className="text-xs text-gray-500">{formatDate(row.created_at)}</p>
        </div>
      ),
    },
    {
      header: 'Order',
      render: (row) => (
        <div>
          <p className="font-medium text-sm">#{row.order?.order_number}</p>
          <p className="text-xs text-gray-500">{row.order?.item?.title}</p>
        </div>
      ),
    },
    {
      header: 'Driver',
      render: (row) => (
        <div>
          {row.driver ? (
            <>
              <p className="text-sm font-medium">{row.driver.name}</p>
              <p className="text-xs text-gray-500">{row.driver.phone}</p>
            </>
          ) : (
            <span className="text-sm text-gray-400">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      header: 'Distance',
      render: (row) => (
        <span className="text-sm">{row.distance_km || 0} km</span>
      ),
    },
    {
      header: 'Fee',
      render: (row) => (
        <div>
          <p className="font-medium">{formatCurrency(row.delivery_fee)}</p>
          <p className="text-xs text-green-600">Driver: {formatCurrency(row.driver_earning)}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
          {capitalize(row.status.replace('_', ' '))}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => { setSelectedDelivery(row); setShowDetailsModal(true); }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter(d => d.status === 'pending').length,
    active: deliveries.filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status)).length,
    completed: deliveries.filter(d => d.status === 'delivered').length,
    failed: deliveries.filter(d => d.status === 'failed').length,
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deliveries Tracking</h1>
        <p className="text-gray-600 mt-1">Track and manage all deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <Package className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <Package className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Active</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.active}</p>
            </div>
            <Truck className="w-10 h-10 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by order number or driver..."
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
            <option value="assigned">Assigned</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={fetchDeliveries} size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      <Table columns={columns} data={deliveries} loading={loading} emptyMessage="No deliveries found" />

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <DeliveryDetailsModal
        delivery={selectedDelivery}
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedDelivery(null); }}
      />
    </div>
  )
}

export default DeliveriesList