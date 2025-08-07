import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecProduct from "../BoxOptionsLite/TableSelect/TableSelecProduct";

const BuscarProducto = ({
  openDialog,
  setOpenDialog,
  onSelect,
  title = null
}) => {


  const onSelectProduct = (product)=>{
    onSelect(product)
    setOpenDialog(false)
  }

  return (
      <Dialog open={openDialog} onClose={()=>{
        setOpenDialog(false)
      }}
      maxWidth="md"
      >
        <DialogContent style={{
        minWidth:"500px",
        minHeight:"500px",
      }}>

      <TableSelecProduct
        onSelect={onSelectProduct}
        show={openDialog}
        title={title}
      />


        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>cerrar</Button>
        </DialogActions>
      </Dialog>
  );
};

export default BuscarProducto;
