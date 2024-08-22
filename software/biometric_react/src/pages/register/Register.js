import {
  Container,
  Box,
  Typography,
  Alert,
  LinearProgress,
} from "@mui/material";
import { useState } from "react";
import { useSignup } from "../../hooks/useSignup";
import { useNavigate } from "react-router-dom";

// components
import InstitutionSelector from "../../components/InstitutionSelector";
import UserForm from "../../components/UserForm";

export default function Register() {
  const [institution, setInstitution] = useState(null);
  const { signup, isPending, error } = useSignup();

  const selectInstitution = (value) => {
    setInstitution(value);
  };

  const submit = (value) => {
    signup({
      ...value,
      institution: institution,
    });
  };

  const back = () => {
    setInstitution(null);
  };

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
        {!institution && <InstitutionSelector selection={selectInstitution} />}

        {institution && (
          <UserDetails back={back} onSubmit={submit} type={institution.type} />
        )}

        {institution && error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: "2rem",
            }}
          >
            {error}
          </Alert>
        )}
        {institution && isPending && (
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
      </Box>
    </Container>
  );
}

function UserDetails({ back, onSubmit, type }) {
  const navigate = useNavigate();
  return (
    <>
      <Typography
        color="text.primary"
        variant="h5"
        component="h1"
        textAlign={["center"]}
      >
        Personal details
      </Typography>
      <Typography
        color="text.primary"
        variant="p"
        component="p"
        textAlign={["center"]}
        sx={{
          maxWidth: "500px",
          paddingBottom: "1rem",
        }}
      >
        {/* Please fill the form and complete registration using your google account.  */}
        Fille the form and complete registration using your google account.
      </Typography>
      {/* <Typography
        textAlign={["center"]}
        sx={{ mb: 1.5 }}
        color="text.secondary"
        variant="body2"
      >
        Agree to the{" "}
        <a
          href="/terms"
          onClick={(e) => {
            e.preventDefault();
            navigate("/terms");
          }}
        >
          terms and conditions.
        </a>
      </Typography> */}
      <UserForm
        back={back}
        onSubmit={onSubmit}
        buttonText="Register"
        type={type}
      />
    </>
  );
}
