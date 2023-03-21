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

// components
import DropShadowBox from "../../components/DropShadowBox";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  const setUserVerified = (authUser, user) => {
    setUser(user);
    setAuthUser(authUser);
  };

  return (
    <UserVerification onUser={setUserVerified}>
      {user && (
        <DropShadowBox marginTop="0px">
          <Typography variant="h6">Welcome {user.name}</Typography>
        </DropShadowBox>
      )}
      <Box
        component="img"
        alt="ABFS Device"
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
  const { value: scannerDetail, error } = useDatabase(
    "biometricScanners",
    scanner.uid
  );

  const { value: scannerAttendance, error2 } = useDatabase(
    "attendance",
    scanner.uid
  );

  console.log(scannerAttendance);

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (scannerDetail) {
      if (
        (Math.floor(new Date().getTime()) - scannerDetail.lastSeen) /
          1000 /
          60 <
        1
      )
        setIsOnline(true);
      else setIsOnline(false);
    }
  }, [scannerDetail]);

  return (
    <DropShadowBox>
      {!scannerDetail && !error && <Typography>Loading...</Typography>}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Device {index + 1}</Typography>
        {scannerDetail && (
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
      {scannerDetail && (
        <>
          <Typography variant="body2">
            Status: {scannerDetail.status}
          </Typography>
          <Typography variant="body2">
            LastSeen: {new Date(scannerDetail.lastSeen).toLocaleDateString()}
            {", "} {new Date(scannerDetail.lastSeen).toLocaleTimeString()}
          </Typography>
        </>
      )}

      {scannerAttendance && (
        <DropShadowBox>
          <Typography variant="h6">Attendance</Typography>
          <Typography variant="body1">
            User: {scannerDetail.data[scannerAttendance.id]}
          </Typography>
          <Typography variant="body2">
            Time: {new Date(scannerAttendance.time).toLocaleDateString()} {", "}
            {new Date(scannerAttendance.time).toLocaleTimeString()}
          </Typography>
        </DropShadowBox>
      )}
    </DropShadowBox>
  );
}
