import Header from "./Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      <Box id="back-to-top-anchor" />
      <Box
        // maxWidth="lg"
        sx={{
          backgroundImage: `url(${require("../assets/images/background/background.jpg")})`,
          backgroundSize: "cover",
          // backgroundAttachment: "center",
          backgroundPosition: "center",
          paddingTop: "70px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "& .Mui-focused": {
            borderColor: "white",
          },
        }}
      >
        {children}
      </Box>
      <Footer />
    </div>
  );
}
