import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, MenuItem, Chip, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { orderAPI } from '../../api/services';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import ModalForm from '../../components/ModalForm';
import Loader from '../../components/Loader';
import { MEAL_TYPES, STATUS_COLORS } from '../../utils/constants';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ orderDate: dayjs().add(1, 'day'), mealType: 'FULL_DAY', quantity: 1, totalAmount: '', notes: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getMy({ page, size: 10 });
      setOrders(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      await orderAPI.place({
        orderDate: form.orderDate.format('YYYY-MM-DD'),
        mealType: form.mealType,
        quantity: Number(form.quantity),
        totalAmount: form.totalAmount ? Number(form.totalAmount) : null,
        notes: form.notes,
      });
      setModalOpen(false);
      setMessage('Order placed successfully');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancel(id);
      setMessage('Order cancelled');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot cancel order');
    }
  };

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'orderDate', label: 'Date' },
    { id: 'mealType', label: 'Meal' },
    { id: 'quantity', label: 'Qty' },
    { id: 'totalAmount', label: 'Amount', render: (row) => row.totalAmount ? `₹${row.totalAmount}` : '-' },
    { id: 'status', label: 'Status', render: (row) => (
      <Chip label={row.status} size="small" color={STATUS_COLORS[row.status] || 'default'} />
    )},
    { id: 'actions', label: 'Actions', render: (row) => (
      ['PLACED', 'PREPARING'].includes(row.status) ? (
        <Button size="small" color="error" startIcon={<CancelIcon />} onClick={() => handleCancel(row.id)}>Cancel</Button>
      ) : null
    )},
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>My Orders</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>Place Order</Button>
      </Box>

      {message && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {loading ? <Loader /> : (
        <>
          <DataTable columns={columns} rows={orders} emptyMessage="No orders yet. Place your first order!" />
          <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onChange={setPage} />
        </>
      )}

      <ModalForm open={modalOpen} onClose={() => setModalOpen(false)} title="Place New Order" onSubmit={handlePlaceOrder} submitLabel="Place Order">
        <DatePicker label="Order Date" value={form.orderDate} minDate={dayjs()} onChange={(v) => setForm({ ...form, orderDate: v })} sx={{ width: '100%', mb: 2 }} />
        <TextField select fullWidth margin="normal" label="Meal Type" value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
          {MEAL_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField fullWidth margin="normal" label="Quantity" type="number" inputProps={{ min: 1 }} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        <TextField fullWidth margin="normal" label="Total Amount (₹)" type="number" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} />
        <TextField fullWidth margin="normal" label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </ModalForm>
    </Box>
  );
};

export default Orders;
