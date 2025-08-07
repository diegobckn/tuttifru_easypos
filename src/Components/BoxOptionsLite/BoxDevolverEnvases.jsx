import React, { useContext, useState, useEffect } from "react";
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

const BoxDevolverEnvases = ({ 
  dataBusqueda,
  step,
  onChange
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

  const [cantidad, setcantidad] = useState(0)
  const [cantidadMax, setcantidadMax] = useState(0)
  const [precioUnitario, setprecioUnitario] = useState(0)

  useEffect(()=>{
    if(step!= 2) return

    console.log("paso 2 correcto")
    setcantidadMax(dataBusqueda.gestionEnvases[0].cantidad)
    setcantidad(1)
    setprecioUnitario(dataBusqueda.gestionEnvases[0].precioUnitario)


  },[step])

  const decQuantity = ()=>{
    if(cantidad <= 1 ) return
    
    setcantidad(cantidad - 1)
  }
  
  const addQuantity = ()=>{
    if(cantidad >= cantidadMax ) return
    setcantidad(cantidad + 1)
  }

  useEffect(()=>{
    onChange({
      cantidad: cantidad
    })
  },[cantidad])

  return (
    <Box sx={{
      width:"100%"
    }}>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5} lg={5}>

          <table style={{
            maxWidth: "400px",
            maxHeight: "inherit",
          }}>
            <tr>
            <td colSpan={5} style={{ textAlign:"center"}}>
              <Typography>Cantidad a devolver</Typography>
              </td>
              </tr>
            <tr>
              <td>

              <SmallButton style={{
                position:"relative",
                height:"52px",
                top:"2px",
                width:"45px",
                backgroundColor:"#6c6ce7",
                fontSize:"25px",
                margin:"0",
                color:"white"
              }}
              withDelay={false}
              actionButton={()=>{
                decQuantity()
              }}
              textButton={"-"} />
              </td>
              <td>
            
            


              <TextField
              value={cantidad}
              onChange={(event) => {
                // handleChangeQuantityProductSold(event)
              }}
              
              onClick={()=>{
                // if(!product.isEnvase) prepareTecladoChangeQuantity()
              }}
              style={{
                marginLeft: "0",
                width: 60,
                fontSize: 2,
                height:"52px",
                alignContent:"center",
                alignItems:"center",
                textAign:"center"
              }}
              />
              </td>
              <td>
              
                <SmallButton style={{
                  position:"relative",
                  height:"52px",
                  top:"2px",
                  
                  width:"45px",
                  backgroundColor:"#6c6ce7",
                  fontSize:"25px",
                  margin:"0",
                  color:"white"
                }}
                withDelay={false}
                actionButton={()=>{
                  addQuantity()
                }}
                textButton={"+"} />
              </td>
              </tr>

              <tr>
                <td colSpan={10}>{" "}</td>
              </tr>

              <tr>
                <td colSpan={5} style={{ padding:"20px 0 0 0", textAlign:"right "}}>
                <Typography>Precio unitario</Typography>
                </td>
              </tr>
              <tr>
                <td colSpan={5} style={{ padding:"0 0 20px 0", textAlign:"right "}}>
                <Typography>${precioUnitario}</Typography>

                </td>
              </tr>

              <tr>
                <td colSpan={5} style={{ padding:"20px 0 0 0", textAlign:"right "}}>
                <Typography>Total</Typography>
                </td>
                </tr>
                <tr>
                <td colSpan={5} style={{ padding:"0 0 20px 0", textAlign:"right "}}>
                <Typography>${precioUnitario * cantidad}</Typography>

                </td>
              </tr>


              <tr>
                <td colSpan={5} style={{ padding:"20px 0 0 0", textAlign:"right "}}>
                <Typography>Cantidad a saldar</Typography>
                </td>
                </tr>
                <tr>
                <td colSpan={5} style={{ padding:"0 0 20px 0", textAlign:"right "}}>
                <Typography>{cantidadMax} unidades</Typography>

                </td>
              </tr>

              </table>

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
          varValue={cantidad} 
          varChanger={(x)=>{
            setcantidad(x)
          }} 
          maxValue={1000}
          onEnter={()=>{
            
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

export default BoxDevolverEnvases;
