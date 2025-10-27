import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import MainButton from "../Elements/MainButton";
import ScreenDialogCreateClient from "../ScreenDialog/CreateClient";
import ScreenDialogShowFamilies from "../ScreenDialog/ShowFamilies";
import ScreenDialogConfig from "../ScreenDialog/AdminConfig";
import BusquedaRapida from "../ScreenDialog/BusquedaRapida";
import ScreenSuspend from "../ScreenDialog/SuspenderVenta";
import ScreenRecuperarVenta from "../ScreenDialog/RecuperarVenta";
import ScreenIngreso from "../ScreenDialog/Ingreso";
import ScreenRetiro from "../ScreenDialog/Retiro";
import ScreenDevolucion from "../ScreenDialog/Devolucion";
import ScreenProductoAbierto from "../ScreenDialog/ProductoAbierto";
import CierreCaja from "../ScreenDialog/CierreCaja";
import MessageDialog from "../Dialogs/Alert";
import UserEvent from "../../Models/UserEvent";
import BoxProductoFamilia from "./BoxProductoFamilia";
import BoxBusquedaRapida from "./BoxBusquedaRapida";
import ModelConfig from "../../Models/ModelConfig";
import SmallButton from "../Elements/SmallButton";
import GrillaProductosVendidos from "./GrillaProductosVendidos";
import ItemVentaOffline from "./ItemVentaOffline";
import SalesOffline from "../../Models/SalesOffline";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import CorregirFolios from "../ScreenDialog/CorregirFolios";
import Atudepa from "../../Models/Atudepa";
import TouchInputName from "../TouchElements/TouchInputName";
import dayjs from "dayjs";
import SmallGrayButton from "../Elements/SmallGrayButton";
import SmallWarningButton from "../Elements/SmallWarningButton";
import SmallPrimaryButton from "../Elements/SmallPrimaryButton";


const BoxAdminAppTurno = ({
  turnoAbierto,
  setTurnoAbierto,
  infoTurno,
  setInfoTurno
}) => {
  const {
    userData,
    salesData,
    clearSessionData,
    clearSalesData,
    getUserData,
    setShowLoadingDialogWithTitle,
    showLoading,
    hideLoading,
    setShowLoadingDialog,
    showConfirm,
    showMessage,
    showAlert,

    suspenderYRecuperar,
    listSalesOffline,
    setListSalesOffline
  } = useContext(SelectedOptionsContext);

  const [abrirAFecha, setAbrirAFecha] = useState("");
  const [abrirAHora, setAbrirAHora] = useState("");

  const [cerrarAFecha, setCerrarAFecha] = useState("");
  const [cerrarAHora, setCerrarAHora] = useState("");
  const [cantidadDePesonal, setCantidadDePesonal] = useState("1");
  const [paused, setPaused] = useState(false);

  const showMessageLoading = (msg) => {
    showMessage(msg)
    hideLoading()
  }

  const abrirTurno = () => {
    Atudepa.abrirTurno(
      dayjs(abrirAFecha + " " + abrirAHora, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm"),
      dayjs(cerrarAFecha + " " + cerrarAHora, "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm"),
      cantidadDePesonal,
      (resp) => {
        setInfoTurno(resp.info)
        setTurnoAbierto(true)
      }, showMessage)
  }

  const cerrarTurno = () => {
    Atudepa.cerrarTurno(
      infoTurno,
      (resp) => {
        setInfoTurno(null)
        setTurnoAbierto(false)
      }, showMessage)
  }

  const pausar = () => {
    Atudepa.pausarTurno(
      infoTurno,
      (resp) => {
        setPaused(true)
      }, showMessage)
  }

  const despausar = () => {
    Atudepa.despausarTurno(
      infoTurno,
      (resp) => {
        setPaused(false)
      }, showMessage)
  }

  const showInfoTurno = () => {
    return infoTurno.name + " // De "
      + dayjs(infoTurno.open_at, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm")
      + " hasta "
      + dayjs(infoTurno.close_at, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm")
  }

  useEffect(() => {

    const fechaHoy = dayjs().format('DD/MM/YYYY')
    const hr = dayjs().format('HH:mm')

    setAbrirAFecha(fechaHoy)
    setCerrarAFecha(fechaHoy)

    setAbrirAHora(hr)
    setCerrarAHora(dayjs().add(3, 'hour').format('HH:mm'))

    showLoading("Revisando turno...")

    Atudepa.preparar(() => {
      Atudepa.checkTurno((resp) => {
        setInfoTurno(resp.info)
        setTurnoAbierto(true)
        if (resp.info.paused) {
          setPaused(true)
        }
        hideLoading()
      }, () => {
        showMessageLoading("No hay turno abierto")
      })
    }, showMessageLoading)


  }, [])

  return (<div style={{
    padding: "10px",
    backgroundColor: "#efefef",
    border: "1px solid #a29d9d",
  }}>
    <Grid container spacing={2} >
      <Grid item xs={12} sm={12} md={12} lg={12}>
        {!turnoAbierto ? (

          <Grid container spacing={2} >
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography variant="h6">Abrir Turno</Typography>
            </Grid>


            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography>Desde</Typography>
            </Grid>


            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TouchInputName
                inputState={[abrirAFecha, setAbrirAFecha]}
                label="Desde Fecha"
              />

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>

              <TouchInputName
                inputState={[abrirAHora, setAbrirAHora]}
                label="Desde Hora"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography>Hasta</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TouchInputName
                inputState={[cerrarAFecha, setCerrarAFecha]}
                label="Hasta Fecha"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TouchInputName
                inputState={[cerrarAHora, setCerrarAHora]}
                label="Hasta Hora"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TouchInputName
                inputState={[cantidadDePesonal, setCantidadDePesonal]}
                label="Cantidad de Personal"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <SmallButton textButton={"Abrir turno de atencion"} actionButton={abrirTurno} />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} >

            <Grid item xs={12} sm={12} md={8} lg={8} sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <Typography style={{
                fontSize: "20px",
                // border: "1px solid #ccc",
                // backgroundColor: "#ddd",
              }}>
                Turno: {showInfoTurno()}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4}>

              <SmallButton
                style={{ height: "70px" }}
                textButton={"Cerrar el turno"}
                actionButton={cerrarTurno}
              />

              {paused ? (
                <SmallPrimaryButton
                  style={{ height: "70px" }}
                  textButton={"Continuar Atencion"}
                  actionButton={despausar}
                />
              ) : (
                <SmallWarningButton
                  style={{ height: "70px" }}
                  textButton={"Pausar Atencion"}
                  actionButton={pausar}
                />
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>

  </div >

  );
}

export default BoxAdminAppTurno;
