import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, TextField, IconButton, Chip, Alert, InputAdornment, Avatar, Paper, Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { studentAPI, reportAPI } from '../../api/services';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import PageHeader from '../../components/PageHeader';
import ModalForm from '../../components/ModalForm';
import Loader from '../../components/Loader';
import AuthenticatedImage from '../../components/AuthenticatedImage';
import { colors } from '../../theme/colors';
import { downloadBlob, extractFilename } from '../../utils/download';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({ fullName: '', mobileNumber: '', email: '', physicalAddress: '', aadhaarNumber: '' });
  const [error, setError] = useState('');
  const [aadhaarView, setAadhaarView] = useState(null);
  const [exporting, setExporting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await studentAPI.getAll({ page, size: 10, search: search || undefined });
      setStudents(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const openEdit = (student) => {
    setEditStudent(student);
    setForm({
      fullName: student.fullName, mobileNumber: student.mobileNumber,
      email: student.email, physicalAddress: student.physicalAddress,
      aadhaarNumber: student.aadhaarNumber,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.update(editStudent.id, form);
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await studentAPI.delete(id);
    fetchStudents();
  };

  const toggleStatus = async (id, active) => {
    await studentAPI.toggleStatus(id, !active);
    fetchStudents();
  };

  const handleExportPdf = async () => {
    setExporting(true);
    setError('');
    try {
      const params = search ? { search } : {};
      const { data, headers } = await reportAPI.downloadStudentsPdf(params);
      const filename = extractFilename(headers['content-disposition'], 'students-report.pdf');
      downloadBlob(data, filename);
    } catch {
      setError('Failed to generate students PDF report');
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    {
      id: 'profile',
      label: 'Profile',
      render: (row) => (
        <Avatar sx={{ width: 36, height: 36, bgcolor: colors.primaryLight, color: colors.primary, fontSize: 13 }}>
          {(row.fullName || '?').charAt(0)}
        </Avatar>
      ),
    },
    {
      id: 'fullName',
      label: 'Student Info',
      render: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>{row.fullName}</Typography>
          <Typography variant="caption" color="text.secondary">ID: STU-{String(row.id).padStart(4, '0')}</Typography>
        </Box>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      render: (row) => (
        <Box>
          <Typography variant="body2">{row.mobileNumber}</Typography>
          <Typography variant="caption" color="text.secondary">{row.physicalAddress || row.email}</Typography>
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
    { id: 'email', label: 'Email' },
    {
      id: 'registered',
      label: 'Registered',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap">
          <IconButton size="small" onClick={() => openEdit(row)} title="Edit"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" onClick={() => setAadhaarView(row)} title="View Aadhaar"><VisibilityIcon fontSize="small" /></IconButton>
          <Chip
            label={row.active ? 'Deactivate' : 'Activate'}
            size="small"
            color={row.active ? 'warning' : 'success'}
            onClick={() => toggleStatus(row.id, row.active)}
            sx={{ cursor: 'pointer' }}
          />
          <IconButton size="small" color="error" onClick={() => handleDelete(row.id)} title="Delete"><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Student Management"
        subtitle={`Manage registered students. ${totalElements} student${totalElements !== 1 ? 's' : ''} in total.`}
      />

      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Search by student name, ID, or mobile number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
            sx={{ flex: 1, minWidth: 240 }}
          />
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPdf}
            disabled={exporting}
            sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            {exporting ? 'Generating PDF...' : 'Download PDF Report'}
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {loading ? <Loader /> : (
        <>
          <DataTable columns={columns} rows={students} />
          <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onChange={setPage} />
        </>
      )}

      <ModalForm open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Student" onSubmit={handleSubmit}>
        {Object.keys(form).map((key) => (
          <TextField key={key} fullWidth margin="normal" label={key.replace(/([A-Z])/g, ' $1')}
            value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        ))}
      </ModalForm>

      <ModalForm open={!!aadhaarView} onClose={() => setAadhaarView(null)} title="Aadhaar Document" onSubmit={(e) => e.preventDefault()} submitLabel="Close">
        {aadhaarView?.aadhaarImagePath ? (
          <AuthenticatedImage src={`/api/files/aadhaar/${aadhaarView.id}`} alt="Aadhaar" maxWidth="100%" maxHeight={400} />
        ) : (
          <Typography color="text.secondary">No Aadhaar image uploaded</Typography>
        )}
      </ModalForm>
    </Box>
  );
};

export default StudentManagement;
