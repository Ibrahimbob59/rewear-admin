import Modal from '../common/Modal'
import { formatDate } from '../../utils/helpers'
import { Building2, Mail, Phone, MapPin, FileText, Hash, Calendar, Heart } from 'lucide-react'

const CharityDetailsModal = ({ charity, isOpen, onClose }) => {
  if (!charity) return null

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 mt-1">{value || 'N/A'}</p>
      </div>
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Charity Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-pink-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{charity.organization_name || charity.name}</h4>
            <p className="text-sm text-gray-500">Charity Organization</p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h5 className="font-semibold text-gray-900 mb-3">Contact Information</h5>
          <div className="space-y-1">
            <InfoRow icon={Mail} label="Email" value={charity.email} />
            <InfoRow icon={Phone} label="Phone" value={charity.phone} />
          </div>
        </div>

        {/* Organization Details */}
        <div>
          <h5 className="font-semibold text-gray-900 mb-3">Organization Details</h5>
          <div className="space-y-1">
            <InfoRow icon={Building2} label="Organization Name" value={charity.organization_name} />
            <InfoRow icon={FileText} label="Registration Number" value={charity.registration_number} />
            <InfoRow icon={Hash} label="Tax ID" value={charity.tax_id} />
          </div>
        </div>

        {/* Description */}
        {charity.organization_description && (
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
            <p className="text-sm text-gray-600">{charity.organization_description}</p>
          </div>
        )}

        {/* Location */}
        <div>
          <h5 className="font-semibold text-gray-900 mb-3">Location</h5>
          <div className="space-y-1">
            <InfoRow icon={MapPin} label="Address" value={charity.address} />
            <InfoRow icon={MapPin} label="City" value={charity.city} />
            <InfoRow icon={MapPin} label="Country" value={charity.country} />
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Account Status</p>
              <p className="font-medium text-gray-900 mt-1">
                {charity.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Created</p>
              <p className="font-medium text-gray-900 mt-1">{formatDate(charity.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CharityDetailsModal