import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Paper,
  Avatar,
  Box,
  Grid,
  Stack,
  InputLabel,
  Typography,
  CircularProgress,
  Snackbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  MenuItem,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import TouchInputPage from "../../TouchElements/TouchInputPage";
import ModelConfig from "../../../Models/ModelConfig";
import SmallButton from "../../Elements/SmallButton";
import Sucursal from "../../../Models/Sucursal";
import TiposPasarela from "../../../definitions/TiposPasarela";
import BoxOptionList from "../BoxOptionList";
import InputCheckbox from "../../Elements/Compuestos/InputCheckbox";
import InputCheckboxAutorizar from "../../Elements/Compuestos/InputCheckboxAutorizar";
import BoxBat from "../BoxBat";

const TabBotones = ({
  onFinish = () => { }
}) => {
  const {
    userData,
    salesData,
    sales,
    addToSalesData,
    setPrecioData,
    grandTotal,
    ventaData,
    setVentaData,
    searchResults,
    // setSearchResults,
    updateSearchResults,
    selectedUser,
    setSelectedUser,
    // selectedCodigoCliente,
    // setSelectedCodigoCliente,
    // selectedCodigoClienteSucursal,
    // setSelectedCodigoClienteSucursal,
    // setSelectedChipIndex,
    // selectedChipIndex,
    searchText,
    setTextSearchProducts,
    clearSalesData,

    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showMessage,
    showConfirm,
    showDialogSelectClient,
    setShowDialogSelectClient,
    modoAvion,
    ultimoVuelto,
    setUltimoVuelto
  } = useContext(SelectedOptionsContext);

  const [verBotonPreventa, setVerBotonPreventa] = useState(false)
  const [verBotonEnvases, setVerBotonEnvases] = useState(false)
  const [verBotonPagarFactura, setVerBotonPagarFactura] = useState(false)

  const [suspenderYRecuperarx, setSuspenderYRecuperarx] = useState(false)


  const loadConfigSesion = () => {
    // console.log("loadConfigSesion")

    setVerBotonPreventa(ModelConfig.get("verBotonPreventa"))
    setVerBotonEnvases(ModelConfig.get("verBotonEnvases"))
    setVerBotonPagarFactura(ModelConfig.get("verBotonPagarFactura"))
    setSuspenderYRecuperarx(ModelConfig.get("suspenderYRecuperar"))

  }

  const handlerSaveAction = () => {
    if (
      !ModelConfig.isEqual("verBotonPreventa", verBotonPreventa)
      || !ModelConfig.isEqual("verBotonEnvases", verBotonEnvases)
      || !ModelConfig.isEqual("verBotonPagarFactura", verBotonPagarFactura)

    ) {
      showConfirm("Hay que recargar la pantalla principal para aplicar los cambios. Desea hacerlo ahora?", () => {
        window.location.href = window.location.href
      })
    }
    ModelConfig.change("verBotonPreventa", verBotonPreventa)
    ModelConfig.change("verBotonEnvases", verBotonEnvases)
    ModelConfig.change("verBotonPagarFactura", verBotonPagarFactura)
    ModelConfig.change("suspenderYRecuperar", suspenderYRecuperarx)


    showMessage("Guardado correctamente")
    // onFinish()
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])



  return (
    <Grid container spacing={2}>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[verBotonPreventa, setVerBotonPreventa]}
          label={"Ver boton Preventa"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>

        <InputCheckbox
          inputState={[verBotonPagarFactura, setVerBotonPagarFactura]}
          label={"Ver boton Pagar Factura"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[verBotonEnvases, setVerBotonEnvases]}
          label={"Ver boton Envases"}
        />
      </Grid>


      <Grid item xs={12} md={12} lg={12}>
        <InputCheckboxAutorizar
          inputState={[suspenderYRecuperarx, setSuspenderYRecuperarx]}
          label={"Suspender y Recuperar"}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>
        <SmallButton textButton="Reiniciar sistema" actionButton={() => {
          window.location.href = window.location.href
        }} style={{
          backgroundColor: "blueviolet",
          width: "inherit"
        }} />

        <SmallButton textButton="Guardar" actionButton={handlerSaveAction} />
        <SmallButton textButton="Guardar y Salir" actionButton={() => {
          handlerSaveAction()
          setTimeout(() => {
            onFinish()
          }, 300);
        }} />
      </Grid>


    </Grid>
  );
};

export default TabBotones;
