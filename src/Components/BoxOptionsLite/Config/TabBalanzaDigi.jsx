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
import BalanzaDigiControl from "../../ScreenDialog/BalanzaDigiControl";
import OCR from "../../ScreenDialog/OCR";
import OCRModal from "../../ScreenDialog/OCRModal";
import TouchInputName from "../../TouchElements/TouchInputName";
import BoxOptionList from "../BoxOptionList";
import System from "../../../Helpers/System";

const TabBalanzaDigi = ({
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

  const [ipBalanzaDigi, setIpBalanzaDigi] = useState("")
  const [puertaBalanzaDigi, setPuertaBalanzaDigi] = useState("")
  const [usuarioBalanzaDigi, setUsuarioBalanzaDigi] = useState("")
  const [claveBalanzaDigi, setClaveBalanzaDigi] = useState("")
  const [codigoValeBalanzaDigi, setCodigoValeBalanzaDigi] = useState("")
  const [refreshValeBalanzaDigi, setRefreshValeBalanzaDigi] = useState("")

  const [urlServicioBalanzaDigi, setUrlServicioBalanzaDigi] = useState("");
  const [revisarValeRepeditoBalanzaDigi, setRevisarValeRepeditoBalanzaDigi] = useState(false);

  const MODELOSDIGI = {
    SM300: "sm-300",
    SM110: "sm-110",
    SM120: "sm-120",
  }

  const [verDigi, setVerDigi] = useState(false);
  const [modeloBalanzaDigi, setModeloBalanzaDigi] = useState(MODELOSDIGI.SM300);


  const [trabajarConBalanzaDigi, setTrabajarConBalanzaDigi] = useState(false);



  const loadConfigSesion = () => {
    setIpBalanzaDigi(ModelConfig.get("ipBalanzaDigi"))
    setModeloBalanzaDigi(ModelConfig.get("modeloBalanzaDigi"))
    setUsuarioBalanzaDigi(ModelConfig.get("usuarioBalanzaDigi"))
    setClaveBalanzaDigi(ModelConfig.get("claveBalanzaDigi"))
    setPuertaBalanzaDigi(ModelConfig.get("puertaBalanzaDigi"))
    setTrabajarConBalanzaDigi(ModelConfig.get("trabajarConBalanzaDigi"))

    setUrlServicioBalanzaDigi(ModelConfig.get("urlServicioBalanzaDigi"))
    setCodigoValeBalanzaDigi(ModelConfig.get("codigoValeBalanzaDigi"))
    setRefreshValeBalanzaDigi(ModelConfig.get("refreshValeBalanzaDigi"))
    setRevisarValeRepeditoBalanzaDigi(ModelConfig.get("revisarValeRepeditoBalanzaDigi"))
  }

  const handlerSaveAction = () => {
    ModelConfig.change("ipBalanzaDigi", ipBalanzaDigi)
    ModelConfig.change("urlServicioBalanzaDigi", urlServicioBalanzaDigi)
    ModelConfig.change("puertaBalanzaDigi", puertaBalanzaDigi)
    ModelConfig.change("modeloBalanzaDigi", modeloBalanzaDigi)
    ModelConfig.change("trabajarConBalanzaDigi", trabajarConBalanzaDigi)
    ModelConfig.change("codigoValeBalanzaDigi", codigoValeBalanzaDigi)
    ModelConfig.change("refreshValeBalanzaDigi", refreshValeBalanzaDigi)
    ModelConfig.change("revisarValeRepeditoBalanzaDigi", revisarValeRepeditoBalanzaDigi)

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
          Balanza DIGI
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={12} md={12} lg={12}>
            <InputCheckbox
              inputState={[trabajarConBalanzaDigi, setTrabajarConBalanzaDigi]}
              label={"Trabajar con Digi"}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <InputCheckbox
              inputState={[revisarValeRepeditoBalanzaDigi, setRevisarValeRepeditoBalanzaDigi]}
              label={"Revisar vales repetidos"}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TouchInputPage
              inputState={[urlServicioBalanzaDigi, setUrlServicioBalanzaDigi]}
              label="Url Servicio"
              onEnter={() => {
                handlerSaveAction()
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[codigoValeBalanzaDigi, setCodigoValeBalanzaDigi]}
              label="Codigo Vale"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[refreshValeBalanzaDigi, setRefreshValeBalanzaDigi]}
              label="Tiempo refresco Vales(seg)"
            />
          </Grid>



          <Grid item xs={12} md={6} lg={6}>
            <TouchInputName
              inputState={[ipBalanzaDigi, setIpBalanzaDigi]}
              label="Ip de la balanza"
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <TouchInputNumber
              inputState={[puertaBalanzaDigi, setPuertaBalanzaDigi]}
              label="Puerta"
            />
          </Grid>

          {modeloBalanzaDigi == MODELOSDIGI.SM120 && (
            <Grid item xs={12} md={6} lg={6}>
              <TouchInputName
                inputState={[usuarioBalanzaDigi, setUsuarioBalanzaDigi]}
                label="usuario de conexion ftp"
              />
            </Grid>
          )}
          {modeloBalanzaDigi == MODELOSDIGI.SM120 && (

            <Grid item xs={12} md={6} lg={6}>
              <TouchInputName
                inputState={[claveBalanzaDigi, setClaveBalanzaDigi]}
                label="contraseña de conexion ftp"
              />
            </Grid>
          )}


          <Grid item xs={12} md={12} lg={12}>
            <label
              style={{
                userSelect: "none",
                fontSize: "19px",
                display: "inline-block",
                margin: "10px 0"
              }}>
              Modelo
            </label>
            <BoxOptionList
              optionSelected={modeloBalanzaDigi}
              setOptionSelected={setModeloBalanzaDigi}
              options={System.arrayIdValueFromObject(MODELOSDIGI, true)}
            />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>

            {trabajarConBalanzaDigi && (
              <SmallButton textButton="CONTROL PARA BALANZAS DIGI" actionButton={() => {
                setVerDigi(true)
              }} style={{
                backgroundColor: "green",
              }} />
            )}

          </Grid>
        </Grid>




      </Grid>

      {/* FIN BALANZA */}


      <BalanzaDigiControl openDialog={verDigi} setOpenDialog={setVerDigi} />


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

export default TabBalanzaDigi;
