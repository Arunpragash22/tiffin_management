import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import { ROLES } from './utils/constants';

import Login from './pages/Login';
import Register from './pages/Register';
import LogoutConfirmation from './pages/LogoutConfirmation';
import RegisterSuccess from './pages/RegisterSuccess';
import VerifyEmail from './pages/VerifyEmail';
import ResendVerification from './pages/ResendVerification';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

import AdminDashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import AttendanceManagement from './pages/admin/AttendanceManagement';
import MenuManagement from './pages/admin/MenuManagement';
import OrderManagement from './pages/admin/OrderManagement';
import AdminManagement from './pages/admin/AdminManagement';

import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import Menus from './pages/student/Menus';
import Orders from './pages/student/Orders';
import Attendance from './pages/student/Attendance';

const HomeRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === ROLES.ADMIN ? '/admin/dashboard' : '/student/dashboard'} replace />;
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
    <Route path="/register/success" element={<RegisterSuccess />} />
    <Route path="/verify-email" element={<VerifyEmail />} />
    <Route path="/resend-verification" element={<ResendVerification />} />
    <Route path="/logout" element={<LogoutConfirmation />} />

    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    }>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="students" element={<StudentManagement />} />
      <Route path="attendance" element={<AttendanceManagement />} />
      <Route path="menus" element={<MenuManagement />} />
      <Route path="orders" element={<OrderManagement />} />
      <Route path="admins" element={<AdminManagement />} />
    </Route>

    <Route path="/student" element={
      <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
        <StudentLayout />
      </ProtectedRoute>
    }>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="menus" element={<Menus />} />
      <Route path="orders" element={<Orders />} />
      <Route path="attendance" element={<Attendance />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
