import { useState, useEffect } from 'react'
import { Users, ShoppingBag, Package, Truck, Heart, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { adminAPI } from '../api/endpoints'
import StatCard from '../components/dashboard/StatCard'
import RecentActivity from '../components/dashboard/RecentActivity'
import QuickActions from '../components/dashboard/QuickActions'
import UserGrowthChart from '../components/dashboard/UserGrowthChart'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getStats()
      setStats(response.data.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
      setError('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  // Mock recent activity - replace with real API later
  const recentActivities = [
    {
      type: 'user',
      title: 'New User Registered',
      description: 'John Doe joined the platform',
      created_at: new Date().toISOString(),
    },
    {
      type: 'item',
      title: 'New Item Listed',
      description: 'Vintage Jacket posted by Sarah',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      type: 'order',
      title: 'Order Completed',
      description: 'Order #1234 delivered successfully',
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ]

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.total_users || 0}
          icon={Users}
          trend="+12% from last month"
          color="blue"
        />
        <StatCard
          title="Items Sold"
          value={stats?.items_sold || 0}
          icon={ShoppingBag}
          trend="+8% from last month"
          color="green"
        />
        <StatCard
          title="Total Donations"
          value={stats?.total_donations || 0}
          icon={Heart}
          trend="+15% from last month"
          color="purple"
        />
        <StatCard
          title="Active Drivers"
          value={stats?.verified_drivers || 0}
          icon={Truck}
          trend={`${stats?.total_drivers || 0} total`}
          color="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Charities</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.total_charities || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.active_users || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(stats?.items_sold || 0) + 150}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <UserGrowthChart />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}

export default Dashboard