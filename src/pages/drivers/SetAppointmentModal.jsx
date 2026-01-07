import { useState } from 'react'
import Modal from '../../components/common/Modal'
import Button from '../../components/common/Button'
import { Calendar, Clock, MapPin, FileText } from 'lucide-react'
import { adminAPI } from '../../api/endpoints'
import { useToast } from '../../context/ToastContext'

const SetAppointmentModal = ({ isOpen, onClose, driver, onSuccess }) => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    appointment_date: '',
    appointment_time: '',
    location: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.appointment_date) newErrors.appointment_date = 'Date is required'
    if (!formData.appointment_time) newErrors.appointment_time = 'Time is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)

    try {
      const response = await adminAPI.setDriverAppointment(driver.id, formData)
      
      if (response.data.success) {
        showToast('Appointment scheduled successfully', 'success')
        onSuccess()
        handleClose()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to schedule appointment'
      showToast(message, 'error')
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      appointment_date: '',
      appointment_time: '',
      location: '',
      notes: '',
    })
    setErrors({})
    onClose()
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={`Schedule Appointment - ${driver?.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Appointment Date *
          </label>
          <input
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            min={minDate}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              errors.appointment_date ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.appointment_date && (
            <p className="text-red-500 text-sm mt-1">{errors.appointment_date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Appointment Time *
          </label>
          <input
            type="time"
            name="appointment_time"
            value={formData.appointment_time}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              errors.appointment_time ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.appointment_time && (
            <p className="text-red-500 text-sm mt-1">{errors.appointment_time}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., ReWear Office, Beirut"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information for the driver..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
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
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            Schedule Appointment
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SetAppointmentModal