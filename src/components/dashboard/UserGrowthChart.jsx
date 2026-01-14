import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const UserGrowthChart = ({ data = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth (Last 6 Months)</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-sm">No user data available yet</p>
            <p className="text-gray-400 text-xs mt-1">User registrations will appear here</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserGrowthChart