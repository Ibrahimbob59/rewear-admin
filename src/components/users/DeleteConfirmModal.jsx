import Modal from '../common/Modal'
import Button from '../common/Button'
import { AlertTriangle } from 'lucide-react'

const DeleteConfirmModal = ({ user, isOpen, onClose, onConfirm, loading }) => {
  if (!user) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User" size="sm">
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-gray-900 font-medium">
            Are you sure you want to delete this user?
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <span className="font-medium">{user.name}</span> ({user.email})
          </p>
          <p className="text-sm text-red-600 mt-3">
            This action cannot be undone. All user data will be permanently deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            Delete User
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmModal