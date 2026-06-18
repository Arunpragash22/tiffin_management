import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Stack, useMediaQuery, useTheme,
} from '@mui/material';
import { colors } from '../theme/colors';

const MobileCard = ({ columns, row }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 2.5,
      border: `1px solid ${colors.border}`,
      bgcolor: 'background.paper',
    }}
  >
    <Stack spacing={1.25}>
      {columns.map((col) => {
        const value = col.render ? col.render(row) : row[col.id];
        if (value === null || value === undefined || value === '') return null;
        return (
          <Box key={col.id} display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} minWidth={0}>
            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, fontWeight: 600 }}>
              {col.label}
            </Typography>
            <Box sx={{ textAlign: 'right', minWidth: 0, maxWidth: '65%', overflow: 'hidden' }}>
              {typeof value === 'string' || typeof value === 'number' ? (
                <Typography variant="body2" fontWeight={500}>{value}</Typography>
              ) : (
                value
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  </Paper>
);

const DataTable = ({ columns, rows, emptyMessage = 'No data available', responsive = true, embedded = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!rows || rows.length === 0) {
    if (embedded) {
      return (
        <Box sx={{ py: { xs: 4, sm: 5 }, px: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <Typography color="text.secondary">{emptyMessage}</Typography>
        </Box>
      );
    }
    return (
      <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center', borderRadius: 3, border: `1px solid ${colors.border}` }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  if (responsive && isMobile) {
    return (
      <Stack spacing={embedded ? 0 : 1.5} sx={embedded ? { p: { xs: 1.5, sm: 2 } } : undefined}>
        {rows.map((row, index) => (
          <MobileCard key={row.id || index} columns={columns} row={row} />
        ))}
      </Stack>
    );
  }

  const containerSx = embedded
    ? {
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
        maxWidth: '100%',
        border: 'none',
        boxShadow: 'none',
        borderRadius: 0,
      }
    : {
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
        maxWidth: '100%',
      };

  return (
    <TableContainer component={embedded ? Box : Paper} sx={containerSx}>
      <Table sx={{ minWidth: embedded ? '100%' : 640, width: '100%', tableLayout: embedded ? 'fixed' : 'auto' }}>
        <TableHead>
          <TableRow sx={embedded ? { bgcolor: '#FAFAFA' } : undefined}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                sx={{
                  whiteSpace: 'nowrap',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  fontWeight: 600,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  py: { xs: 1.5, sm: 1.75 },
                  px: { xs: 2.5, sm: 3 },
                  borderBottom: `1px solid ${colors.border}`,
                  ...(embedded && col.id === columns[0].id ? { width: '28%' } : {}),
                  ...(embedded && col.id === columns[columns.length - 1].id ? { width: '18%' } : {}),
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.id || index}
              hover
              sx={{ '&:last-child td': { borderBottom: 0 }, '&:hover': { bgcolor: 'rgba(230,126,34,0.03)' } }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  sx={{
                    py: { xs: 1.75, sm: 2.25 },
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    px: { xs: 2.5, sm: 3 },
                    borderBottom: embedded ? `1px solid ${colors.border}` : undefined,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {col.render ? col.render(row) : row[col.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
