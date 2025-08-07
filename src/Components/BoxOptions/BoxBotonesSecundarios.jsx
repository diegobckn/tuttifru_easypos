/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import {
  Paper,
  Grid,
  Box,
  Typography,
  TextField,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import CoffeeIcon from '@mui/icons-material/Coffee';

const CustomBottomNavigationAction = styled(BottomNavigationAction)({
  color: "white",
  "&.Mui-selected": {
    color: "white",
  },
  "&:hover": {
    color: "white",
  },
});

const BoxBotonesSecundarios = () => {
  const [value, setValue] = useState(0);

  const handleNavigationChange = (event, newValue) => {
    // Handle navigation change here
    console.log(`Button ${newValue} clicked`);
    setValue(newValue);
  };

  // useEffect(() => {
  //   // Simulate a fetch operation after 2 seconds
  //   const fetchData = () => {
  //     setTimeout(() => {
  //       setVendedor(vendedores);
  //     }, 2000);
  //   };

  //   fetchData();
  // }, []);

  return (
    <Paper
      elevation={8}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "620px",
        height: "135px",
        marginBottom: "10px",
        justifyContent: "center",
        alignItems: "center",
        marginTop:"-333px"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",

          marginBottom: "19px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BottomNavigation
          value={value}
          onChange={handleNavigationChange}
          showLabels
        >
          <CustomBottomNavigationAction
            sx={{
              height: "115px",
              backgroundColor: "black",
              borderRadius: "18px",
              marginTop: "-22px",
              marginRight: "19px",
            }}
            label="Informe"
            icon={<ReceiptLongIcon sx={{ fontSize: 80, color: "white" }} />}
          />
          <CustomBottomNavigationAction
            sx={{
              height: "115px",
              backgroundColor: "black",
              borderRadius: "18px",
              marginTop: "-22px",
              marginRight: "19px",
            }}
            label="Anular documento"
            icon={<EditIcon sx={{ fontSize: 80, color: "white" }} />}
          />
          <CustomBottomNavigationAction
            sx={{
              height: "115px",
              backgroundColor: "black",
              borderRadius: "18px",
              marginTop: "-22px",
              marginRight: "19px",
            }}
            label="Cerrar Vendedor"
            icon={<CoffeeIcon sx={{ fontSize: 80, color: "white" }} />}
          />
          <CustomBottomNavigationAction
            sx={{
              height: "115px",
              backgroundColor: "black",
              borderRadius: "18px",
              marginTop: "-22px",
            }}
            label="Cierre de día"
            icon={
              <CoffeeIcon sx={{ fontSize: 80, color: "white" }} />
            }
          />
        </BottomNavigation>
      </div>
    </Paper>
  );
};

export default BoxBotonesSecundarios;
