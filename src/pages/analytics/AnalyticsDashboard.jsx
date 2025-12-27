import { useState, useEffect } from 'react'
import { Calendar, TrendingUp, DollarSign, Package, Users } from 'lucide-react'
import { adminAPI } from '../../api/endpoints'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ExportReports from '../../components/analytics/ExportReports'

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    fetchStats()
  }, [dateRange])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    )
  }

  const summaryStats = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Charities',
      value: stats?.total_charities || 0,
      icon: Package,
      color: 'green',
    },
    {
      title: 'Total Drivers',
      value: stats?.total_drivers || 0,
      icon: TrendingUp,
      color: 'purple',
    },
    {
      title: 'Verified Drivers',
      value: stats?.verified_drivers || 0,
      icon: DollarSign,
      color: 'orange',
    },
  ]

  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Platform statistics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Real Stats from Backend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note about future enhancements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Analytics Dashboard</h3>
        <p className="text-blue-800">
          Currently showing real-time platform statistics from the backend.
          Charts for revenue, categories, and trends can be added when order/item data is available.
        </p>
      </div>

      {/* Export Reports */}
      <ExportReports />
    </div>
  )
}

export default AnalyticsDashboard