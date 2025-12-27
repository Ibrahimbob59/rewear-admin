import { useState, useEffect } from 'react'
import { Search, Eye, Filter, CheckCircle, XCircle } from 'lucide-react'
import { adminAPI } from '../../api/endpoints'
import { formatDate, getStatusColor, capitalize } from '../../utils/helpers'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/pagination'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import DriverApplicationDetails from '../../components/drivers/DriverApplicationDetails'

const DriverApplicationsList = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

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

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveDriver(id)
      setShowDetailsModal(false)
      setSelectedApp(null)
      fetchApplications()
      alert('Driver approved successfully!')
    } catch (error) {
      console.error('Failed to approve driver:', error)
      alert('Failed to approve driver')
    }
  }

  const handleReject = async (id, reason) => {
    try {
      await adminAPI.rejectDriver(id, reason)
      setShowDetailsModal(false)
      setSelectedApp(null)
      fetchApplications()
      alert('Driver application rejected')
    } catch (error) {
      console.error('Failed to reject driver:', error)
      alert('Failed to reject driver')
    }
  }

  const columns = [
    {
      header: 'Applicant',
      render: (row) => (
        <div>
          <p className="font-medium">{row.full_name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Location',
      render: (row) => (
        <span className="text-sm">{row.city}</span>
      ),
    },
    {
      header: 'Vehicle',
      render: (row) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs uppercase">
          {row.vehicle_type}
        </span>
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
      header: 'Applied',
      render: (row) => (
        <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => { setSelectedApp(row); setShowDetailsModal(true); }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Driver Applications</h1>
        <p className="text-gray-600 mt-1">Review and approve driver applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-yellow-200">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-green-200">
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-red-200">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by name or email..."
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
            <option value="under_review">Under Review</option>
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

      <Table columns={columns} data={applications} loading={loading} emptyMessage="No applications found" />

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <DriverApplicationDetails
        application={selectedApp}
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedApp(null); }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}

export default DriverApplicationsList