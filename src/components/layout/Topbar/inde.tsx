import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AuthContext } from "../../../Auth/AuthProvider";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface Props{
  open: boolean,
  toggleDrawer: (value: boolean) => void;
}
export default function TopBar({toggleDrawer,open}:Props) {
  const { logout } = React.useContext(AuthContext);

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#79c094ff", boxShadow: 3 }}>
      <Toolbar>

        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={() => toggleDrawer(!open)}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          <img src="../logito.png"  width="200px" />
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <AccountCircleIcon />
          <Typography variant="body1">Usuario</Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
            }}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
