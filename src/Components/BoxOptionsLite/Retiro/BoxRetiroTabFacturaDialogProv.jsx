/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import TableSelecDeudasProveedor from "./../TableSelect/TableSelecDeudasProveedor";


const BoxRetiroTabFacturaDialogProv = ({
  proveedor,
  onSelect,
  openDialog,
  setOpenDialog,
}) => {

  const [deudasSeleccionadas, setDeudasSeleccionadas] = useState([])

  const handleAceptar = ()=>{
    onSelect(deudasSeleccionadas)
    setOpenDialog(false)
  }

  return (
    <Dialog
        open={openDialog}
        onClose={ ()=> {setOpenDialog(false)} }
        maxWidth="md"
      >
        <DialogTitle>Seleccionar deuda del proveedor</DialogTitle>
        <DialogContent>
        
        <TableSelecDeudasProveedor 
          proveedor={proveedor} 
          onSelect={(ds)=>{setDeudasSeleccionadas(ds)}}
          showBox={openDialog}
        />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAceptar}
          >Aceptar</Button>
          <Button onClick={ ()=>{ setOpenDialog(false) } }>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default BoxRetiroTabFacturaDialogProv;
