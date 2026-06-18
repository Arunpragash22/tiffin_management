import { Box } from '@mui/material';
import { colors } from '../theme/colors';

const AuthLayout = ({ children, maxWidth = 'sm' }) => (
  <Box
    sx={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: { xs: 2, sm: 3 },
      py: { xs: 3, sm: 4 },
      background: `linear-gradient(135deg, ${colors.primaryLight} 0%, ${colors.background} 50%, #F5EDE4 100%)`,
    }}
  >
    <Box sx={{ width: '100%', maxWidth: maxWidth === 'sm' ? 480 : maxWidth === 'md' ? 720 : 960 }}>
      {children}
    </Box>
  </Box>
);

export default AuthLayout;
