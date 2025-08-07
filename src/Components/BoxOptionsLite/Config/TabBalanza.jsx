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
import TouchInputNumber from "../../TouchElements/TouchInputNumber";
import InputCheckbox from "../../Elements/Compuestos/InputCheckbox";
import IngresarNumeroORut from "../../ScreenDialog/IngresarNumeroORut";

const TabBalanza = ({
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
    setUltimoVuelto,

    showPrintButton,
    setShowPrintButton,
    suspenderYRecuperar,
    setSuspenderYRecuperar,
  } = useContext(SelectedOptionsContext);

  const [balanzaCod, setBalanzaCod] = useState("")
  const [balanzaIdProd, setBalanzaIdProd] = useState("")
  const [balanzaPesaje, setBalanzaPesaje] = useState("")
  const [balanzaDigitosPesoEnteros, setBalanzaDigitosPesoEnteros] = useState("")

  const [urlServicioDeteccionPeso, setUrlServicioDeteccionPeso] = useState("");
  const [detectarPeso, setDetectarPeso] = useState(false);

  const loadConfigSesion = () => {
    setBalanzaCod(ModelConfig.get("codBalanza"))
    setBalanzaIdProd(ModelConfig.get("largoIdProdBalanza"))
    setBalanzaPesaje(ModelConfig.get("largoPesoBalanza"))
    setBalanzaDigitosPesoEnteros(ModelConfig.get("digitosPesoEnterosBalanza"))

    setUrlServicioDeteccionPeso(ModelConfig.get("urlServicioDeteccionPeso"))
    setDetectarPeso(ModelConfig.get("detectarPeso"))
  }

  const handlerSaveAction = () => {
    ModelConfig.change("codBalanza", balanzaCod)
    ModelConfig.change("largoIdProdBalanza", balanzaIdProd)
    ModelConfig.change("largoPesoBalanza", balanzaPesaje)
    ModelConfig.change("digitosPesoEnterosBalanza", balanzaDigitosPesoEnteros)
    ModelConfig.change("urlServicioDeteccionPeso", urlServicioDeteccionPeso)
    ModelConfig.change("detectarPeso", detectarPeso)

    showMessage("Guardado correctamente")
    // onFinish()
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])


  return (
    <Grid container spacing={2}>


      {/* BALANZA */}
      <Grid item xs={12} lg={12} sx={{
        border: "1px solid #C5C3C3",
        backgroundColor: "#f6f6f6",
        borderRadius: "4px",
        marginTop: "20px",
        padding: "20px"
      }}>

        <Typography sx={{
          fontWeight: "bold",
          marginBottom: "20px"
        }}>
          Balanza
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[balanzaCod, setBalanzaCod]}
              label="Codigo de la balanza"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[balanzaIdProd, setBalanzaIdProd]}
              label="Largo del producto"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[balanzaPesaje, setBalanzaPesaje]}
              label="Largo del peso"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[balanzaDigitosPesoEnteros, setBalanzaDigitosPesoEnteros]}
              label="Digitos peso enteros"
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TouchInputPage
            inputState={[urlServicioDeteccionPeso, setUrlServicioDeteccionPeso]}
            label="Url Servicio Deteccion Peso"
            onEnter={() => {
              handlerSaveAction()
            }}
          />
        </Grid>


        <Grid item xs={12} md={12} lg={12}>
          <InputCheckbox
            inputState={[detectarPeso, setDetectarPeso]}
            label={"Detectar peso automaticamente"}
          />
        </Grid>
      </Grid>

      {/* FIN BALANZA */}




      <Grid item xs={12} sm={12} md={12} lg={12}>
        <SmallButton textButton="Reiniciar sistema" actionButton={() => {
          window.location.href = window.location.href
        }} style={{
          backgroundColor: "blueviolet",
          width: "inherit"
        }} />

        <SmallButton textButton="Guardar" actionButton={() => {
          handlerSaveAction()
        }} />
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

export default TabBalanza;
