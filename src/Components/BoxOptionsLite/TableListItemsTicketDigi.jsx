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
import TableItemTicketDigi from "./TableItemTicketDigi";


export default ({
  listadoItems
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

  const showMessageLoading = (msg) => {
    showMessage(msg)
    hideLoading()
  }

  useEffect(() => {
    console.log("listadoItems", listadoItems)
  }, [listadoItems])

  return (
    <Box>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography variant="h5">Items de ticket de balanza Digi</Typography>
        </Grid>


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
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Peso</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>En pos</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{
                // maxHeight: "400px",
                // maxHeight: "200px",
                // overflowY: "auto"
              }}>
                {listadoItems.map((itemDigi, ix) =>
                  itemDigi.borradoLogico ? null : (<TableItemTicketDigi
                    key={ix}
                    itemTicketDigi={itemDigi}
                  />)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>


      </Grid>
    </Box >
  );
};

