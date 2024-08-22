import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  LinearProgress,
  TextField,
  // Paper,
  // Avatar,
  // Dialog,
  // DialogContent,
  // TextField,
  // Select,
  // DialogTitle,
  // DialogContentText,
  // DialogActions,
  // MenuItem,
  Snackbar,
  // IconButton,
  // Card,
  // CardMedia,
  CardContent,
  // CardActions,
} from "@mui/material";
// import Edit from "@mui/icons-material/Edit";

// functions
import { useEffect, useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { useFirestore } from "../../hooks/useFirestore";
import { increment, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import UserVerification from "../../components/userVerification/UserVerification";
import { useDatabase } from "../../hooks/useDatabase";
import { useNavigate } from "react-router-dom";

// components
import DropShadowBox from "../../components/DropShadowBox";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const setUserVerified = (authUser, user) => {
    setUser(user);
    setAuthUser(authUser);
  };

  const navigate = useNavigate();

  return (
    <UserVerification onUser={setUserVerified}>
      {user && (
        <DropShadowBox marginTop="0px">
          <Typography variant="h6">Welcome {user.name}</Typography>
        </DropShadowBox>
      )}
      <Box
        component="img"
        alt="Voting Device"
        src={require("../../assets/images/home/device.png")}
        maxHeight="50vh"
        maxWidth="90vw"
        sx={{
          display: "block",
          margin: "0 auto",
          paddingBottom: "50px",
        }}
      />
      {user && <BiometricScanners user={user} />}
    </UserVerification>
  );
}

function BiometricScanners({ user }) {
  const query = ["admins", "array-contains", user.email];
  const { error, documents: scanners } = useCollection(
    "biometricScanners",
    query
  );
  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}

      {scanners && (
        <>
          {scanners.map((scanner, index) => (
            <ScannerDetail key={scanner.uid} scanner={scanner} index={index} />
          ))}
        </>
      )}
    </div>
  );
}

function ScannerDetail({ scanner, index }) {
  const { value: reading, error } = useDatabase(
    `devices/${scanner.uid}/reading`,
  );

  const { value: scannerData, error2 } = useDatabase(
    `devices/${scanner.uid}/data`,
  );

  console.log(`devices/${scanner.uid}/reading`);

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (reading) {
      if (
        (Math.floor(new Date().getTime()) - reading.ts) /
          1000 /
          60 <
        1
      )
        setIsOnline(true);
      else setIsOnline(false);
    }
  }, [reading]);

  return (
    <DropShadowBox>
      {!reading && !error && <Typography>Loading...</Typography>}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Device {index + 1}</Typography>
        {reading && (
          <DropShadowBox padding="2px 6px 2px 6px" marginTop="0px">
            <Typography
              variant="body2"
              sx={{ color: isOnline ? "green" : "red" }}
            >
              {isOnline ? "Online" : "Offline"}
            </Typography>
          </DropShadowBox>
        )}
      </Box>
      <Typography variant="body2">ID: {scanner.email}</Typography>
      {error || (error2 && <Alert severity="error">{error ?? error2}</Alert>)}
      {reading && (
        <>
         <Typography variant="body2">
            Total fingeres: {reading.fingerCount}
          </Typography>
          <Typography variant="body2">
            Last finger id: {reading.fingerID}
          </Typography>
          <Typography variant="body2">
            Last finger confidenece: {reading.confidenece}
          </Typography>
          <Typography variant="body2">
            Last selected key: {reading.keyIn}
          </Typography>
          <Typography variant="body2">
            Enrollment status code: {reading.enrolStatus}
          </Typography>
          <Typography variant="body2">
            LastSeen: {new Date(reading.ts).toLocaleDateString()}
            {", "} {new Date(reading.ts).toLocaleTimeString()}
          </Typography>
        </>
      )}

      {scannerData && (
        <DropShadowBox>
          <Typography variant="h6">Data</Typography>
          <Typography variant="body1">
            Current mode: {scannerData.isEnrollment ? "Enrollment" : "Scanning"}
          </Typography>
          <Typography variant="body1">
            Last enroller ID: {scannerData.fingerIdIn}
          </Typography>
          {/* <Typography variant="body2">
            Time: {new Date(scannerData.time).toLocaleDateString()} {", "}
            {new Date(scannerData.time).toLocaleTimeString()}
          </Typography> */}
        </DropShadowBox>
      )}
    </DropShadowBox>
  );
}
