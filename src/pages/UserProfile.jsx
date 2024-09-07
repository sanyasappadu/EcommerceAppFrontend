

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../AuthContext';

const theme = createTheme();

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('user'); // To toggle between user and order view
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
      setError('User ID not found');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://ecommerceappbackend-obm7.onrender.com/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
        console.log(data)
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.state, navigate, token, user]);

  useEffect(() => {
    if (view === 'orders' && token) {
      const fetchOrderData = async () => {
        try {
          const response = await fetch('https://ecommerceappbackend-obm7.onrender.com/api/orders', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch order data');
          }

          const data = await response.json();
          setOrderData(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchOrderData();
    }
  }, [view, token]);

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
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => setView('user')}>
              View User Details
            </Button>
            <Button variant="contained" onClick={() => setView('orders')} sx={{ ml: 2 }}>
              View Order Details
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            {view === 'user' ? (
              <Box>
                <Typography variant="body1" gutterBottom>
                  User ID: {userData?.id}
                </Typography>
                {/* Display more user information if needed */}
              </Box>
            ) : (
              <Box>
                {orderData.length > 0 ? (
                  orderData.map((order) => (
                    <Box key={order.id} sx={{ mb: 2, borderBottom: '1px solid #ccc', pb: 2 }}>
                      <Typography variant="body2">
                        Order ID: {order.id}
                      </Typography>
                      <Typography variant="body2">
                        Status: {order.status}
                      </Typography>
                      <Typography variant="body2">
                        Total: {order.totalAmount}
                      </Typography>
                      {/* Display more order details as needed */}
                    </Box>
                  ))
                ) : (
                  <Typography>No orders found.</Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UserProfile;
