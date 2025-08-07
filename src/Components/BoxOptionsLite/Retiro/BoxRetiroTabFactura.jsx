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
import TableSelecProveedor from "./../TableSelect/TableSelecProveedor";
import BoxRetiroTabFacturaDialogProv from "./BoxRetiroTabFacturaDialogProv";
import SmallButton from "./../../Elements/SmallButton"
import System from "./../../../Helpers/System";

const TabRetiroFactura = ({
  tabNumber,
  info,
  setInfo
}) => {
  const [rutProveedor, setRutProveedor] = useState("")
  const [montoRetiro, setMontoRetiro] = useState(0)
  const [showSeleccionarProveedor, setShowSeleccionarProveedor] = useState(false)
  const [showSeleccionarDeuda, setShowSeleccionarDeuda] = useState(false)
  
  const [proveedor, setProveedor] = useState(null)
  const [deudas, setDeudas] = useState([])

  const onSelectProveedor = (proveedorYDeudas)=>{
    if(proveedorYDeudas.length<1) {
      setMontoRetiro(0)
      setProveedor(null)
      setDeudas([])

      info.proveedor = null
      info.deudas = []
      info.monto = 0
      return
    }
    setProveedor({
      codigoProveedor: proveedorYDeudas[0].codigoProveedor,
      nombreResponsable: proveedorYDeudas[0].nombreResponsable,
      razonSocial: proveedorYDeudas[0].razonSocial
    })

    var montoTotal = 0
    const deudasx = []
    proveedorYDeudas.forEach((deuda)=>{
      montoTotal += deuda.total
      deudasx.push({
        id: deuda.id,
        total: deuda.total
      })
    })
    setDeudas(deudasx)
    setMontoRetiro(montoTotal)
    // setProveedor(proveedorYDeudas)
    //setShowSeleccionarProveedor(false)
    //setShowSeleccionarDeuda(true)
  }

  useEffect(()=>{
    if(!proveedor){
      setShowSeleccionarProveedor(true)
    }
  },[proveedor]);

  useEffect(()=>{
    if(tabNumber != 1)return

    const infoX = {}
    if(montoRetiro!= 0)
    info.monto = montoRetiro

    if(proveedor){
      info.proveedor = proveedor
    }else{
      setShowSeleccionarProveedor(true)
    }

    if(deudas.length>0){
      info.deudas = deudas
    }else if(proveedor){
      setShowSeleccionarDeuda(true)
    }

  },[tabNumber, proveedor, montoRetiro]);

  const calcularTotalSeleccion = (deudasx)=>{
    var total = 0;
    if(deudasx == undefined) deudasx = deudas
    deudasx.forEach((d)=>{
      total+= d.total
    })
    setMontoRetiro(total)
  }

  return (
    <TabPanel value={tabNumber} index={1}>
      <Grid container spacing={2} 
      >
          <Grid item xs={12} sm={12} md={12} lg={12}>

          {
            !proveedor && 1==2 && (
              <TextField
              margin="normal"
              fullWidth
              label="RUT Proveedor"
              type="text" // Cambia dinámicamente el tipo del campo de contraseña
              value={rutProveedor}
              onChange={(e) => setRutProveedor(e.target.value)}
              />
            )
          }

          

          

          <TableSelecProveedor 
          showBox={showSeleccionarProveedor} 
          onSelect={onSelectProveedor} />
          {/* <BoxRetiroTabFacturaDialogProv 
            proveedor={proveedor} 
            openDialog={showSeleccionarDeuda} 
            setOpenDialog={setShowSeleccionarDeuda}
            onSelect={onSelectDeuda}
          /> */}


          {
            deudas.length>0 && (

              <Typography sx={{
                backgroundColor:"whitesmoke",
                marginTop:"20px",
                fontSize:"20px",
                display:"inline-block",
                textAlign:"center",
                marginLeft:"5%",
                padding:"20px",
                width:"90%"
              }}>
                Monto a retirar: 
                ${System.formatMonedaLocal(montoRetiro)}
              </Typography>
            )
          }


          </Grid>
        </Grid>
      </TabPanel>
  );
};

export default TabRetiroFactura;
