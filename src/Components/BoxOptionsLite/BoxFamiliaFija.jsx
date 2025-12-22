import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxProductoFamilia from "./BoxProductoFamilia";
import ModelConfig from "../../Models/ModelConfig";


const BoxFamiliaFija = ({
  whenApply = ()=>{}
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

  const [fijarFamilia, setFijarFamilia] = useState(false)

  useEffect(() => {
    setFijarFamilia(ModelConfig.get("fijarFamilia"))
  }, [])

  useEffect(() => {
    if(fijarFamilia){
      whenApply()
    }
  }, [fijarFamilia])

  return fijarFamilia ? (
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
          <BoxProductoFamilia />
        </Grid>
        <Grid item xs={12}>
        </Grid>
      </Grid>
    </Paper>
  ) : null;
}

  export default BoxFamiliaFija;
