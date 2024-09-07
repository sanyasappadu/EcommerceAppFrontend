
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery, useTheme } from '@mui/material';

const Navbar = () => {
  const { user, logout, token, isLoggedIn, selectCategory } = useAuth() || {};
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if screen size is medium or smaller

  const handleProfileClick = () => {
    if (user && token) {
      console.log(token, user.image)
      navigate(`/profile`, { state: { userId: user.id } });
    }
  };

  const handleCartClick = () => {
    if (isLoggedIn) {
      navigate(`/cart`);
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/products');
  };

  const handleCategoryChange = (event) => {
    selectCategory(event.target.value);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            E-SHOP
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link to="/products" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Home
                </Link>
              </MenuItem>
              <MenuItem onClick={handleCartClick}>Cart</MenuItem>
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          {/* Select component visible on mobile only */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Select
              defaultValue="All"
              onChange={handleCategoryChange}
              sx={{ color: 'white', mr: 2 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="electronic">Electronics</MenuItem>
              <MenuItem value="clothing">Clothes</MenuItem>
              <MenuItem value="activewear">Activewear</MenuItem>
              <MenuItem value="shoes">Shoes</MenuItem>
            </Select>
          </Box>

          {/* Home and Cart components visible on medium and larger screens only */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" component={Link} to="/products">
              Home
            </Button>
            <Button color="inherit" onClick={handleCartClick}>
              Cart
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Open Profile">
                  <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                    <Avatar alt={user.name} src={user.image || '/default-avatar.png'} />
                  </IconButton>
                </Tooltip>
                <Button color="inherit" onClick={handleCartClick}>
                  Cart
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                {/* <Button color="inherit" component={Link} to="/signup">
                  Signup
                </Button> */}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;