import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <footer>
      <Box bgcolor="black" pt={{ xs: 3, sm: 3 }} pb={{ xs: 2, sm: 2 }}>
        <Container
          maxWidth="lg"
          sx={{
            display: isSmall ? "grid" : "flex",
            // alignItems: "space-between",

            justifyContent: isSmall ? "center" : "space-between",
          }}
        >
          <Typography
            variant="body"
            color="white"
            align={isSmall ? "center" : "left"}
            gutterBottom
            // sx={{ fontWeight: "600" }}
          >
            Made with 🤍
          </Typography>
          {/* <Typography
            variant="body2"
            color="white"
            align={"center"}
            gutterBottom
            // sx={{ fontWeight: "600" }}
          >
            <a
              style={{ color: "white" }}
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                navigate("/contact");
              }}
            >
              Contact us
            </a>
          </Typography> */}
          <Typography
            variant="body"
            color="white"
            align={isSmall ? "center" : "right"}
            gutterBottom
          >
            By Muhammed Azhar
          </Typography>
        </Container>
      </Box>
    </footer>
  );
}
