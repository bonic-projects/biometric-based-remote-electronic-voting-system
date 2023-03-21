import {
  Container,
  Box,
  Avatar,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Paid from "@mui/icons-material/Paid";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

import { useEffect, useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useDocument } from "../../hooks/useDocument";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { increment } from "firebase/firestore";
import DropShadowBox from "../../components/DropShadowBox";

export default function Admin() {
  const { user: authUser } = useAuthContext();
  const { document: user, error: userError } = useDocument(
    "users",
    authUser.uid
  );
  const { documents, error: usersError } = useCollection("users");

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "80vh", sm: "80vh", md: "81.2vh" },
        marginTop: "10px",
        // marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        {(userError || usersError) && (
          <Alert
            severity="error"
            sx={{
              marginBottom: "2rem",
            }}
          >
            {userError || usersError}
          </Alert>
        )}
        {!documents && (
          <LinearProgress
            sx={{
              position: "absolute",
              top: { xs: "58px", sm: "64px", md: "64px" },
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          />
        )}

        {/* <DropShadowBox
          padding="10px"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        > */}
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "text.secondary",
            marginBottom: "1rem",
          }}
        >
          All users
        </Typography>
        {/* <Typography
            variant="h6"
            align="center"
            sx={{
              color: "text.secondary",
              marginBottom: "1rem",
            }}
          >
            Count: 0
          </Typography> */}
        {/* </DropShadowBox> */}

        {documents && (
          <List dense={false}>
            {documents.map((document) => (
              <DropShadowBox padding="2px" key={document.uid}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box display="flex">
                      {/* <IconButton
                        aria-label="comment"
                        onClick={() => {
                          window.open(
                            `https://wa.me/91${document.phone}?text=https://chat.whatsapp.com/DmeTeEgjwUHExmVAXvWvYA`,
                            "_blank"
                          );
                        }}
                      >
                        <WhatsAppIcon
                          sx={{
                            color: "white",
                          }}
                        />
                      </IconButton> */}
                      {/* {registrations && (
                        <PaymentMade
                          user={user}
                          participant={document}
                          registrations={registrations}
                          event={event}
                        />
                      )} */}
                    </Box>
                  }
                >
                  <ListItemIcon>
                    <Avatar
                      alt={document.displayName}
                      src={document.photoURL}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={document.name}
                    secondary={
                      <Box
                        component={"span"}
                        sx={{
                          display: "flex",
                          // alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {document.phone}
                        </Typography>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {document.department}
                          {" - "}
                          {document.year} year
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>

                {/* <Divider
                  variant="inset"
                  component="li"
                  sx={{
                    backgroundColor: "#D9FFFFFF",
                  }}
                /> */}
              </DropShadowBox>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

// function PaymentMade({ participant, registrations, user, event }) {
//   const [paymentMade, setPaymentMade] = useState(false);
//   const [registration, setRegistration] = useState(null);

//   useEffect(() => {
//     registrations.forEach((registration) => {
//       if (registration.email === participant.email) {
//         setRegistration(registration);
//         setPaymentMade(true);
//       }
//     });
//   }, [participant, registrations]);

//   const [isCoordinator, setIsCoordinator] = useState(false);
//   const [isCoordinatorParticipant, setIsCoordinatorParticipant] =
//     useState(false);

//   useEffect(() => {
//     if (event && event.coordinators.indexOf(user.email) > -1) {
//       setIsCoordinator(true);
//     }
//     if (event && event.coordinators.indexOf(participant.email) > -1) {
//       setIsCoordinatorParticipant(true);
//     }
//   }, [event, user, participant]);

//   // dialoge
//   const [open, setOpen] = useState(false);

//   const handleClickOpen = () => {
//     if (isCoordinator) setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   //delete regisration
//   const [loading, setLoading] = useState(false);

//   const [isCancelled, setIsCancelled] = useState(false);

//   const { updateDocument: updateUser, response: userResponse } =
//     useFirestore("users");
//   const { updateDocument: updateEvent, response: eventResponse } =
//     useFirestore("events");
//   const {
//     deleteDocument: deleteEventRegistration,
//     response: eventRegistrationResponse,
//   } = useFirestore(`events/${event.id}/registrations`);

//   const {
//     updateDocument: updateEventRegistration,
//     response: updateRegistrationResponse,
//   } = useFirestore(`events/${event.id}/registrations`);

//   // function
//   const cancelRegistration = async () => {
//     setLoading(true);
//     await deleteEventRegistration(participant.email);
//     await updateEvent(event.id, {
//       verifiedRegCount: increment(-1),
//     });
//     await updateUser(participant.uid, {
//       isMember: false,
//       membershipPeriod: null,
//       activeEvents: null,
//     });
//     setLoading(false);

//     if (
//       userResponse.error ||
//       eventResponse.error ||
//       eventRegistrationResponse.error
//       // || orderResponse.error
//     ) {
//       setError(
//         userResponse.error ??
//           eventResponse.error ??
//           eventRegistrationResponse.error
//         //  ?? orderResponse.error
//       );
//     }

//     handleClose();
//     setSnackbarOpen(true);
//     setIsCancelled(true);
//   };

//   const enrollParticipant = async () => {
//     setLoading(true);
//     await updateEventRegistration(participant.email, {
//       isParticipant: true,
//       enrollParticipantOn: new Date(),
//     });
//     await updateEvent(event.id, {
//       participants: increment(1),
//     });
//     await updateUser(participant.uid, {
//       participations: increment(1),
//       events: increment(1),
//     });
//     setLoading(false);

//     if (
//       userResponse.error ||
//       eventResponse.error ||
//       eventRegistrationResponse.error ||
//       updateRegistrationResponse.error
//     ) {
//       setError(
//         userResponse.error ??
//           eventResponse.error ??
//           eventRegistrationResponse.error ??
//           updateRegistrationResponse.error
//       );
//     }

//     handleClose();
//     setSnackbarOpen(true);
//     setIsCancelled(true);
//   };

//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSnackbarClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }

//     setSnackbarOpen(false);
//   };

//   return (
//     <>
//       {paymentMade &&
//         !isCancelled &&
//         !(registration && registration.isParticipant) && (
//           <IconButton aria-label="comment" onClick={handleClickOpen}>
//             <Paid
//               sx={{
//                 color: "green",
//               }}
//             />
//           </IconButton>
//         )}

//       {registration && registration.isParticipant && (
//         <CheckCircleOutlineIcon
//           sx={{
//             margin: "0.5rem",
//             color: "red",
//           }}
//         />
//       )}

//       {isCoordinatorParticipant && (
//         <VerifiedUserIcon
//           sx={{
//             margin: "0.5rem",
//             color: "green",
//           }}
//         />
//       )}

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Payment details</DialogTitle>
//         <DialogContent>
//           {registration && (
//             <>
//               <DialogContentText>
//                 Registration ID: {registration.regId}
//               </DialogContentText>
//               <DialogContentText>
//                 Transacton ID: {registration.txnId}
//               </DialogContentText>
//               <Button
//                 variant="contained"
//                 onClick={cancelRegistration}
//                 disabled={loading}
//                 sx={{
//                   backgroundColor: "white",
//                   color: "black",
//                   "&:hover": {
//                     backgroundColor: "black",
//                     color: "white",
//                   },
//                   // margin: "0 auto",
//                   marginTop: "1rem",
//                   display: "flex",
//                   // width: "100%",
//                 }}
//               >
//                 {loading ? "Loading.." : "Cancel registration"}
//               </Button>

//               <Button
//                 variant="contained"
//                 onClick={enrollParticipant}
//                 disabled={loading}
//                 sx={{
//                   backgroundColor: "white",
//                   color: "black",
//                   "&:hover": {
//                     backgroundColor: "black",
//                     color: "white",
//                   },
//                   // margin: "0 auto",
//                   marginTop: "1rem",
//                   display: "flex",
//                   // width: "100%",
//                 }}
//               >
//                 {loading ? "Loading.." : "Enroll participant"}
//               </Button>
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={handleClose}
//             sx={{
//               color: "white",
//             }}
//           >
//             Cancel
//           </Button>
//           {/* <Button
//             // disabled={userResponse.isPending || hostelResponse.isPending}
//             onClick={save}
//             sx={{
//               color: "white",
//             }}
//           >
//             Enroll
//           </Button> */}
//         </DialogActions>
//       </Dialog>
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={3000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={error ? "error" : "success"}
//           sx={{ width: "100%" }}
//         >
//           {error ? error : "Completed!"}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }
