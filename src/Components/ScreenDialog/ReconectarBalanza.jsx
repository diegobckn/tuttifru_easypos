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
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallPrimaryButton from "../Elements/SmallPrimaryButton";


const ReconectarBalanza = ({
  openDialog,
  setOpenDialog
}) => {

  const {
    showAlert
  } = useContext(SelectedOptionsContext);

  const [paso, setPaso] = useState(0)
  const [message, setMessage] = useState("")


  useEffect(() => {
    if (openDialog) {
      setPaso(1)
    }
  }, [openDialog])

  useEffect(() => {
    if (paso % 2 != 0) {
      setMessage("Reconectar la balanza y apretar el boton continuar")
    } else {
      setMessage("Apretar el boton continuar")
    }
  }, [paso])



  return (
    <Dialog open={openDialog} onClose={() => { }} maxWidth="lg">
      <DialogTitle>
        Reconectar Balanza
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">
              No se pudo hacer la conexion con la balanza. Por favor hacer el siguiente procedimiento:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="h4" sx={{
              textAlign: "center",
              border: "3px solid darkgray",
              margin: "30px 30px 30px 0",
              padding: "30px",
            }}>
              {message}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>

            <SmallPrimaryButton textButton="Continuar" actionButton={() => {

              setTimeout(() => {
                setPaso(paso + 1)
              }, 3000);
              const balanza = Balanza.getInstance()
              Balanza.detectandoConexion = true
              Balanza.onNeedReconect = () => {
                showAlert("No se pudo conectar la balanza. Reintentar por favor.")
              }
              balanza.deteccionPeso((nuevoPeso) => {
                console.log("peso recibido en prueba de conexion", nuevoPeso)
                showAlert("Deteccion correcta")
                setMessage("Deteccion correcta")
                setOpenDialog(false)
              })

            }} style={{
              marginRight: "100px",
              height: "70px",
              width: "200px",
            }} />

          </Grid>

        </Grid>

      </DialogContent>
      <DialogActions>

        <SmallButton textButton="cancelar" actionButton={() => {
          setOpenDialog(false)
        }} />

      </DialogActions>
    </Dialog>
  );
};

export default ReconectarBalanza;
