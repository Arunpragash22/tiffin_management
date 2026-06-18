import { Box, Card, Typography, Button, Link } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { colors } from '../theme/colors';

const RegisterSuccess = () => {
  const [params] = useSearchParams();
  const email = params.get('email') || 'your email';

  return (
    <AuthLayout maxWidth="sm">
      <Card sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
        <Box sx={{ background: `linear-gradient(180deg, ${colors.primary} 0%, #F39C12 100%)`, py: 4, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#fff', mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <EmailOutlinedIcon sx={{ fontSize: 32, color: colors.primary }} />
          </Box>
        </Box>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Check your email</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            We sent a verification link to <strong>{email}</strong>.
            Please open the link to activate your TiffinPro account before logging in.
          </Typography>
          <Button component={RouterLink} to="/login" variant="contained" fullWidth sx={{ py: 1.4, borderRadius: 2.5, mb: 2 }}>
            Go to Login
          </Button>
          <Typography variant="body2" color="text.secondary">
            Didn&apos;t receive it?{' '}
            <Link component={RouterLink} to={`/resend-verification?email=${encodeURIComponent(email)}`} underline="hover">
              Resend verification email
            </Link>
          </Typography>
        </Box>
      </Card>
    </AuthLayout>
  );
};

export default RegisterSuccess;
