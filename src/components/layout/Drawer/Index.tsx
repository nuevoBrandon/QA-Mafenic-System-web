import React from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

interface Props {
  open: boolean;
  toggleDrawer: (value: boolean) => void;
}

export default function DrawerMenu({ open, toggleDrawer }: Props) {
  const APP_BAR_HEIGHT = 64; 
  const DrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => toggleDrawer(false)} 
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/home">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/custom-tickect">
            <ListItemIcon>
              <ConfirmationNumberIcon />
            </ListItemIcon>
            <ListItemText primary="Ticket" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/setting-user">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="User" />
          </ListItemButton>
        </ListItem>
        
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="persistent"      
      anchor="left"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          marginTop: `${APP_BAR_HEIGHT}px`,        
          height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
        },
      }}
    >
      {DrawerList}
    </Drawer>
  );
}
