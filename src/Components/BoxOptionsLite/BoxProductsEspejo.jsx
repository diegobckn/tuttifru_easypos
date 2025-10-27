import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  Snackbar,
  IconButton,
  Table,
  Autocomplete,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Popper,
  Grow,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Slider,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Swal from "sweetalert2";

import RemoveIcon from "@mui/icons-material/Remove";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import System from "../../Helpers/System";
import Validator from "../../Helpers/Validator";
import ProductSold from "../../Models/ProductSold";
import Client from "../../Models/Client";
import SmallButton from "../Elements/SmallButton";
import IngresarNumeroORut from "../ScreenDialog/IngresarNumeroORut";
import SearchProductItem from "../Elements/SearchProductItem";
import SoldProductItem from "../Elements/SoldProductItem";
import ModelConfig from "../../Models/ModelConfig";
import Preventa from "../../Models/Preventa";
import ProductCodeStack from "../../Models/ProductCodeStack";
import Balanza from "../../Models/Balanza";
import BalanzaUnidad from "../../Models/BalanzaUnidad";
import dayjs from "dayjs";
import CardSemaforo from "./CardSemaforo";
import RefreshInfoControl from "./RefreshInfoControl";
import Model from "../../Models/Model";
import Sales from "../../Models/Sales";
import OrdenListado from "../../definitions/OrdenesListado";

const BoxProductsEspejo = ({ }) => {
  const {
    sales,
    salesData,
    cliente,
    setCliente,

    setSalesData,
    grandTotal,
    setGrandTotal,
    addToSalesData,
    removeFromSalesData,
    quantity,
    setQuantity,
    clearSalesData,

    showMessage,
    showConfirm,

    textSearchProducts,
    setTextSearchProducts,
    buscarCodigoProducto,
    setBuscarCodigoProducto,
    showTecladoBuscar,
    setShowTecladoBuscar,
    addNewProductFromCode,
    hideLoading,
    showLoading,
  } = useContext(SelectedOptionsContext);

  useEffect(() => {
    // ProductCodeStack.processFunction = procesarBusqueda
    // setCargado(true)
  }, [])

  return (
    <Paper
      elevation={13}
      sx={{
        background: "#859398",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        justifyContent: "center",
      }}

    >




      <Grid item xs={12}>
        <Paper
          elevation={1}
          sx={{
            background: "#859398",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px",
            width: "99%",
            // maxHeight: (System.getInstance().getWindowHeight() / 2),
            // overflow: "auto",
          }}
        >
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
                  }}>Cantidad</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Total</TableCell>
                  {/* <TableCell>Eliminar</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody style={{
                // maxHeight: "400px",
                // maxHeight: "200px",
                // overflowY: "auto"


              }}>
                {salesData.map((productx, indexx, all) => {

                  var index = indexx
                  if (ModelConfig.get("ordenMostrarListado") == OrdenListado.Descendente) {
                    index = all.length - 1 - indexx
                  }

                  const product = all[index]

                  return (
                    <SoldProductItem
                      product={product}
                      itemIndex={index}
                      key={index}
                      canDelete={false}
                      canChangeQuantity={false}
                    />
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
        </Paper>
        {/* <Paper
            sx={{
              width: "99%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              padding: "21px",
              margin: "5px",
            }}
            elevation={18}
          >
            <Typography sx={{ fontSize: "25px", }}>Total: ${System.getInstance().en2Decimales(grandTotal)}</Typography>
          </Paper> */}
      </Grid>
    </Paper >

  );
};

export default BoxProductsEspejo;
