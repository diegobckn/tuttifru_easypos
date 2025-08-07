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

import TabPanel from "../TabPanel";
import SystemHelper from "./../../../Helpers/System";
import TableSelecTrabajador from "../TableSelect/TableSelecUsuario";
import  BoxRetiroTabTrabajadorDialogMonto from "./BoxRetiroTabTrabajadorDialogMonto";
import User from "../../../Models/User";


const TabRetiroTrabajador = ({
  tabNumber,
  info,
  setInfo
}) => {
  const [showDialogMonto, setShowDialogMonto]= useState(false)
  const [trabajadores, setTrabajadores] = useState([])
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null)
  const [monto, setMonto] = useState(0)
  const [infoCompleta, setInforCompleta] = useState(false)

  useEffect(()=>{
    console.log("buscando trabajadores del servidor");
    User.getInstance().getAllFromServer((all)=>{
      setTrabajadores(all)
    },()=>{
      setTrabajadores([])
    })
  },[])

  const onSelectCallback = (usuarioTrabajador)=>{
    console.log("selecciono un trabajor");
    setTrabajadorSeleccionado(usuarioTrabajador)
    setShowDialogMonto(true)
  }

  useEffect(()=>{
    if(tabNumber != 2)return
    console.log("actualizando info retiro")

    const infoX = {}
    infoX.codigoUsuario = 0
    if(trabajadorSeleccionado != null) infoX.codigoUsuario = trabajadorSeleccionado.codigoUsuario
    infoX.monto = parseFloat(monto);
    setInfo(infoX)
    console.log(infoX);

    if(monto != 0 && trabajadorSeleccionado != null){
      setInforCompleta(true)
    }

  },[trabajadorSeleccionado, monto]);

  return (
    <TabPanel value={tabNumber} index={2}>
      <Grid container spacing={2}>
        <TableSelecTrabajador 
        usuarios={!infoCompleta ? 
           trabajadores : []} onSelectCallback={onSelectCallback} />

        <BoxRetiroTabTrabajadorDialogMonto 
          trabajador={trabajadorSeleccionado} 
          openDialog={showDialogMonto} 
          setOpenDialog={setShowDialogMonto}
          onFinish={(monto)=>{
            setShowDialogMonto(false)
            setMonto(monto)
          }}
        />


          {infoCompleta && (
            <div>
              <Typography>Usuario: {trabajadorSeleccionado.nombres + " " + trabajadorSeleccionado.apellidos}</Typography>
              <Typography>Monto: ${monto}</Typography>

              <Button onClick={()=>{
                setInforCompleta(false)
                setMonto(0)
              }} style={{
                background:"#0e59df",
                color:"white"
              }}
              >Cambiar Trabajador</Button>
            </div>
          )}


      </Grid>
    </TabPanel>
  );
};

export default TabRetiroTrabajador;
