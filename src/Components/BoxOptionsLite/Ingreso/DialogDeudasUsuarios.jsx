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

import TableSelectDeudasUsuario from "./../TableSelect/TableSelecDeudasUsuario";


const DialogDeudasUsuarios = ({
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
        <DialogTitle>Seleccionar deudas de usuario</DialogTitle>
        <DialogContent>
        
        <TableSelectDeudasUsuario 
          onSelect={(ds)=>{setDeudasSeleccionadas(ds)}}
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

export default DialogDeudasUsuarios;
