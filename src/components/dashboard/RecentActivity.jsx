import { Users, ShoppingBag, Package, Heart } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      user: Users,
      item: ShoppingBag,
      order: Package,
      charity: Heart,
    }
    const Icon = icons[type] || Package
    return <Icon className="w-5 h-5" />
  }

  const getActivityColor = (type) => {
    const colors = {
      user: 'bg-blue-100 text-blue-600',
      item: 'bg-green-100 text-green-600',
      order: 'bg-purple-100 text-purple-600',
      charity: 'bg-pink-100 text-pink-600',
    }
    return colors[type] || 'bg-gray-100 text-gray-600'
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-center py-8">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(activity.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity