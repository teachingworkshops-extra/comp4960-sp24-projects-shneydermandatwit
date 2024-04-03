import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Avatar, Grid, Button, Snackbar, SnackbarContent, IconButton } from '@mui/material';
import { grey, blueGrey, orange } from '@mui/material/colors';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CheckCircle, Error, Delete, AccessTime } from '@mui/icons-material';
import { ROOT } from '../config';
import '../App.css'
import { Box } from '@mui/material';

const ReviewItem = ({ review }) => {
  const firstLetter = review.posterDisplayName.charAt(0).toUpperCase();
  const [deleteSnackbarOpen, setDeleteSnackbarOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (Object.keys(review).length > 0) {
      const mongoTimestamp = review.updatedAt;
      const date = new Date(mongoTimestamp);

      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
      const formatted = date.toLocaleDateString('en-US', options);
      setFormattedDate(formatted);

    }
  }, [review])

  console.log(Cookies.get('permission') === 'admin')

  const handleDeleteSnackbarClose = () => {
    setDeleteSnackbarOpen(false);
    setDeleteSuccess(false);
  };

  const deletePost = async (id) => {
    const token = Cookies.get('token');

    try {
      await axios.delete(`${ROOT}/review/${id}`, {
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
    <Card variant='outlined' sx={{ backgroundColor: grey[200], color: grey[100], elevation: 24, boxShadow: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center" sx={{ marginBottom: '3vh' }}>
          <Grid item>
            <Avatar sx={{ bgcolor: "orange" }}>{firstLetter}</Avatar>
          </Grid>
          <Grid item>
            <Typography variant="body1" gutterBottom sx={{ color: blueGrey[900], fontWeight: 'bold' }}>
              {review.posterDisplayName}
            </Typography>
          </Grid>
          <Grid item alignSelf={'center'} marginLeft='auto'>
            {(review.posterEmail === decodeCookie() || Cookies.get('permission') === 'admin') && (
              <Delete className='delete' fontSize='large' onClick={() => deletePost(review._id)} />
            )}
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom sx={{ color: blueGrey[900] }}>
          {review.title}
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: blueGrey[800] }}>
          {review.description}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: blueGrey[800] }}>
          Building: {review.building}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: blueGrey[800] }}>
          Floor: {review.floor}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: blueGrey[800] }}>
          Room: {review.room}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTime style={{ color: 'chocolate', marginTop: '-2px' }} />
          <Typography variant="body2" gutterBottom style={{ color: 'chocolate' }}>
            {formattedDate}
          </Typography>
        </Box>
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
