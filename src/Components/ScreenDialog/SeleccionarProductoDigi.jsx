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
import TableItemTicketDigi from "../BoxOptionsLite/TableItemTicketDigi";
import TableListItemsTicketDigi from "../BoxOptionsLite/TableListItemsTicketDigi";

export default ({
  openDialog,
  setOpenDialog,
  listadoItems = [],
  onSelect = () => { }
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

  const balanza = new BalanzaDigi()


  return (
    <Dialog
      open={openDialog} onClose={() => { }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Seleccionar producto
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>



          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableContainer
              component={Paper}
            // style={{
            //   overflowX: "auto"
            // }}
            >
              <Table>
                <TableHead sx={{
                  background: "#859398",
                  // height: "30%"
                  // height: "60px"
                }}>
                  <TableRow>
                    <TableCell sx={{
                      textAlign: "center"
                    }}>
                      Codigo
                    </TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{
                  // maxHeight: "400px",
                  // maxHeight: "200px",
                  // overflowY: "auto"
                }}>
                  {listadoItems.map((itemDigi, ix) => (
                    <TableRow key={ix}>
                      <TableCell>{itemDigi.plu}</TableCell>
                      <TableCell>{itemDigi.nombre}</TableCell>
                      <TableCell>${System.formatMonedaLocal(itemDigi.precio)}</TableCell>
                      <TableCell>
                        <SmallButton
                          textButton={"Seleccionar"}
                          actionButton={() => {
                            onSelect(itemDigi)
                          }} />
                      </TableCell>
                    </TableRow>
                  )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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