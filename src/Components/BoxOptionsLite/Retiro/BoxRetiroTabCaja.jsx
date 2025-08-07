/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField
} from "@mui/material";
import TabPanel from "./../TabPanel";
import SystemHelper from "./../../../Helpers/System";
import Validator from "../../../Helpers/Validator";
import IngresarTexto from "../../ScreenDialog/IngresarTexto";
import TecladoPagoCaja from "../../Teclados/TecladoPagoCaja";

const TabRetiroCaja = ({
  tabNumber,
  info,
  setInfo
}) => {
  const [motivoEgreso, setMotivoEgreso] = useState("")
  const [montoEgreso, setMontoEgreso] = useState(0)

  useEffect(()=>{
    if(tabNumber != 0)return
    const infoX = {}
    infoX.motivo = motivoEgreso
    infoX.monto = parseFloat(montoEgreso);
    setInfo(infoX)
  },[tabNumber, motivoEgreso, montoEgreso]);


  const [dialogMotivo, setDialogMotivo] = useState(false)
  const validateChangeMotivo = (newvalue)=>{
    if(Validator.isSearch(newvalue))
    setMotivoEgreso(newvalue)
  }


  return (
    <TabPanel value={tabNumber} index={0}>
      <IngresarTexto
        title="Ingrese motivo del egreso"
        openDialog={dialogMotivo}
        setOpenDialog={setDialogMotivo}
        varChanger={validateChangeMotivo}
        varValue={motivoEgreso}
      />
      
      <Grid container spacing={2}>

      <Grid item xs={12} sm={5} md={5} lg={5}>

        <TextField
          margin="normal"
          fullWidth
          label="Motivo del egreso"
          type="text" // Cambia dinámicamente el tipo del campo de contraseña
          value={motivoEgreso}
          onChange={(e) => validateChangeMotivo(e.target.value)}
          onClick={()=>{
            setDialogMotivo(true)
          }}
        />

        <TextField
          margin="normal"
          fullWidth
          label="Monto del egreso"
          type="number" // Cambia dinámicamente el tipo del campo de contraseña
          value={montoEgreso}
          onChange={(e) => {
            if(Validator.isMonto(e.target.value)){
              setMontoEgreso(e.target.value)
            }
          }}
        />
        </Grid>
        <Grid item xs={12} sm={7} md={7} lg={7}>
          <TecladoPagoCaja
          maxValue={100000000}
          showFlag={true}
          varValue={montoEgreso}
          varChanger={setMontoEgreso}
          esPrimeraTecla={false}
          onEnter={()=>{}}
          />
        </Grid>


      </Grid>
    </TabPanel>
  );
};

export default TabRetiroCaja;
