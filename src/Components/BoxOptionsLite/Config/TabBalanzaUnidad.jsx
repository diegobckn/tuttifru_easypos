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

const TabBalanzaUnidad = ({
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

  const [balanzaVentaUnidadCod, setBalanzaVentaUnidadCod] = useState("")
  const [balanzaVentaUnidadIdProd, setBalanzaVentaUnidadIdProd] = useState("")
  const [balanzaVentaUnidadPesaje, setBalanzaVentaUnidadPesaje] = useState("")

  const loadConfigSesion = () => {
    setBalanzaVentaUnidadCod(ModelConfig.get("codBalanzaVentaUnidad"))
    setBalanzaVentaUnidadIdProd(ModelConfig.get("largoIdProdBalanzaVentaUnidad"))
    setBalanzaVentaUnidadPesaje(ModelConfig.get("largoPesoBalanzaVentaUnidad"))
  }

  const handlerSaveAction = () => {
    ModelConfig.change("codBalanzaVentaUnidad", balanzaVentaUnidadCod)
    ModelConfig.change("largoIdProdBalanzaVentaUnidad", balanzaVentaUnidadIdProd)
    ModelConfig.change("largoPesoBalanzaVentaUnidad", balanzaVentaUnidadPesaje)

    showMessage("Guardado correctamente")
    // onFinish()
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])


  return (
    <Grid container spacing={2}>

      {/* BALANZA VENTA POR UNIDADES */}
      <Grid item xs={12} lg={12} sx={{
        border: "1px solid #C5C3C3",
        backgroundColor: "#b8cbf9",
        borderRadius: "4px",
        marginTop: "20px",
        padding: "20px"
      }}>

        <Typography sx={{
          fontWeight: "bold",
          marginBottom: "20px"
        }}>
          Balanza venta por unidades
        </Typography>

        <Grid container spacing={2} sx={{
        }}>
          <Grid item xs={12} md={4} lg={4}>
            <TouchInputNumber
              inputState={[balanzaVentaUnidadCod, setBalanzaVentaUnidadCod]}
              label="Codigo de la balanza"
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <TouchInputNumber
              inputState={[balanzaVentaUnidadIdProd, setBalanzaVentaUnidadIdProd]}
              label="Largo del producto"
            />
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <TouchInputNumber
              inputState={[balanzaVentaUnidadPesaje, setBalanzaVentaUnidadPesaje]}
              label="Largo la cantidad"
            />
          </Grid>

        </Grid>

      </Grid>

      {/* FIN BALANZA VENTA POR UNIDADES */}


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

export default TabBalanzaUnidad;
