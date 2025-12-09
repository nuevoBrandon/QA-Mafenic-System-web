import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import Tooltip from "@mui/material/Tooltip"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Divider from "@mui/material/Divider"

import MenuIcon from "@mui/icons-material/Menu"
import LogoutIcon from "@mui/icons-material/Logout"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"

import { AuthContext } from "../../../Auth/AuthProvider"

interface Props {
  open: boolean
  toggleDrawer: (value: boolean) => void
}

// 🔹 Generar color a partir del nombre
function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = "#"

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

// 🔹 Construir props para el avatar (iniciales + color)
function stringAvatar(name: string | undefined) {
  if (!name) {
    return {
      children: "?",
    }
  }

  const parts = name.trim().split(" ")
  const first = parts[0]?.[0] ?? ""
  const second = parts[1]?.[0] ?? ""

  const initials = (first + second).toUpperCase()

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  }
}

export default function TopBar({ toggleDrawer, open }: Props) {
  const { logout, user } = React.useContext(AuthContext)
  const userName = user?.name || "Usuario"

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogout = () => {
    handleCloseUserMenu()
    logout()
  }

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#79c094ff", boxShadow: 3 }}>
      <Toolbar>
        {/* Botón menú lateral */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
          onClick={() => toggleDrawer(!open)}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          <img src="../logito.png" width="200px" />
        </Typography>

        {/* Usuario */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={userName}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={handleOpenUserMenu}
            >
              <Avatar {...stringAvatar(userName)} />
              <Typography variant="body1" sx={{ display: { xs: "none", sm: "block" } }}>
                {userName}
              </Typography>
              <KeyboardArrowDownIcon fontSize="small" />
            </Box>
          </Tooltip>

          {/* Menú desplegable de usuario */}
          <Menu
            sx={{ mt: "40px" }}
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {/* Aquí puedes agregar más opciones, ej: Perfil, Configuración, etc. */}
            {/* <MenuItem onClick={handleCloseUserMenu}>Perfil</MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>Configuración</MenuItem>
            <Divider /> */}
            <MenuItem onClick={handleLogout}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LogoutIcon fontSize="small" />
                <Typography>Cerrar sesión</Typography>
              </Box>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
