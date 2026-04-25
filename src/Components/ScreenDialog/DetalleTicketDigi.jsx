/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,

  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField,
  Paper
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import IngresarTexto from "./IngresarTexto";
import BalanzaDigi from "../../Models/BalanzaDigi";
import Product from "../../Models/Product";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ProductSold from "../../Models/ProductSold";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallPrimaryButton from "../Elements/SmallPrimaryButton";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import TableListItemsTicketDigi from "../BoxOptionsLite/TableListItemsTicketDigi";



export default ({
  openDialog,
  setOpenDialog,
  itemTicket52,
  listado51
}) => {

  const {
    addToSalesData,
    userData,
    salesData,
    grandTotal,
    setSelectedUser,
    setTextSearchProducts,
    clearSalesData,

    cliente,
    setCliente,
    setAskLastSale,
    showMessage,
    showLoading,
    hideLoading,
    setShowDialogSelectClient,
    modoAvion,
    showAlert,
    setUltimoVuelto,
    sales,
    setSolicitaRetiro,
    showConfirm,
    setListSalesOffline,
    createQrString,
  } = useContext(SelectedOptionsContext);

  const [items, setItems] = useState([])

  useEffect(() => {
    if (!openDialog) return

    console.log("viendo detalles de ", itemTicket52)
    console.log("info 51 ", listado51)

    var ls = []
    listado51.forEach((item51)=>{
      if(item51.nroVale == itemTicket52.nroVale){
        ls.push(item51)
      }
    })

    setItems(ls)
  }, [openDialog])

  return (
    <Dialog
      open={openDialog} onClose={() => { }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Detalle de ticket
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">

            </Typography>
          </Grid>

          <TableListItemsTicketDigi listadoItems={items} />

          <Grid item xs={12} sm={12} md={12} lg={12}>
            {/* <Typography>Total ${System.formatMonedaLocal(total, false)}</Typography> */}
          </Grid>

        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Volver</Button>
      </DialogActions>
    </Dialog>
  );
};

