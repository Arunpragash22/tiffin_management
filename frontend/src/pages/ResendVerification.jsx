import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api/services';
import AuthLayout from '../components/AuthLayout';

const ResendVerification = () => {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const { data } = await authAPI.resendVerification(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout maxWidth="sm">
      <Card sx={{ width: '100%', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom>
            Resend Verification Email
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={3}>
            Enter your registered email to receive a new verification link.
          </Typography>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 2, py: 1.4 }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Verification Email'}
            </Button>
          </Box>

          <Typography textAlign="center" mt={2} variant="body2">
            <Link component={RouterLink} to="/login" underline="hover">Back to Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default ResendVerification;
