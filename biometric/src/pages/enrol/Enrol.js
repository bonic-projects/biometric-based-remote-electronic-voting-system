import React, { useState } from 'react';
import { TextField, Button, Snackbar, Alert } from '@mui/material';
import { collection, doc, setDoc } from 'firebase/firestore';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth, rtdb} from '../../firebase/config'; // Assuming you have initialized your Firebase app and obtained the Firestore and Auth instances
import UserVerification from "../../components/userVerification/UserVerification";
import { ref, set } from 'firebase/database';
import { useDatabase } from "../../hooks/useDatabase";

const EnrollVoterPage = () => {
  const { value: reading, error: error2 } = useDatabase(
    `devices/7Q2IRfpyFUXS492bCmvdwe0gxBW2/reading`,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handleEnrollVoter = async (event) => {
    event.preventDefault();

    if(reading.enrolStatus != 1)  {
      setError("Finger not enrolled correctly!");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Create a new user with email and password
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Create a new document object
      const voterData = {
        email,
        name,
        userId: parseInt(userId),
        userRole: 'voter',
        uid: user.uid,
      };

      // Add the document to the "users" collection in Firestore
      const refFb = doc(db, "users", user.uid);
      await setDoc(
        refFb,
        voterData,
        { merge: true }
      );

      const data = {
        isEnrollment: false,
        fingerIdIn: 0,
      };
      data["line1"] = `User ${name} enrld`
      set(ref(rtdb, 'devices/7Q2IRfpyFUXS492bCmvdwe0gxBW2/data/'), data);


      setError(null);
      setSnackbarOpen(true);

      // Reset the form
      setEmail('');
      setPassword('');
      setName('');
      setUserId('');
    } catch (error) {
      console.error('Error enrolling voter:', error);
      setError(`Error: ${error}`);
      setSnackbarOpen(true);
    }
  };

  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const setUserVerified = (authUser, user) => {
    setUser(user);
    setAuthUser(authUser);
  };

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
    setError(null);
    setSuccess(null)
  };

  const handleUpdateDevice = () => {
    const data = {
      isEnrollment: true,
      fingerIdIn: parseInt(userId),
    };
  
    try {
      set(ref(rtdb, 'devices/7Q2IRfpyFUXS492bCmvdwe0gxBW2/data/'), data);
      setSuccess("Device updates");
      setError(null);
      setSnackbarOpen(true);
    } catch (e) {
      console.error('Update error:', e);
      setError(`Error: ${e}`);
      setSnackbarOpen(true);
    }

  };

  return (
    <UserVerification onUser={setUserVerified}>
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
          {error ? error : success ? success : "Created!"}
        </Alert>
      </Snackbar>

    <form onSubmit={handleEnrollVoter}>
      <TextField
        label="Email"
        value={email}
        onChange={handleEmailChange}
        fullWidth
        require
        sx={{marginBottom: "20px",}}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        fullWidth
        required
        sx={{marginBottom: "20px",}}
      />

      <TextField
        label="Name"
        value={name}
        onChange={handleNameChange}
        fullWidth
        required
        sx={{marginBottom: "20px",}}
      />

      <TextField
        label="User ID"
        value={userId}
        onChange={handleUserIdChange}
        fullWidth
        required
        sx={{marginBottom: "20px",}}
      />

      <Button type="submit" variant="contained" color="primary">
        Enroll Voter
      </Button>
    </form>

    <Button onClick={handleUpdateDevice} variant="outlined" size="small"
        sx={{marginTop: "20px",}}
    >
        Set to enrolment mode and update enrol ID#{userId}
      </Button>
      
    </UserVerification>
  );
};

export default EnrollVoterPage;
