import { Container, Box, Button, Alert, LinearProgress } from "@mui/material";
// import Edit from "@mui/icons-material/Edit";

// functions
import { useEffect } from "react";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

export default function UserVerification({ onUser, children }) {
  const { user: authUser } = useAuthContext();
  const { document: user, error } = useDocument("users", authUser.uid);
  const { logout, logoutIsPending } = useLogout();

  useEffect(() => {
    if (user) {
      onUser(authUser, user);
    }
  }, [user, authUser, onUser]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "80vh", sm: "80vh", md: "81.2vh" },
        // marginTop: "10px",
        // marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        {(logoutIsPending || (!user && !error)) && (
          <LinearProgress
            sx={{
              position: "absolute",
              top: { xs: "56px", sm: "64px", md: "64px" },
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          />
        )}
        {error && (
          <Alert severity="error">
            {error === "No such document exists"
              ? "Not registered yet, please register now to continue."
              : error}
          </Alert>
        )}

        {error === "No such document exists" && (
          <>
            <Box height={18} />

            <Button
              variant="contained"
              onClick={logout}
              disabled={logoutIsPending}
              sx={{
                margin: "0 auto",
                display: "block",
                // width: "100%",
              }}
            >
              Register now
            </Button>
          </>
        )}

        {user && !error && children}
      </Box>
    </Container>
  );
}
