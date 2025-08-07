import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import SendingButton from "../Elements/SendingButton";
import TecladoNumeros from "../Teclados/TecladoNumeros";

const BoxBuscarEnvases = ({ 
  folio, setFolio,
  qr, setQr,
  onEnter = null
}) => {
  const {
    userData,
    salesData,
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
    showDialogSelectClient,
    setShowDialogSelectClient

  } = useContext(SelectedOptionsContext);

  const[qrOFolio, setQrOFolio] = useState(null)
  const inputRef = useRef(null)

  const changeFolio = (newValue) =>{
    // if((newValue + "").indexOf(".")<0 && Validator.isNumeric(newValue) && newValue<100){
    if(Validator.isNumeric(newValue)){
      setFolio(newValue)
      setQrOFolio(newValue)
      setQr("")
      return
    }else{
      setQr(newValue)
      setQrOFolio(newValue)
      setFolio(0)
    }
    // }
  }


  useEffect(()=>{
    System.intentarFoco(inputRef)
  }, [inputRef])

  useEffect(()=>{
    setQr("")
    setQrOFolio("")
    setFolio(0)
  },[])

  return (
    <Box>

      <Grid container spacing={2}>

        <Grid item xs={12} md={5} lg={5} style={{
          textAlign:"right",
          maxWidth: "inherit",
          maxHeight: "inherit",
        }}>
          
          <TextField
            margin="dense"
            fullWidth
            label="Folio o QR"
            value={qrOFolio || ""}
            onChange={(e) => {
              changeFolio(e.target.value)
            }}

            onKeyDown={(e) => {
              if(e.key == "Enter"){
                if(onEnter) onEnter()
              }
            }}
            ref={inputRef}
          />
        </Grid>


        <Grid item xs={12} md={7} lg={7}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >

        <TecladoNumeros 
          showFlag={true} 
          varValue={folio} 
          varChanger={(x)=>{
            changeFolio(x)
          }} 
          maxValue={1000}
          onEnter={()=>{
            if(onEnter) onEnter()
          }}
          />
          <div style={{
            height:"100px"
          }}></div>
            
          </Grid>
        </Grid>


      </Grid>
    </Box>
  );
};

export default BoxBuscarEnvases;
