import AppBar from "@mui/material/AppBar";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import { AuthContext } from "../AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: green[200],
    },
    secondary: {
      main: green[500],
    },
  },
});

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ecommerce App
          </Typography>
          <Link to="/wishlist" className="link-component">
            <Button color="inherit">Wishlist</Button>
          </Link>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <Link to="/login" className="link-component">
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
