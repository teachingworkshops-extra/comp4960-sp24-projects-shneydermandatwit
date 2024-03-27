import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Snackbar, SnackbarContent, IconButton } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


const CreateAccountForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSuccessSnackbarOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!displayName || !email || !password) {
      setErrorMessage('Please enter all fields.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (!(email.endsWith('@wit.edu'))) {
      setErrorMessage('Email must have a wit.edu domain');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5555/user/register', {
        displayName,
        email,
        password,
      }); 

      console.log('Registration successful:', response.data);
      setSuccessSnackbarOpen(true); // Show success Snackbar
      setErrorMessage(""); 

      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage('Error creating account.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Create Account
      </Typography>
      {errorMessage && (
        <Typography variant="body1" align="center" color="error">
          {errorMessage}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Display Name"
          type="text"
          fullWidth
          value={displayName}
          onChange={handleDisplayNameChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={handleEmailChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          margin="normal"
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
        >
          Create Account
        </Button>
      </form>
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <SnackbarContent
          sx={{ backgroundColor: '#4caf50', borderRadius: '5px' }}
          message={
            <Typography variant="body1" sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
              <CheckCircle sx={{ mr: 1 }} /> Account created successfully!
            </Typography>
          }
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            >
              {/* You can add a close icon here if needed */}
            </IconButton>
          }
        />
      </Snackbar>
      <br />

      Already have an account? <a href="/login">Login</a>
    </Container>
  );
};

export default CreateAccountForm;
