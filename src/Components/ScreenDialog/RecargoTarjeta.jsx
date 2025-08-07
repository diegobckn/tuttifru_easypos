import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const RecargoTarjeta = ({openDialog,setOpenDialog}) => {
  const [monto, setMonto] = useState("");

  const onAceptClick = ()=>{
    setOpenDialog(false)
  }
  return (
      <Dialog open={openDialog} onClose={()=>{
        setOpenDialog(false)
      }}
      >
        <DialogTitle>
          Recargo Pago Tarjeta
        </DialogTitle>
        <DialogContent>
        <Grid container item xs={12} spacing={2}>
          
              <Grid item xs={12} lg={12}>
              <Grid container spacing={2}>

              <TextField
                margin="normal"
                fullWidth
                label="Ingrese el recargo"
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />

              </Grid>
              </Grid>
              
        </Grid>
        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Guardar" actionButton={onAceptClick}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default RecargoTarjeta;
