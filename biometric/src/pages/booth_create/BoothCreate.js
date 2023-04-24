import { useState } from 'react';
import { TextField, Button, Box, Snackbar , Alert } from '@mui/material';
import { db } from '../../firebase/config';
import { collection, addDoc, GeoPoint  } from 'firebase/firestore';
// import GoogleMapReact from 'google-map-react';
import UserVerification from "../../components/userVerification/UserVerification";
import { GeoFirestore } from "geofirestore";

const BoothCreationForm = () => {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const setUserVerified = (authUser, user) => {
    setUser(user);
    setAuthUser(authUser);
  };


  const [name, setName] = useState('');
  const [place, setPlace] = useState('Thammanam');
  const [latitude, setLatitude] = useState('9.989742616586135');
  const [longitude, setLongitude] = useState('76.31741350881452');


  // const handleMapClick = (event) => {
  //   // Set latitude and longitude based on map click event
  //   console.log(event);
  //   setLatitude(event.latLng.lat());
  //   setLongitude(event.latLng.lng());
  // };

  const handleCreateBooth = async () => {
    setLoading(true);
    
    await createBooth({
      name,
      place,
      location: new GeoPoint(latitude, longitude),
    });
    setLoading(false);
    setSnackbarOpen(true);
  };

  const createBooth = async (boothData) => {
    try {
      const boothRef = await addDoc(collection(db, "booths"), boothData);
      console.log("Booth document created with ID: ", boothRef.id);

      // Add the booth location to the GeoFirestore index
      // const geofirestore = new GeoFirestore(db);
      // const geocollection = geofirestore.collection("booths");
      // geocollection.doc(boothRef.id).set({
      //   coordinates: new GeoPoint(latitude, longitude),
      // });
      
      return boothRef.id;
    } catch (error) {
      console.error("Error creating booth document: ", error);
      setError("Error");
      return null;
    }
  };

  //===================================================
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <UserVerification onUser={setUserVerified}>
          <Box
      component="form"
      sx={{
        maxWidth: "100vw",
        // onSubmit: handleSubmit,
        "& .MuiTextField-root": {
          display: "flex",
          margin: "0 auto",
          paddingBottom: 1,
          paddingRight: 1,
          //   p: 1,
        },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Place" value={place} onChange={(e) => setPlace(e.target.value)} />
      <TextField label="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
      <TextField label="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
      <Button variant="contained" onClick={!loading ? handleCreateBooth : null}>Create Booth</Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={error ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {error ? error : "Created!"}
        </Alert>
      </Snackbar>

      {/* <div style={{ height: '400px', width: '100%' }}>
        <GoogleMapReact
        // defaultCenter={}
        defaultCenter={[9.989742616586135, 76.31741350881452]}
          bootstrapURLKeys={{ key: "AIzaSyAPx0rFDx0etUZDGOmzWcSJLciU2L1Qt1Q" }}
          center={[latitude, longitude]}
          defaultZoom={12}
          onClick={handleMapClick}
        >
          <Marker lat={latitude} lng={longitude} />
        </GoogleMapReact>
      </div> */}
      </Box>
    </UserVerification>
  );
};

// const Marker = () => <div style={{ color: 'red', fontSize: '24px' }}>📍</div>;

export default BoothCreationForm;
