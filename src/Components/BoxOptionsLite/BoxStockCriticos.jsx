import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
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
import ProductosCriticos from "./ProductosCriticos";
import ProductosCriticosBuscarUno from "./ProductosCriticosBuscarUno";
import Tabs, { Tab } from "../Elements/Tabs";


const BoxStockCriticos = () => {
  const {
    userData,
  } = useContext(SelectedOptionsContext);

  return (
    <Tabs
      tabsItems={[
        {
          title: "Todos los Productos",
          content: (
            <ProductosCriticos onFinish={() => { }} />
          )
        },
        {
          title: "Buscar un producto",
          content: (
            <ProductosCriticosBuscarUno onFinish={() => { }} />
          )
        },
      ]}
    />
  );
};

export default BoxStockCriticos;
