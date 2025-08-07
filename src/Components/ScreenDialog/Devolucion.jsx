/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState } from "react";
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

import BoxDevolucion from "../BoxOptionsLite/Devolucion/BoxDevolucion";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";


const PantallaDevolucion = ({
  openDialog,
  setOpenDialog
}) => {


  const handlerAcceptAction = ()=>{
    console.log("haciendo devolucion")
    setOpenDialog(false)
  }
  
  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}}>
        <DialogTitle>
          Devolucion
        </DialogTitle>
        <DialogContent>
          <BoxDevolucion />
        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Aceptar" actionButton={handlerAcceptAction}/>
          <Button onClick={()=>{setOpenDialog(false)}}>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default PantallaDevolucion;
