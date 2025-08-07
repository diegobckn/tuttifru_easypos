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
import BoxOptionListMulti from "../BoxOptionListMulti";
import BoxOptionList from "../BoxOptionList";
import System from "../../../Helpers/System";
import MetodosPago from "../../../definitions/MetodosPago";
import { EmitirDetalle } from "../../../definitions/BaseConfig";

const TabEmitirBoleta = ({
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

    setModoAvion
  } = useContext(SelectedOptionsContext);

  const [emitirBoleta, setEmitirBoleta] = useState(false)
  const [tienePasarelaPago, setTienePasarelaPago] = useState(false)
  const [excluirMediosEnBoleta, setExcluirMediosEnBoleta] = useState([])

  const [emitirDetalle, setEmitirDetalle] = useState(false)

  const loadConfigSesion = () => {
    setEmitirBoleta(ModelConfig.get("emitirBoleta"))
    setTienePasarelaPago(ModelConfig.get("tienePasarelaPago"))
    setExcluirMediosEnBoleta(ModelConfig.get("excluirMediosEnBoleta"))

    setEmitirDetalle(ModelConfig.get("emitirDetalle"))
  }

  const handlerSaveAction = () => {
    if (!ModelConfig.isEqual("emitirBoleta", emitirBoleta)) {
      setModoAvion(!emitirBoleta)
    }
    ModelConfig.change("emitirBoleta", emitirBoleta)

    ModelConfig.change("tienePasarelaPago", tienePasarelaPago)
    ModelConfig.change("excluirMediosEnBoleta", excluirMediosEnBoleta)

    ModelConfig.change("emitirDetalle", emitirDetalle)

    showMessage("Guardado correctamente")
    // onFinish()
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])

  return (
    <Grid container spacing={2} sx={{
      alignContent: "left",
      alignItems: "start"
    }}>

      <Grid item xs={12} md={12} lg={12} sx={{
        alignContent: "left",
        alignItems: "start"
      }}>
        <h3>Emision de Boleta</h3>
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[emitirBoleta, setEmitirBoleta]}
          label={"Emitir boleta"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[tienePasarelaPago, setTienePasarelaPago]}
          label={"Tiene pasarela de pago"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <label
          style={{
            userSelect: "none",
            fontSize: "19px",
            display: "inline-block",
            margin: "10px 0"
          }}>
          No emitir Boleta en:
        </label>
        <BoxOptionListMulti
          optionSelected={excluirMediosEnBoleta}
          setOptionSelected={setExcluirMediosEnBoleta}
          options={System.arrayIdValueFromObject(MetodosPago, true)}
        />

        <br />
        <br />
        <br />
      </Grid>


      <Grid item xs={12} md={12} lg={12}>
        <label
          style={{
            userSelect: "none",
            fontSize: "19px",
            display: "inline-block",
            margin: "10px 0"
          }}>
          Emitir detalles
        </label>
        <BoxOptionList
          optionSelected={emitirDetalle}
          setOptionSelected={setEmitirDetalle}
          options={System.arrayIdValueFromObject(EmitirDetalle, true)}
        />

        <br />
        <br />
        <br />
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

export default TabEmitirBoleta;
