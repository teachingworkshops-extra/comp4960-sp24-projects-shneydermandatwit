import React from 'react';
import ReviewItem from './ReviewItem'; // Assuming ReviewItem is in a separate file
import { Grid } from '@mui/material';

const ReviewList = ({ reviews }) => {
  return (
    <Grid container spacing={2} style={{ paddingLeft: '10px', paddingRight: '15px' }}>
      {reviews.map(review => (
        <Grid item key={review._id} xs={12} sm={12} md={12}>
          <ReviewItem review={review} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ReviewList;
