import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// import { makeStyles } from "@mui/styles";
import { Button, Grid, TextField, Typography } from "@mui/material";
import UserVerification from "../../components/userVerification/UserVerification";

// const useStyles = makeStyles({
//   root: {
//     padding: "20px",
//   },
// });

const ElectionStartPage = () => {

    const [user, setUser] = useState(null);
    const [authUser, setAuthUser] = useState(null);
  
    const setUserVerified = (authUser, user) => {
      setUser(user);
      setAuthUser(authUser);
    };

  const [electionName, setElectionName] = useState("");
  const [electionDetails, setElectionDetails] = useState("");
  const [booths, setBooths] = useState([]);
  const [ongoingElections, setOngoingElections] = useState([]);

//   useEffect(() => {
//     // Fetch list of booths from Firestore
//     const unsubscribe = collection(db, "booths")
//       .onSnapshot((snapshot) => {
//         const data = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setBooths(data);
//       });

//     // Fetch list of ongoing elections from Firestore
//     const unsubscribe2 = firebase
//       .firestore()
//       .collection("elections")
//       .where("endDate", ">", new Date())
//       .onSnapshot((snapshot) => {
//         const data = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setOngoingElections(data);
//       });

//     return () => {
//       unsubscribe();
//       unsubscribe2();
//     };
//   }, []);

//   const handleStartElection = async () => {
//     // Create election document in Firestore
//     const electionRef = await collection("elections").add({
//       name: electionName,
//       details: electionDetails,
//       startDate: new Date(),
//       endDate: new Date(),
//     });

//     // Add booths to the election document
//     const boothRefs = booths.map((booth) => {
//       return electionRef.collection("booths").doc(booth.id).set({
//         name: booth.name,
//         location: booth.location,
//       });
//     });

//     await Promise.all(boothRefs);

//     // Navigate to ElectionBoothList page
//     history.push("/election/booths");
//   };

//   const handleDeleteBooth = async (id) => {
//     // Delete booth document from Firestore
//     await firebase.firestore().collection("booths").doc(id).delete();
//   };

  return (
    <UserVerification onUser={setUserVerified}>

      <Typography variant="h4" component="h1" gutterBottom>
        Start Election
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="election-name"
            name="election-name"
            label="Election Name"
            fullWidth
            value={electionName}
            onChange={(e) => setElectionName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="election-details"
            name="election-details"
            label="Election Details"
            fullWidth
            value={electionDetails}
            onChange={(e) => setElectionDetails(e.target.value)}
          />
        </Grid>
      </Grid>
      <Typography variant="h5" component="h2" gutterBottom>
        Select Booths
      </Typography>
    </UserVerification>
  );
}

export default ElectionStartPage;
