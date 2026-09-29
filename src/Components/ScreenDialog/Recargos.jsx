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
import { DEFAULT_DESKTOP_MODE_MEDIA_QUERY } from "@mui/x-date-pickers";
import TouchInputNumber from "../TouchElements/TouchInputNumber";


export default ({
  openDialog,
  setOpenDialog,
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

  const [tipoEfectivo, setTipoEfectivo] = useState(null)
  const [valorEfectivo, setValorEfectivo] = useState(0)

  const [tipoTransferencia, setTipoTransferencia] = useState(null)
  const [valorTransferencia, setValorTransferencia] = useState(0)

  const [tipoTarjetaCredito, setTipoTarjetaCredito] = useState(null)
  const [valorTarjetaCredito, setValorTarjetaCredito] = useState(0)

  const [tipoTarjetaDebito, setTipoTarjetaDebito] = useState(null)
  const [valorTarjetaDebito, setValorTarjetaDebito] = useState(0)

  const [recargosMediosPagos, setRecargosMediosPagos] = useState([])

  const guardarCambios = () => {
    ModelConfig.change("recargosMediosPagos", recargosMediosPagos)
    setOpenDialog(false)
  }

  useEffect(() => {
    if (!openDialog) {
      return
    }

    setRecargosMediosPagos(ModelConfig.get("recargosMediosPagos"))
    setTipoEfectivo(ModelConfig.get("recargosMediosPagos")["efectivo"]["tipo"])
    setValorEfectivo(ModelConfig.get("recargosMediosPagos")["efectivo"]["valor"])
    setTipoTransferencia(ModelConfig.get("recargosMediosPagos")["transferencia"]["tipo"])
    setValorTransferencia(ModelConfig.get("recargosMediosPagos")["transferencia"]["valor"])
    setTipoTarjetaCredito(ModelConfig.get("recargosMediosPagos")["tarjeta_credito"]["tipo"])
    setValorTarjetaCredito(ModelConfig.get("recargosMediosPagos")["tarjeta_credito"]["valor"])
    setTipoTarjetaDebito(ModelConfig.get("recargosMediosPagos")["tarjeta_debito"]["tipo"])
    setValorTarjetaDebito(ModelConfig.get("recargosMediosPagos")["tarjeta_debito"]["valor"])

  }, [openDialog])

  useEffect(() => {
    setRecargosMediosPagos(
      {
        "efectivo": {
          tipo: tipoEfectivo,
          valor: valorEfectivo
        },
        "transferencia": {
          tipo: tipoTransferencia,
          valor: valorTransferencia
        },
        "tarjeta_credito": {
          tipo: tipoTarjetaCredito,
          valor: valorTarjetaCredito
        },
        "tarjeta_debito": {
          tipo: tipoTarjetaDebito,
          valor: valorTarjetaDebito
        }
      }
    )
  }, [
    tipoEfectivo,
    valorEfectivo,
    tipoTransferencia,
    valorTransferencia,
    tipoTarjetaCredito,
    valorTarjetaCredito,
    tipoTarjetaDebito,
    valorTarjetaDebito
  ])

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="md" fullWidth>
      <DialogTitle>
        Recargos
      </DialogTitle>
      <DialogContent>


        <Grid container spacing={2} sx={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
          position: "relative"
        }}>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography>
              Efectivo
            </Typography>

          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <BoxOptionList
              optionSelected={tipoEfectivo}
              setOptionSelected={setTipoEfectivo}
              options={System.arrayIdValueFromObject(TiposDescuentos, true)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TouchInputNumber
              style={{
                "marginTop": "4px",
                "position": "relative",
              }}
              inputState={[valorEfectivo, setValorEfectivo]}
              label={"Valor del recargo en efectivo"}
              isDecimal={true}
              withLabel={false}
            />
          </Grid>

        </Grid>



        <Grid container spacing={2} sx={{
          padding: "20px",
          minWidth: "50vw",
          backgroundColor: "#dfdfdf",
          position: "relative"
        }}>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography>
              Transferencia
            </Typography>

          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <BoxOptionList
              optionSelected={tipoTransferencia}
              setOptionSelected={setTipoTransferencia}
              options={System.arrayIdValueFromObject(TiposDescuentos, true)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TouchInputNumber
              style={{
                "marginTop": "4px",
                "position": "relative",
              }}
              inputState={[valorTransferencia, setValorTransferencia]}
              label={"Valor del recargo en transferencia"}
              isDecimal={true}
              withLabel={false}
            />
          </Grid>
        </Grid>


        <Grid container spacing={2} sx={{
          padding: "20px",
          minWidth: "50vw",
          backgroundColor: "#f5f5f5",
          position: "relative"
        }}>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography>
              Tarjeta de Crédito
            </Typography>

          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <BoxOptionList
              optionSelected={tipoTarjetaCredito}
              setOptionSelected={setTipoTarjetaCredito}
              options={System.arrayIdValueFromObject(TiposDescuentos, true)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TouchInputNumber
              style={{
                "marginTop": "4px",
                "position": "relative",
              }}
              inputState={[valorTarjetaCredito, setValorTarjetaCredito]}
              label={"Valor del recargo en tarjeta de crédito"}
              isDecimal={true}
              withLabel={false}
            />
          </Grid>
        </Grid>



        <Grid container spacing={2} sx={{
          padding: "20px",
          minWidth: "50vw",
          backgroundColor: "#dfdfdf",
          position: "relative"
        }}>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <Typography>
              Tarjeta de Débito
            </Typography>

          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <BoxOptionList
              optionSelected={tipoTarjetaDebito}
              setOptionSelected={setTipoTarjetaDebito}
              options={System.arrayIdValueFromObject(TiposDescuentos, true)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TouchInputNumber
              style={{
                "marginTop": "4px",
                "position": "relative",
              }}
              inputState={[valorTarjetaDebito, setValorTarjetaDebito]}
              label={"Valor del recargo en tarjeta de débito"}
              isDecimal={true}
              withLabel={false}
            />
          </Grid>
        </Grid>



      </DialogContent>
      <DialogActions>



        <SmallButton
          textButton={"Guardar cambios"}
          actionButton={guardarCambios}
        />
        <SmallButton
          textButton={"Volver"}
          actionButton={() => {
            setOpenDialog(false)
          }}
        />
      </DialogActions>
    </Dialog >
  );
};
