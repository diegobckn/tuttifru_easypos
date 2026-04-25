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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField,
  Chip
} from "@mui/material";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import MainButton from "../Elements/MainButton";
import TableSelecSubFamily from "../BoxOptionsLite/TableSelect/TableSelecSubFamily";
import TableSelecProductNML from "../BoxOptionsLite/TableSelect/TableSelecProductNML";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { extraDefault, extraDefaultLlevar } from "../../Types/TExtra";
import Product from "../../Models/Product";
import TableSelecProductFromList from "../BoxOptionsLite/TableSelect/TableSelecProductFromList";
import SmallGrayButton from "../Elements/SmallGrayButton";
import SmallDangerButton from "../Elements/SmallDangerButton";
import Client from "../../Models/Client";



const TarjetaCliente = ({
  openDialog,
  setOpenDialog,
}) => {

  const {
    cliente,
    setCliente,
    showPrintButton,
    setShowPrintButton,
    suspenderYRecuperar,
    setSuspenderYRecuperar,
    showAlert,
    showLoading,
    hideLoading,
    showConfirm,
    sales,
    salesData,
    setAskLastSale,
    clearSalesData,
    addToSalesData,
    setShowDialogSelectClient,
    setSalesData
  } = useContext(SelectedOptionsContext);



  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="lg">
      <DialogTitle>
        Cliente
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} sm={12} md={12} lg={12}>

          <Chip
            label={(cliente != null ? (cliente.nombreResponsable + " " + cliente.apellidoResponsable) : "Seleccionar cliente")}
            sx={{
              borderRadius: "6px",
              backgroundColor: "white",
              width: "60%",
            }}>
          </Chip>
          {!cliente ? (

            <SmallGrayButton
              textButton="Seleccionar Cliente"
              actionButton={() => {
                if (salesData.length > 0) {
                  showConfirm("Se quitaran todos los productos agregados. Continuar igualmente?", () => {
                    clearSalesData();
                    setAskLastSale(true)
                    setShowDialogSelectClient(true)
                  })
                } else {
                  setAskLastSale(true)
                  setShowDialogSelectClient(true)
                }
              }}
            />
          ) : (
            <SmallDangerButton
              style
              textButton="Deseleccionar Cliente"
              actionButton={() => {
                if (salesData.length > 0) {
                  showConfirm("Se quitaran todos los productos agregados. Continuar igualmente?", () => {
                    clearSalesData();
                    setCliente(null)
                    Client.getInstance().sesion.truncate()
                  })
                } else {
                  setCliente(null)
                  Client.getInstance().sesion.truncate()
                }
              }}
            />
          )}

        </Grid>

      </DialogContent>
      <DialogActions>
        {/* <SmallButton textButton="Confirmar" actionButton={handlerSaveAction}/> */}
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Volver</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TarjetaCliente;
