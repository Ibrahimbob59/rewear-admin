import Modal from '../common/Modal'
import { formatDate } from '../../utils/helpers'
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react'

const UserDetailsModal = ({ user, isOpen, onClose }) => {
  if (!user) return null

  const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-1">{value || 'N/A'}</p>
      </div>
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{user.name}</h4>
            <p className="text-sm text-gray-500 capitalize">{user.user_type}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-1">
            <DetailRow icon={Mail} label="Email" value={user.email} />
            <DetailRow icon={Phone} label="Phone" value={user.phone} />
            <DetailRow icon={Shield} label="Status" value={user.is_active ? 'Active' : 'Inactive'} />
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            <DetailRow icon={MapPin} label="Location" value={user.city && user.country ? `${user.city}, ${user.country}` : null} />
            <DetailRow icon={Calendar} label="Joined" value={formatDate(user.created_at)} />
            <DetailRow icon={Calendar} label="Last Login" value={formatDate(user.last_login_at)} />
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Bio</h5>
            <p className="text-sm text-gray-600">{user.bio}</p>
          </div>
        )}

        {/* Charity Details */}
        {user.user_type === 'charity' && user.organization_name && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h5 className="text-sm font-semibold text-blue-900 mb-2">Organization Details</h5>
            <div className="space-y-2">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Name:</span> {user.organization_name}
              </p>
              {user.organization_description && (
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Description:</span> {user.organization_description}
                </p>
              )}
              {user.registration_number && (
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Registration:</span> {user.registration_number}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Driver Status */}
        {user.is_driver && (
          <div className={`rounded-lg p-4 border ${user.driver_verified ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-100'}`}>
            <h5 className={`text-sm font-semibold mb-2 ${user.driver_verified ? 'text-green-900' : 'text-yellow-900'}`}>
              Driver Status
            </h5>
            <p className={`text-sm ${user.driver_verified ? 'text-green-800' : 'text-yellow-800'}`}>
              {user.driver_verified ? `Verified on ${formatDate(user.driver_verified_at)}` : 'Pending Verification'}
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default UserDetailsModal