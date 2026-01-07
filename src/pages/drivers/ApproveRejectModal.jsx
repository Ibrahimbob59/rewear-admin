import { useState } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { CheckCircle, XCircle, FileText } from 'lucide-react'
import { adminAPI } from '../../api/endpoints'
import { useToast } from '../../context/ToastContext'

const ApproveRejectModal = ({ isOpen, onClose, driver, action, onSuccess }) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const isApprove = action === 'approve'

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isApprove && !notes.trim()) {
      setError('Please provide a reason for rejection')
      return
    }

    setLoading(true)

    try {
      const response = isApprove
        ? await adminAPI.approveDriver(driver.id, notes)
        : await adminAPI.rejectDriver(driver.id, notes)
      
      if (response.data.success) {
        showToast(
          `Driver ${isApprove ? 'approved' : 'rejected'} successfully`,
          'success'
        )
        onSuccess()
        handleClose()
      }
    } catch (error) {
      const message = error.response?.data?.message || 
        `Failed to ${isApprove ? 'approve' : 'reject'} driver`
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setNotes('')
    setError('')
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={`${isApprove ? 'Approve' : 'Reject'} Driver Application`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`p-4 rounded-lg ${
          isApprove ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          {isApprove ? (
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Approve Driver</p>
                <p className="text-sm text-green-700 mt-1">
                  This will grant {driver?.name} driver access to the platform. 
                  They will be able to accept and complete deliveries.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Reject Driver</p>
                <p className="text-sm text-red-700 mt-1">
                  This will reject {driver?.name}'s driver application. 
                  Please provide a reason for rejection.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-900">{driver?.name}</p>
          <p className="text-sm text-gray-600">{driver?.email}</p>
          <p className="text-sm text-gray-600">{driver?.phone}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            {isApprove ? 'Notes (Optional)' : 'Reason for Rejection *'}
          </label>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value)
              setError('')
            }}
            placeholder={
              isApprove
                ? 'Any notes for internal reference...'
                : 'Please explain why this application is being rejected...'
            }
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            required={!isApprove}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={isApprove ? 'primary' : 'danger'}
            loading={loading}
            className="flex-1"
          >
            {isApprove ? 'Approve Driver' : 'Reject Application'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ApproveRejectModal