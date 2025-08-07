/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
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
import TecladoPeso from "../Teclados/TecladoPeso";
import InputPeso from "../Elements/InputPeso";
import Validator from "../../Helpers/Validator";
import MainButton from "../Elements/MainButton";
import Balanza from "../../Models/Balanza";
import { Label } from "@mui/icons-material";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";


const AsignarPeso = ({
  openDialog,
  setOpenDialog,
  onFinish = () => { },
  showGrInfo = true,
  precioKg = null
}) => {


  const [peso, setPeso] = useState(0)
  const [precioParcial, setPrecioParcial] = useState(null)
  const balanza = Balanza.getInstance()

  const resetear = () => {
    console.log("reset")
    balanza.deteccionPeso((nuevoPeso) => {
      setPeso(nuevoPeso)
      console.log("asignando peso al iniciar", nuevoPeso)
    })
  }

  useEffect(() => {
    if (!openDialog) return
    console.log("balanza", balanza)
    balanza.deteccionPeso((nuevoPeso) => {
      setPeso(nuevoPeso)
      console.log("asignando peso al iniciar", nuevoPeso)
    })
  }, [openDialog])

  const handlerSaveAction = () => {
    if (peso == 0) {
      alert("Debe ingresar un peso");
      return;
    }

    onFinish(parseFloat(peso).toFixed(3))
    setOpenDialog(false)
  }




  const checkGr = (valor) => {
    // if(parseFloat(valor)>0 && parseFloat(valor)<1){
    //   setEngr(Math.round(parseFloat(valor) * 100) / 100  * 1000 + "")
    // }else{
    //   setEngr("")
    // }
    var kilos = Math.trunc(valor);
    var gramos = valor - kilos
    gramos = (parseFloat(gramos + "")).toFixed(3) * 1000 + ""

    var tx = ""
    if (kilos > 0) {
      if (kilos > 1)
        tx = kilos + " KILOS"
      else
        tx = kilos + " KILO"
    }

    if (gramos > 0) {
      if (tx.length > 0) {
        tx += " y " + gramos + " GRAMOS"
      } else {
        tx += gramos + " GRAMOS"
      }
    }

    setEngr(tx)
  }

  const [enGr, setEngr] = useState("")

  useEffect(() => {
    checkGr(peso)

    setPrecioParcial(peso * precioKg)

  }, [peso])

  return (
    <Dialog open={openDialog} onClose={() => { }} maxWidth="lg">
      <DialogTitle>
        Deteccion de peso
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">
              Ubicar el producto en la balanza
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h4" sx={{
              textAlign: "center",
              border: "3px solid darkgray",
              margin: "30px 30px 30px 0",
              padding: "30px",
            }}>{parseFloat(peso).toFixed(3)}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              alignItems: "center"
            }}>
              {
                showGrInfo && enGr != "" && (
                  <div style={{
                    width: "100%",
                    margin: "0 auto",
                    marginLeft: "5px",
                    height: "30px",
                    textAlign: "center",
                    fontSize: 20,
                    // backgroundColor:"#6df0ff"
                  }}>{enGr}</div>
                )
              }

              {precioKg !== null && (
                <div style={{
                  width: "100%",
                  margin: "20px auto",
                  marginLeft: "5px",
                  height: "30px",
                  textAlign: "center",
                  fontSize: 20,
                  // backgroundColor:"#6df0ff"
                }}>${System.formatMonedaLocal(precioParcial, false)}</div>
              )}
            </div>
          </Grid>

        </Grid>

      </DialogContent>
      <DialogActions>
        <SmallSecondaryButton textButton="Refrescar" actionButton={() => {
          resetear()
        }} style={{
          marginRight: "100px",
          height: "50px"
        }} />
        <SmallButton textButton="Confirmar" actionButton={handlerSaveAction} />
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignarPeso;
