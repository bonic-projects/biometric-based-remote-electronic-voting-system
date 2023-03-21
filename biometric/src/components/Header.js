import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {
  Tooltip,
  IconButton,
  Menu,
  Divider,
  MenuItem,
  ListItemIcon,
  Box,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
// import Alert  from "@mui/material/Alert";
import { useState, Fragment } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogin } from "../hooks/useLogin";
import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
// import Hidden from "@mui/material/Hidden";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

// const navigationLinks = [
//   { name: "Home", href: "/" },
//   { name: "Codeit", href: "/codeit" },
//   { name: "About us", href: "/about" },
//   { name: "Contact us", href: "/contact" },
// ];

export default function Header() {
  // const [open, setOpen] = useState(false);

  // const location = useLocation();
  // const path = location.pathname;
  // const navigate = useNavigate();
  const { user } = useAuthContext();
  const { login } = useLogin();

  return (
    <AppBar
      // elevation={0}
      color="primary"
      sx={{
        background: "transparent",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          // sx={{
          //   height: 80,
          //   display: "flex",
          // }}
        >
          <Logo />
          {!user && (
            <Button
              variant="contained"
              // color="secondary"
              onClick={login}
              // disabled={isPending}
            >
              Login
              {/* {isPending ? "Loading.." : "Login"} */}
            </Button>
          )}
          {user && <AccountMenu user={user} />}
          {/* <Hidden mdDown>
            {navigationLinks.map((link) => (
              <NavLink
                key={link.href}
                link={link.href}
                name={link.name}
                path={path}
              />
            ))}
          </Hidden>
          <Hidden mdUp>
            <IconButton onClick={() => setOpen(true)}>
              <MenuIcon color="primary" />
            </IconButton>
          </Hidden> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

function Logo() {
  const navigate = useNavigate();
  return (
    <Box
      component="img"
      alt="Robovation logo"
      src={require("../assets/images/logo/logo.png")}
      // maxHeight="50vh"

      sx={{
        maxWidth: { xs: "40px", sm: "40px", md: "45px" },
        marginRight: "auto",
        cursor: "pointer",
      }}
      onClick={() => navigate("/")}
      // sx={{
      //   display: "block",
      //   margin: "0 auto",
      // }}
    />
  );
}

// export function NavLink({ name, link, path, isFooter, isSmall }) {
//   const navigate = useNavigate();
//   return (
//     <Typography
//       onClick={() => navigate(link)}
//       color={isFooter ? "secondary" : "text.primary"}
//       align={isFooter ? (isSmall ? "left" : "right") : "center"}
//       variant="h6"
//       sx={{
//         marginLeft: 4,
//         cursor: "pointer",
//         fontSize: "16px",
//         fontWeight: "regular",
//         textAlign: "bottom",
//         borderBottom: path === link ? "3px solid black" : "none",
//         ":hover": {
//           borderBottom: !isFooter
//             ? (theme) => `3px solid ${theme.palette.text.main}`
//             : "none",
//         },
//       }}
//     >
//       {name}
//     </Typography>
//   );
// }

function AccountMenu({ user }) {
  const navigate = useNavigate();
  const { logout, logoutIsPending } = useLogout();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Tooltip title="Account">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar alt={user.displayName} src={user.photoURL} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            padding: "14px",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 60,
              height: 60,
              margin: "0 auto",
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Avatar
          alt={user.displayName}
          src={user.photoURL}
          sx={{
            width: "100px",
            height: "100px",
          }}
        />

        <Typography
          variant="h6"
          color="text.primary"
          fontWeight="500"
          textAlign="center"
          sx={{
            paddingTop: "0.5rem",
          }}
        >
          {user.displayName}
        </Typography>

        <Typography variant="p" color="text.primary" textAlign="center">
          {user.email}
        </Typography>

        <Divider
          sx={{
            paddingTop: "1rem",
          }}
        />

        <MenuItem
          onClick={() => {
            navigate("/settings");
          }}
          sx={{
            marginTop: "8px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ListItemIcon
            sx={{
              color: "text.primary",
              marginRight: -1,
            }}
          >
            <Settings />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />
        <Box height={8} />

        <Button
          variant="contained"
          onClick={logout}
          disabled={logoutIsPending}
          sx={{
            margin: "0 auto",
            display: "block",
            // width: "100%",
          }}
        >
          Logout
        </Button>
      </Menu>
    </Fragment>
  );
}
