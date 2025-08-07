/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxIngreso from "../BoxOptionsLite/Ingreso/BoxIngreso";
import System from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import Ingreso from "../../Models/Ingreso";
import Client from "../../Models/Client";
import User from "../../Models/User";
import Printer from "../../Models/Printer";


const PantallaIngreso = ({openDialog, setOpenDialog}) => {
  const {
    userData,
    
    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showDialogSelectClient,
    setShowDialogSelectClient,

    setShowLoadingDialogWithTitle,
    hideLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);


  const [info, setInfo] = useState(null)
  const tipo = ["fiados","usuarios","otrosingresos"]
  const [tabNumber, setTabNumber] = useState(0);
  
  const handlerSaveAction = ()=>{
    
    if(tipo[tabNumber] == "otrosingresos"){
      if(!info.motivo || info.motivo.trim()==""){
        showMessage("Ingrese motivo para continuar");
        return
      }

      if(!info.monto){
        showMessage("Ingrese monto para continuar");
        return
      }

      const ingreso = new Ingreso()
      ingreso.codigoUsuario = userData.codigoUsuario
      // ingreso.codigoSucursal = 0
      // ingreso.puntoVenta = "0000"
      ingreso.fechaIngreso = System.getInstance().getDateForServer()
      ingreso.idTurno = userData.idTurno
      
      ingreso.fill(info);
      setShowLoadingDialogWithTitle("Haciendo el ingreso...",true)
      ingreso.otros((res)=>{
        hideLoadingDialog()
        showMessage("Realizado correctamente");
        onSuccessFinish(res)
      },()=>{
        hideLoadingDialog()
        showMessage("No se pudo realizar.");

      })
    }else if(tipo[tabNumber] == "fiados"){
      if(!info.clienteSeleccionado){
        showMessage("Debe seleccionar un cliente");
        return
      }

      if(!info.deudas || info.deudas.length<1){
        showMessage("Debe seleccionar al menos una deuda");
        return
      }

      if(!info.monto || parseFloat(info.monto)<=0){
        showMessage("Debe ingresar un monto");
        return
      }

      var cl = new Client()
      cl.data = {}
      cl.data.fechaIngreso = System.getInstance().getDateForServer()
      cl.data.codigoUsuario = userData.codigoUsuario
      // cl.data.codigoSucursal = 0
      // cl.data.puntoVenta = ""
      cl.data.deudaIds = []

      info.deudas.forEach(deudaItem => {
        cl.data.deudaIds.push(
          {
            idCuentaCorriente : deudaItem.id,
            idCabecera : deudaItem.idCabecera,
            total : deudaItem.total
          }
        )
      });
      
      cl.data.montoPagado = info.monto
      cl.data.metodoPago = info.metodoPago

      
    
    setShowLoadingDialogWithTitle("Haciendo el ingreso...",true)
      cl.pagarFiado((respuestaServidor)=>{
        hideLoadingDialog()
        showMessage(respuestaServidor.descripcion);
        onSuccessFinish(respuestaServidor)
      },()=>{
        hideLoadingDialog()
        showMessage("No se pudo realizar.");
      })
    }else if(tipo[tabNumber] == "usuarios"){
      if(!info.usuario){
        showMessage("Debe seleccionar un usuario");
        return
      }

      if(!info.deudas){
        showMessage("Debe seleccionar deuda");
        return
      }

      if(!info.monto){
        showMessage("Debe ingresar monto");
        return
      }

      console.log("todo ok para seguir");
      console.log("info:")
      console.log(info)
      const usr = new User()
      usr.idUsuario = info.usuario.idUsuario
      usr.deudaIds = []

      info.deudas.forEach((deuda)=>{
        usr.deudaIds.push({
          idCuentaCorriente : deuda.idCuentaCorriente,
          idCabecera : deuda.idCabecera,
          total : deuda.total
        })
      })
      usr.montoPagado = info.monto
      usr.metodoPago = "EFECTIVO"

      setShowLoadingDialogWithTitle("Haciendo el ingreso...",true)
      usr.pargarDeudas((res)=>{
        hideLoadingDialog()
        showMessage("Realizado correctamente");
        onSuccessFinish(res)
      },()=>{
        hideLoadingDialog()
        showMessage("No se pudo realizar.");
      })
    }

  }

  const onSuccessFinish = (serverResponse)=>{
    console.log("onSuccessFinish")
    setOpenDialog(false)
    Printer.printAll(serverResponse)
  }

  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}} 
    maxWidth="lg">
        <DialogTitle>
          Ingresos
        </DialogTitle>
        <DialogContent>
          <BoxIngreso 
            tabNumber={tabNumber} 
            setTabNumber={setTabNumber} 
            info={info} 
            setInfo={setInfo}
          />
        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Guardar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{setOpenDialog(false)}}>cerrar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default PantallaIngreso;
