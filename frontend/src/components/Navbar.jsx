import {
  AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, Divider,
  InputBase, Badge, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

const Navbar = ({ onMenuClick, title = 'TiffinPro' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    setAnchorEl(null);
    navigate('/logout');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ bgcolor: colors.paper, color: 'text.primary', borderBottom: `1px solid ${colors.border}` }}
    >
      <Toolbar
        sx={{
          gap: { xs: 1, sm: 2 },
          px: { xs: 1.5, sm: 2 },
          minHeight: { xs: 56, sm: 64 },
          flexWrap: { xs: 'nowrap', md: 'nowrap' },
        }}
      >
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { lg: 'none' }, flexShrink: 0 }}>
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: colors.primary,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            display: { xs: 'block', sm: 'block' },
            flexShrink: 0,
          }}
        >
          {isMobile ? 'TiffinPro' : title}
        </Typography>

        <Box
          sx={{
            order: { xs: 3, md: 0 },
            width: { xs: '100%', md: 'auto' },
            flex: { md: 1 },
            maxWidth: { md: 480 },
            mx: { md: 'auto' },
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: colors.background,
            borderRadius: 3,
            px: 2,
            py: 0.6,
            border: `1px solid ${colors.border}`,
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase placeholder="Search orders, students..." sx={{ flex: 1, fontSize: '0.875rem' }} />
        </Box>

        <Box display="flex" alignItems="center" gap={0.5} sx={{ ml: { xs: 'auto', md: 0 } }}>
          <IconButton size="small">
            <Badge variant="dot" color="error">
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            <SettingsOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', fontWeight: 600, mx: 1, display: { xs: 'none', lg: 'block' } }}
            onClick={handleLogout}
          >
            Logout
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            <Avatar sx={{ width: { xs: 32, sm: 34 }, height: { xs: 32, sm: 34 }, bgcolor: colors.primary, fontSize: 13 }}>
              {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>
              <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>{user?.fullName || user?.email}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
