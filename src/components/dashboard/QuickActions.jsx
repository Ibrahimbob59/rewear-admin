import { UserPlus, ShoppingBag, Truck, Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const QuickActions = () => {
  const navigate = useNavigate()

  const actions = [
    {
      title: 'Add User',
      description: 'Create new user account',
      icon: UserPlus,
      color: 'bg-blue-500',
      onClick: () => navigate('/users'),
    },
    {
      title: 'View Items',
      description: 'Manage marketplace items',
      icon: ShoppingBag,
      color: 'bg-green-500',
      onClick: () => navigate('/items'),
    },
    {
      title: 'Deliveries',
      description: 'Track active deliveries',
      icon: Truck,
      color: 'bg-purple-500',
      onClick: () => navigate('/deliveries'),
    },
    {
      title: 'Charities',
      description: 'Manage charity accounts',
      icon: Heart,
      color: 'bg-pink-500',
      onClick: () => navigate('/charities'),
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
          >
            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{action.title}</p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions