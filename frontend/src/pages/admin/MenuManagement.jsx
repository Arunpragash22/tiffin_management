import { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, IconButton, MenuItem, Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { menuAPI } from '../../api/services';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import PageHeader from '../../components/PageHeader';
import ModalForm from '../../components/ModalForm';
import Loader from '../../components/Loader';
import { MENU_TYPES } from '../../utils/constants';

const emptyForm = { menuDate: dayjs(), menuType: 'DAILY', breakfast: '', lunch: '', dinner: '', description: '' };

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMenu, setEditMenu] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await menuAPI.getAll({ page, size: 10 });
      setMenus(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      setError('Failed to load menus');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchMenus(); }, [fetchMenus]);

  const openCreate = () => { setEditMenu(null); setForm(emptyForm); setModalOpen(true); };

  const openEdit = (menu) => {
    setEditMenu(menu);
    setForm({
      menuDate: dayjs(menu.menuDate), menuType: menu.menuType,
      breakfast: menu.breakfast, lunch: menu.lunch, dinner: menu.dinner, description: menu.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, menuDate: form.menuDate.format('YYYY-MM-DD') };
    try {
      if (editMenu) await menuAPI.update(editMenu.id, payload);
      else await menuAPI.create(payload);
      setModalOpen(false);
      fetchMenus();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu?')) return;
    await menuAPI.delete(id);
    fetchMenus();
  };

  const columns = [
    { id: 'menuDate', label: 'Date' },
    { id: 'menuType', label: 'Type' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
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
        title="Menu Management"
        subtitle="Create and manage daily and weekly tiffin menus."
        action
        actionLabel="Add Menu Item"
        actionIcon={<AddIcon />}
        onAction={openCreate}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {loading ? <Loader /> : (
        <>
          <DataTable columns={columns} rows={menus} />
          <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onChange={setPage} />
        </>
      )}

      <ModalForm open={modalOpen} onClose={() => setModalOpen(false)} title={editMenu ? 'Edit Menu' : 'Add Menu Item'} onSubmit={handleSubmit} maxWidth="md">
        <Box display="flex" gap={2} flexWrap="wrap">
          <DatePicker label="Menu Date" value={form.menuDate} onChange={(v) => setForm({ ...form, menuDate: v })} sx={{ flex: 1 }} />
          <TextField select label="Menu Type" value={form.menuType} onChange={(e) => setForm({ ...form, menuType: e.target.value })} sx={{ flex: 1 }}>
            {MENU_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </Box>
        <TextField fullWidth margin="normal" label="Breakfast" value={form.breakfast} onChange={(e) => setForm({ ...form, breakfast: e.target.value })} required />
        <TextField fullWidth margin="normal" label="Lunch" value={form.lunch} onChange={(e) => setForm({ ...form, lunch: e.target.value })} required />
        <TextField fullWidth margin="normal" label="Dinner" value={form.dinner} onChange={(e) => setForm({ ...form, dinner: e.target.value })} required />
        <TextField fullWidth margin="normal" label="Description" multiline rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </ModalForm>
    </Box>
  );
};

export default MenuManagement;
