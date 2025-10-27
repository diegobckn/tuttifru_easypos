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
import System from "../../Helpers/System";


const BoxBotones = () => {
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

  const focusSearchInput = () => {
    System.intentarFoco(searchInputRef)
  }

  return (
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
          <Grid container spacing={2}>


            <MainButton textButton="Borrar" actionButton={() => {

              if (salesData.length < 1) {
                showAlert("No hay ventas")
                focusSearchInput()
                return
              }

              var txtVentas = "las ventas";
              if (salesData.length == 1) txtVentas = "la venta"
              showConfirm("Borrar " + txtVentas + "?", () => {
                setShowLoadingDialogWithTitle("Borrando...", true);
                clearSalesData();
                hideLoadingDialog()
                focusSearchInput()
              }, () => {
                focusSearchInput()
              })
            }} />


            <ScreenDialogShowFamilies openDialog={showFamiliasDialog}
              setOpenDialog={(val) => {
                setShowFamiliasDialog(val)
                if (!val) {
                  focusSearchInput()
                }
              }}
            />
            <MainButton textButton="Familias" actionButton={() => {
              setShowFamiliasDialog(true);
            }} />

            <ScreenSuspend openDialog={showScreenSuspend}
              setOpenDialog={(val) => {
                setShowScreenSuspend(val)
                if (!val) {
                  focusSearchInput()
                }
              }}
            />


            <ScreenRecuperarVenta openDialog={showScreenRecuperar}
              setOpenDialog={(val) => {
                setShowScreenRecuperar(val)
                if (!val) {
                  focusSearchInput()
                }
              }}
            />

            <MainButton textButton="Suspender Venta" actionButton={() => {
              if (salesData.length < 1) {
                showMessage("No hay ventas")
                focusSearchInput()
                return
              }
              setShowScreenSuspend(true)
            }}
              isDisabled={!suspenderYRecuperar}
            />

            <MainButton textButton="Recuperar Venta" actionButton={() => {
              setShowScreenRecuperar(true)
            }}
              isDisabled={!suspenderYRecuperar}
            />



            <ScreenDevolucion openDialog={showScreenDevolucion}
              setOpenDialog={(val) => {
                setShowScreenDevolucion(val)
                if (!val) {
                  focusSearchInput()
                }
              }}
            />
            <MainButton
              textButton="Devolucion"
              isDisabled={true}
              actionButton={() => {
                setShowScreenDevolucion(true)
              }} />


            <CierreCaja
              openDialog={showScreenCierreCaja}
              setOpenDialog={(val) => {
                setShowScreenCierreCaja(val)
                if (!val) {
                  focusSearchInput()
                } else {
                  UserEvent.send({
                    name: "apreto boton 'Cerrar caja'",
                  })
                }
              }}
            />

            <MainButton textButton="Cerrar caja" actionButton={() => {
              setShowScreenCierreCaja(true)
            }} />

          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Grid container spacing={2}>


            <ScreenIngreso openDialog={showScreenIngreso}
              setOpenDialog={(val) => {
                setShowScreenIngreso(val)
                if (!val) {
                  focusSearchInput()
                } else {
                  UserEvent.send({
                    name: "apreto boton 'Ingresos'",
                  })
                }
              }}
            />
            <MainButton textButton="Ingresos" actionButton={() => {
              setShowScreenIngreso(true)
            }} />

            <ScreenRetiro openDialog={showScreenRetiro}
              setOpenDialog={(val) => {
                setShowScreenRetiro(val)
                if (!val) {
                  focusSearchInput()
                } else {
                  UserEvent.send({
                    name: "apreto boton 'Retiros'",
                  })
                }
              }}
            />
            <MainButton textButton="Retiros" actionButton={() => {
              setShowScreenRetiro(true)
            }} />

            <BusquedaRapida openDialog={showFastSearchDialog}
              setOpenDialog={(val) => {
                setShowFastSearchDialog(val)
                if (!val) {
                  focusSearchInput()
                }
              }}
            />
            <MainButton textButton="Busqueda Rapida" actionButton={() => {
              setShowFastSearchDialog(true)
            }} />

            <ScreenProductoAbierto openDialog={showProductoAbierto}
              setOpenDialog={(val) => {
                setShowProductoAbierto(val)
                if (!val) {
                  focusSearchInput()
                }
              }}
            />
            <MainButton textButton="Producto Abierto" actionButton={() => {
              setShowProductoAbierto(true)
            }} />

            <ScreenDialogCreateClient openDialog={openScreenCreateClient}
              setOpenDialog={(val) => {
                setOpenScreenCreateClient(val)
                if (!val) {
                  focusSearchInput()
                }
              }}
            />
            <MainButton textButton="Agregar Cliente" actionButton={() => { setOpenScreenCreateClient(true) }} />

            <ScreenDialogConfig openDialog={showScreenConfig}
              setOpenDialog={(val) => {
                setShowScreenConfig(val)
                if (!val) {
                  focusSearchInput()
                } else {
                  UserEvent.send({
                    name: "apreto boton 'Config'",
                  })
                }
              }}
            />
            <MainButton textButton="Config" actionButton={() => { setShowScreenConfig(true) }} />

          </Grid>
        </Grid>
      </Grid>

    </Paper>
  );
};

export default BoxBotones;
