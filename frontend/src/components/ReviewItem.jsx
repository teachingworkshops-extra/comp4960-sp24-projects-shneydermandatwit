import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent, Avatar, Grid, Button, Snackbar, SnackbarContent, IconButton } from '@mui/material';
import { grey, blueGrey } from '@mui/material/colors';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CheckCircle, Error } from '@mui/icons-material';


const ReviewItem = ({ review }) => {
  const firstLetter = review.posterDisplayName.charAt(0).toUpperCase();
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
console.log(Cookies.get('permission') === 'admin')

  const handleDeleteSnackbarClose = () => {
    setDeleteSnackbarOpen(false);
    setDeleteSuccess(false);
  };

  const deletePost = async (id) => {
    const token = Cookies.get('token');

    try {
      await axios.delete(`http://localhost:5555/review/${id}`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      });

      setDeleteSuccess(true);
      setDeleteSnackbarOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
      setDeleteSuccess(false);
      setDeleteSnackbarOpen(true);
    }
  };

  function decodeCookie() {
    const token = Cookies.get('token');

    if (token) {
      const decodedToken = atob(token.split('.')[1]);
      const tokenData = JSON.parse(decodedToken);
      const userEmail = tokenData.email;
      return userEmail;
    }
  }

  return (
    <Card variant='outlined' sx={{ backgroundColor: grey[900], color: grey[100] }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '3vh' }}>
          <Grid item>
            <Avatar sx={{ bgcolor: "orange" }}>{firstLetter}</Avatar>
          </Grid>
          <Grid item>
            <Typography variant="body1" gutterBottom sx={{ color: blueGrey[300], fontWeight: 'bold' }}>
              {review.posterDisplayName}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom sx={{ color: blueGrey[200] }}>
          {review.title}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: blueGrey[300] }}>
          {review.description}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: blueGrey[300] }}>
          Building: {review.building}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: blueGrey[300] }}>
          Floor: {review.floor}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: blueGrey[300] }}>
          Room: {review.room}
        </Typography>
        {(review.posterEmail === decodeCookie() || Cookies.get('permission') === 'admin') && (
          <Button color="warning" onClick={() => deletePost(review._id)}>Delete</Button>
        )}
      </CardContent>
      <Snackbar
        open={deleteSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleDeleteSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <SnackbarContent
          sx={{ backgroundColor: deleteSuccess ? '#4caf50' : '#f44336', borderRadius: '5px' }}
          message={
            <Typography variant="body1" sx={{ color: 'white', display: 'flex', alignItems: 'center' }}>
              {deleteSuccess ? <CheckCircle sx={{ mr: 1 }} /> : <Error sx={{ mr: 1 }} />}
              {deleteSuccess ? 'Review deleted successfully!' : 'Error deleting review!'}
            </Typography>
          }
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleDeleteSnackbarClose}
              sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            >
              {/* You can add a close icon here if needed */}
            </IconButton>
          }
        />
      </Snackbar>
    </Card>
  );
};

export default ReviewItem;
