import { Box, Pagination as MuiPagination, Typography } from '@mui/material';

const Pagination = ({ page, totalPages, onChange, totalElements, pageSize = 10 }) => {
  if (totalPages <= 1 && totalElements <= pageSize) return null;

  const from = page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalElements);

  return (
    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mt={2.5} gap={2}>
      <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'center', sm: 'left' }}>
        Showing {from} to {to} of {totalElements} entries
      </Typography>
      <Box display="flex" justifyContent={{ xs: 'center', sm: 'flex-end' }}>
        <MuiPagination
          count={totalPages}
          page={page + 1}
          onChange={(_, value) => onChange(value - 1)}
          color="primary"
          shape="rounded"
          size="small"
          siblingCount={0}
          boundaryCount={1}
        />
      </Box>
    </Box>
  );
};

export default Pagination;
