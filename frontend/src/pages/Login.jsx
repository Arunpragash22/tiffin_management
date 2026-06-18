import { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, Link, Tabs, Tab,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loginAs = tab === 1 ? 'ADMIN' : 'STUDENT';
      const data = await login({ ...form, loginAs });
      const from = location.state?.from?.pathname;
      const defaultPath = data.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
      navigate(from && from !== '/login' ? from : defaultPath, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    }
  };

  return (
    <AuthLayout maxWidth="xs">
      <Card elevation={3} sx={{ width: '100%', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h4" color="primary.main" fontWeight={700} textAlign="center" gutterBottom>
            TiffinPro
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={3}>
            Sign in to your account
          </Typography>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 3 }}>
            <Tab label="Student Login" />
            <Tab label="Admin Login" />
          </Tabs>

          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
              {error.toLowerCase().includes('verify') && (
                <Box mt={1}>
                  <Link component={RouterLink} to={`/resend-verification?email=${encodeURIComponent(form.email)}`} underline="hover">
                    Resend verification email
                  </Link>
                </Box>
              )}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" type="email" required margin="normal"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Password" type={showPassword ? 'text' : 'password'} required margin="normal"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, py: 1.5 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          {tab === 0 && (
            <Typography textAlign="center" mt={3} variant="body2">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" underline="hover">Register here</Link>
            </Typography>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Login;
