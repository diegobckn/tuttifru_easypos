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

  TableContainer,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import SystemHelper from "../../../Helpers/System";
import SmallButton from "../../Elements/SmallButton";
import System from "../../../Helpers/System";
import TecladoPrecio from "../../Teclados/TecladoPrecio";
import MainButton from "../../Elements/MainButton";
import TableSelecSubFamily from "./TableSelecSubFamily";
import TableSelecProductNML from "./TableSelecProductNML";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import { extraDefault, extraDefaultLlevar } from "../../../Types/TExtra";
import Product from "../../../Models/Product";
import TableSelecProductFromList from "./TableSelecProductFromList";
import TableSelecProduct from "./TableSelecProduct";
import BuscarProducto from "../../ScreenDialog/BuscarProducto";
import SmallPrimaryButton from "../../Elements/SmallPrimaryButton";
import SmallDangerButton from "../../Elements/SmallDangerButton";

const SeleccionarProductos = ({
  openDialog,
  setOpenDialog,
  productosSeleccionados,
  setProductosSeleccionados,

  onConfirm = (prods) => { },
  txtButtonConfirm = "Confirmar"
}) => {

  const {
    showPrintButton,
    setShowPrintButton,
    suspenderYRecuperar,
    setSuspenderYRecuperar,
    showAlert,
    showLoading,
    hideLoading,
    showConfirm,
    sales,
    addToSalesData,
    setSalesData
  } = useContext(SelectedOptionsContext);

  const [verSeleccionarProducto, setVerSeleccionarProducto] = useState(false)


  const handleSelect = (prod) => {
    var prods = System.clone(productosSeleccionados)
    prods.push(prod)
    setProductosSeleccionados([])

    setTimeout(() => {
      setProductosSeleccionados(prods)
    }, 300);
  }

  const agregarLosPesables = (prod, ix) => {
    showLoading("agregando pesables")
    var paraAgregar = []
    Product.getInstance().getAll((prods) => {
      paraAgregar = []
      prods.forEach((prod) => {
        if (prod.tipoVenta == 2) {
          paraAgregar.push(prod)
        }
      })

      hideLoading()
      setProductosSeleccionados(paraAgregar)
    })

  }

  const quitar = (prod, ix) => {

    var prods = System.clone(productosSeleccionados.filter((pr, ind) => ind != ix))
    setProductosSeleccionados([])

    setTimeout(() => {
      setProductosSeleccionados(prods)
    }, 300);
  }

  useEffect(() => {
    if (!openDialog) return


  }, [openDialog])

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false)
      }} maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Seleccionar productos
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} sm={12} md={12} lg={12}>


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
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosSeleccionados.map((prod, ix) => (
                    <TableRow key={ix}>
                      <TableCell sx={{
                        textAlign: "center"
                      }}>{parseInt(prod.idProducto)}</TableCell>
                      <TableCell>{prod.nombre}</TableCell>
                      <TableCell>${System.formatMonedaLocal(prod.precioVenta, false)}</TableCell>
                      <TableCell>
                        <SmallButton textButton={"Quitar"} actionButton={() => {
                          quitar(prod, ix)
                        }} />
                      </TableCell>
                    </TableRow>
                  )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>

            <Typography> {productosSeleccionados.length} seleccionados </Typography>

          </Grid>

        </Grid>

      </DialogContent>
      <DialogActions>

        <BuscarProducto
          openDialog={verSeleccionarProducto}
          setOpenDialog={setVerSeleccionarProducto}
          onSelect={handleSelect}
        />

        <SmallPrimaryButton
          style={{
            width: "inherit",
            height: "60px"
          }}
          textButton={"Agregar todos los pesables"}
          actionButton={() => {
            agregarLosPesables()
          }} />


        <SmallButton
          style={{
            width: "inherit",
            height: "60px"
          }}
          textButton={"Agregar Producto"}
          actionButton={() => {
            setVerSeleccionarProducto(true)
          }} />

          <SmallDangerButton
            style={{
              width: "inherit",
              height: "60px"
            }}
            isDisabled={productosSeleccionados.length < 1}
            textButton={"Quitar todos"}
            actionButton={() => {
              setProductosSeleccionados([])
            }} />
            
        <SmallButton
          textButton={txtButtonConfirm}
          actionButton={() => {
            onConfirm(productosSeleccionados)
            setOpenDialog(false)
          }}
          isDisabled={productosSeleccionados.length < 1}
          style={{
            width: "inherit",
            height: "60px",
            marginRight: "100px !important"
          }}
        />


        <Button onClick={() => {
          setOpenDialog(false)
        }}>Volver</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeleccionarProductos;
