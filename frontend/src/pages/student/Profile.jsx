import { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, Card, CardContent, Alert, Grid,
} from '@mui/material';
import { studentAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import AuthenticatedImage from '../../components/AuthenticatedImage';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);

  useEffect(() => {
    studentAPI.getProfile()
      .then((res) => {
        setProfile(res.data);
        setForm({
          fullName: res.data.fullName,
          mobileNumber: res.data.mobileNumber,
          email: res.data.email,
          physicalAddress: res.data.physicalAddress,
          aadhaarNumber: res.data.aadhaarNumber,
        });
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = await studentAPI.updateProfile(form);
      setProfile(data);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAadhaarUpload = async () => {
    if (!aadhaarFile) return;
    const formData = new FormData();
    formData.append('aadhaarImage', aadhaarFile);
    try {
      const { data } = await studentAPI.updateAadhaar(formData);
      setProfile(data);
      setAadhaarFile(null);
      setMessage('Aadhaar image updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <Box maxWidth={700}>
      <Typography variant="h5" fontWeight={700} mb={3}>My Profile</Typography>
      {message && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={handleUpdate}>
            <Grid container spacing={2}>
              {['fullName', 'mobileNumber', 'email', 'aadhaarNumber'].map((field) => (
                <Grid key={field} size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label={field.replace(/([A-Z])/g, ' $1')}
                    value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                </Grid>
              ))}
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Physical Address" multiline rows={2}
                  value={form.physicalAddress || ''} onChange={(e) => setForm({ ...form, physicalAddress: e.target.value })} />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={saving}>
              {saving ? 'Saving...' : 'Update Profile'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Aadhaar Card</Typography>
          {profile?.aadhaarImagePath && user?.studentId && (
            <Box mb={2}>
              <AuthenticatedImage src={`/api/files/aadhaar/${user.studentId}`} alt="Aadhaar" />
            </Box>
          )}
          <Button variant="outlined" component="label">
            Choose New Image
            <input type="file" hidden accept="image/*" onChange={(e) => setAadhaarFile(e.target.files[0])} />
          </Button>
          {aadhaarFile && (
            <Box mt={2}>
              <Typography variant="body2" mb={1}>{aadhaarFile.name}</Typography>
              <Button variant="contained" onClick={handleAadhaarUpload}>Upload Aadhaar</Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
