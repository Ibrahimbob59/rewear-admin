import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import DriverApplicationsList from '../../pages/drivers/DriverApplicationsList'
import { Building2, Mail, Phone, FileText, Hash, MapPin } from 'lucide-react'

const CreateCharityModal = ({ isOpen, onClose, onCreate }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    organization_name: '',
    email: '',
    phone: '',
    organization_description: '',
    registration_number: '',
    tax_id: '',
    address: '',
    city: '',
    country: '',
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
    if (!formData.organization_name) newErrors.organization_name = 'Organization name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.phone) newErrors.phone = 'Phone is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.country) newErrors.country = 'Country is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    await onCreate(formData)
    setLoading(false)
    setFormData({
      organization_name: '',
      email: '',
      phone: '',
      organization_description: '',
      registration_number: '',
      tax_id: '',
      address: '',
      city: '',
      country: '',
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Charity Account" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Organization Name"
          name="organization_name"
          value={formData.organization_name}
          onChange={handleChange}
          icon={Building2}
          error={errors.organization_name}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            error={errors.email}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            icon={Phone}
            error={errors.phone}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="organization_description"
            value={formData.organization_description}
            onChange={handleChange}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Brief description of the organization..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Registration Number"
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            icon={FileText}
          />
          <Input
            label="Tax ID"
            name="tax_id"
            value={formData.tax_id}
            onChange={handleChange}
            icon={Hash}
          />
        </div>

        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          icon={MapPin}
          error={errors.address}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
          />
          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            error={errors.country}
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            A random password will be generated and sent to the charity email address.
          </p>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" fullWidth loading={loading}>
            Create Charity
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateCharityModal