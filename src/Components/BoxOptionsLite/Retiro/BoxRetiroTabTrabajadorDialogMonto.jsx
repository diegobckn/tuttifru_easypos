/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid
} from "@mui/material";

import SystemHelper from "./../../../Helpers/System";
import Validator from "../../../Helpers/Validator";
import TecladoPagoCaja from "../../Teclados/TecladoPagoCaja";

const TabRetiroTrabajador = ({
  trabajador,
  openDialog,
  setOpenDialog,
  onFinish
}) => {
  const [montoAnticipo, setMontoAnticipo] = useState(0)

  return (
    <Dialog
        open={openDialog}
        onClose={ ()=> {setOpenDialog(false)}}
        maxWidth="lg"
      >
        <DialogContent>

        <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={4} lg={4}>
          <Typography>
            {
            trabajador != null ? 
            ("Anticipo para " + trabajador.nombres +  " " + trabajador.apellidos) : ""
            }
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="Monto del anticipo"
            type="number" // Cambia dinámicamente el tipo del campo de contraseña
            value={montoAnticipo}
            onChange={(e) => {
              if(Validator.isMonto(e.target.value)){
                setMontoAnticipo(e.target.value)
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={7} md={7} lg={7}>
          <TecladoPagoCaja
          maxValue={10000000}
          showFlag={true}
          varValue={montoAnticipo}
          varChanger={setMontoAnticipo}
          esPrimeraTecla={false}
          onEnter={()=>{}}
          />
        </Grid>
        </Grid>

          
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{onFinish(montoAnticipo)}}>Aceptar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default TabRetiroTrabajador;
