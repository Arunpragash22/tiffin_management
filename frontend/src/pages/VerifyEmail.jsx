import { useEffect, useRef, useState } from 'react';
import { Box, Card, Typography, Button, Alert, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/services';
import AuthLayout from '../components/AuthLayout';
import { colors } from '../theme/colors';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const verifyStarted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    if (verifyStarted.current) return;
    verifyStarted.current = true;

    authAPI.verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      });
  }, [token]);

  return (
    <AuthLayout maxWidth="sm">
      <Card sx={{ width: '100%', borderRadius: 3, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          {status === 'loading' && (
            <>
              <CircularProgress color="primary" sx={{ mb: 2 }} />
              <Typography variant="h6">Verifying your email...</Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={700} gutterBottom>Email Verified!</Typography>
              <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>{message}</Alert>
              <Button component={RouterLink} to="/login" variant="contained" fullWidth sx={{ py: 1.4, borderRadius: 2.5 }}>
                Continue to Login
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorOutlineOutlinedIcon sx={{ fontSize: 56, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" fontWeight={700} gutterBottom>Verification Failed</Typography>
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>{message}</Alert>
              <Button component={RouterLink} to="/resend-verification" variant="contained" fullWidth sx={{ py: 1.4, borderRadius: 2.5, mb: 1 }}>
                Resend Verification Email
              </Button>
              <Button component={RouterLink} to="/login" fullWidth sx={{ mt: 1 }}>
                Back to Login
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                If you can already log in, your email is verified — you can ignore this message.
              </Typography>
            </>
          )}
        </Box>
      </Card>
    </AuthLayout>
  );
};

export default VerifyEmail;
