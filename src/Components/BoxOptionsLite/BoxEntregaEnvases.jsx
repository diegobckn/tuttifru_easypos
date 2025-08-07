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

const BoxEntregaEnvases = ({
  onClose,
  tieneEnvases, settieneEnvases,
  products,
  productosConEnvases, setProductosConEnvases,
  descuentoEnvases, setDescuentoEnvases,

  reload = false
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


  const updateDescuentosEnvases = (productos) => {
    var descuentos = 0
    productos.forEach((pro) => {
      if (pro.isEnvase) {
        descuentos += pro.total
      }
    })
    setDescuentoEnvases(descuentos)
    // setVuelto(calcularVuelto());
  }

  const checkEnvases = () => {
    var tieneAlguno = false
    var descuentosDeEnvases = 0

    var copiaSales = JSON.parse(JSON.stringify(products))
    // console.log("checkEnvases de prods", copiaSales)

    copiaSales.forEach((pro) => {
      if (pro.isEnvase) {
        tieneAlguno = true
        // pro.quantity = 0
        // pro.updateSubtotal()
        descuentosDeEnvases += pro.total
      }
    })

    settieneEnvases(tieneAlguno)
    setProductosConEnvases(copiaSales)
    setDescuentoEnvases(descuentosDeEnvases)
  }

  const changeQuantityIfEnvase = (prod, index, newQuantity) => {
    if (!prod.isEnvase) return
    if (newQuantity !== 0 && !Validator.isCantidad(newQuantity)) return false

    const orig = ProductSold.getOwnerByEnvase(prod, productosConEnvases)
    if (newQuantity > orig.quantity || newQuantity < 0) {
      return
    }

    const prods = productosConEnvases
    var stSold = ProductSold.getInstance()
    prods[index].quantity = newQuantity
    stSold.fill(prods[index])
    prods[index].total = stSold.getSubTotal()

    setProductosConEnvases(prods)
    updateDescuentosEnvases(prods)

  }


  // OBSERVERS

  useEffect(() => {

    // console.log("useefect de Envases", System.clone(products))
    if (products.length < 1) {
      return
    }
    checkEnvases()
  }, [products]);
  // }, [reload]);



  return (
    <table width="100%" cellPadding={5} cellSpacing={0} style={{
      border: "0px solid #1b1b1ba3"
    }}>
      <tbody>
        {tieneEnvases && (
          <tr>
            <td colSpan={10} style={{
              textAlign: "left"
            }}>Envases que entrega el cliente</td>
          </tr>
        )}

        {productosConEnvases.map((prod, index) => {
          if (prod.isEnvase) {
            const original = ProductSold.getOwnerByEnvase(prod, productosConEnvases)
            return (
              <tr key={index} style={{
                backgroundColor: (index % 2 == 0 ? "#f3f3f3" : "#dfdfdf")
              }}>
                <td>
                  <Typography
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #a09797",
                      borderRadius: "5px",
                      alignContent: "center",
                      backgroundColor: "#f5f5f5",
                      textAlign: "center"
                    }}
                  >{prod.quantity === 0 ? "0" : prod.quantity}</Typography>
                </td>
                <td style={{ textAlign: "left" }}>
                  <SmallButton style={{
                    height: "45px",
                    width: "45px",
                    backgroundColor: "#6c6ce7",
                    fontSize: "25px",
                    margin: "0",

                    color: "white"
                  }}
                    withDelay={false}
                    actionButton={() => {
                      changeQuantityIfEnvase(prod, index, prod.quantity - 1)
                    }}
                    textButton={"-"} />
                </td>
                <td style={{ textAlign: "left" }}>
                  <SmallButton style={{
                    height: "45px",
                    width: "45px",
                    backgroundColor: "#6c6ce7",
                    fontSize: "25px",
                    margin: "0",
                    color: "white"
                  }}
                    withDelay={false}
                    actionButton={() => {
                      changeQuantityIfEnvase(prod, index, prod.quantity + 1)
                    }}
                    textButton={"+"} />
                </td>

                <td style={{ textAlign: "left" }}>
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
  );
};

export default BoxEntregaEnvases;
