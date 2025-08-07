/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";

const BotonClienteOUsuario = ({
  openDialog,
  setOpenDialog,
  onSelect
}) => {
  
  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}}>
      <DialogTitle>
        Elegir opcion
      </DialogTitle>
        <DialogContent>
          <SmallButton textButton="Cliente" actionButton={()=>{
            onSelect("cliente")
            }}/>
          <SmallButton textButton="Usuario" actionButton={()=>{
            onSelect("usuario")
            }}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setOpenDialog(false)}}>cerrar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default BotonClienteOUsuario;
