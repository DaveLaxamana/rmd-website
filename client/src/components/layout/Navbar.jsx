import { useState, Fragment } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { showSuccessAlert } from '../../redux/slices/alertSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  AddCircleOutline,
  ExitToApp,
  Person,
  Settings,
} from '@mui/icons-material';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showSuccessAlert('Successfully logged out'));
    navigate('/');
    handleClose();
  };

  const guestLinks = (
    <>
      <Button color="inherit" component={RouterLink} to="/login">
        Login
      </Button>
      <Button color="inherit" component={RouterLink} to="/register">
        Register
      </Button>
    </>
  );

  const authLinks = (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        color="inherit"
        component={RouterLink}
        to="/projects/new"
        startIcon={<AddCircleOutline />}
        sx={{ mr: 2 }}
      >
        Create Project
      </Button>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleMenu}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            alt={user?.name}
            src={user?.avatar}
            sx={{ width: 32, height: 32 }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={RouterLink}
          to="/"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            Raket Clone
          </Box>
        </Typography>
        {isAuthenticated ? authLinks : guestLinks}
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon fontSize="small" />
          </ListItemIcon>
          Dashboard
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
