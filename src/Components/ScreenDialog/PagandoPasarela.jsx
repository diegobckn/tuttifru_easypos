import React, { useState, useContext, useEffect, useRef } from "react";
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
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import TecladoPeso from "../Teclados/TecladoPeso";
import InputPeso from "../Elements/InputPeso";
import Validator from "../../Helpers/Validator";
import MainButton from "../Elements/MainButton";
import DetectarPeso from "./DetectarPeso";
import ModelConfig from "../../Models/ModelConfig";
import dayjs from "dayjs";
import ProductSold from "../../Models/ProductSold";
import PasarelaPago from "../../Models/PasarelaPago";

export default ({
  openDialog,
  setOpenDialog,
  pago,
  onPayedOk = () => { }
}) => {

  const {
    showMessage,
    showAlert
  } = useContext(SelectedOptionsContext);


  const [cantidadRespuestas, setCantidadRespuestas] = useState(0)
  const [respuestas, setRespuestas] = useState([])

  const [idTransaccion, setIdTransaccion] = useState(null)

  const buscarRespuesta = (idTran) => {
    console.log("buscarRespuesta..", idTran)
    PasarelaPago.consultar(idTran, (res) => {
      console.log("res de consulta", res)

      console.log("res.data", res.data)
      console.log("res.data.response", res.data.response)
      console.log("res.data.response.responseMessage", res.data.response.responseMessage)

      if (res.data.response.responseMessage == "Aprobado") {
        console.log("esta aprobado")
        onPayedOk(res.data.response)
        setOpenDialog(false)
        PasarelaPago.actualizarEstadoVenta(idTran, "Aprobado")
        // setIdTransaccion(null)
        // setCantidadRespuestas(0)
        // setRespuestas([])
        return
      }

      console.log("set respuestas:", [...respuestas, res.data.response])
      setRespuestas([...respuestas, res.data.response])
      setCantidadRespuestas(cantidadRespuestas + 1)
    }, (errr) => {
      console.log("error en respuesta de consulta", errr)
      console.log("setrespuestas.. wrong", [...respuestas, null])
      setRespuestas([...respuestas, null])
      setCantidadRespuestas(cantidadRespuestas + 1)
    })
  }

  useEffect(() => {
    if (!openDialog || !pago) return

    setRespuestas([])
    setCantidadRespuestas(0)

    console.log("pago a enviar", pago)
    PasarelaPago.enviarVenta(pago, (res) => {
      showMessage("enviado correctamente")
      console.log("res", res)
      setIdTransaccion(res.idPosTxs)
      console.log("id transaccion", res.idPosTxs)
    }, () => {
      showMessage("No se pudo enviar")
    })
  }, [pago, openDialog])



  useEffect(() => {
    if (!openDialog || !pago) return

    if (idTransaccion == null) return
    setTimeout(() => {
      buscarRespuesta(idTransaccion)
    }, 3 * 1000);
  }, [idTransaccion])

  useEffect(() => {
    if (!openDialog || !pago) return

    if (cantidadRespuestas < 1) return
    if (cantidadRespuestas > 2) {
      console.log("llego al limite de intentos..respuestas", respuestas)

      respuestas.forEach((resConsulta) => {
        console.log("resConsulta", resConsulta)
        if (resConsulta && resConsulta.responseMessage == "Aprobado") {
          onPayedOk(resConsulta)
          setOpenDialog(false)
          setIdTransaccion(null)
          setCantidadRespuestas(0)
          setRespuestas([])
        }
      })

      showAlert(
        "Pago por pasarela",
        "No se detecto el pago en la pasarela o vencio el tiempo",
        () => {
          setOpenDialog(false)
          setIdTransaccion(null)
          setCantidadRespuestas(0)
          setRespuestas([])
        })
      return
    }
    setTimeout(() => {
      buscarRespuesta(idTransaccion)
    }, 3 * 1000);
  }, [cantidadRespuestas])

  return (
    <Dialog open={openDialog} onClose={() => { }} maxWidth="lg">
      <DialogTitle>
        Pagar con pasarela
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>Enviando el intento de pago a la pasarela...</Typography>
            {cantidadRespuestas > 0 && (
              <Typography>{"Revisando el estado del pago. Numero de operacion: " + cantidadRespuestas}</Typography>
            )}
          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};
