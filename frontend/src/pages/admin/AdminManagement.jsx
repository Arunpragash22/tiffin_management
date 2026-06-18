import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Chip, Alert, InputAdornment, Button, Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { adminAPI } from '../../api/services';
import { useAuth } from '../../context/AuthContext';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import PageHeader from '../../components/PageHeader';
import ModalForm from '../../components/ModalForm';
import Loader from '../../components/Loader';
import { colors } from '../../theme/colors';

const emptyForm = { email: '', password: '', confirmPassword: '' };

const AdminManagement = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAll({ page, size: 10, search: search || undefined });
      setAdmins(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Failed to load admin accounts');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const openCreate = () => {
    setForm(emptyForm);
    setFieldErrors({});
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setError('');

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setSubmitting(true);
    try {
      await adminAPI.create({ email: form.email.trim(), password: form.password });
      setModalOpen(false);
      setForm(emptyForm);
      fetchAdmins();
    } catch (err) {
      const data = err.response?.data;
      if (data?.validationErrors) {
        setFieldErrors(data.validationErrors);
      }
      setError(data?.message || 'Failed to create admin account');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id, active) => {
    setError('');
    try {
      await adminAPI.toggleStatus(id, !active);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this admin account?')) return;
    setError('');
    try {
      await adminAPI.delete(id);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete admin account');
    }
  };

  const columns = [
    {
      id: 'email',
      label: 'Admin',
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <AdminPanelSettingsIcon sx={{ color: colors.primary }} />
          <Box>
            <Typography variant="body2" fontWeight={600}>{row.email}</Typography>
            {row.email === user?.email && (
              <Typography variant="caption" color="primary.main">Signed in as you</Typography>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: 'active',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.active ? 'Active' : 'Inactive'}
          size="small"
          sx={{
            bgcolor: row.active ? '#dcfce7' : '#f3f4f6',
            color: row.active ? '#16a34a' : '#6b7280',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => {
        const isSelf = row.email === user?.email;
        return (
          <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap">
            <Chip
              label={row.active ? 'Deactivate' : 'Activate'}
              size="small"
              color={row.active ? 'warning' : 'success'}
              onClick={() => toggleStatus(row.id, row.active)}
              disabled={isSelf && row.active}
              sx={{ cursor: isSelf && row.active ? 'not-allowed' : 'pointer' }}
            />
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row.id)}
              disabled={isSelf}
              title={isSelf ? 'You cannot delete your own account' : 'Delete admin'}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Admin Management"
        subtitle={`Create and manage admin accounts. ${totalElements} admin${totalElements !== 1 ? 's' : ''} in total.`}
        action
        actionLabel="Add New Admin"
        actionIcon={<AddIcon />}
        onAction={openCreate}
      />

      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by admin email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
        />
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? <Loader /> : (
        <>
          <DataTable columns={columns} rows={admins} />
          <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onChange={setPage} />
        </>
      )}

      <ModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Admin"
        onSubmit={handleSubmit}
        submitLabel="Create Admin"
        loading={submitting}
      >
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={!!fieldErrors.email}
          helperText={fieldErrors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={!!fieldErrors.password}
          helperText={fieldErrors.password || 'Minimum 6 characters'}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Confirm Password"
          type="password"
          required
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          error={!!fieldErrors.confirmPassword}
          helperText={fieldErrors.confirmPassword}
        />
      </ModalForm>
    </Box>
  );
};

export default AdminManagement;
