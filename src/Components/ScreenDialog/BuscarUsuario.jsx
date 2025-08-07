import React, { useState, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import TableSelecUsuario from "../BoxOptionsLite/TableSelect/TableSelecUsuario";
import User from "../../Models/User";

const BuscarUsuario = ({
  openDialog,
  setOpenDialog,
  onSelect,
}) => {

  const [usuarios, setUsuarios] = useState([])

  useEffect(()=>{
    console.log("buscando trabajadores del servidor");
    User.getInstance().getAllFromServer((all)=>{
      setUsuarios(all)
    },()=>{
      setUsuarios([])
    })
  },[])


  return (
      <Dialog 
      open={openDialog} 
      onClose={()=>{
        setOpenDialog(false)
      }}
      maxWidth="lg"
      >
        <DialogContent>
          <TableSelecUsuario 
          onSelectCallback={onSelect}
          openDialog={openDialog}
          usuarios={usuarios}
          setOpenDialog={setOpenDialog}
          />
        </DialogContent>
        {/* <DialogActions>
          <SmallButton textButton="Guardar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </DialogActions> */}
      </Dialog>
  );
};

export default BuscarUsuario;
