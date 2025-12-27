import Modal from '../common/Modal'
import { formatDate, formatCurrency, getStatusColor, capitalize } from '../../utils/helpers'
import { Package, Truck, MapPin, DollarSign, Calendar, User } from 'lucide-react'

const DeliveryDetailsModal = ({ delivery, isOpen, onClose }) => {
  if (!delivery) return null

  const StatusTimeline = () => {
    const statuses = [
      { key: 'pending', label: 'Pending', time: delivery.created_at },
      { key: 'assigned', label: 'Assigned', time: delivery.assigned_at },
      { key: 'picked_up', label: 'Picked Up', time: delivery.picked_up_at },
      { key: 'in_transit', label: 'In Transit', time: delivery.picked_up_at },
      { key: 'delivered', label: 'Delivered', time: delivery.delivered_at },
    ]

    const currentIndex = statuses.findIndex(s => s.key === delivery.status)

    return (
      <div className="relative mb-6">
        <div className="flex justify-between">
          {statuses.map((status, idx) => (
            <div key={status.key} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                idx <= currentIndex ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {idx < currentIndex ? '✓' : idx + 1}
              </div>
              <p className={`text-xs mt-2 text-center ${idx <= currentIndex ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {status.label}
              </p>
              {status.time && idx <= currentIndex && (
                <p className="text-xs text-gray-500">{formatDate(status.time)}</p>
              )}
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div className="h-full bg-green-600 transition-all" style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }} />
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delivery #${delivery.id}`} size="xl">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(delivery.status)}`}>
            {capitalize(delivery.status.replace('_', ' '))}
          </span>
          <span className="text-sm text-gray-500">Created {formatDate(delivery.created_at)}</span>
        </div>

        {/* Timeline */}
        <StatusTimeline />

        {/* Order Info */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h5 className="font-semibold text-blue-900">Order Information</h5>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Order Number</p>
              <p className="font-medium text-blue-900">#{delivery.order?.order_number}</p>
            </div>
            <div>
              <p className="text-blue-600">Item</p>
              <p className="font-medium text-blue-900">{delivery.order?.item?.title}</p>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        {delivery.driver && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Truck className="w-5 h-5 text-gray-400" />
              <h5 className="font-semibold text-gray-900">Driver Information</h5>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{delivery.driver.name}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{delivery.driver.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Locations */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <h5 className="font-semibold text-gray-900">Pickup Location</h5>
            </div>
            <p className="text-sm text-gray-600">{delivery.pickup_address || 'Not specified'}</p>
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-red-600" />
              <h5 className="font-semibold text-gray-900">Delivery Location</h5>
            </div>
            <p className="text-sm text-gray-600">{delivery.delivery_address || 'Not specified'}</p>
          </div>
        </div>

        {/* Distance & Fees */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Distance</p>
              <p className="font-medium text-gray-900">{delivery.distance_km || 0} km</p>
            </div>
            <div>
              <p className="text-gray-500">Delivery Fee</p>
              <p className="font-medium text-gray-900">{formatCurrency(delivery.delivery_fee)}</p>
            </div>
            <div>
              <p className="text-gray-500">Driver Earning</p>
              <p className="font-medium text-green-600">{formatCurrency(delivery.driver_earning)}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {delivery.delivery_notes && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Delivery Notes</h5>
            <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
              {delivery.delivery_notes}
            </p>
          </div>
        )}

        {/* Failure Reason */}
        {delivery.status === 'failed' && delivery.failure_reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h5 className="font-semibold text-red-900 mb-2">Failure Reason</h5>
            <p className="text-sm text-red-800">{delivery.failure_reason}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default DeliveryDetailsModal