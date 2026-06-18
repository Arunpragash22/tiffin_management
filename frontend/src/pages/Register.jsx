import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert, Link, Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { isValidSlMobile, normalizeSlMobile, SL_MOBILE_HELPER } from '../utils/phone';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '', mobileNumber: '', email: '', physicalAddress: '',
    aadhaarNumber: '', password: '', confirmPassword: '',
  });
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name } = e.target;
    setForm({ ...form, [name]: e.target.value });
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!isValidSlMobile(form.mobileNumber)) {
      setError(`Invalid mobile number. ${SL_MOBILE_HELPER}`);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!aadhaarImage) {
      setError('Aadhaar card image is required');
      return;
    }

    const formData = new FormData();
    const data = {
      fullName: form.fullName,
      mobileNumber: normalizeSlMobile(form.mobileNumber),
      email: form.email,
      physicalAddress: form.physicalAddress,
      aadhaarNumber: form.aadhaarNumber,
      password: form.password,
    };
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    formData.append('aadhaarImage', aadhaarImage);

    try {
      const data = await register(formData);
      if (data.emailVerificationSent) {
        navigate(`/register/success?email=${encodeURIComponent(data.email)}`);
      } else {
        navigate('/login', { state: { message: data.message } });
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.validationErrors && typeof data.validationErrors === 'object') {
        setFieldErrors(data.validationErrors);
        setError(data.message || 'Please correct the highlighted fields.');
      } else {
        const msg = data?.message || 'Registration failed';
        setError(typeof msg === 'string' ? msg : 'Registration failed');
      }
    }
  };

  return (
    <AuthLayout maxWidth="md">
      <Card elevation={3} sx={{ width: '100%', borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" fontWeight={700} textAlign="center" mb={1}>
            Student Registration
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={3}>
            Create your tiffin account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Full Name" name="fullName" required value={form.fullName} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobileNumber"
                  required
                  placeholder="0712345678"
                  helperText={fieldErrors.mobileNumber || SL_MOBILE_HELPER}
                  error={!!fieldErrors.mobileNumber}
                  value={form.mobileNumber}
                  onChange={handleChange}
                  inputProps={{ inputMode: 'tel' }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Aadhaar / NIC Number"
                  name="aadhaarNumber"
                  required
                  placeholder="12 digit ID"
                  value={form.aadhaarNumber}
                  onChange={handleChange}
                  error={!!fieldErrors.aadhaarNumber}
                  helperText={fieldErrors.aadhaarNumber}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Physical Address" name="physicalAddress" required multiline rows={2} value={form.physicalAddress} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Password" name="password" type="password" required value={form.password} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" required value={form.confirmPassword} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5 }}>
                  Upload Aadhaar / NIC Image
                  <input type="file" hidden accept="image/*" onChange={(e) => setAadhaarImage(e.target.files[0])} />
                </Button>
                {aadhaarImage && <Typography variant="caption" mt={1} display="block">{aadhaarImage.name}</Typography>}
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, py: 1.5 }} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Box>

          <Typography textAlign="center" mt={2} variant="body2">
            Already have an account? <Link component={RouterLink} to="/login" underline="hover">Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Register;
