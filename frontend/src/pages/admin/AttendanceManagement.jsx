import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, IconButton, Chip, Alert, MenuItem, FormControlLabel, Switch, Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { attendanceAPI, studentAPI, reportAPI } from '../../api/services';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import PageHeader from '../../components/PageHeader';
import ModalForm from '../../components/ModalForm';
import Loader from '../../components/Loader';
import { colors } from '../../theme/colors';
import { downloadBlob, extractFilename } from '../../utils/download';

const AttendanceManagement = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filterDate, setFilterDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form, setForm] = useState({ studentId: '', attendanceDate: dayjs(), present: true, notes: '' });
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (filterDate) params.date = filterDate.format('YYYY-MM-DD');
      const { data } = await attendanceAPI.getAll(params);
      setRecords(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, [page, filterDate]);

  useEffect(() => {
    studentAPI.getAll({ page: 0, size: 100 }).then((res) => setStudents(res.data.content));
    fetchRecords();
  }, [fetchRecords]);

  const openCreate = () => {
    setEditRecord(null);
    setForm({ studentId: '', attendanceDate: dayjs(), present: true, notes: '' });
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditRecord(record);
    setForm({
      studentId: record.studentId,
      attendanceDate: dayjs(record.attendanceDate),
      present: record.present,
      notes: record.notes || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      studentId: Number(form.studentId),
      attendanceDate: form.attendanceDate.format('YYYY-MM-DD'),
      present: form.present,
      notes: form.notes,
    };
    try {
      if (editRecord) await attendanceAPI.update(editRecord.id, payload);
      else await attendanceAPI.mark(payload);
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this attendance record?')) return;
    await attendanceAPI.delete(id);
    fetchRecords();
  };

  const handleExportPdf = async () => {
    setExporting(true);
    setError('');
    try {
      const params = filterDate ? { date: filterDate.format('YYYY-MM-DD') } : {};
      const { data, headers } = await reportAPI.downloadAttendancePdf(params);
      const filename = extractFilename(headers['content-disposition'], 'attendance-report.pdf');
      downloadBlob(data, filename);
    } catch {
      setError('Failed to generate attendance PDF report');
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    { id: 'attendanceDate', label: 'Date' },
    { id: 'studentName', label: 'Student Name' },
    {
      id: 'present',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.present ? 'Present' : 'Absent'}
          size="small"
          sx={{
            bgcolor: row.present ? '#dcfce7' : '#fee2e2',
            color: row.present ? '#16a34a' : '#dc2626',
            fontWeight: 600,
          }}
        />
      ),
    },
    { id: 'notes', label: 'Notes' },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <Box>
          <IconButton size="small" onClick={() => openEdit(row)}><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Attendance Records"
        subtitle="Manage and review historical student attendance."
        action
        actionLabel="Mark Attendance"
        actionIcon={<AddIcon />}
        onAction={openCreate}
      />

      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <DatePicker
            label="Filter by Date"
            value={filterDate}
            onChange={(v) => { setFilterDate(v); setPage(0); }}
            slotProps={{ textField: { size: 'small', sx: { minWidth: 180 } } }}
          />
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            size="small"
            onClick={handleExportPdf}
            disabled={exporting}
            sx={{ fontWeight: 600 }}
          >
            {exporting ? 'Generating PDF...' : 'Download PDF Report'}
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {loading ? <Loader /> : (
        <>
          <DataTable columns={columns} rows={records} />
          <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onChange={setPage} />
        </>
      )}

      <ModalForm open={modalOpen} onClose={() => setModalOpen(false)} title={editRecord ? 'Edit Attendance' : 'Mark Attendance'} onSubmit={handleSubmit}>
        <TextField select fullWidth margin="normal" label="Student" value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
          {students.map((s) => <MenuItem key={s.id} value={s.id}>{s.fullName}</MenuItem>)}
        </TextField>
        <DatePicker label="Date" value={form.attendanceDate} onChange={(v) => setForm({ ...form, attendanceDate: v })} sx={{ mt: 2, width: '100%' }} />
        <FormControlLabel control={<Switch checked={form.present} onChange={(e) => setForm({ ...form, present: e.target.checked })} color="primary" />} label="Present" sx={{ mt: 1 }} />
        <TextField fullWidth margin="normal" label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </ModalForm>
    </Box>
  );
};

export default AttendanceManagement;
