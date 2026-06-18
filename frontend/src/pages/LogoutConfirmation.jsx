import { useState } from 'react';
import { Box, Card, Typography, Button, Stack } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import Loader from '../components/Loader';
import { colors } from '../theme/colors';

const LogoutConfirmation = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const portalPath = user?.role === ROLES.ADMIN ? '/admin/dashboard' : '/student/dashboard';

  const handleYes = async () => {
    setSubmitting(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNo = () => {
    navigate(portalPath, { replace: true });
  };

  if (loading) return <Loader fullScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: colors.background,
        px: 2,
        py: 4,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: `1px solid ${colors.border}`,
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(180deg, ${colors.primary} 0%, #F39C12 100%)`,
            py: 5,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <LogoutIcon sx={{ fontSize: 36, color: colors.brown }} />
          </Box>
        </Box>

        <Box sx={{ px: 4, py: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Log out?
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Are you sure you want to log out of TiffinPro?
          </Typography>

          <Stack spacing={1.5}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleYes}
              disabled={submitting}
              sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 600 }}
            >
              {submitting ? 'Logging out...' : 'Yes, log out'}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={handleNo}
              disabled={submitting}
              sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 600 }}
            >
              No, stay logged in
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            py: 2,
            bgcolor: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <RestaurantIcon sx={{ fontSize: 18, color: colors.primary }} />
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            TiffinPro
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default LogoutConfirmation;
