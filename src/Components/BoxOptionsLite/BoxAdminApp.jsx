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
import SmallButton from "../Elements/SmallButton";
import GrillaProductosVendidos from "./GrillaProductosVendidos";
import ItemVentaOffline from "./ItemVentaOffline";
import SalesOffline from "../../Models/SalesOffline";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import CorregirFolios from "../ScreenDialog/CorregirFolios";
import Atudepa from "../../Models/Atudepa";
import TouchInputName from "../TouchElements/TouchInputName";
import dayjs from "dayjs";
import SmallGrayButton from "../Elements/SmallGrayButton";
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
