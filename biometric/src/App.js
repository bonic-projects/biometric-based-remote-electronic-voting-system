import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// components
import Layout from "./components/Layout";

// pages
import HomePage from "./pages/home/HomePage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Settings from "./pages/settings/Settings";
import Contact from "./pages/contact/Contact";
import Admin from "./pages/admin/Admin";

let theme = createTheme({
  palette: {
    primary: {
      main: "#212d3a",
    },
    secondary: {
      main: "#0090e9",
    },
    background: {
      default: "#FFF",
      // paper: "#009DEB10",
      paper: "#212d3a",
    },
    text: {
      primary: "#FFF",
      secondary: "#FFF",
    },
  },
  typography: {
    fontFamily: "Poppins",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

//Responsive font sizing
theme = responsiveFontSizes(theme);

function App() {
  const { authIsReady, user } = useAuthContext();

  return (
    <div>
      <ThemeProvider theme={theme}>
        {authIsReady && (
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route
                  path="/"
                  element={user ? <HomePage /> : <Navigate to="/login" />}
                />
                <Route
                  path="/login"
                  element={!user ? <Login /> : <Navigate to="/" />}
                />
                <Route
                  path="/register"
                  element={!user ? <Register /> : <Navigate to="/" />}
                />
                <Route
                  path="/settings"
                  element={user ? <Settings /> : <Navigate to="/" />}
                />
                <Route
                  path="/admin"
                  element={user ? <Admin /> : <Navigate to="/" />}
                />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
