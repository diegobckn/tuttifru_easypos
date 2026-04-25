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
import UserEvent from "../../Models/UserEvent";
import System from "../../Helpers/System";
import BusquedaRapidaOfertas from "../ScreenDialog/BusquedaRapidaOfertas";


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
    focusSearchInput,
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
  const [verOfertas, setVerOfertas] = useState(false)


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
                showAlert("Borrar ventas", "No hay ventas", () => {
                  focusSearchInput(searchInputRef)
                })
                return
              }

              var txtVentas = "las ventas";
              if (salesData.length == 1) txtVentas = "la venta"
              showConfirm("Borrar " + txtVentas + "?", () => {
                setShowLoadingDialogWithTitle("Borrando...", true);
                clearSalesData();
                hideLoadingDialog()
                focusSearchInput(searchInputRef)
              }, () => {
                focusSearchInput(searchInputRef)
              })
            }} />


            <ScreenDialogShowFamilies openDialog={showFamiliasDialog}
              setOpenDialog={(val) => {
                setShowFamiliasDialog(val)
                if (!val) {
                  focusSearchInput(searchInputRef)
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
                  focusSearchInput(searchInputRef)
                }
              }}
            />


            <ScreenRecuperarVenta openDialog={showScreenRecuperar}
              setOpenDialog={(val) => {
                setShowScreenRecuperar(val)
                if (!val) {
                  focusSearchInput(searchInputRef)
                }
              }}
            />

            <MainButton textButton="Suspender Venta" actionButton={() => {
              if (salesData.length < 1) {
                showMessage("No hay ventas")
                focusSearchInput(searchInputRef)
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
                  focusSearchInput(searchInputRef)
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
                  focusSearchInput(searchInputRef)
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
                  focusSearchInput(searchInputRef)
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
                  focusSearchInput(searchInputRef)
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
                  focusSearchInput(searchInputRef)
                }
              }}
            />

            <BusquedaRapidaOfertas openDialog={verOfertas} setOpenDialog={setVerOfertas} />

            <MainButton textButton="Busqueda Rapida" actionButton={() => {
              setShowFastSearchDialog(true)
              // setVerOfertas(true)
            }} />

            <ScreenProductoAbierto openDialog={showProductoAbierto}
              setOpenDialog={(val) => {
                setShowProductoAbierto(val)
                if (!val) {
                  focusSearchInput(searchInputRef)
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
                  focusSearchInput(searchInputRef)
                }
              }}
            />
            <MainButton textButton="Agregar Cliente" actionButton={() => { setOpenScreenCreateClient(true) }} />

            <ScreenDialogConfig openDialog={showScreenConfig}
              setOpenDialog={(val) => {
                setShowScreenConfig(val)
                if (!val) {
                  focusSearchInput(searchInputRef)
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
