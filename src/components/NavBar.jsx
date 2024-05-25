
import AppBar from "@mui/material/AppBar";
import { Link } from 'react-router-dom';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";

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

export default function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Ecommerce App
          </Typography>
          <Link to="/" className='link-component'><Button color="inherit">Home</Button></Link>
          <Link to="/login" className='link-component'><Button color="inherit">Login</Button></Link>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
    </>
  );
}