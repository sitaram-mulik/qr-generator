import { Grid } from '@mui/material';
import { createTheme, styled } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000', // Black
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#f9f9f9', // Gray
      contrastText: '#000000'
    },
    background: {
      default: '#ffffff', // White background
      paper: '#f9f9f9' // Light gray paper
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#555555' // Gray text
    },
    error: {
      main: '#d32f2f'
    },
    warning: {
      main: '#ed6c02'
    },
    info: {
      main: '#0288d1'
    },
    success: {
      main: '#2e7d32'
    }
  },
  typography: {
    // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontFamily: '"Fira Code", "Roboto", "Helvetica", "Arial", monospace',
    h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.01562em', color: '#000000' },
    h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.00833em', color: '#000000' },
    h3: { fontWeight: 700, fontSize: '1.75rem', letterSpacing: '0em', color: '#000000' },
    h4: { fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.00735em', color: '#000000' },
    h5: { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0em', color: '#000000' },
    h6: { fontWeight: 700, fontSize: '1rem', letterSpacing: '0.0075em', color: '#000000' },
    body1: { fontSize: '1rem', color: '#000000' },
    body2: { fontSize: '0.875rem', color: '#555555' },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '8px 24px',
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#555555' }
        }
      },
      defaultProps: {
        color: 'inherit' // Force all buttons to respect theme colors unless explicitly set
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          backgroundColor: '#f9f9f9',
          border: '1px solid #888888'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 0
        }
      }
    },

    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: 0
        }
      }
    }
  }
});

export const BoxGrid = styled(Grid)(({ theme }) => ({
  padding: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  border: '1px solid',
  borderColor: theme.palette.primary.main
}));

export default theme;
