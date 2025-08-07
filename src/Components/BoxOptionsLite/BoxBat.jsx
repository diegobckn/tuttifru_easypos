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
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import PagoBoleta from "../../Models/PagoBoleta";
import TecladoPagoCaja from "../Teclados/TecladoPagoCaja"
import BoxSelectPayMethod from "./BoxSelectPayMethod"
import BotonClienteOUsuario from "../ScreenDialog/BotonClienteOUsuario";
import BuscarUsuario from "../ScreenDialog/BuscarUsuario";
import ProductSold from "../../Models/ProductSold";
import Validator from "../../Helpers/Validator";
import SmallButton from "../Elements/SmallButton";
import Client from "../../Models/Client";
import Printer from "../../Models/Printer";
import LastSale from "../../Models/LastSale";
import PagoTransferencia from "../ScreenDialog/PagoTransferencia";
import { TabContainer } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import { RemoveCircleOutline } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

const BoxBat = ({
    
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


  
  const descargaBatEdge = function() {
    const urlActual = window.location.href
    // var contenido = `start /B "" "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --kiosk-printing ` + urlActual + ` --edge-kiosk-type=public-browsing`;
    var contenido = `start /B "" "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe" --app="` + urlActual + `" --kiosk-printing --new-window --user-data-dir="%temp%\\kiosco_sesion"`;
    descargarDoc("EasyPos-Edge.bat", contenido);
  
  }

  const descargaBatChrome = function() {
    const urlActual = window.location.href
    // var contenido = `start /B "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --kiosk-printing ` + urlActual + ` --edge-kiosk-type=public-browsing`;
    var contenido = `start /B "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --app="` + urlActual + `" --kiosk-printing --new-window --user-data-dir="%temp%\\kiosco_sesion"`;
    descargarDoc("EasyPos-Chrome.bat", contenido);
  
  }
  
  const descargarDoc = function(filename, data) {
    var blob = new Blob([data], {
      type: 'text/plain'
    });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }
  
  // OBSERVERS


  return (
    <Grid item xs={12} sm={12} md={12} lg={12} sx={{
      marginTop:"20px",
      border:"1px solid #ccc",
      padding:"10px",
      textAlign:"center"
    }}>
      <Typography>Descargar Bat</Typography>
      <Button sx={{
        backgroundColor:"#5315EE",
        color:"white",
        border:"2px solid blue",
        margin:"0 5px",
        "&:hover": {
          backgroundColor:"#9671F4",
          color:"black",
        }
      }} onClick={descargaBatEdge}>Edge</Button>

      <Button sx={{
        backgroundColor:"#368A0F",
        color:"white",
        border:"2px solid darkgreen",
        "&:hover": {
          color:"black",
          backgroundColor:"#5FF14F",
        }
      }} onClick={descargaBatChrome}>Chrome</Button>
    </Grid>
  );
};

export default BoxBat;
