import { useState, useEffect } from 'react'
import { Search, Eye, Filter, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { adminAPI } from '../../api/endpoints'
import { formatDate, getStatusColor, capitalize } from '../../utils/helpers'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/pagination'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import DriverApplicationDetails from '../../components/drivers/DriverApplicationDetails'
import SetAppointmentModal from './SetAppointmentModal'
import ApproveRejectModal from './ApproveRejectModal'

const DriverApplicationsList = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [actionType, setActionType] = useState('approve')

  useEffect(() => {
    fetchApplications()
  }, [currentPage, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = { page: currentPage }
      if (statusFilter) params.status = statusFilter

      const response = await adminAPI.getDriverApplications(params)
      const data = response.data.data
      setApplications(data.data || data)
      setTotalPages(data.last_page || 1)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSetAppointment = (driver) => {
    setSelectedDriver(driver)
    setShowAppointmentModal(true)
  }

  const handleApprove = (driver) => {
    setSelectedDriver(driver)
    setActionType('approve')
    setShowActionModal(true)
  }

  const handleReject = (driver) => {
    setSelectedDriver(driver)
    setActionType('reject')
    setShowActionModal(true)
  }

  const columns = [
    {
      header: 'Driver',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-primary-600">
              {row.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Vehicle',
      render: (row) => (
        <div>
          <p className="text-sm">{row.vehicle_make || 'N/A'} {row.vehicle_model || ''}</p>
          <p className="text-xs text-gray-500">{row.license_plate || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status || 'pending')}`}>
          {capitalize(row.status || 'pending')}
        </span>
      ),
    },
    {
      header: 'Applied',
      accessor: 'created_at',
      render: (row) => (
        <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleSetAppointment(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Schedule Appointment"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleApprove(row)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Approve"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleReject(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Reject"
          >
            <XCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedApp(row)
              setShowDetailsModal(true)
            }}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Applications</h1>
        <p className="text-gray-600 mt-1">Review and manage driver applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={fetchApplications} size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Applications Table */}
      <Table
        columns={columns}
        data={applications}
        loading={loading}
        emptyMessage="No driver applications found"
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      <DriverApplicationDetails
        application={selectedApp}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedApp(null)
        }}
      />

      <SetAppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        driver={selectedDriver}
        onSuccess={() => {
          fetchApplications()
        }}
      />

      <ApproveRejectModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        driver={selectedDriver}
        action={actionType}
        onSuccess={() => {
          fetchApplications()
        }}
      />
    </div>
  )
}

export default DriverApplicationsList