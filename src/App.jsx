import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UsersList from './pages/users/UsersList'
import ItemsList from './pages/items/ItemsList'
import OrdersList from './pages/orders/OrdersList'
import DriverApplicationsList from './pages/drivers/DriverApplicationsList'
import CharitiesList from './pages/charities/CharitiesList'
import DeliveriesList from './pages/deliveries/DeliveriesList'
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard'
import Layout from './components/layout/layout'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersList />} />
              <Route path="items" element={<ItemsList />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="drivers" element={<DriverApplicationsList />} />
              <Route path="charities" element={<CharitiesList />} />
              <Route path="deliveries" element={<DeliveriesList />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App