import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import MainButton from "../Elements/MainButton";
import ScreenDialogCreateClient from "../ScreenDialog/CreateClient";
import ScreenDialogShowFamilies from "../ScreenDialog/ShowFamilies";
import ScreenDialogConfig from "../ScreenDialog/AdminConfig";
import BusquedaRapida from "../ScreenDialog/BusquedaRapida";
import ScreenSuspend from "../ScreenDialog/SuspenderVenta";
import ScreenRecuperarVenta from "../ScreenDialog/RecuperarVenta";
import ScreenIngreso from "../ScreenDialog/Ingreso";
import ScreenRetiro from "../ScreenDialog/Retiro";
import ScreenDevolucion from "../ScreenDialog/Devolucion";
import ScreenProductoAbierto from "../ScreenDialog/ProductoAbierto";
import CierreCaja from "../ScreenDialog/CierreCaja";
import MessageDialog from "../Dialogs/Alert";
import UserEvent from "../../Models/UserEvent";
import BoxProductoFamilia from "./BoxProductoFamilia";
import BoxBusquedaRapida from "./BoxBusquedaRapida";
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
    searchInputRef,

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
