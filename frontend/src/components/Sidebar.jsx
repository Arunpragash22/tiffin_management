import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Avatar, Divider, useMediaQuery, useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const DRAWER_WIDTH = 260;

export { DRAWER_WIDTH };

const Sidebar = ({ items, open, onClose, variant = 'admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { user } = useAuth();
  const isAdmin = variant === 'admin';

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: colors.sidebar }}>
      {/* Brand */}
      <Box sx={{ p: 2.5, borderBottom: `1px solid ${colors.border}` }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 2,
              bgcolor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <RestaurantIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" lineHeight={1.2}>
              TiffinPro
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAdmin ? 'System Controller' : 'Student Portal'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile card — admin only */}
      {isAdmin && (
        <Box sx={{ px: 2, pt: 2 }}>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
              bgcolor: colors.paper, borderRadius: 2, border: `1px solid ${colors.border}`,
            }}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: colors.primary, fontSize: 14 }}>
              {(user?.fullName || user?.email || 'A').charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>Admin Panel</Typography>
              <Typography variant="caption" color="text.secondary">System Controller</Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={isActive}
              onClick={() => { navigate(item.path); if (isMobile) onClose(); }}
              sx={{
                borderRadius: 2.5, mb: 0.5, py: 1.2,
                color: isActive ? '#fff' : colors.textSecondary,
                '&.Mui-selected': {
                  bgcolor: colors.primary,
                  color: '#fff',
                  '&:hover': { bgcolor: colors.primaryDark },
                  '& .MuiListItemIcon-root': { color: '#fff' },
                },
                '&:hover': { bgcolor: isActive ? colors.primaryDark : 'rgba(230,126,34,0.08)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: isActive ? '#fff' : colors.textSecondary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, fontSize: '0.9rem' }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Bottom section — admin only */}
      {isAdmin && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Divider sx={{ mb: 1 }} />
          <ListItemButton sx={{ borderRadius: 2, py: 0.8 }} disabled>
            <ListItemIcon sx={{ minWidth: 36 }}><PersonOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '0.875rem' }} />
          </ListItemButton>
          <ListItemButton sx={{ borderRadius: 2, py: 0.8 }} disabled>
            <ListItemIcon sx={{ minWidth: 36 }}><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ fontSize: '0.875rem' }} />
          </ListItemButton>
        </Box>
      )}
    </Box>
  );

  const paperSx = {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    borderRight: `1px solid ${colors.border}`,
    bgcolor: colors.sidebar,
    boxShadow: 'none',
  };

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', lg: 'none' }, '& .MuiDrawer-paper': paperSx }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            ...paperSx,
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            overflowY: 'auto',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
