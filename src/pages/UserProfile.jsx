import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../AuthContext';

const theme = createTheme();

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) {
      navigate('/login'); // Redirect to login if no user or token is found
      return;
    }

    const { userId } = location.state || { userId: user.id };

    if (!userId) {
      setError("User ID not found");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://ecommerceappbackend-obm7.onrender.com/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.state, navigate, token, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {userData?.email[0].toUpperCase()}
          </Avatar>
          <Typography component="h1" variant="h5">
            {userData?.email}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1" gutterBottom>
              User ID: {userData?.id}
            </Typography>
            {/* Display more user information if needed */}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default UserProfile;
