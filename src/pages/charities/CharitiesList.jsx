import { useState, useEffect } from 'react'
import { Search, Eye, Filter, Plus, Heart } from 'lucide-react'
import { adminAPI } from '../../api/endpoints'
import { formatDate } from '../../utils/helpers'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/pagination'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import CreateCharityModal from '../../components/charities/CreateCharityModal'
import CharityDetailsModal from '../../components/charities/CharityDetailsModal'

const CharitiesList = () => {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchCharities()
  }, [currentPage])

  const fetchCharities = async () => {
    try {
      setLoading(true)
      const params = { page: currentPage }

      const response = await adminAPI.getCharities(params)
      const data = response.data.data
      setCharities(data.data || data)
      setTotalPages(data.last_page || 1)
    } catch (error) {
      console.error('Failed to fetch charities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCharity = async (formData) => {
    try {
      await adminAPI.createCharity(formData)
      setShowCreateModal(false)
      fetchCharities()
      alert('Charity account created successfully! Login credentials have been sent to the email.')
    } catch (error) {
      console.error('Failed to create charity:', error)
      alert('Failed to create charity account. Please try again.')
    }
  }

  const columns = [
    {
      header: 'Organization',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
            <Heart className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <p className="font-medium">{row.organization_name || row.name}</p>
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
      header: 'Location',
      render: (row) => (
        <span className="text-sm">
          {row.city && row.country ? `${row.city}, ${row.country}` : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Registration',
      accessor: 'registration_number',
      render: (row) => row.registration_number || 'N/A',
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Created',
      render: (row) => (
        <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          onClick={() => { setSelectedCharity(row); setShowDetailsModal(true); }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  const filteredCharities = charities.filter(charity => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      charity.organization_name?.toLowerCase().includes(search) ||
      charity.name?.toLowerCase().includes(search) ||
      charity.email?.toLowerCase().includes(search)
    )
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Charities Management</h1>
          <p className="text-gray-600 mt-1">Manage charity organizations</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Charity
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Charities</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{charities.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-green-200">
          <p className="text-sm text-green-600">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {charities.filter(c => c.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-red-200">
          <p className="text-sm text-red-600">Inactive</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {charities.filter(c => !c.is_active).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <Input
          placeholder="Search charities by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
      </div>

      <Table columns={columns} data={filteredCharities} loading={loading} emptyMessage="No charities found" />

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <CreateCharityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateCharity}
      />

      <CharityDetailsModal
        charity={selectedCharity}
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedCharity(null); }}
      />
    </div>
  )
}

export default CharitiesList