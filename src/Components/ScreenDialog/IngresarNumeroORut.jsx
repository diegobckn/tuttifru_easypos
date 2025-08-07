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
  Grid,
  Typography,
  TextField
} from "@mui/material";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import TecladoAlfaNumerico from "../Teclados/TecladoAlfaNumerico";
import TecladoNumerico from "../Teclados/TecladoNumerico";
import TecladoPeso from "../Teclados/TecladoPeso";
import TecladoNumeros from "../Teclados/TecladoNumeros";


const IngresarNumeroORut = ({
  openDialog,
  setOpenDialog,
  title,
  varChanger,
  varValue,
  isRut = false,
  isDecimal = false,
  onEnter=()=>{},
  canBe0 = false
}) => {


  const handlerSaveAction = ()=>{
    if(varValue == 0 && !canBe0){
      alert("Debe ingresar un valor");
      return;
    }
    setOpenDialog(false)
  }

  const handleKeydownSearchInput = (e)=>{
    if(e.keyCode == 13){
      setOpenDialog(false)
      if(onEnter) onEnter()
    }
  }


  
  return (
    <Dialog open={openDialog} onClose={()=>{
      setOpenDialog(false)
    }} maxWidth="md">
        <DialogTitle>
          {title}
        </DialogTitle>
        <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                margin="normal"
                fullWidth
                type="text" // Cambia dinámicamente el tipo del campo de contraseña
                value={varValue}
                onChange={(e) => varChanger(e.target.value)}
                onKeyDown={handleKeydownSearchInput}
                sx={{
                  marginBottom:"20px"
                }}
              />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <div style={{
              position:"relative"
            }}>

            <TecladoNumeros
              maxValue={10000000000}
              showFlag={true}
              varValue={varValue}
              varChanger={varChanger}
              isRut={isRut}
              isDecimal={isDecimal}
              onEnter={()=>{
                setOpenDialog(false)
                if(onEnter) onEnter()
              }}
              />
                

              
            </div>
          </Grid>
        </Grid>

        </DialogContent>
        <DialogActions>
          <SmallButton textButton="Aceptar" actionButton={handlerSaveAction}/>
          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Volver</Button>
        </DialogActions>
      </Dialog>
  );
};

export default IngresarNumeroORut;
