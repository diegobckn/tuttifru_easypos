/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext } from "react";
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
import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import AperturaCaja from "../../Models/AperturaCaja";
import dayjs from "dayjs";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";


const AbrirCaja = ({openDialog, setOpenDialog}) => {
  const { 
    userData, 
    updateUserData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [openAmount, setOpenAmount] = useState(0)
  const handlerSaveAction = ()=>{
    if(openAmount == 0){
      showMessage("Debe ingresar un monto inicial");
      return;
    }
    
    var ac = new AperturaCaja();
    ac.codigoUsuario = userData.codigoUsuario
    ac.fechaIngreso = System.getInstance().getDateForServer()
    ac.tipo = "INGRESO"
    ac.detalleTipo = "INICIOCAJA"
    ac.observacion = ""
    ac.monto = openAmount
    ac.idTurno = userData.idTurno

    console.log("para enviar:");
    console.log(ac.getFillables());
    ac.sendToServer((res)=>{
      var user2 = userData
      user2.inicioCaja = true;
      updateUserData(user2)
      setOpenDialog(false)
      Printer.printAll(res)

      UserEvent.send({
        name: "inicio de caja correctamente",
        info: ""
      })

    },(error)=>{
      showMessage(error);
    })

  }
  
  return (
    <Dialog open={openDialog} onClose={()=>{}} maxWidth="md">
        <DialogTitle>
          Apertura de caja
        </DialogTitle>
        <DialogContent>
          <BoxAbrirCaja 
          openAmount={openAmount} 
          setAmount={setOpenAmount}
          onEnter={()=>{
            handlerSaveAction()
          }}
          />
        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Guardar" actionButton={handlerSaveAction}/>
        </DialogActions>
      </Dialog>
  );
};

export default AbrirCaja;
