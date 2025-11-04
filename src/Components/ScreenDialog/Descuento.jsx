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
  TextField,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../Context/ProviderModales";

import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import AperturaCaja from "../../Models/AperturaCaja";
import dayjs from "dayjs";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import TecladoCierre from "../Teclados/TecladoCierre";
import Validator from "../../Helpers/Validator";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";
import IngresarNumeroORut from "./IngresarNumeroORut";
import SmallDangerButton from "../Elements/SmallDangerButton";
import TiposDescuentos from "../../definitions/TiposDescuentos";
import ModelConfig from "../../Models/ModelConfig";


const Descuento = ({
  openDialog,
  setOpenDialog,

  totalVentas,
  descuentos,
  setDescuentos
}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showAlert,
  } = useContext(SelectedOptionsContext);

  const {
    pedirSupervision,
  } = useContext(ProviderModalesContext);

  const [descuentoInput, setDescuentoInput] = useState(0)
  const [descuentoAConfirmar, setDescuentoAConfirmar] = useState(0)
  const [tipo, setTipo] = useState(TiposDescuentos.MONTO)

  const [verTeclado, setVerTeclado] = useState(false)


  useEffect(() => {
    if (tipo == TiposDescuentos.PORCENTAJE) {
      var por = (descuentoInput / 100)
      if (descuentoInput > 100) {
        setDescuentoAConfirmar(0)
        setDescuentoInput(0)
        return
      }
      setDescuentoAConfirmar(System.truncarMoneda(parseFloat(totalVentas * por)))
    } else {
      setDescuentoAConfirmar(System.truncarMoneda(parseFloat(descuentoInput)))
    }
  }, [descuentoInput, tipo])

  useEffect(() => {
    if (!openDialog) {
      setTipo(TiposDescuentos.MONTO)
      return
    }
    setDescuentoInput(descuentos)
    setDescuentoAConfirmar(0)
  }, [openDialog])

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="lg">
      <DialogTitle>
        Descuentos
      </DialogTitle>
      <DialogContent>


        <Grid container spacing={2} sx={{
          padding: "20px",
          minWidth: "50vw",
          position: "relative"
        }}>
          <IngresarNumeroORut
            openDialog={verTeclado}
            setOpenDialog={setVerTeclado}
            title={"Ingresar el valor del descuento"}
            varValue={descuentoInput}
            varChanger={setDescuentoInput}
            onEnter={() => {
              setVerTeclado(false)
            }}
            canBe0={true}
          />
          <Grid item xs={12} md={5} lg={5}>

            <Typography>Total de ventas:</Typography>
            <Typography sx={{
              fontSize: "24px"
            }}>${System.truncarMoneda(totalVentas)}</Typography>
            <br /><br />
            <Typography>Total con descuento:</Typography>
            <Typography sx={{
              fontSize: "24px"
            }}>${System.truncarMoneda(totalVentas - descuentoAConfirmar)}</Typography>




          </Grid>

          <Grid item xs={12} md={7} lg={7}>
            <label
              style={{
                userSelect: "none",
                fontSize: "19px",
                display: "inline-block",
                margin: "0 0 10px 0"
              }}>
              Tipo de descuento
            </label>
            <BoxOptionList
              optionSelected={tipo}
              setOptionSelected={setTipo}
              options={System.arrayIdValueFromObject(TiposDescuentos, true)}
            />

            <br />


            <div style={{
              display: "inline-block",
              width: "100%",
              padding: "0 14px 0 0"
            }}>
              <p>Valor</p>
              <p style={{
                border: "1px solid #766c6c",
                padding: "12px",
                borderRadius: "7px",
              }} onClick={() => {
                setVerTeclado(true)
              }}>
                {descuentoInput}
              </p>
            </div>

            <Typography>Descuento real: ${System.truncarMoneda(descuentoAConfirmar)}</Typography>

          </Grid>

        </Grid>




      </DialogContent>
      <DialogActions>

        <SmallDangerButton
          style={{
            width: "200px"
          }}
          textButton={"Borrar descuento"}
          actionButton={() => {
            setDescuentoInput(0)
          }}
        />

        <SmallButton
          textButton={"Aceptar"}
          actionButton={() => {
            const sds = ModelConfig.get("pedirAutorizacionParaAplicarDescuentos")
            console.log("pedirAutorizacionParaAplicarDescuentos", sds)
            if (sds) {

              pedirSupervision("Aplicar descuento", () => {
                setOpenDialog(false)
                setDescuentos(descuentoAConfirmar)
              })
            } else {
              setOpenDialog(false)
              setDescuentos(descuentoAConfirmar)
            }
          }}
        />

        <SmallButton
          textButton={"Cancelar"}
          actionButton={() => {
            setOpenDialog(false)
          }}
        />
      </DialogActions>
    </Dialog >
  );
};

export default Descuento;
