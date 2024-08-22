import { Typography, Alert, Snackbar } from "@mui/material";

// functions
import { useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { updateProfile } from "firebase/auth";
//Components
import UserVerification from "../../components/userVerification/UserVerification";
import UserForm from "../../components/UserForm";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const setUserVerified = (authUser, user) => {
    setUser(user);
    setAuthUser(authUser);
  };

  const [loading, setLoading] = useState(false);

  const { updateDocument: updateUser, response: userResponse } =
    useFirestore("users");

  const updateDb = async (userDetails) => {
    setLoading(true);

    await updateUser(user.uid, {
      ...userDetails,
    });

    await updateProfile(authUser, { displayName: userDetails.name });

    setLoading(false);
    if (userResponse.error) {
      setError(userResponse.error);
    }

    setSnackbarOpen(true);
  };

  //====================================================

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
      <Typography
        variant="h4"
        align="center"
        sx={{
          padding: "20px",
        }}
      >
        Update profile
      </Typography>

      {user && (
        <UserForm
          user={user}
          onSubmit={!loading ? updateDb : null}
          buttonText={loading ? "Loading.." : "Save profile"}
        />
      )}
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
          {error ? error : "Completed!"}
        </Alert>
      </Snackbar>
    </UserVerification>
  );
}
