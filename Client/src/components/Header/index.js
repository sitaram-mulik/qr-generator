import React, { useState, useContext } from 'react';
import axios from '../../utils/axiosInstance';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Avatar,
  useMediaQuery,
  useTheme,
  Box,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CampaignIcon from '@mui/icons-material/Campaign';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import GroupIcon from '@mui/icons-material/Group';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, removeUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = event => {
    if (!isMobile) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = path => {
    navigate(path);
    handleClose();
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      removeUser();
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.log('Logout failed:', error);
    } finally {
      handleClose();
      setMobileMenuOpen(false);
    }
  };

  const menuItems = user
    ? [
        isMobile && {
          id: 'dashboard',
          text: 'Dashboard',
          icon: <DashboardIcon />,
          onClick: () => handleNavigation('/')
        },
        isMobile && {
          id: 'assets',
          text: 'Assets',
          icon: <QrCodeScannerIcon />,
          onClick: () => handleNavigation('/assets')
        },
        isMobile && {
          id: 'campaigns',
          text: 'Campaigns',
          icon: <CampaignIcon />,
          onClick: () => handleNavigation('/campaigns')
        },
        isMobile &&
          user?.isSuperAdmin && {
            id: 'users',
            text: 'Users',
            icon: <GroupIcon />,
            onClick: () => handleNavigation('/users')
          },

        {
          id: 'profile',
          text: 'Profile',
          icon: <AccountCircleIcon />,
          onClick: () => handleNavigation('/profile')
        },
        {
          text: 'Logout',
          icon: <LogoutIcon />,
          onClick: handleLogout
        }
      ].filter(Boolean)
    : [
        {
          text: 'Login',
          icon: <AccountCircle />,
          onClick: () => handleNavigation('/login')
        }
      ];

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            size="large"
            onClick={handleMobileMenuToggle}
            sx={{ mr: 2, justifyContent: 'flex-start' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {isMobile ? 'CAG' : 'Campaign Assets Generator'}
        </Typography>

        {!isMobile && user?.userName && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              {user.displayName}
            </Typography>
            <IconButton onClick={handleMenu} color="inherit" sx={{ p: 0.5 }}>
              <Avatar sx={{ width: 40, height: 40 }}>
                {user.displayName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {menuItems.map(item => (
                <MenuItem key={item.text} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}

        {!isMobile && !user && (
          <Button
            color="inherit"
            onClick={() => handleNavigation('/login')}
            startIcon={<AccountCircle />}
          >
            Login
          </Button>
        )}

        <SwipeableDrawer
          anchor="left"
          open={mobileMenuOpen}
          onOpen={handleMobileMenuToggle}
          onClose={handleMobileMenuToggle}
        >
          <Box sx={{ width: 250 }} role="presentation">
            {user && (
              <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                <Avatar sx={{ mb: 1 }}>{user.displayName.charAt(0).toUpperCase()}</Avatar>
                <Typography variant="subtitle1">{user.displayName}</Typography>
              </Box>
            )}
            <Divider />
            <List>
              {menuItems.map(item => (
                <ListItem key={item.id} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </SwipeableDrawer>
      </Toolbar>
      {!isMobile && user && (
        <Toolbar
          component="nav"
          variant="dense"
          sx={{
            justifyContent: 'flex-start',
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            py: 1,
            px: 2,
            gap: 2
          }}
        >
          <Button
            component={Link}
            to="/"
            color={location.pathname === '/' ? 'secondary' : 'primary'}
            variant={location.pathname === '/' ? 'contained' : 'text'}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/assets"
            color={location.pathname.startsWith('/assets') ? 'secondary' : 'primary'}
            variant={location.pathname.startsWith('/assets') ? 'contained' : 'text'}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Assets
          </Button>
          <Button
            component={Link}
            to="/campaigns"
            color={location.pathname.startsWith('/campaigns') ? 'secondary' : 'primary'}
            variant={location.pathname.startsWith('/campaigns') ? 'contained' : 'text'}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Campaigns
          </Button>
          {user.isSuperAdmin && (
            <Button
              component={Link}
              to="/users"
              color={location.pathname.startsWith('/users') ? 'secondary' : 'primary'}
              variant={location.pathname.startsWith('/users') ? 'contained' : 'text'}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              Users
            </Button>
          )}
          <Box sx={{ position: 'absolute', right: 2 }}>
            <Alert severity={user.credits > 0 ? 'success' : 'error'}>Credits: {user.credits}</Alert>
          </Box>
        </Toolbar>
      )}
    </AppBar>
  );
};

export default Header;
