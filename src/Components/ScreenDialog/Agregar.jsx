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
  TextField
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

const Agregar = ({
  openDialog,
  setOpenDialog,
  product,
  indexInSales
}) => {

  const {
    showPrintButton,
    setShowPrintButton,
    suspenderYRecuperar,
    setSuspenderYRecuperar,
    showAlert,
    showConfirm,
    sales,
    addToSalesData,
    setSalesData
  } = useContext(SelectedOptionsContext);

  const handleSelect = (prod) => {
    // console.log("agrega ", prod)

    var nombreOriginal = prod.nombre + ""
    var nombreReemplazado = nombreOriginal.replace("AGREGA ", "")

    prod.nombre = nombreReemplazado
    prod.description = nombreReemplazado
    product.extras.agregar.push(System.clone(prod))

    prod.nombre = nombreOriginal
    prod.description = nombreOriginal

    prod.ocultarEnListado = true
    prod.esAgregado = true
    sales.actualizarSesion()
    setSalesData(sales.loadFromSesion())
  }

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="lg">
      <DialogTitle>
        Agregar
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="body4" color="black">
              {product.description}
            </Typography>
          </Grid>


          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TableSelecProductNML
              title={""}
              show={true}
              categoryId={1}
              subcategoryId={1}
              familyId={1}
              subfamilyId={1}
              onSelect={handleSelect}
              includeOnlyText={["AGREGA"]}
              replaceText={["AGREGA ,"]}
            />

          </Grid>

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

export default Agregar;
