import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Typography,
  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Settings } from "@mui/icons-material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
  const {
    userData,
    setUserData,
    ventaData,
    salesData,
    setVentaData,
    searchResults,
    selectedCodigoCliente,
    selectedCodigoClienteSucursal,
    clearSessionData 
  } = useContext(SelectedOptionsContext);
  const [dateTime, setDateTime] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isEstablishmentVisible, setIsEstablishmentVisible] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // Update the date and time every second (1000 milliseconds)
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);



  const formattedDate = dateTime.toLocaleDateString();
  const formattedTime = dateTime.toLocaleTimeString();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    
    // Clear userData from localStorage
    localStorage.removeItem("userData");
    // Clear userData from context
    clearSessionData();
    

    // Close the logout dialog
    
    navigate("/login");
  };

  return (
    <Paper
      elevation={3}
      style={{ backgroundColor: "#283048", padding: "1px", marginTop: "2px" }}
    >
      <Grid container item xs={12}>
        <Grid item xs={12} sx={{ display: "flex", padding:2 }}>
          <Grid item xs={3} sm={2} md={2} sx={{ marginTop: "6px" }}>
            <Box variant="h5" color="white">
              EasyPOS
            </Box>
          </Grid>
          <Grid item xs={8} sm={9} md={9}>
            <Chip
              label="Establecimiento"
              sx={{
                marginTop: "6px",
                borderRadius: "6px",
                backgroundColor: "white",
                width: "90%",
              }}
            ></Chip>
          </Grid>
          <Grid item xs={2} sm={2} md={1}>
            <IconButton onClick={handleMenuOpen} style={{ padding: "8px" }}>
              <Settings fontSize="medium" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                Cerrar sesión
              </MenuItem>
              {/* <MenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                Configuración
              </MenuItem> */}
              {/* <MenuItem onClick={() => setIsLogoutDialogOpen(true)}>Más</MenuItem> */}
            </Menu>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          sx={{ display: "flex", margin: "1%", justifyContent: "center" }}
        >
          <Grid item xs={6} sm={6}>
            <Typography
              sx={{
                width: "100%",
                color: "white",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Fecha: {formattedDate}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6}>
            {" "}
            <Typography
              sx={{
                width: "100%",
                color: "white",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {" "}
              Hora: {formattedTime}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      >
        <DialogTitle>Cerrar Sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>
           Deseas cerrar sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLogoutDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NavBar;
