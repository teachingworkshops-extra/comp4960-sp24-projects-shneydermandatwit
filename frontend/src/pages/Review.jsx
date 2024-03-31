import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Select, MenuItem, Collapse, Button, Dialog, DialogActions, DialogTitle, DialogContent, Divider } from '@mui/material';
import { KeyboardArrowDownRounded, KeyboardArrowUpRounded, SearchOff } from '@mui/icons-material'
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import '../App.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import Cookies from 'js-cookie';
import { ROOT } from '../config';
import { grey } from '@mui/material/colors';



const Review = () => {
    const [building, setBuilding] = useState(localStorage.getItem('building') || 'none');
    const [floor, setFloor] = useState(localStorage.getItem('floor') || 'none');
    const [room, setRoom] = useState(localStorage.getItem('room') || 'none');
    const [reviews, setReviews] = useState([]);
    const [roomsList, setRoomsList] = useState([]);
    const [noReviewsFound, setNoReviewsFound] = useState(false);


    const navigate = useNavigate()

    const location = useLocation(); //
    const { state } = location;
    const buildingParam = state ? state.buildingParam : null;

    useEffect(() => {
        if (buildingParam) {
            setBuilding(buildingParam);
            setFloor('none');
            setRoom('none');
            navigate('/review', { replace: true });

        }
    }, []);


    const buildingData = [
        {
            buildingName: "Beatty Hall",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3", "Floor 4"],
        },
        {
            buildingName: "Wentworth Hall",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3"]
        },
        {
            buildingName: "Watson Hall",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3"],
        },
        {
            buildingName: "Rubenstein Hall",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3"],
        },
        {
            buildingName: "CEIS",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3"],
        },
        {
            buildingName: "Baker Hall",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3"],
        },
        {
            buildingName: "C Store",
            floors: ["Ground"],
        },
        {
            buildingName: "Ira Allen",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3"],
        },
        {
            buildingName: "Dobbs Hall",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3"],
        },
        {
            buildingName: "Williston Hall",
            floors: ["Ground", "Floor 1", "Floor 2", "Floor 3"],
        },
    ];


    const getToken = () => {
        return Cookies.get('token');
    }


    const handleBuildingChange = (event) => {
        let selectedBuilding = event.target.value;
        setBuilding(selectedBuilding);
        setFloor('none');
        setRoom('none');
    };


    const handleFloorChange = (event) => {
        let selectedFloor = event.target.value;
        setFloor(selectedFloor);
        setRoom('none');
    };


    const handleRoomChange = (event) => {
        let selectedRoom = event.target.value;
        setRoom(selectedRoom);
    };


    useEffect(() => {
        localStorage.setItem('building', building);
        localStorage.setItem('floor', floor);
        localStorage.setItem('room', room);
        const fetchReviews = async () => {
            try {
                console.log("Floor", floor);
                const response = await axios.get(`${ROOT}/review/?building=${(!(building === "none") ? building : "")}&floor=${(!(floor === "none") ? floor : "")}&room=${(!(room === "none") ? room : "")}`);
                setReviews(response.data); // Assuming response.data is an array of reviews
                setNoReviewsFound(false); // Reset noReviewsFound state if reviews are found
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setNoReviewsFound(true); // Set state to indicate no reviews were found
                } else {
                    console.error('Error fetching reviews:', error);
                    setReviews([]);
                }
            }
        };

        const fetchRoomsList = async () => {
            if (!(building === "none") && !(floor === "none")) {
                const responseRooms = await axios.get(`${ROOT}/review/rooms/?building=${building}&floor=${floor}`)
                console.log("Room", responseRooms.data);
                setRoomsList(responseRooms.data);
            }
        }

        fetchReviews();
        fetchRoomsList();
    }, [building, floor, room]);

    const cBuildingItem = buildingData.find(buildingItem => buildingItem.buildingName === building);
    const floorList = cBuildingItem ? cBuildingItem.floors : [];

    const [openBuildingSelect, setSelectOpen] = React.useState(false);
    const [openReviewDialog, setDialogOpen] = React.useState(false);

    const handleBuildingSelect = () => {
        setSelectOpen(!openBuildingSelect);
    };
    const handleDialog = () => {
        setDialogOpen(!openReviewDialog);
    };
    return (
        <Grid container spacing={1} style={{ height: '100vh', marginBottom: '50px' }}>
            <Grid item xs={12} style={{ height: '100%', paddingBottom: '50px' }}>
                <div className='reviewPage' style={{ height: 'calc(100% - 50px)', overflow: 'hidden', overflowY: 'auto', padding: '16px' }}>
                    <div style={{ border: '2px solid chocolate', borderRadius: '5.5px' }}>
                        <Collapse in={!openBuildingSelect}>
                            <Paper className="panel" style={{ elevation: 20, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '10px', backgroundColor: grey[200] }}>
                                <div style={{ width: '70%', paddingRight: '45px' }}>
                                    <Typography variant="h7" style={{ color: '#333' }}>Building</Typography>
                                    <br />
                                    <Select fullWidth value={building} onChange={handleBuildingChange} color= 'warning'>
                                        <MenuItem value="none">None</MenuItem>
                                        {buildingData.map((building, index) => (
                                            <MenuItem key={index} value={building.buildingName}>{building.buildingName}</MenuItem>
                                        ))}
                                    </Select>
                                </div>
                                <div style={{ width: '70%', paddingRight: '45px' }}>
                                    <Typography variant="h7" style={{ color: '#333' }}>Floor</Typography>
                                    <br />
                                    <Select fullWidth value={floor} onChange={handleFloorChange} disabled={building === "none"} color='warning' >
                                        <MenuItem value="none">None</MenuItem>
                                        {floorList.map((floorItem, index) =>
                                            <MenuItem key={index} value={floorItem}>{floorItem}</MenuItem>
                                        )}
                                    </Select>
                                </div>
                                <div style={{ width: '70%' }}>
                                    <Typography variant="h7" style={{ color: '#333' }}>Room</Typography>
                                    <br />
                                    <Select fullWidth value={room} onChange={handleRoomChange} disabled={!(!(floor === "none") && !(building === "none"))} color='warning'>
                                        <MenuItem value="none">None</MenuItem>
                                        {roomsList.map((roomItem, index) =>
                                            <MenuItem key={index} value={roomItem}>{roomItem}</MenuItem>
                                        )}
                                    </Select>
                                </div>
                            </Paper>
                        </Collapse>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '7%', width: '100%' }}>
                            <Button onClick={handleBuildingSelect} className="panel" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%',  backgroundColor: grey[200], outline: 'none', color: 'chocolate' }}>
                                <b>Select a location</b>
                                <br />
                                {
                                    !openBuildingSelect ? (<KeyboardArrowUpRounded />) : (<KeyboardArrowDownRounded />)
                                }
                            </Button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', width: '100%', paddingTop: '10px' }}>
                        {building != 'none' ?
                            (<h1 style={{ alignContent: 'center' }} >{building}</h1>) :
                            (<h1>All Reviews</h1>)
                        }
                        <Button onClick={handleDialog} style={{ height: '20%', width: '9%', elevation: 20,  backgroundColor: grey[200], padding: '10px', border: '2px solid chocolate', borderRadius: '5.5px', alignSelf: 'center', color: 'chocolate', outline: 'none' }}>
                            <b>New Review</b>
                        </Button>
                        <Dialog
                            open={openReviewDialog}
                            onClose={handleDialog}
                        >
                            {building != 'none' ?
                                <DialogTitle style={{ paddingTop: '25px', paddingLeft: '15px', paddingBottom: '5px' }}
                                ><b>Create a new review for {building}</b></DialogTitle> :
                                <DialogTitle><b>Create a new review</b></DialogTitle>
                            }

                            <DialogContent
                                style={{ padding: '0px', paddingLeft: '8px', paddingRight: '8px' }}>
                                {getToken() ? (
                                    <ReviewForm building={building} floor={floor} roomItem={room} />
                                ) : (
                                    <p style={{ margin: "10vh auto" }}>Please <a href='/login'>log in </a>to post a review.</p>
                                )}
                            </DialogContent>
                            <DialogActions style={{ padding: '0px', paddingBottom: '25px', paddingLeft: '8px', paddingRight: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }} >
                                <Button
                                    style={{ width: "95%", alignSelf: 'left' }}
                                    variant="outlined"
                                    color="warning"
                                    onClick={handleDialog}>Cancel</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div style={{paddingBottom:'16px'}}>
                        <Divider sx={{ bgcolor: "white" }} />
                    </div>
                    {noReviewsFound ?
                        (
                            <p style={{ width: '100%', color: 'white', display:'flex', flexDirection: 'row', justifyContent:'center', paddingTop:'40px'}}>
                                <b>No reviews found  <SearchOff /></b>
                            </p>

                        ) :
                        (
                            <ReviewList reviews={reviews} />
                        )}
                </div>
            </Grid>
        </Grid>

    );
}

export default Review;
