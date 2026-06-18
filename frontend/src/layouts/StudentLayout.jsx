import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import Navbar from '../components/Navbar';
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar';

const studentMenuItems = [
  { label: 'Dashboard', path: '/student/dashboard', icon: <DashboardIcon /> },
  { label: 'Profile', path: '/student/profile', icon: <PersonIcon /> },
  { label: 'Menus', path: '/student/menus', icon: <RestaurantMenuIcon /> },
  { label: 'Orders', path: '/student/orders', icon: <ShoppingCartIcon /> },
  { label: 'Attendance', path: '/student/attendance', icon: <EventAvailableIcon /> },
];

const StudentLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar items={studentMenuItems} variant="student" open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, lg: `${DRAWER_WIDTH}px` },
          width: { xs: '100%', lg: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} title="Student Portal" />
        <Box component="main" sx={{ flex: 1, p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default StudentLayout;
