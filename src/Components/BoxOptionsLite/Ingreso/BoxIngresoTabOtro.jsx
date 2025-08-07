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
} from "@mui/material";

import TabPanel from "./../TabPanel";
import SystemHelper from "./../../../Helpers/System";
import TecladoPagoCaja from "../../Teclados/TecladoPagoCaja";
import Validator from "../../../Helpers/Validator";
import IngresarTexto from "../../ScreenDialog/IngresarTexto";


const  TabIngresoOtro= ({
  tabNumber,
  info,
  setInfo
}) => {
  const [motivo, setMotivo] = useState("")
  const [monto, setMonto] = useState("")

  const [dialogMotivo, setDialogMotivo] = useState(false)

  useEffect(()=>{
    const infox = {}
    infox.motivo = motivo
    infox.monto = parseFloat(monto)
    setInfo(infox)
  },[motivo, monto])

  const validateChangeMotivo = (newvalue)=>{
    if(Validator.isSearch(newvalue))
    setMotivo(newvalue)
  }

  return (
    <TabPanel value={tabNumber} index={2}>
      <IngresarTexto
        title="Ingrese motivo del ingreso"
        openDialog={dialogMotivo}
        setOpenDialog={setDialogMotivo}
        varChanger={validateChangeMotivo}
        varValue={motivo}
      />
      <Grid container spacing={2} 
      >
        
        <Grid item xs={12} sm={5} md={5} lg={5}>
          <TextField
            margin="normal"
            fullWidth
            label="Motivo del ingreso"
            type="text" // Cambia dinámicamente el tipo del campo de contraseña
            value={motivo}
            onChange={(e) =>{
              validateChangeMotivo(e.target.value)
            }}


            onClick={()=>{
                setDialogMotivo(true)
            }}
            />

          <TextField
            margin="normal"
            fullWidth
            label="Monto del ingreso"
            type="number" // Cambia dinámicamente el tipo del campo de contraseña
            value={monto}
            onFocus={()=>{
              setDialogMotivo(false)
            }}
            onChange={(e) =>{
              if(Validator.isMonto(e.target.value)){
                setMonto(parseFloat(e.target.value))
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={7} md={7} lg={7}>
          <TecladoPagoCaja
          maxValue={100000}
          showFlag={true}
          varValue={monto}
          varChanger={setMonto}
          onEnter={()=>{}}
          />
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default TabIngresoOtro;
