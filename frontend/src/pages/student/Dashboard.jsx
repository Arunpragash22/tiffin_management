import { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Button, Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { menuAPI, orderAPI, attendanceAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import { colors } from '../../theme/colors';

const QuickActionCard = ({ title, subtitle, icon, color, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      borderRadius: 3,
      border: `1px solid ${colors.border}`,
      height: '100%',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(230,126,34,0.15)',
        borderColor: colors.primary,
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2.5,
          bgcolor: `${color}.light`,
          color: `${color}.main`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>
    </CardContent>
  </Card>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      menuAPI.getDaily().catch(() => null),
      orderAPI.getMy({ page: 0, size: 1 }),
      attendanceAPI.getMy({ page: 0, size: 100 }),
    ]).then(([menuRes, ordersRes, attendanceRes]) => {
      if (menuRes) setMenu(menuRes.data);
      setTotalOrders(ordersRes.data.totalElements);
      setAttendanceCount(attendanceRes.data.content.filter((a) => a.present).length);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const firstName = (user?.fullName || 'Student').split(' ')[0];

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${colors.primaryLight} 0%, #fff 40%, ${colors.background} 100%)`,
          border: `1px solid ${colors.border}`,
        }}
      >
        <CardContent sx={{ py: { xs: 2.5, md: 3.5 }, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <Box display="flex" alignItems="center" gap={2} minWidth={0}>
              <Avatar sx={{ width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 }, bgcolor: colors.primary, fontSize: { xs: 18, sm: 22 }, fontWeight: 700, flexShrink: 0 }}>
                {(user?.fullName || 'S').charAt(0)}
              </Avatar>
              <Box minWidth={0}>
                <Box display="flex" alignItems="center" gap={0.5} mb={0.5} flexWrap="wrap">
                  <WbSunnyOutlinedIcon sx={{ fontSize: 16, color: colors.primary }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>{today}</Typography>
                </Box>
                <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                  Welcome, {firstName}!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Here&apos;s your tiffin overview for today.
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/student/orders')}
              sx={{ borderRadius: 2.5, px: 3, py: 1.2, alignSelf: { xs: 'stretch', sm: 'center' }, width: { xs: '100%', sm: 'auto' } }}
            >
              Place Order
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} sx={{ width: '100%', mb: { xs: 4, md: 5 } }}>
        <Grid size={{ xs: 12, sm: 4 }} sx={{ minWidth: 0 }}>
          <StatCard title="My Orders" value={totalOrders} icon={<ShoppingCartIcon />} color="info" subtitle="Total placed" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }} sx={{ minWidth: 0 }}>
          <StatCard title="Attendance" value={attendanceCount} icon={<EventAvailableIcon />} color="success" subtitle="Days present" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }} sx={{ minWidth: 0 }}>
          <StatCard
            title="Meals Today"
            value={menu ? 3 : 0}
            icon={<RestaurantMenuIcon />}
            color="primary"
            subtitle={menu ? 'Menu available' : 'No menu yet'}
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight={700} mb={2.5} mt={0.5}>Quick Actions</Typography>
      <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} sx={{ mb: { xs: 4, md: 5 } }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <QuickActionCard
            title="View Menus"
            subtitle="Browse daily & weekly meals"
            icon={<RestaurantMenuIcon />}
            color="primary"
            onClick={() => navigate('/student/menus')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <QuickActionCard
            title="Place Order"
            subtitle="Order your next tiffin"
            icon={<ShoppingCartIcon />}
            color="warning"
            onClick={() => navigate('/student/orders')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <QuickActionCard
            title="My Attendance"
            subtitle="Track your presence"
            icon={<EventAvailableIcon />}
            color="success"
            onClick={() => navigate('/student/attendance')}
          />
        </Grid>
      </Grid>

      {menu ? (
        <Card
          sx={{
            borderRadius: 3,
            bgcolor: colors.brownCard,
            color: '#fff',
            border: 'none',
            boxShadow: '0 8px 24px rgba(123,75,42,0.25)',
          }}
        >
          <CardContent sx={{ py: { xs: 2.5, sm: 3.5 }, px: { xs: 2.5, sm: 3.5 } }}>
            <Box display="flex" alignItems="center" gap={2} mb={2.5}>
              <RestaurantIcon />
              <Typography variant="overline" sx={{ letterSpacing: 1.2, fontWeight: 600, opacity: 0.85 }}>
                Today&apos;s Menu
              </Typography>
            </Box>
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              {['breakfast', 'lunch', 'dinner'].map((meal) => menu[meal] && (
                <Grid key={meal} size={{ xs: 12, sm: 4 }}>
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 2, p: { xs: 2, sm: 2.5 } }}>
                    <Typography variant="caption" sx={{ opacity: 0.75, textTransform: 'uppercase', fontWeight: 600 }}>
                      {meal}
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>{menu[meal]}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 3, border: `2px dashed ${colors.border}` }}>
          <CardContent sx={{ textAlign: 'center', py: 5 }}>
            <RestaurantIcon sx={{ fontSize: 48, color: colors.primary, mb: 1, opacity: 0.6 }} />
            <Typography fontWeight={600} color="text.secondary">No menu posted for today</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StudentDashboard;
