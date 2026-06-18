import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Navbar from '../components/Navbar';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';

const adminMenuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Students', path: '/admin/students', icon: <PeopleIcon /> },
  { label: 'Attendance', path: '/admin/attendance', icon: <EventAvailableIcon /> },
  { label: 'Menus', path: '/admin/menus', icon: <RestaurantMenuIcon /> },
  { label: 'Orders', path: '/admin/orders', icon: <ShoppingCartIcon /> },
  { label: 'Admins', path: '/admin/admins', icon: <AdminPanelSettingsIcon /> },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar items={adminMenuItems} variant="admin" open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, lg: `${DRAWER_WIDTH}px` },
          width: { xs: '100%', lg: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} title="TiffinPro" />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
