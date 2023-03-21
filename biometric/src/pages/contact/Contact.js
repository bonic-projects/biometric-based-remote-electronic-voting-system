import {
  Container,
  Box,
  Button,
  TextField,
  Alert,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useFirestore } from "../../hooks/useFirestore";

export default function Contact() {
  const { addDocument, response } = useFirestore("contacts");
  const save = async (data) => {
    console.log(data);
    await addDocument(data);
    if (response.error) {
      setError(response.error);
    }
    setSnackbarOpen(true);
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "80vh", sm: "80vh", md: "81.2vh" },
        marginTop: "10px",
        paddingBottom: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3" component="h1" color="text.primary">
        Contact us
      </Typography>
      <Typography
        variant="body1"
        component="p"
        color="text.primary"
        align="center"
        sx={{
          maxWidth: "500px",
          padding: "1rem",
        }}
      >
        Fill the below fomr to contact us reagrding
        technical/registration/payment related issues.
      </Typography>
      <Form onSubmit={save} />
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
          {error ? error : "Message send!"}
        </Alert>
      </Snackbar>
    </Container>
  );
}

function Form({ onSubmit }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError(false);
    setEmailError(false);
    setMessageError(false);
    if (name.length < 3) {
      setNameError(true);
      return;
    }
    if (email.length < 7) {
      setEmailError(true);
      return;
    }
    if (message.length < 10) {
      setMessageError(true);
      return;
    }

    onSubmit({ name, email, message });
  };

  return (
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
          minWidth: "270px",
        },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        required
        id="name"
        label="Name"
        type="text"
        value={name}
        error={nameError}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        required
        // fullWidth
        id="email"
        label="Email"
        type="email"
        value={email}
        error={emailError}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Box
        sx={{
          display: "flex",
        }}
      >
        <TextField
          required
          fullWidth
          id="message"
          label="Message"
          type="text"
          multiline
          rows={4}
          value={message}
          error={messageError}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Box>

      <Box
        sx={{
          paddingTop: "2rem",
        }}
      >
        <Button
          variant="contained"
          sx={{
            type: "submit",
            display: "block",
            margin: "0 auto",
            //   marginTop: "20px",
            marginBottom: "20px",
          }}
          onClick={handleSubmit}
        >
          {"Send"}
        </Button>
      </Box>
    </Box>
  );
}
