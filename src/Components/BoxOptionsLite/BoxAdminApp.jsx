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


const BoxAdminApp = ({
  isVisible
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

  const [turnoAbierto, setTurnoAbierto] = useState(false);
  const [infoTurno, setInfoTurno] = useState(null);

  const [pedidos, setPedidos] = useState([]);

  const showMessageLoading = (msg) => {
    showMessage(msg)
    hideLoading()
  }

  return (
    <Box>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography variant="h5">Administracion de la App</Typography>
        </Grid>



        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BoxAdminAppTurno
            infoTurno={infoTurno}
            setInfoTurno={setInfoTurno}
            turnoAbierto={turnoAbierto}
            setTurnoAbierto={setTurnoAbierto}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <BoxAdminAppPedidos
            visible={turnoAbierto}
            pedidos={pedidos}
            setPedidos={setPedidos}
          />
        </Grid>




      </Grid>
    </Box >
  );
};

export default BoxAdminApp;
