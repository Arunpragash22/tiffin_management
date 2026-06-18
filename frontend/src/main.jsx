import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { colors } from './theme/colors';
import './index.css';

const theme = createTheme({
  palette: {
    primary: { main: colors.primary, light: '#F39C12', dark: colors.primaryDark, contrastText: '#fff' },
    secondary: { main: colors.brown, light: '#A0522D', dark: colors.brownDark },
    success: { main: '#16a34a', light: '#dcfce7' },
    warning: { main: '#d97706', light: '#fef3c7' },
    error: { main: '#dc2626', light: '#fee2e2' },
    info: { main: '#2563eb', light: '#dbeafe' },
    background: { default: colors.background, paper: colors.paper },
    text: { primary: colors.textPrimary, secondary: colors.textSecondary },
    divider: colors.border,
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontWeight: 700, color: colors.textPrimary },
    h5: { fontWeight: 700, color: colors.textPrimary },
    h6: { fontWeight: 600, color: colors.textPrimary },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 10, boxShadow: 'none' },
        contained: {
          boxShadow: '0 2px 8px rgba(230, 126, 34, 0.25)',
          '&:hover': { boxShadow: '0 4px 12px rgba(230, 126, 34, 0.35)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 10 },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          '&.Mui-selected': {
            backgroundColor: colors.primary,
            color: '#fff',
            '&:hover': { backgroundColor: colors.primaryDark },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: colors.textSecondary,
          bgcolor: '#FAFAFA',
          borderBottom: `1px solid ${colors.border}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
