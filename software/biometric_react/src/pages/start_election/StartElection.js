// import { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
// // import { makeStyles } from "@mui/styles";
// import { Button, Grid, TextField, Typography } from "@mui/material";
// import UserVerification from "../../components/userVerification/UserVerification";

// const ElectionStartPage = () => {

//     const [user, setUser] = useState(null);
//     const [authUser, setAuthUser] = useState(null);
  
//     const setUserVerified = (authUser, user) => {
//       setUser(user);
//       setAuthUser(authUser);
//     };

//   const [electionName, setElectionName] = useState("");
//   const [electionDetails, setElectionDetails] = useState("");
//   const [candidates, setCandidates] = useState([]);
//   const [isActive, setIsActive] = useState(true);

// //   useEffect(() => {
// //     // Fetch list of booths from Firestore
// //     const unsubscribe = collection(db, "booths")
// //       .onSnapshot((snapshot) => {
// //         const data = snapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));
// //         setBooths(data);
// //       });

// //     // Fetch list of ongoing elections from Firestore
// //     const unsubscribe2 = firebase
// //       .firestore()
// //       .collection("elections")
// //       .where("endDate", ">", new Date())
// //       .onSnapshot((snapshot) => {
// //         const data = snapshot.docs.map((doc) => ({
// //           id: doc.id,
// //           ...doc.data(),
// //         }));
// //         setOngoingElections(data);
// //       });

// //     return () => {
// //       unsubscribe();
// //       unsubscribe2();
// //     };
// //   }, []);

// //   const handleStartElection = async () => {
// //     // Create election document in Firestore
// //     const electionRef = await collection("elections").add({
// //       name: electionName,
// //       details: electionDetails,
// //       startDate: new Date(),
// //       endDate: new Date(),
// //     });

// //     // Add booths to the election document
// //     const boothRefs = booths.map((booth) => {
// //       return electionRef.collection("booths").doc(booth.id).set({
// //         name: booth.name,
// //         location: booth.location,
// //       });
// //     });

// //     await Promise.all(boothRefs);

// //     // Navigate to ElectionBoothList page
// //     history.push("/election/booths");
// //   };

// //   const handleDeleteBooth = async (id) => {
// //     // Delete booth document from Firestore
// //     await firebase.firestore().collection("booths").doc(id).delete();
// //   };

//   return (
//     <UserVerification onUser={setUserVerified}>

//       <Typography variant="h4" component="h1" gutterBottom>
//         Start Election
//       </Typography>
//       <Grid container spacing={2}>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             required
//             id="election-name"
//             name="election-name"
//             label="Election Name"
//             fullWidth
//             value={electionName}
//             onChange={(e) => setElectionName(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6}>
//           <TextField
//             required
//             id="election-details"
//             name="election-details"
//             label="Election Details"
//             fullWidth
//             value={electionDetails}
//             onChange={(e) => setElectionDetails(e.target.value)}
//           />
//         </Grid>
//       </Grid>
//       <Typography variant="h5" component="h2" gutterBottom>
//         Select Booths
//       </Typography>
//     </UserVerification>
//   );
// }

// export default ElectionStartPage;


import React, { useState } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControl,
  FormLabel,
} from '@mui/material';

import UserVerification from "../../components/userVerification/UserVerification";

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ElectionForm = () => {
  const [electionName, setElectionName] = useState('');
  const [electionDetails, setElectionDetails] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [isActive, setIsActive] = useState(true);

  const handleNameChange = (event) => {
    setElectionName(event.target.value);
  };

  const handleDetailsChange = (event) => {
    setElectionDetails(event.target.value);
  };

  const handleCandidateChange = (event, index) => {
    const updatedCandidates = [...candidates];
    updatedCandidates[index] = event.target.value;
    setCandidates(updatedCandidates);
  };

  const handleCandidateAdd = () => {
    if (candidates.length < 3) {
      setCandidates([...candidates, '']);
    }
  };

  const handleCandidateRemove = (index) => {
    const updatedCandidates = [...candidates];
    updatedCandidates.splice(index, 1);
    setCandidates(updatedCandidates);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform any necessary form validation or data processing
    console.log({
      electionName,
      electionDetails,
      candidates,
      isActive,
    });


    event.preventDefault();

    // Create a new document object
    const electionData = {
      electionName,
      electionDetails,
      candidates,
      isActive,
    };
  
    try {
      // Add the document to the "elections" collection
      const docRef = await addDoc(collection(db, 'elections'), electionData);
  
      console.log('Document written with ID:', docRef.id);
  
      // Reset the form
      setElectionName('');
      setElectionDetails('');
      setCandidates([]);
      setIsActive(true);
    } catch (error) {
      console.error('Error adding document:', error);
    }


    // Reset the form
    setElectionName('');
    setElectionDetails('');
    setCandidates([]);
    setIsActive(true);
  };

  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const setUserVerified = (authUser, user) => {
    setUser(user);
    setAuthUser(authUser);
  };

  return (
    <UserVerification onUser={setUserVerified}>
    <form onSubmit={handleSubmit}>
      <TextField
        label="Election Name"
        value={electionName}
        onChange={handleNameChange}
        sx={{paddingBottom: "20px",}}
        fullWidth
        required
      />

      <TextField
        label="Election Details"
        value={electionDetails}
        onChange={handleDetailsChange}
        sx={{paddingBottom: "20px",}}
        fullWidth
        required
      />

      <FormControl component="fieldset">
        <FormLabel component="legend"
        sx={{paddingBottom: "20px",}}
        >Candidates</FormLabel>
        <FormGroup>
          {candidates.map((candidate, index) => (
            <div key={index}>
              <TextField
                label={`Candidate ${index + 1}`}
                value={candidate}
                onChange={(event) => handleCandidateChange(event, index)}
                fullWidth
                sx={{paddingBottom: "20px",}}
                required
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleCandidateRemove(index)}
                sx={{marginBottom: "20px",}}
              >
                Remove
              </Button>
            </div>
          ))}
          {candidates.length < 3 && (
            <Button variant="outlined" onClick={handleCandidateAdd}>
              Add Candidate
            </Button>
          )}
          
          <Button type="submit" variant="contained" color="primary"
                sx={{marginTop: "20px",}}
          >
        Submit
      </Button>
        </FormGroup>
      </FormControl>

      {/* <FormControlLabel
        control={
          <Checkbox
            sx={{paddingBottom: "20px", color: "#057dff"}}
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
          />
        }
        label="Active"
      /> */}
    </form>
    </UserVerification>
  );
};

export default ElectionForm;
