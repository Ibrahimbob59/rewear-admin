import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  Truck,
  Heart,
  Building2,
  BarChart3,
} from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/items', icon: ShoppingBag, label: 'Items' },
    { path: '/orders', icon: Package, label: 'Orders' },
    { path: '/deliveries', icon: Truck, label: 'Deliveries' },
    { path: '/drivers', icon: Truck, label: 'Drivers' },
    { path: '/charities', icon: Heart, label: 'Charities' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">ReWear</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-primary-50 rounded-lg p-3">
            <p className="text-xs text-primary-800 font-medium">Admin Panel v1.0</p>
            <p className="text-xs text-primary-600 mt-1">ReWear Sustainable Fashion</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar