import { Box, Typography, Button } from '@mui/material';

const PageHeader = ({ title, subtitle, action, actionLabel, onAction, actionIcon }) => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems={{ xs: 'flex-start', sm: 'center' }}
    mb={3}
    flexWrap="wrap"
    gap={2}
  >
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom={!!subtitle} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    {action && (
      <Button variant="contained" startIcon={actionIcon} onClick={onAction} sx={{ width: { xs: '100%', sm: 'auto' } }}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default PageHeader;
