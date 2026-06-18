import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ fullScreen = false, message = 'Loading...' }) => {
  const content = (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <CircularProgress size={fullScreen ? 48 : 32} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        {content}
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" py={4}>
      {content}
    </Box>
  );
};

export default Loader;
