/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState,useEffect } from "react";
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
  Typography
} from "@mui/material";

import TabPanel from "./../TabPanel";
import SystemHelper from "./../../../Helpers/System";
import TableSelecUsuario from "../TableSelect/TableSelecUsuario";
import User from "../../../Models/User";
import TecladoPagoCaja from "../../Teclados/TecladoPagoCaja";
import TableSelec from "../TableSelect/TableSelec";
import DialogDeudasUsuarios from "./DialogDeudasUsuarios";
import BoxSelectPayMethod from './../BoxSelectPayMethod'
import Validator from "../../../Helpers/Validator";

const BoxIngresoTabUsuario = ({
  tabNumber,
  info,
  setInfo
}) => {

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [monto, setMonto] = useState(0)

  const [showSelectDeuda, setShowSelectDeuda] = useState(false)
  const [deudas, setDeudas] = useState([])
  const [metodoPago, setMetodoPago] = useState("EFECTIVO")

  useEffect(()=>{
  },[])


  useEffect(()=>{
    if(usuarioSeleccionado != null){
      setShowSelectDeuda(true)
    }
  },[usuarioSeleccionado])



  useEffect(()=>{
    const infox = {}
    if(usuarioSeleccionado != null){
      setShowSelectDeuda(false)
      infox.usuario = usuarioSeleccionado
    }
    if(deudas.length>0){
      infox.deudas = deudas
    }
    if(parseFloat(monto)>0)
      infox.monto = monto
    if(metodoPago != null)
      infox.metodoPago = metodoPago

    setInfo(infox)
  },[usuarioSeleccionado, monto, metodoPago])

  const onSelectUsuario = (usuarioYDeudas)=>{
    if(usuarioYDeudas.length<1) {
      setMonto(0)
      setUsuarioSeleccionado(null)
      setDeudas([])

      info.usuario = null
      info.deudas = []
      info.monto = 0
      return
    }
    setUsuarioSeleccionado({
      idUsuario: usuarioYDeudas[0].codigoUsuario,
      nombre: usuarioYDeudas[0].nombreApellidoOperador
    })

    var montoTotal = 0
    const deudasx = []
    usuarioYDeudas.forEach((deuda)=>{
      montoTotal += deuda.total
      deudasx.push({
        idCuentaCorriente: deuda.id,
        idCabecera: deuda.idCabecera,
        total: deuda.total
      })
    })
    setDeudas(deudasx)
    setMonto(montoTotal)
  }

  const onChangePayMethod = (method)=>{
    setMetodoPago(method);
  }

  const calcularTotalDeudas = (deudasx)=>{
    var total = 0;
    if(!deudasx) deudasx = deudas
    deudasx.forEach((d)=>{
      total += d.total
    })
    return total
  }

  

  return (
    <TabPanel value={tabNumber} index={1}>
      <Grid container spacing={2} 
      >
          <Grid item xs={12} sm={5} md={5} lg={5}>
            

          <TextField
            margin="normal"
            fullWidth
            label="Monto del ingreso"
            type="number" // Cambia dinámicamente el tipo del campo de contraseña
            value={monto}
            onChange={(e) => {
              if(Validator.isMonto(e.target.value)){
                setMonto(parseFloat(e.target.value))
              }
            }}
          />
          
          <DialogDeudasUsuarios
            openDialog={showSelectDeuda}
            setOpenDialog={setShowSelectDeuda}
            onSelect={onSelectUsuario}
          />

          {!usuarioSeleccionado && (
            <div>
              <Button onClick={()=>{
                setUsuarioSeleccionado(null)
                setShowSelectDeuda(true)
                setMonto(0)
              }} style={{
                background:"#0e59df",
                color:"white"
              }}
              >Seleccionar usuario</Button>
            </div>
          )}

          {usuarioSeleccionado && (
            <Table>
              <TableBody>
            <TableRow>
            <TableCell>
              <Typography>Usuario: {usuarioSeleccionado.nombre}</Typography>
            </TableCell>
            </TableRow>
            </TableBody>
            </Table>
          )}

          {deudas.length>0 && (
            <Table>
            <TableBody>
            <TableRow>
            <TableCell>
              <Typography>Deudas: ${calcularTotalDeudas()}</Typography>
            </TableCell>
            <TableCell>
              <Button onClick={()=>{
                setUsuarioSeleccionado(null)
                setDeudas([])
                setShowSelectDeuda(true)
                setMonto(0)
              }} style={{
                background:"#0e59df",
                color:"white"
              }}
              >Cambiar deudas</Button>
            </TableCell>
            </TableRow>
            </TableBody>
            </Table>
          )}

          { usuarioSeleccionado && deudas.length>0 &&(
            <Table>
            <TableBody>
            <TableRow>
            <TableCell>
              <BoxSelectPayMethod 
                metodoPago={metodoPago} 
                onChange={onChangePayMethod}
                excludes={[
                  "TRANSFERENCIA",
                  "CUENTACORRIENTE"
                ]}
              />
              </TableCell>
              </TableRow>
              </TableBody>
              </Table>
            )}


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

export default BoxIngresoTabUsuario;
