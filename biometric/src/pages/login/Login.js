import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: { xs: "80vh", sm: "80vh", md: "81.2vh" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <Box
          component="img"
          alt="Device"
          src={require("../../assets/images/login/bio.png")}
          maxHeight="50vh"
          maxWidth="90vw"
          sx={{
            display: "block",
            margin: "0 auto",
            paddingBottom: "50px",
          }}
        />
        <Typography
          color="text.primary"
          variant="h5"
          component="h1"
          textAlign={["center"]}
        >
          ABFS
        </Typography>
        <Typography
          color="text.primary"
          variant="h5"
          component="h1"
          textAlign={["center"]}
        >
          Advanced Biometric Fingerprint Scanner
        </Typography>
        <Typography
          color="text.primary"
          variant="p"
          component="p"
          textAlign={["center"]}
          sx={{
            display: "block",
            margin: "0 auto",
            maxWidth: { xs: "300px", sm: "400px", md: "500px" },
          }}
        >
          To use the device click below button and register
        </Typography>
        {/* <Typography
          color="text.primary"
          variant="h5"
          component="h1"
          textAlign={["center"]}
        >
          449₹ only!
        </Typography> */}
        <Button
          variant="contained"
          sx={{
            display: "block",
            margin: "0 auto",
            marginTop: "20px",
            marginBottom: "20px",
          }}
          onClick={() => navigate("/register")}
        >
          Register now
        </Button>
      </Box>
    </Container>
  );
}
