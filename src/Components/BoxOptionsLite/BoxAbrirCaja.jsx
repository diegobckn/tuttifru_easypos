/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import TecladoCierre from "../Teclados/TecladoCierre";
import Validator from "../../Helpers/Validator";


const BoxAbrirCaja = ({
  openAmount,
  setAmount,
  onEnter = () => { }
}) => {

  return (
    <Grid container spacing={2}>

      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="body4" color="black">
          Ingrese el monto inicial para abrir la caja
        </Typography>
      </Grid>
      <Grid item xs={12} md={5} lg={5}>

        <TextField
          margin="normal"
          fullWidth
          label="Monto del ingreso"
          type="number" // Cambia dinámicamente el tipo del campo de contraseña
          value={openAmount}
          onChange={(e) => {
            if (Validator.isMonto(e.target.value))
              setAmount(e.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12} md={7} lg={7}>
        <TecladoCierre
          maxValue={10000000}
          showFlag={true}
          varValue={openAmount}
          varChanger={setAmount}
          onEnter={onEnter}
        />
      </Grid>
    </Grid>
  );
};

export default BoxAbrirCaja;
