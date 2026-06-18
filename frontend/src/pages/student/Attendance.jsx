import { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Button, Alert, Card, CardContent, Grid, IconButton, Paper,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import dayjs from 'dayjs';
import { attendanceAPI } from '../../api/services';
import Loader from '../../components/Loader';
import { colors } from '../../theme/colors';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const STATUS_CONFIG = {
  PRESENT: {
    label: 'Present',
    bgcolor: '#dcfce7',
    color: '#16a34a',
    icon: CheckCircleIcon,
  },
  ABSENT: {
    label: 'Absent',
    bgcolor: '#fee2e2',
    color: '#dc2626',
    icon: CancelIcon,
  },
  LATE: {
    label: 'Late',
    bgcolor: '#fef3c7',
    color: '#d97706',
    icon: ScheduleIcon,
  },
};

const getRecordStatus = (record) => {
  if (!record) return null;
  if (!record.present) return 'ABSENT';
  if (record.notes?.toLowerCase().includes('late')) return 'LATE';
  return 'PRESENT';
};

const StatCard = ({ title, value, subValue, icon: Icon, iconBg, iconColor }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
            {subValue && (
              <Typography component="span" variant="h6" color="text.secondary" fontWeight={500}>
                {' '}/ {subValue}
              </Typography>
            )}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: iconBg, color: iconColor, p: 1.2, borderRadius: '50%', display: 'flex' }}>
          <Icon fontSize="small" />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Attendance = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const year = currentMonth.year();
  const month = currentMonth.month() + 1;

  useEffect(() => {
    setLoading(true);
    setError('');
    attendanceAPI.getMyCalendar(year, month)
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load attendance'))
      .finally(() => setLoading(false));
  }, [year, month]);

  const recordsByDate = useMemo(() => {
    const map = {};
    (data?.records || []).forEach((r) => {
      map[r.attendanceDate] = r;
    });
    return map;
  }, [data]);

  const calendarDays = useMemo(() => {
    const start = currentMonth.startOf('month');
    const daysInMonth = start.daysInMonth();
    const startOffset = (start.day() + 6) % 7;
    const cells = [];

    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      const date = start.date(day);
      const dateKey = date.format('YYYY-MM-DD');
      cells.push({ day, date, record: recordsByDate[dateKey] || null });
    }
    return cells;
  }, [currentMonth, recordsByDate]);

  const today = dayjs().format('YYYY-MM-DD');

  if (loading && !data) return <Loader fullScreen />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-start' }} flexDirection={{ xs: 'column', sm: 'row' }} mb={3} gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>My Attendance</Typography>
          <Typography variant="body2" color="text.secondary">
            Track your daily presence and meal eligibility.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ReportProblemOutlinedIcon />}
          sx={{ borderRadius: 2.5, bgcolor: colors.paper, width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}
          onClick={() => alert('Please contact the admin to request an attendance correction.')}
        >
          Request Correction
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Days Present"
            value={data?.daysPresent ?? 0}
            subValue={data?.totalMarked || undefined}
            icon={CheckCircleIcon}
            iconBg="#dcfce7"
            iconColor="#16a34a"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Days Absent"
            value={data?.daysAbsent ?? 0}
            icon={CancelIcon}
            iconBg="#fee2e2"
            iconColor="#dc2626"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            title="Days Late"
            value={data?.daysLate ?? 0}
            icon={ScheduleIcon}
            iconBg="#fef3c7"
            iconColor="#d97706"
          />
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: 3, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={2}
          px={{ xs: 2, sm: 3 }}
          py={2}
          borderBottom={`1px solid ${colors.border}`}
        >
          <Box display="flex" alignItems="center" gap={1} width={{ xs: '100%', sm: 'auto' }} justifyContent="center">
            <IconButton size="small" onClick={() => setCurrentMonth((m) => m.subtract(1, 'month'))}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={600} minWidth={{ xs: 140, sm: 160 }} textAlign="center" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {currentMonth.format('MMMM YYYY')}
            </Typography>
            <IconButton size="small" onClick={() => setCurrentMonth((m) => m.add(1, 'month'))}>
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap" justifyContent={{ xs: 'center', sm: 'flex-end' }} width={{ xs: '100%', sm: 'auto' }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <Box key={key} display="flex" alignItems="center" gap={0.75}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cfg.color }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {cfg.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(44px, 1fr))', minWidth: 320, bgcolor: '#FAFAFA', borderBottom: `1px solid ${colors.border}` }}>
            {WEEKDAYS.map((day) => (
              <Box key={day} py={1.5} textAlign="center">
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(44px, 1fr))', minWidth: 320 }}>
          {calendarDays.map((cell, index) => {
            if (!cell) {
              return <Box key={`empty-${index}`} sx={{ minHeight: 100, borderRight: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, bgcolor: '#FAFAFA' }} />;
            }

            const dateKey = cell.date.format('YYYY-MM-DD');
            const isToday = dateKey === today;
            const status = getRecordStatus(cell.record);
            const cfg = status ? STATUS_CONFIG[status] : null;
            const StatusIcon = cfg?.icon;

            return (
              <Box
                key={dateKey}
                sx={{
                  minHeight: { xs: 72, sm: 100 },
                  p: { xs: 0.5, sm: 1 },
                  borderRight: `1px solid ${colors.border}`,
                  borderBottom: `1px solid ${colors.border}`,
                  bgcolor: colors.paper,
                  outline: isToday ? `2px solid ${colors.primary}` : 'none',
                  outlineOffset: -2,
                }}
              >
                <Box display="flex" justifyContent="flex-end" mb={0.5}>
                  <Typography
                    variant="caption"
                    fontWeight={isToday ? 700 : 500}
                    sx={{
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      bgcolor: isToday ? colors.primary : 'transparent',
                      color: isToday ? '#fff' : 'text.secondary',
                    }}
                  >
                    {cell.day}
                  </Typography>
                </Box>

                {cfg && (
                  <Box
                    sx={{
                      bgcolor: cfg.bgcolor,
                      color: cfg.color,
                      borderRadius: 1.5,
                      px: 0.75,
                      py: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <StatusIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" fontWeight={600}>{cfg.label}</Typography>
                  </Box>
                )}

                {status === 'LATE' && cell.record?.notes && (
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5} sx={{ fontSize: '0.65rem' }}>
                    {cell.record.notes}
                  </Typography>
                )}
              </Box>
            );
          })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Attendance;
