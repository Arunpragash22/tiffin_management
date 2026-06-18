import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, IconButton, Chip, Alert, TextField, MenuItem, Paper, Grid, Avatar, Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { orderAPI, reportAPI } from '../../api/services';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import { ORDER_STATUSES } from '../../utils/constants';
import { colors } from '../../theme/colors';
import { downloadBlob, extractFilename } from '../../utils/download';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [exporting, setExporting] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        orderAPI.getAll({ page, size: 10 }),
        orderAPI.getStats(),
      ]);
      setOrders(ordersRes.data.content);
      setTotalPages(ordersRes.data.totalPages);
      setTotalElements(ordersRes.data.totalElements);
      setStats(statsRes.data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, status);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await orderAPI.delete(id);
    fetchOrders();
  };

  const handleExportPdf = async () => {
    setExporting(true);
    setError('');
    try {
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const { data, headers } = await reportAPI.downloadOrdersPdf(params);
      const filename = extractFilename(headers['content-disposition'], 'orders-report.pdf');
      downloadBlob(data, filename);
    } catch {
      setError('Failed to generate orders PDF report');
    } finally {
      setExporting(false);
    }
  };

  const filteredOrders = statusFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const columns = [
    {
      id: 'id',
      label: 'Order ID',
      render: (row) => (
        <Typography variant="body2" fontWeight={600}>#ORD-{String(row.id).padStart(3, '0')}</Typography>
      ),
    },
    {
      id: 'studentName',
      label: 'Student Details',
      render: (row) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primaryLight, color: colors.primary, fontSize: 12 }}>
            {(row.studentName || '?').charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>{row.studentName}</Typography>
        </Box>
      ),
    },
    { id: 'mealType', label: 'Tiffin Type' },
    { id: 'orderDate', label: 'Order Time' },
    {
      id: 'totalAmount',
      label: 'Amount',
      render: (row) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {row.totalAmount ? `₹${row.totalAmount}` : '-'}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <TextField select size="small" value={row.status} onChange={(e) => updateStatus(row.id, e.target.value)}
          sx={{ minWidth: 130 }}>
          {ORDER_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (row) => (
        <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}><DeleteIcon fontSize="small" /></IconButton>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Order Management"
        subtitle="Track, update, and manage all student tiffin orders."
      />

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard title="Total Orders" value={stats?.total || 0} icon={<ReceiptLongIcon />} color="info" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard title="Pending" value={stats?.placed || 0} icon={<ScheduleIcon />} color="warning" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard title="Preparing" value={stats?.preparing || 0} icon={<RestaurantIcon />} color="info" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard title="Delivered" value={stats?.delivered || 0} icon={<LocalShippingIcon />} color="success" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, border: `1px solid ${colors.border}` }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap" mb={2}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            Filter by status
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPdf}
            disabled={exporting}
            sx={{ fontWeight: 600 }}
          >
            {exporting ? 'Generating PDF...' : 'Download PDF Report'}
          </Button>
        </Box>
        <Box display="flex" gap={1} flexWrap="wrap">
          {['ALL', ...ORDER_STATUSES].map((s) => (
            <Chip
              key={s}
              label={s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              onClick={() => setStatusFilter(s)}
              variant={statusFilter === s ? 'filled' : 'outlined'}
              color={statusFilter === s ? 'primary' : 'default'}
              sx={{ fontWeight: 600, cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {loading ? <Loader /> : (
        <>
          <DataTable columns={columns} rows={filteredOrders} emptyMessage="No orders yet" />
          <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onChange={setPage} />
        </>
      )}
    </Box>
  );
};

export default OrderManagement;
