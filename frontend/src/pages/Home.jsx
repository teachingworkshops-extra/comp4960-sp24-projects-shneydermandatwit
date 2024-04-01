import '../App.css'
import MapContainer from '../components/MapComponent';
import React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import AlertTitle from '@mui/material/AlertTitle';

const Home = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <div id='homePage' style={{ width: '100%', height: '100%', overflow: 'hidden', overflowY: 'auto' }}>
        <Box sx={{ width: '100%' }}>
          <Collapse in={open}>
            <Alert variant="outlined" severity="info" color="warning"
              sx={{ mb: 2, ml: 1, mr: 1, bgcolor: 'background.paper' }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              <AlertTitle>Welcome to RateMyWIT!</AlertTitle>
              Here, you'll find an interactive map showcasing all the buildings on the Wentworth campus.
              Simply click on a building to access the reviews provided by students and staff about the amenities inside.<br />
              <br />
              <b>How to use:<br /></b>
              Hover over a map marker to see the building's name<br />
              Click on a map marker to head to its review page<br />
              Within each building's review page, you can filter reviews by floors and rooms to discover thoughts shared by members of the WIT community.<br />
              <br />
              Happy exploring!
            </Alert>
          </Collapse>
          <Button
            style={{ display: open ? 'none' : undefined }}
            sx={{ mb: 2, ml: 4, bgcolor: 'background.paper' }}
            variant="outlined"
            color="warning"
            onClick={() => {
              setOpen(true);
            }}
          >
            Open Guide
          </Button>
        </Box>
        <div style={{ height: 'calc(100% - 30px)', overflow: 'hidden', overflowY: 'auto', marginBottom: '10vh' }}>
          <Box sx={{ border: 4, borderColor: "chocolate", width: '95%', height: '91%', margin: 'auto' }}>
            <MapContainer />
          </Box>
        </div>
      </div>
    </>
  )
}

export default Home