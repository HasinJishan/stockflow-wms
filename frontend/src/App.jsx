import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInventory from './pages/admin/AdminInventory';
import AdminReports from './pages/admin/AdminReports';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminUpdateRole from './pages/admin/AdminUpdateUserRole';
import AdminEditProfile from './pages/admin/AdminEditProfile';
import AdminNotifications from './pages/admin/Adminnotifications';
import AdminProductDetail from './pages/admin/AdminProductDetail';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminCreateOrder from "./pages/admin/AdminCreateOrder";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";

import StaffDashboard from './pages/staff/StaffDashboard';
import StaffPickPack from "./pages/staff/StaffPickPack";
import StaffInventory from "./pages/staff/StaffInventory";
import StaffStockUpdates from "./pages/staff/StaffStockUpdates";
import StaffNotifications from "./pages/staff/StaffNotifications";
import StaffAccount from "./pages/staff/StaffAccount";
import StaffHelpSupport from "./pages/staff/StaffHelpSupport";
import StaffAnalytics from "./pages/staff/StaffAnalytics";

import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerTrackShipment from './pages/customer/CustomerTrackShipment';
import CustomerSavedItems from './pages/customer/CustomerSavedItems';
import CustomerAddresses from './pages/customer/CustomerAddresses';
import CustomerAccount from './pages/customer/CustomerAccount';
import CustomerAnalytics from './pages/customer/CustomerAnalytics';
import CustomerHelpSupport from './pages/customer/CustomerHelpSupport';
import CustomerBrowseProducts from './pages/customer/CustomerBrowseProducts';
import CustomerCheckout from './pages/customer/CustomerCheckout';
import CustomerOrderSuccess from './pages/customer/CustomerOrderSuccess';
import CustomerNotifications from './pages/customer/CustomerNotifications';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth & Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inventory"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminInventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/inventory/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/add"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAddUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:userId/role"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUpdateRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings/edit-profile"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminEditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminNotifications />
                </ProtectedRoute>
              }
            />
           <Route 
  path="/admin/products/:id" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminProductDetail />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/admin/products/:id/edit" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminEditProduct />
    </ProtectedRoute>
  } 
/>
<Route path="/admin/orders/create" element={<AdminCreateOrder />} />
<Route path="/admin/orders/:id" element={<AdminOrderDetail />} />

            {/* Staff Routes */}
            <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><StaffDashboard /></ProtectedRoute>} />
            <Route path="/staff/pick-pack" element={<StaffPickPack />} />
            <Route path="/staff/inventory" element={<StaffInventory />} />
            <Route path="/staff/stock-updates" element={<StaffStockUpdates />} />
            <Route path="/staff/notifications" element={<StaffNotifications />} />
            <Route path="/staff/account" element={<StaffAccount />} />
            <Route path="/staff/help" element={<StaffHelpSupport />} />
            <Route path="/staff/analytics" element={<StaffAnalytics />} />

            {/* Customer Routes */}
            <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/customer/track-shipment" element={<CustomerTrackShipment />} />
            <Route path="/customer/saved-items" element={<CustomerSavedItems />} />
            <Route path="/customer/addresses" element={<CustomerAddresses />} />
            <Route path="/customer/account" element={<CustomerAccount />} />
            <Route path="/customer/analytics" element={<CustomerAnalytics />} />
            <Route path="/customer/help" element={<CustomerHelpSupport />} />
            <Route path="/customer/notifications" element={<CustomerNotifications />} />
            <Route path="/customer/order-success" element={<CustomerOrderSuccess />} />
            <Route path="/customer/browse" element={<ProtectedRoute allowedRoles={['customer']}><CustomerBrowseProducts /></ProtectedRoute>} />
            <Route path="/customer/checkout" element={<ProtectedRoute allowedRoles={['customer']}><CustomerCheckout /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}