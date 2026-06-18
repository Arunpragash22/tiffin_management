import { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Tabs, Tab, Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { menuAPI } from '../../api/services';
import Loader from '../../components/Loader';

const Menus = () => {
  const [tab, setTab] = useState(0);
  const [dailyMenu, setDailyMenu] = useState(null);
  const [weeklyMenus, setWeeklyMenus] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDaily = async (date) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await menuAPI.getDaily(date.format('YYYY-MM-DD'));
      setDailyMenu(data);
    } catch {
      setDailyMenu(null);
      setError('No menu found for selected date');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeekly = async (start) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await menuAPI.getWeekly(start.format('YYYY-MM-DD'));
      setWeeklyMenus(data);
      if (data.length === 0) setError('No weekly menu found');
    } catch {
      setWeeklyMenus([]);
      setError('No weekly menu found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 0) fetchDaily(selectedDate);
    else fetchWeekly(selectedDate);
  }, [tab, selectedDate]);

  const MenuCard = ({ menu }) => (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>{menu.menuDate} ({menu.menuType})</Typography>
        <Typography><strong>🌅 Breakfast:</strong> {menu.breakfast}</Typography>
        <Typography><strong>☀️ Lunch:</strong> {menu.lunch}</Typography>
        <Typography><strong>🌙 Dinner:</strong> {menu.dinner}</Typography>
        {menu.description && <Typography variant="body2" color="text.secondary" mt={1}>{menu.description}</Typography>}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Menus</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Daily Menu" />
        <Tab label="Weekly Menu" />
      </Tabs>

      <DatePicker
        label={tab === 0 ? 'Select Date' : 'Week Starting'}
        value={selectedDate}
        onChange={(v) => setSelectedDate(v)}
        sx={{ mb: 3 }}
      />

      {error && <Alert severity="info" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? <Loader /> : (
        tab === 0 ? (
          dailyMenu ? <MenuCard menu={dailyMenu} /> : null
        ) : (
          <Grid container spacing={2}>
            {weeklyMenus.map((menu) => (
              <Grid key={menu.id} size={{ xs: 12, md: 6 }}>
                <MenuCard menu={menu} />
              </Grid>
            ))}
          </Grid>
        )
      )}
    </Box>
  );
};

export default Menus;
