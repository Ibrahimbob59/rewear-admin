import Modal from '../common/Modal'
import Button from '../common/Button'
import { formatDate } from '../../utils/helpers'
import { User, Phone, Mail, MapPin, Car, FileText, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

const DriverApplicationDetails = ({ application, isOpen, onClose, onApprove, onReject }) => {
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [approveLoading, setApproveLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  if (!application) return null

  const handleApprove = async () => {
    setApproveLoading(true)
    await onApprove(application.id)
    setApproveLoading(false)
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    setRejectLoading(true)
    await onReject(application.id, rejectReason)
    setRejectLoading(false)
    setRejecting(false)
    setRejectReason('')
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 py-2">
      <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value || 'N/A'}</p>
      </div>
    </div>
  )

  const DocumentPreview = ({ url, label }) => (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <img src={url} alt={label} className="w-full h-48 object-cover rounded-lg border hover:opacity-75" />
        </a>
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">No document uploaded</p>
        </div>
      )}
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Driver Application Details" size="xl">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            application.status === 'approved' ? 'bg-green-100 text-green-800' :
            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
            application.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {application.status.replace('_', ' ').toUpperCase()}
          </span>
          <span className="text-sm text-gray-500">Applied {formatDate(application.created_at)}</span>
        </div>

        {/* Personal Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <InfoRow icon={User} label="Full Name" value={application.full_name} />
            <InfoRow icon={Phone} label="Phone" value={application.phone} />
            <InfoRow icon={Mail} label="Email" value={application.email} />
            <InfoRow icon={MapPin} label="Address" value={`${application.address}, ${application.city}`} />
          </div>
        </div>

        {/* Vehicle Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Vehicle Information</h4>
          <InfoRow icon={Car} label="Vehicle Type" value={application.vehicle_type?.toUpperCase()} />
        </div>

        {/* Documents */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Documents</h4>
          <div className="grid grid-cols-3 gap-4">
            <DocumentPreview url={application.id_document_url} label="ID Document" />
            <DocumentPreview url={application.driving_license_url} label="Driving License" />
            <DocumentPreview url={application.vehicle_registration_url} label="Vehicle Registration" />
          </div>
        </div>

        {/* Rejection Reason (if rejected) */}
        {application.status === 'rejected' && application.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h5 className="font-semibold text-red-900 mb-2">Rejection Reason</h5>
            <p className="text-sm text-red-800">{application.rejection_reason}</p>
            <p className="text-xs text-red-600 mt-2">Reviewed on {formatDate(application.reviewed_at)}</p>
          </div>
        )}

        {/* Rejection Form */}
        {rejecting && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter detailed reason for rejection..."
            />
          </div>
        )}

        {/* Actions */}
        {application.status === 'pending' && (
          <div className="flex space-x-3 pt-4 border-t">
            {!rejecting ? (
              <>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setRejecting(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleApprove}
                  loading={approveLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Driver
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => { setRejecting(false); setRejectReason(''); }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleReject}
                  loading={rejectLoading}
                >
                  Confirm Rejection
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default DriverApplicationDetails