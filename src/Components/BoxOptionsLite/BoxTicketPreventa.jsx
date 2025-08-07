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
import TecladoPagoCaja from "./../Teclados/TecladoPagoCaja"
import BoxSelectPayMethod from "./BoxSelectPayMethod"
import BotonClienteOUsuario from "../ScreenDialog/BotonClienteOUsuario";
import BuscarUsuario from "../ScreenDialog/BuscarUsuario";
import ProductSold from "../../Models/ProductSold";
import Validator from "../../Helpers/Validator";
import SmallButton from "../Elements/SmallButton";
import TicketPreventa from "../../Models/TicketPreventa";
import Printer from "../../Models/Printer";

const BoxTicketPreventa = ({ 
  onClose,
  openDialog,
  setOpenDialog
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
    setShowDialogSelectClient,
    showLoading,
    hideLoading

  } = useContext(SelectedOptionsContext);

  const [productosConEnvases, setProductosConEnvases] = useState([]);
  
  useEffect(() => {
     console.log("carga ticket")
      checkEnvases()
  }, []);

  const checkEnvases = ()=>{
    var tieneAlguno = false
    salesData.forEach((pro)=>{
      if(pro.isEnvase)
        tieneAlguno = true
    })

    if(tieneAlguno){
      setProductosConEnvases([...salesData])
    }

    return tieneAlguno
  }



  
  const changeQuantityIfEnvase = (prod, index ,newQuantity) => {
    if(!prod.isEnvase) return
    if(!Validator.isCantidad(newQuantity))return false

    const orig = ProductSold.getOwnerByEnvase(prod, productosConEnvases)
    if(newQuantity> orig.quantity || newQuantity<0) {
      return
    }

    const prods = productosConEnvases
    prods[index].quantity = newQuantity
    prods[index].updateSubtotal()
    setProductosConEnvases([...prods])
  }


  const onGenerarTicketClick = ()=>{
    showLoading("Generando ticket...")
    const requestBody = {
      idUsuario: userData.codigoUsuario,
      idCabecera: 0,
      codigoClienteSucursal: 0,
      codigoCliente: 0, // despues abajo se cambia si es necesario
      codigoUsuarioVenta: userData.codigoUsuario, // despues abajo se cambia si es necesario
      total: grandTotal,

      products: productosConEnvases.map((producto) => {
        const esEnvase = ProductSold.esEnvase(producto)
        if(esEnvase){
        const owner = ProductSold.getOwnerByEnvase(producto,productosConEnvases)
        const difcant = owner.quantity - producto.quantity
        return ({
          codProducto: 0,
          codbarra: (producto.idProducto + ""),
          cantidad: System.getInstance().typeIntFloat(difcant),
          precioUnidad: producto.price,
          descripcion: producto.description,
        })

        }else{
          
          return({
            codProducto: 0,
            codbarra: (producto.idProducto + ""),
            cantidad: System.getInstance().typeIntFloat(producto.quantity),
            precioUnidad: producto.price,
            descripcion: producto.description,
          })
        }
    }
    ),
      metodoPago: "",
    };

    if(cliente){
      requestBody.codigoCliente = cliente.codigoCliente
      requestBody.codigoClienteSucursal = cliente.codigoClienteSucursal
    }
    
    var MTicket = new TicketPreventa();
    MTicket.fill(requestBody);
    
    MTicket.hacerTicket(requestBody,(response)=>{
      
      showMessage(response.descripcion?? 'Realizado correctamente');
      clearSalesData();
      setSelectedUser(null);
      hideLoading()
      console.log("antes de printall")
      Printer.printAll(response)
      setOpenDialog(false)
      setTextSearchProducts("")
    }, (error)=>{
      console.error("Error al realizar el ticket:", error);
      showMessage("Error al realizar el ticket");
      hideLoading()
      setOpenDialog(false)
    })
  }

  return (
    <>

      <Grid container spacing={2} style={{
      }}>

        <Grid item xs={10} sm={10} md={10} lg={10} style={{
          textAlign:"right",
        }}>

          <Typography style={{
            color:"rgb(225, 33, 59)",
            fontSize: "25px",
            fontWeight: "bold",
            fontFamily: "Victor Mono"
            }}>
            Total: $
            {grandTotal}
          </Typography>

          
          <table width="100%" cellPadding={5} cellSpacing={0} style={{
            border:"2px solid #1b1b1ba3"
          }}>
            <tbody>

              {productosConEnvases.map((prod, index) => {
                if(prod.isEnvase){
                  const original = ProductSold.getOwnerByEnvase(prod, productosConEnvases)
                return(
                  <tr key={index} style={{
                    backgroundColor:(index  % 2 == 0 ? "#f3f3f3" : "#dfdfdf")
                  }}>
                    <td>
                    <Typography
                      style={{
                        width: "60px",
                        height: "60px",
                        border:"1px solid #a09797",
                        borderRadius:"5px",
                        alignContent:"center",
                        backgroundColor:"#f5f5f5",
                        textAlign:"center"
                      }}
                      >{prod.quantity === 0 ? "0" : prod.quantity}</Typography>
                      </td>
                      <td style={{textAlign:"left"}}>
                        <SmallButton style={{
                          height:"45px",
                          width:"45px",
                          backgroundColor:"#6c6ce7",
                          fontSize:"25px",
                          margin:"0",

                          color:"white"
                        }}
                        withDelay={false}
                        actionButton={()=>{
                          changeQuantityIfEnvase(prod,index,prod.quantity-1)
                        }}
                        textButton={"-"} />
                      </td>
                      <td style={{textAlign:"left"}}>
                        <SmallButton style={{
                          height:"45px",
                          width:"45px",
                          backgroundColor:"#6c6ce7",
                          fontSize:"25px",
                          margin:"0",
                          color:"white"
                        }}
                        withDelay={false}
                        actionButton={()=>{
                          changeQuantityIfEnvase(prod,index,prod.quantity+1)
                        }}
                        textButton={"+"} />
                      </td>
                      
                      <td style={{textAlign:"left"}}>
                    <Typography>{prod.description}</Typography>
                      </td>
                      <td>
                      ${System.getInstance().en2Decimales(prod.total)}
                      </td>
                  </tr>
                )
                }
              }
            )}
            </tbody>
          </table>
        </Grid>

        <Grid item xs={10} sm={10} md={10} lg={10} style={{
          textAlign:"right",
        }}>
          <SmallButton
            actionButton={()=>{
              onGenerarTicketClick()
            }}

            textButton={"Generar ticket"}

            style={{
              width:"250px",
              height:"50px"
            }}
          />

          <Button onClick={()=>{
            setOpenDialog(false)
          }}>Atras</Button>
        </Grid>





      </Grid>

    </>
  );
};

export default BoxTicketPreventa;
