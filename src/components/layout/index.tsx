import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./Topbar/inde";
import DrawerMenu from "./Drawer/Index";
import { Box } from "@mui/material";

const APP_BAR_HEIGHT = 64;
const DRAWER_WIDTH = 250;

export default function Layout() {
  const [open, setOpen] = React.useState<boolean>(false);

  const toggleDrawer = (value: boolean) => {
    setOpen(value);
  };
//"#eeeeeec4"
  return (
    <>
      <TopBar open={open} toggleDrawer={toggleDrawer} />

      <DrawerMenu open={open} toggleDrawer={toggleDrawer} />

     <Box
        component="main"
        sx={{
          mt: `${APP_BAR_HEIGHT}px`,
          ml: open ? `${DRAWER_WIDTH}px` : 0,
          minHeight: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          p: 3,
          bgcolor: "#fafafaef",
          transition: "margin-left 0.3s ease",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1500, mt:5 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}
