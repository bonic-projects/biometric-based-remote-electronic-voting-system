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
import BoothCreate from "./pages/booth_create/BoothCreate";
import BoothList from "./pages/booth_view/BoothView";
import ElectionForm from "./pages/start_election/StartElection";
import ElectionList from "./pages/start_election/ElectionView";
import EnrollVoterPage from "./pages/enrol/Enrol";

let theme = createTheme({
  palette: {
    primary: {
      main: "#057dff",
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
                <Route
                  path="/booth_create"
                  element={user ? <BoothCreate /> : <Navigate to="/" />}
                />
                <Route
                  path="/booth_view"
                  element={user ? <BoothList /> : <Navigate to="/" />}
                />
                <Route
                  path="/election"
                  element={user ? <ElectionList /> : <Navigate to="/" />}
                />
                <Route
                  path="/election_create"
                  element={user ? <ElectionForm /> : <Navigate to="/" />}
                />
                <Route
                  path="/enrollment"
                  element={user ? <EnrollVoterPage /> : <Navigate to="/" />}
                />
              </Routes>
            </Layout>
          </BrowserRouter>
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
