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
import BoxTicketPreventa from "../BoxOptionsLite/BoxTicketPreventa";



const TicketPreventa = ({openDialog,setOpenDialog}) => {
  
  return (
    <Dialog open={openDialog} onClose={()=>{setOpenDialog(false)}} maxWidth="lg">
      <DialogTitle>Generar ticket</DialogTitle>
      <DialogContent onClose={()=>{setOpenDialog(false)}}>
        <BoxTicketPreventa 
          openDialog={openDialog} 
          setOpenDialog={setOpenDialog} 
          onClose={()=>{setOpenDialog(false)}}
        />
      </DialogContent>
      </Dialog>
  );
};

export default TicketPreventa;
