import Modal from '../common/Modal'
import { formatDate, formatCurrency, getStatusColor, capitalize } from '../../utils/helpers'
import { Package, User, MapPin, Truck, DollarSign, Calendar, Clock } from 'lucide-react'

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null

  const StatusTimeline = () => {
    const statuses = [
      { key: 'pending', label: 'Pending', time: order.created_at },
      { key: 'confirmed', label: 'Confirmed', time: order.confirmed_at },
      { key: 'in_delivery', label: 'In Delivery', time: order.delivery?.assigned_at },
      { key: 'delivered', label: 'Delivered', time: order.delivered_at },
      { key: 'completed', label: 'Completed', time: order.completed_at },
    ]

    const currentIndex = statuses.findIndex(s => s.key === order.status)

    return (
      <div className="relative">
        <div className="flex justify-between">
          {statuses.map((status, idx) => (
            <div key={status.key} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                idx <= currentIndex ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {idx < currentIndex ? '✓' : idx + 1}
              </div>
              <p className={`text-xs mt-2 ${idx <= currentIndex ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {status.label}
              </p>
              {status.time && (
                <p className="text-xs text-gray-500">{formatDate(status.time)}</p>
              )}
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div
            className="h-full bg-primary-600 transition-all"
            style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${order.order_number}`} size="xl">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {capitalize(order.status)}
          </span>
          <span className="text-sm text-gray-500">
            Placed {formatDate(order.created_at)}
          </span>
        </div>

        {/* Timeline */}
        <StatusTimeline />

        {/* Item Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={order.item?.images?.[0]?.image_url || '/placeholder.jpg'}
              alt={order.item?.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{order.item?.title}</h4>
              <p className="text-sm text-gray-500">{order.item?.category} • {order.item?.size}</p>
              <p className="text-lg font-bold text-primary-600 mt-1">{formatCurrency(order.item_price)}</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-gray-400" />
                <h5 className="font-semibold text-gray-900">Buyer</h5>
              </div>
              <p className="text-sm text-gray-600">{order.buyer?.name}</p>
              <p className="text-sm text-gray-500">{order.buyer?.email}</p>
              <p className="text-sm text-gray-500">{order.buyer?.phone}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-gray-400" />
                <h5 className="font-semibold text-gray-900">Seller</h5>
              </div>
              <p className="text-sm text-gray-600">{order.seller?.name}</p>
              <p className="text-sm text-gray-500">{order.seller?.email}</p>
              <p className="text-sm text-gray-500">{order.seller?.phone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <h5 className="font-semibold text-gray-900">Delivery Address</h5>
              </div>
              <p className="text-sm text-gray-600">{order.delivery_address?.address_line1}</p>
              {order.delivery_address?.address_line2 && (
                <p className="text-sm text-gray-600">{order.delivery_address.address_line2}</p>
              )}
              <p className="text-sm text-gray-500">
                {order.delivery_address?.city}, {order.delivery_address?.postal_code}
              </p>
            </div>

            {order.delivery?.driver && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <h5 className="font-semibold text-gray-900">Driver</h5>
                </div>
                <p className="text-sm text-gray-600">{order.delivery.driver.name}</p>
                <p className="text-sm text-gray-500">{order.delivery.driver.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Item Price</span>
              <span className="font-medium">{formatCurrency(order.item_price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">{formatCurrency(order.delivery_fee)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-lg text-primary-600">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium uppercase">{order.payment_method}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {capitalize(order.payment_status)}
          </span>
        </div>

        {/* Cancellation Reason */}
        {order.status === 'cancelled' && order.cancellation_reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h5 className="font-semibold text-red-900 mb-2">Cancellation Reason</h5>
            <p className="text-sm text-red-800">{order.cancellation_reason}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default OrderDetailsModal