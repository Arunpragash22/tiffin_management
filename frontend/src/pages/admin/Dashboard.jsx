import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Button, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../api/services';
import DataTable from '../../components/DataTable';
import StatCard from '../../components/StatCard';
import SectionCard from '../../components/SectionCard';
import Loader from '../../components/Loader';
import { STATUS_COLORS } from '../../utils/constants';
import { colors } from '../../theme/colors';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    dashboardAPI.getStats()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard data. Please check that the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen />;

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  const orderColumns = [
    { id: 'studentName', label: 'Student' },
    { id: 'mealType', label: 'Tiffin Type' },
    { id: 'orderDate', label: 'Order Time' },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip label={row.status} size="small" color={STATUS_COLORS[row.status] || 'default'} />
      ),
    },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* Hero banner */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: 'hidden',
          border: 'none',
          background: `linear-gradient(135deg, ${colors.primary} 0%, #F39C12 50%, ${colors.brownCard} 100%)`,
          color: '#fff',
        }}
      >
        <CardContent sx={{ py: { xs: 2.5, md: 3.5 }, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <Box minWidth={0}>
              <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 1.5, fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                {today}
              </Typography>
              <Typography variant="h4" fontWeight={800} mt={0.5} sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                Dashboard
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, maxWidth: 480 }}>
                Overview of today&apos;s tiffin operations — students, orders, attendance &amp; menus.
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/admin/orders')}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                borderRadius: 2.5,
                px: 3,
                width: { xs: '100%', sm: 'auto' },
                alignSelf: { xs: 'stretch', sm: 'center' },
              }}
            >
              View Orders
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} sx={{ width: '100%', mb: { xs: 4, md: 5 } }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ minWidth: 0 }}>
          <StatCard title="Total Students" value={data?.totalStudents || 0} icon={<PeopleIcon />} color="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ minWidth: 0 }}>
          <StatCard
            title="Active Students"
            value={data?.totalActiveStudents || 0}
            icon={<PersonAddIcon />}
            color="success"
            subtitle="Currently subscribed"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ minWidth: 0 }}>
          <StatCard title="Total Orders" value={data?.totalOrders || 0} icon={<ShoppingCartIcon />} color="info" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={{ minWidth: 0 }}>
          <StatCard
            title="Today's Attendance"
            value={data?.todayAttendanceCount || 0}
            icon={<EventAvailableIcon />}
            color="warning"
            subtitle="Present today"
          />
        </Grid>
      </Grid>

      {data?.todayMenu ? (
        <Card
          sx={{
            mb: { xs: 4, md: 5 },
            borderRadius: 3,
            bgcolor: colors.brownCard,
            color: '#fff',
            border: 'none',
            boxShadow: '0 8px 24px rgba(123,75,42,0.3)',
          }}
        >
          <CardContent sx={{ py: { xs: 2.5, sm: 3.5 }, px: { xs: 2.5, sm: 3.5 } }}>
            <Box
              display="flex"
              alignItems="flex-start"
              gap={{ xs: 2.5, sm: 3 }}
              flexDirection={{ xs: 'column', sm: 'row' }}
            >
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: { xs: 1.5, sm: 2 }, borderRadius: 2.5, alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
                <RestaurantIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
              </Box>
              <Box flex={1} minWidth={0} width="100%">
                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1.2, fontWeight: 600, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  Today&apos;s Menu
                </Typography>
                <Typography variant="h5" fontWeight={700} mt={0.5} mb={2.5} sx={{ fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                  {data.todayMenu.lunch || data.todayMenu.breakfast || 'Menu set for today'}
                </Typography>
                <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                  {['breakfast', 'lunch', 'dinner'].map((meal) => data.todayMenu[meal] && (
                    <Grid key={meal} size={{ xs: 12, sm: 4 }} sx={{ minWidth: 0 }}>
                      <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: { xs: 2, sm: 2.5 } }}>
                        <Typography variant="caption" sx={{ opacity: 0.75, textTransform: 'uppercase', fontWeight: 600 }}>
                          {meal}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>{data.todayMenu[meal]}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mb: 4, borderRadius: 3, border: `2px dashed ${colors.border}`, bgcolor: colors.primaryLight }}>
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <RestaurantIcon sx={{ fontSize: 40, color: colors.primary, mb: 1 }} />
            <Typography fontWeight={600}>No menu set for today</Typography>
            <Button size="small" sx={{ mt: 1 }} onClick={() => navigate('/admin/menus')}>Add Menu</Button>
          </CardContent>
        </Card>
      )}

      {(data?.pendingOrders || 0) > 0 && (
        <Card sx={{ mb: 3, borderRadius: 3, borderLeft: `5px solid ${colors.brown}`, bgcolor: '#FFF8F0' }}>
          <CardContent>
            <Box display="flex" gap={1.5} alignItems="flex-start">
              <WarningAmberIcon sx={{ color: colors.brown, mt: 0.2 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Pending Orders</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {data.pendingOrders} order{data.pendingOrders !== 1 ? 's' : ''} waiting to be processed.
                </Typography>
                <Button size="small" sx={{ mt: 1, p: 0 }} onClick={() => navigate('/admin/orders')}>
                  Manage orders →
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      <SectionCard title="Recent Orders" noPadding>
        <DataTable
          columns={orderColumns}
          rows={data?.recentOrders || []}
          emptyMessage="No orders yet"
          responsive
          embedded
        />
      </SectionCard>
    </Box>
  );
};

export default AdminDashboard;
