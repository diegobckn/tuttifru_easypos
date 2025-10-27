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
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import CorregirFolios from "../ScreenDialog/CorregirFolios";


const BoxVentasOffline = ({
  isVisible
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
    listSalesOffline,
    setListSalesOffline
  } = useContext(SelectedOptionsContext);

  const [openScreenCreateClient, setOpenScreenCreateClient] = useState(false);
  const [showCorreccion, setShowCorreccion] = useState(false);

  const recargarVentas = () => {
    setListSalesOffline([])
    setTimeout(() => {
      setListSalesOffline(SalesOffline.getInstance().loadFromSesion())
    }, 300);
  }

  return (
    <Box>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography>Listado ventas</Typography>
          {SalesOffline.sincronizando && (
            <Typography>El sistema esta intentando enviar las ventas...</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <SmallButton
            style={{
              height: "60px"
            }}
            textButton={"Sincronizar Todo"}
            actionButton={() => {
              SalesOffline.sincronizar((sale) => {
                console.log("sincronizado recien", sale)
                recargarVentas()
              }, () => {
                if (isVisible) showAlert("sincronizado correctamente")
                recargarVentas()
              })
            }}

            isDisabled={listSalesOffline.length < 1 || SalesOffline.sincronizando}
          />

          <SmallDangerButton
            textButton={"Descartar Todo"}
            actionButton={() => {
              showConfirm("Eliminar todo?", () => {
                SalesOffline.borrarTodos()
                setTimeout(() => {
                  recargarVentas()
                }, 200);
              })
            }}

            style={{
              height: "60px"
            }}
            isDisabled={listSalesOffline.length < 1}
          />

          <SmallSecondaryButton
            textButton={"Frenar sincronizacion"}
            actionButton={() => {
              SalesOffline.frenarSincro()
            }}

            style={{
              height: "60px"
            }}
            isDisabled={!SalesOffline.sincronizando}
          />

          <CorregirFolios
            openDialog={showCorreccion}
            setOpenDialog={setShowCorreccion}
            onConfirm={(tipo, nroFolio) => {
              SalesOffline.corregirFolios(tipo, nroFolio, () => {
                setTimeout(() => {
                  recargarVentas()
                }, 300);
              })
            }}
          />

          <SmallButton
            style={{
              height: "60px",
              backgroundColor: "darkorange"
            }}
            textButton={"Corregir folios"}
            actionButton={() => {
              setShowCorreccion(true)
            }}
            isDisabled={listSalesOffline.length < 1 || SalesOffline.sincronizando}
          />


          {listSalesOffline.map((sale, ix) => (
            <ItemVentaOffline
              sale={sale}
              key={ix}
              index={ix}
              onRemove={recargarVentas}
              onSent={recargarVentas}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BoxVentasOffline;
