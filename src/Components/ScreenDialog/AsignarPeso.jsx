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
import DetectarPeso from "./DetectarPeso";
import ModelConfig from "../../Models/ModelConfig";
import dayjs from "dayjs";


const AsignarPeso = ({
  openDialog,
  setOpenDialog,
  product,
  title = "Asignar Peso",
  currentWight = 0,
  onAsignWeight
}) => {


  const [peso, setPeso] = useState(0)

  const [showModalDeteccionPeso, setShowModalDeteccionPeso] = useState(false)
  const [detectarPeso, setVerBoton] = useState(null)

  useEffect(() => {
    // console.log("cambio openDialog de asignar peso", openDialog, " a ", dayjs().format("HH:mm:ss"))
    if (!openDialog) return
    if (ModelConfig.get("detectarPeso")) {
      setVerBoton(true)
      setShowModalDeteccionPeso(true)
    }
    setPeso(currentWight)
  }, [openDialog])

  const handlerSaveAction = () => {
    if (peso == 0) {
      alert("Debe ingresar un peso");
      return;
    }

    onAsignWeight(peso)
    setOpenDialog(false)

  }

  const checkChangeWeight = (newWeight) => {
    if (Validator.isPeso(newWeight))
      setPeso(newWeight)
  }




  return (
    <Dialog open={openDialog} onClose={() => { }} maxWidth="lg">
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">
              Ingrese el peso del producto {product ? product.nombre : ""}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={5} lg={5}>
            <InputPeso
              inputValue={peso}
              funChanger={checkChangeWeight}
            />

            {product ? (
              <>
                <Typography>
                  Precio unitario: ${System.formatMonedaLocal(product.precioVenta)}
                </Typography>

                <Typography >
                  Precio a pagar:
                </Typography>
                <Typography sx={{
                  fontSize: "30px",
                  textAlign: "center"
                }}>
                  ${System.formatMonedaLocal(product.precioVenta * peso)}
                </Typography>
              </>
            ) : null}
          </Grid>

          <Grid item xs={12} sm={12} md={7} lg={7}>
            <TecladoPeso
              maxValue={100000}
              showFlag={true}
              varValue={peso}
              varChanger={checkChangeWeight}
              onEnter={handlerSaveAction}
            />

            {detectarPeso === true ? (
              <DetectarPeso
                openDialog={showModalDeteccionPeso}
                setOpenDialog={(v) => {
                  setShowModalDeteccionPeso(v)

                  if (!v && detectarPeso) {
                    setOpenDialog(false)
                  }
                }}
                onFinish={(pesoDetectado) => {
                  onAsignWeight(pesoDetectado)
                  setOpenDialog(false)
                }}
                precioKg={product.precioVenta}
              />
            ) : null}

          </Grid>
        </Grid>

      </DialogContent>
      <DialogActions>
        <SmallButton textButton="Confirmar" actionButton={handlerSaveAction} />
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AsignarPeso;
