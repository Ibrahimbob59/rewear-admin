# ReWear Admin Dashboard

Modern React admin dashboard for the ReWear sustainable fashion platform.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Recharts** - Charts (for DAY 2)

## 📁 Project Structure

```
rewear-admin/
├── public/
├── src/
│   ├── api/
│   │   ├── axios.js          # Axios instance with interceptors
│   │   └── endpoints.js      # API endpoint definitions
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   │   ├── Layout.jsx    # Main layout wrapper
│   │   │   ├── Sidebar.jsx   # Sidebar navigation
│   │   │   └── Header.jsx    # Top header
│   │   └── common/
│   │       ├── Button.jsx    # Reusable button
│   │       ├── Input.jsx     # Reusable input
│   │       └── LoadingSpinner.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication state
│   ├── pages/
│   │   ├── Login.jsx         # Login page
│   │   └── Dashboard.jsx     # Dashboard home
│   ├── routes/
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── utils/
│   │   ├── tokenStorage.js   # Token management
│   │   └── helpers.js        # Helper functions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd rewear-admin
npm install
```

### 2. Configure Environment

The `.env` file is already created with default values:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=ReWear Admin
```

**Important:** Update `VITE_API_BASE_URL` to match your Laravel backend URL.

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 🔐 Authentication

### Default Admin Credentials

```
Email: admin@rewear.com
Password: Admin@12345
```

### How Authentication Works

1. **Login Flow:**
   - User enters credentials
   - System calls `/api/auth/login`
   - Backend returns `access_token` and `refresh_token`
   - Tokens are stored in `localStorage`
   - User is redirected to dashboard

2. **Token Refresh:**
   - Axios interceptor detects 401 errors
   - Automatically calls `/api/auth/refresh-token`
   - Updates access token
   - Retries failed request
   - If refresh fails, redirects to login

3. **Logout:**
   - Calls `/api/auth/logout`
   - Clears tokens from localStorage
   - Redirects to login page

## 📊 Features Implemented (DAY 1)

### ✅ Completed

- [x] React + Vite + Tailwind setup
- [x] Complete project structure
- [x] Axios instance with JWT interceptors
- [x] Token storage and management
- [x] Authentication context with React Context API
- [x] Protected routes
- [x] Login page with validation
- [x] Dashboard layout (Sidebar + Header)
- [x] Responsive design
- [x] Reusable components (Button, Input, LoadingSpinner)
- [x] API endpoint definitions
- [x] Error handling
- [x] Auto token refresh

### 🔜 Coming Next (DAY 2)

- [ ] Dashboard statistics with real API data
- [ ] Charts and analytics
- [ ] Recent activity feed
- [ ] Quick actions panel

## 🎨 Design System

### Colors

- **Primary:** Green shades (#22c55e)
- **Secondary:** Gray shades
- **Danger:** Red shades
- **Success:** Green shades
- **Warning:** Yellow shades

### Components

All components are built with Tailwind CSS and follow a consistent design pattern:

- **Button:** Multiple variants (primary, secondary, danger, outline, ghost)
- **Input:** With icon support, error states, and validation
- **LoadingSpinner:** Multiple sizes

## 🔒 Security Features

1. **JWT Authentication:**
   - Access tokens (short-lived)
   - Refresh tokens (long-lived)
   - Automatic token refresh

2. **Protected Routes:**
   - All admin routes require authentication
   - Automatic redirect to login if not authenticated

3. **Token Storage:**
   - Stored in localStorage
   - Cleared on logout

4. **API Security:**
   - All API requests include Bearer token
   - 401 errors trigger automatic token refresh
   - Failed refresh redirects to login

## 📝 API Integration

### Base URL

Default: `http://localhost:8000/api`

### Available Endpoints

```javascript
// Authentication
authAPI.login(credentials)
authAPI.logout()
authAPI.getProfile()
authAPI.refreshToken(refreshToken)

// Admin
adminAPI.getStats()
adminAPI.getUsers(params)
adminAPI.deleteUser(userId)
adminAPI.getCharities(params)
adminAPI.createCharity(data)
adminAPI.getDriverApplications(params)
adminAPI.approveDriver(driverId)
adminAPI.rejectDriver(driverId, reason)

// Items
itemsAPI.getItems(params)
itemsAPI.getItemById(itemId)
itemsAPI.deleteItem(itemId)
itemsAPI.updateItem(itemId, data)

// Orders
ordersAPI.getOrders(params)
ordersAPI.getOrderById(orderId)
ordersAPI.updateOrderStatus(orderId, status)
ordersAPI.cancelOrder(orderId, reason)

// Deliveries
deliveriesAPI.getDeliveries(params)
deliveriesAPI.getDeliveryById(deliveryId)
deliveriesAPI.assignDriver(deliveryId, driverId)
```

## 🐛 Troubleshooting

### Issue: CORS errors

**Solution:** Make sure your Laravel backend has CORS configured correctly:

```php
// In Laravel config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### Issue: 401 Unauthorized

**Solution:** Check if:
1. Backend is running
2. Admin credentials are correct
3. Backend URL in `.env` is correct

### Issue: Token refresh not working

**Solution:** Check if:
1. Refresh token endpoint is `/api/auth/refresh-token`
2. Backend returns both `access_token` and `refresh_token`

## 📚 Next Steps

After completing DAY 1 setup, move to:

- **DAY 2:** Dashboard statistics with real API data
- **DAY 3:** Users management
- **DAY 4:** Items management
- **DAY 5:** Orders management
- **DAY 6:** Driver verification
- **DAY 7:** Charity management
- **DAY 8:** Deliveries tracking
- **DAY 9:** Analytics & reports
- **DAY 10:** Polish & testing

## 📄 License

MIT License - ReWear Admin Dashboard

## 👨‍💻 Developer

Built for the ReWear sustainable fashion platform.

---

**Version:** 1.0.0 (DAY 1 - Setup Complete)
**Last Updated:** December 2024