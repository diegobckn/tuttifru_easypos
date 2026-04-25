import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxAdminAppTurno from "./BoxAdminAppTurno";
import BoxAdminAppPedidos from "./BoxAdminAppPedidos";
import System from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import Product from "../../Models/Product";
import { Check, WrongLocation } from "@mui/icons-material";


export default ({
  itemTicketDigi
}) => {
  const {
    userData,
    salesData,
    clearSessionData,
    clearSalesData,
    getUserData,
    setShowLoadingDialogWithTitle,
    showLoading,
    hideLoading,
    setShowLoadingDialog,
    showConfirm,
    showMessage,
    showAlert,

    suspenderYRecuperar,
    listSalesOffline,
    setListSalesOffline
  } = useContext(SelectedOptionsContext);

  const [info, setInfo] = useState(null)

  useEffect(() => {
    console.log("cambio algo de itemTicketDigi", itemTicketDigi)

    // if (itemTicketDigi) {
    //   Product.getInstance().findByCodigoBarras({
    //     codigoProducto: parseInt(itemTicketDigi.pluItem)
    //   }, (prods) => {

    //     if (prods.length > 0) {
    //       const prod = new ProductSold()
    //       prod.fill(prods[0])
    //       prod.cantidad = parseFloat(item.pesoItem) / 1000
    //       prod.updateSubtotal()
    //       prod.total = parseFloat(item.precioTotalItem)
    //       setInfo(prod)

    //     }
    //   }, (er) => {
    //     showAlert(er)
    //   })
    // }
    setInfo(itemTicketDigi)

    var precioUnitario = parseFloat(itemTicketDigi.precioUnitarioItem)
    var precioTotal = parseFloat(itemTicketDigi.precioTotalItem)
    var cantidad = parseFloat(itemTicketDigi.cantidadItem)
    var peso = parseFloat(itemTicketDigi.pesoItem)
    var cantidadOPeso = cantidad
    if (peso > 0) {
      cantidadOPeso = peso / 1000
    }

    if (precioUnitario <= 0 && precioTotal > 0 && cantidadOPeso > 0) {
      precioUnitario = precioTotal / cantidadOPeso
      itemTicketDigi.precioUnitarioItem = precioUnitario
    }

  }, [itemTicketDigi])

  const getNombre = (item) => {
    var nom = info.nombreItem

    if (nom.length > 30) {
      return (nom + "").substring(0, 30)
    }

    if (nom == "") {
      return "N/D"
    }
  }

  return (!info ? null : (
    <TableRow>
      <TableCell sx={{
        textAlign: "center"
      }}>{parseInt(info.pluItem)}</TableCell>
      <TableCell>{getNombre(info)}</TableCell>
      <TableCell>${System.formatMonedaLocal(info.precioUnitarioItem, false)}</TableCell>
      <TableCell>{info.cantidadItem}</TableCell>
      <TableCell>{info.pesoItem}</TableCell>
      <TableCell>${System.formatMonedaLocal(info.precioTotalItem, false)}</TableCell>
      <TableCell>{(info.inPos ? <Check sx={{
        color: "#00FF0D"
      }} /> : <WrongLocation sx={{
        color: "#f00"
      }} />)}</TableCell>
      <TableCell>
        {/* <SmallButton textButton={"Quitar"} actionButton={() => {
          quitar(ix)
        }} /> */}
      </TableCell>
    </TableRow>
  )
  );
};

