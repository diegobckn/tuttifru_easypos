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
import { extraDefaultLlevar } from "../../Types/TExtra";

const Quitar = ({
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
    replaceToSalesData
  } = useContext(SelectedOptionsContext);


  const handleSelect = (prod) => {
    // console.log("quita ", prod)

    var nombreOriginal = prod.nombre + ""
    var nombreReemplazado = nombreOriginal.replace("SIN ", "")

    prod.nombre = nombreReemplazado
    prod.description = nombreReemplazado

    const copiaProduct = System.clone(product)
    copiaProduct.extras.quitar.push(System.clone(prod))

    replaceToSalesData(indexInSales, copiaProduct)
  }

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="lg">
      <DialogTitle>
        Quitar
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
              includeOnlyText={["SIN"]}
              replaceText={["SIN ,"]}
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

export default Quitar;
