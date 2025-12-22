import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxBusquedaRapida from "./BoxBusquedaRapida";
import ModelConfig from "../../Models/ModelConfig";


const BoxBusquedaRapidaFija = ({
  whenApply = () => { }
}) => {
  const {
    userData,
    salesData,
    clearSessionData,
    clearSalesData,
    getUserData,
    setShowLoadingDialogWithTitle,
    hideLoadingDialog,
    setShowLoadingDialog,
    showConfirm,
    showMessage,
    showAlert,

    suspenderYRecuperar,
  } = useContext(SelectedOptionsContext);

  const [fijarBusquedaRapida, setFijarBusquedaRapida] = useState(false)

  useEffect(() => {

    setFijarBusquedaRapida(ModelConfig.get("fijarBusquedaRapida"))

  }, [])

  useEffect(() => {

    if (fijarBusquedaRapida) {
      whenApply()
    }
  }, [fijarBusquedaRapida])

  return fijarBusquedaRapida ? (
    <Paper
      elevation={3}
      style={{
        backgroundColor: "#859398",
        padding: "10px",
        width: "100%",
        // height:"200px"
      }}
    >
      <Grid container spacing={2} >

        <Grid item xs={12}>
          <BoxBusquedaRapida show={true} />
        </Grid>
        <Grid item xs={12}>
        </Grid>
      </Grid>
    </Paper>
  ) : null;
}

export default BoxBusquedaRapidaFija;
