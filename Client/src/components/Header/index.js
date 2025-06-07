import React, { useState, useContext } from "react";
import axios from "../../utils/axiosInstance";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import FolderIcon from "@mui/icons-material/Folder";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, removeUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenu = (event) => {
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

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      removeUser();
      sessionStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      handleClose();
      setMobileMenuOpen(false);
    }
  };

  const menuItems = user
    ? [
        {
          text: "Dashboard",
          icon: <FolderIcon />,
          onClick: () => handleNavigation("/"),
        },
        {
          text: "Assets",
          icon: <FolderIcon />,
          onClick: () => handleNavigation("/assets"),
        },
        {
          text: "Campaigns",
          icon: <FolderIcon />,
          onClick: () => handleNavigation("/campaigns"),
        },

        {
          text: "Profile",
          icon: <PersonIcon />,
          onClick: () => handleNavigation("/profile"),
        },
        { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout },
      ]
    : [
        {
          text: "Login",
          icon: <AccountCircle />,
          onClick: () => handleNavigation("/login"),
        },
      ];

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleMobileMenuToggle}
            sx={{ mr: 2, justifyContent: "flex-start" }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant={isMobile ? "h6" : "h5"}
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            flexGrow: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isMobile ? "CAG" : "Campaign Assets Generator"}
        </Typography>

        {!isMobile && user?.name && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              {user.name}
            </Typography>
            <IconButton onClick={handleMenu} color="inherit" sx={{ p: 0.5 }}>
              <Avatar sx={{ bgcolor: "#1565c0", width: 40, height: 40 }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {menuItems.map((item) => (
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
            onClick={() => handleNavigation("/login")}
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
              <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
                <Avatar sx={{ mb: 1, bgcolor: "#1565c0" }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1">{user.name}</Typography>
              </Box>
            )}
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem button key={item.text} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </SwipeableDrawer>
      </Toolbar>
      {!isMobile && (
        <Toolbar
          component="nav"
          variant="dense"
          sx={{
            justifyContent: "flex-start",
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            px: 2,
            gap: 2,
          }}
        >
          <Button
            component={Link}
            to="/"
            color="primary"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/assets"
            color="primary"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Assets
          </Button>
          <Button
            component={Link}
            to="/campaigns"
            color="primary"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Campaigns
          </Button>


        </Toolbar>
      )}
    </AppBar>
  );
};

export default Header;
