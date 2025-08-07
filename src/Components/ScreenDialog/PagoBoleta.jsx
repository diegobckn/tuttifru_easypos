import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import BoxBoleta from "../BoxOptionsLite/BoxBoleta";



const PagoBoleta = ({openDialog,setOpenDialog}) => {
  
  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}} fullWidth maxWidth="lg">
      <DialogTitle>Pagar Boleta</DialogTitle>
      <DialogContent onClose={()=>{setOpenDialog(false)}}>
        <BoxBoleta openDialog={openDialog} onClose={()=>{setOpenDialog(false)}}/>
      </DialogContent>
      </Dialog>
  );
};

export default PagoBoleta;
