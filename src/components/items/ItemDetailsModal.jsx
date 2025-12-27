import Modal from '../common/Modal'
import { formatDate, formatCurrency } from '../../utils/helpers'
import { Package, Tag, Ruler, Star, MapPin, User, Calendar } from 'lucide-react'

const ItemDetailsModal = ({ item, isOpen, onClose }) => {
  if (!item) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Item Details" size="xl">
      <div className="space-y-6">
        {/* Images */}
        <div className="grid grid-cols-4 gap-4">
          {item.images && item.images.length > 0 ? (
            item.images.map((img, idx) => (
              <img
                key={idx}
                src={img.image_url}
                alt={item.title}
                className="w-full h-32 object-cover rounded-lg border"
              />
            ))
          ) : (
            <div className="col-span-4 bg-gray-100 h-48 rounded-lg flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Title & Price */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            {item.is_donation ? 'FREE (Donation)' : formatCurrency(item.price)}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="font-medium capitalize">{item.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Ruler className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Size</p>
                <p className="font-medium uppercase">{item.size}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Condition</p>
                <p className="font-medium capitalize">{item.condition}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Seller</p>
                <p className="font-medium">{item.seller?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium">{item.seller?.city || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Listed</p>
                <p className="font-medium">{formatDate(item.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
          <p className="text-gray-600">{item.description || 'No description'}</p>
        </div>

        {/* Additional Info */}
        <div className="flex gap-4 text-sm">
          <span className={`px-3 py-1 rounded-full ${item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {item.status}
          </span>
          {item.brand && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              Brand: {item.brand}
            </span>
          )}
          {item.color && (
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              {item.color}
            </span>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ItemDetailsModal