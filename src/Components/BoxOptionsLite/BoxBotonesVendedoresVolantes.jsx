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
import Suspender from "../../Models/Suspender";
import dayjs from "dayjs";
import System from "../../Helpers/System";


const BoxBotonesVendedoresVolantes = () => {
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
    showLoading,
    hideLoading,
    searchInputRef,

    suspenderYRecuperar,
    numeroAtencion,
    setNumeroAtencion,
  } = useContext(SelectedOptionsContext);
  const [openScreenCreateClient, setOpenScreenCreateClient] = useState(false);
  const [showFamiliasDialog, setShowFamiliasDialog] = useState(false);
  const [showFastSearchDialog, setShowFastSearchDialog] = useState(false);

  const [showScreenConfig, setShowScreenConfig] = useState(false);
  const [showScreenSuspend, setShowScreenSuspend] = useState(false);
  const [showScreenRecuperar, setShowScreenRecuperar] = useState(false);
  const [showScreenIngreso, setShowScreenIngreso] = useState(false);
  const [showScreenRetiro, setShowScreenRetiro] = useState(false);
  const [showScreenDevolucion, setShowScreenDevolucion] = useState(false);
  const [showProductoAbierto, setShowProductoAbierto] = useState(false);
  const [showScreenCierreCaja, setShowScreenCierreCaja] = useState(false)

  const [textoCerrarSesion, setTextoCerrarSesion] = useState("Liberar equipo");

  const cerrarSesion = () => {
    if (salesData.length < 1) {
      clearSessionData()
      setNumeroAtencion(0)
      return
    }
    const ventaSuspenderDetalle = [];
    salesData.forEach(sale => {
      ventaSuspenderDetalle.push({
        cantidad: parseFloat(sale.quantity),
        descripcion: sale.description,
        codProducto: sale.idProducto + ""
      });
    })

    const trabajaConNumeroAtencion = ModelConfig.get("conNumeroAtencion")
    var txtDescripcion = "vendedorvolante_"

    if (trabajaConNumeroAtencion) {
      txtDescripcion += "_nroAtencion_" + numeroAtencion + "_"
    }

    txtDescripcion += dayjs().format("DD.MM.YYYY_HH.mm:ss")

    const sus = new Suspender()
    sus.preSuspender({
      usuario: userData.codigoUsuario,
      descripcion: txtDescripcion,
      listado: ventaSuspenderDetalle,
    })

    showLoading("Guardando...")
    sus.suspender((res) => {
      // showMessage(res.descripcion);
      hideLoading()
      clearSessionData()
      setNumeroAtencion(0)
    }, () => {
      hideLoading()
      showConfirm("No se pudo guardar los datos, salir igualmente?", () => {
        clearSessionData()
      })
    })
  }


  useEffect(() => {
    if (salesData.length > 0) {
      setTextoCerrarSesion("Acumular")
    } else {
      setTextoCerrarSesion("Liberar Equipo")
    }
  }, [salesData])

  const focusSearchInput = () => {
    System.intentarFoco(searchInputRef)
  }

  return (
    <Grid container spacing={2}>

      <ScreenDialogShowFamilies openDialog={showFamiliasDialog}
        setOpenDialog={(val) => {
          setShowFamiliasDialog(val)
          if (!val) {
            focusSearchInput()
          }
        }}
      />


      <BusquedaRapida openDialog={showFastSearchDialog}
        setOpenDialog={(val) => {
          setShowFastSearchDialog(val)
          if (!val) {
            focusSearchInput()
          }
        }}
      />

      <BusquedaRapida openDialog={showFastSearchDialog}
        setOpenDialog={(val) => {
          setShowFastSearchDialog(val)
          if (!val) {
            focusSearchInput()
          }
        }}
      />

      <Grid item xs={12} sm={12} md={12} lg={12}>

        <Grid container spacing={1} sx={{
          // backgroundColor: "red"
        }}>



          <MainButton textButton="Borrar Todo" actionButton={() => {
            if (salesData.length < 1) {
              showMessage("El listado esta vacio")
              focusSearchInput()
              return
            }

            showConfirm("Borrar todos los productos de la lista?", () => {
              clearSalesData()
              focusSearchInput()
            }, () => {
              focusSearchInput()
            })
          }} xs={6} sm={3} md={2} lg={2} style={{
            height: "80px",
            color: "white",
            backgroundColor: "#FA4646"
          }} />

          <MainButton textButton="Familias" actionButton={() => {
            setShowFamiliasDialog(true);
          }} xs={6} sm={3} md={2} lg={2} />

          <MainButton textButton="Busqueda Rapida" actionButton={() => {
            setShowFastSearchDialog(true)
          }} xs={6} sm={3} md={4} lg={4} />

          <MainButton
            textButton="Busqueda Rapida Productos Pesables"
            actionButton={() => {
              setShowFastSearchDialog(true)
            }} xs={6} sm={3} md={2} lg={2} />

          <MainButton
            style={{
              backgroundColor: "#4f25d6"
            }}
            textButton={textoCerrarSesion}
            actionButton={cerrarSesion}
            xs={6} sm={3} md={2} lg={2} />

        </Grid>
      </Grid>
    </Grid>
  );
};

export default BoxBotonesVendedoresVolantes;
