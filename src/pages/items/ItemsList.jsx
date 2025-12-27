import { useState, useEffect } from 'react'
import { Search, Eye, Trash2, Filter, ToggleLeft, ToggleRight } from 'lucide-react'
import { itemsAPI, adminAPI } from '../../api/endpoints'
import { formatDate, formatCurrency, getStatusColor, capitalize } from '../../utils/helpers'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/pagination'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ItemDetailsModal from '../../components/items/ItemDetailsModal'
import DeleteConfirmModal from '../../components/users/DeleteConfirmModal'

const ItemsList = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [currentPage, categoryFilter, statusFilter])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const params = { page: currentPage }
      if (searchTerm) params.search = searchTerm
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter

      const response = await itemsAPI.getItems(params)
      const data = response.data.data
      setItems(data.data || data)
      setTotalPages(data.last_page || 1)
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (item) => {
    try {
      await itemsAPI.updateItem(item.id, {
        status: item.status === 'available' ? 'sold' : 'available'
      })
      fetchItems()
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const handleDelete = async () => {
    try {
      setDeleteLoading(true)
      await itemsAPI.deleteItem(selectedItem.id)
      setShowDeleteModal(false)
      setSelectedItem(null)
      fetchItems()
    } catch (error) {
      console.error('Failed to delete item:', error)
    } finally {
      setDeleteLoading(false)
    }
  }

  const columns = [
    {
      header: 'Item',
      render: (row) => (
        <div className="flex items-center">
          <img
            src={row.images?.[0]?.image_url || '/placeholder.jpg'}
            alt={row.title}
            className="w-12 h-12 object-cover rounded-lg mr-3"
          />
          <div>
            <p className="font-medium">{row.title}</p>
            <p className="text-xs text-gray-500">{row.seller?.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Price',
      render: (row) => (
        <span className="font-medium">
          {row.is_donation ? 'FREE' : formatCurrency(row.price)}
        </span>
      ),
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {capitalize(row.category)}
        </span>
      ),
    },
    {
      header: 'Size',
      accessor: 'size',
      render: (row) => <span className="uppercase">{row.size}</span>,
    },
    {
      header: 'Condition',
      render: (row) => capitalize(row.condition),
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
      header: 'Listed',
      render: (row) => <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => { setSelectedItem(row); setShowDetailsModal(true); }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(row)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            title="Toggle Status"
          >
            {row.status === 'available' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { setSelectedItem(row); setShowDeleteModal(true); }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Items Management</h1>
        <p className="text-gray-600 mt-1">Manage marketplace items</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="dresses">Dresses</option>
            <option value="outerwear">Outerwear</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={fetchItems} size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      <Table columns={columns} data={items} loading={loading} emptyMessage="No items found" />

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <ItemDetailsModal
        item={selectedItem}
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedItem(null); }}
      />

      <DeleteConfirmModal
        user={selectedItem}
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelectedItem(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  )
}

export default ItemsList