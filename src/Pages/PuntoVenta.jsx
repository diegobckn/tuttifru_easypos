/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import BoxTop from "../Components/BoxOptionsLite/BoxTop";
import BoxProducts from "../Components/BoxOptionsLite/BoxProducts";
import BoxTotales from "../Components/BoxOptionsLite/BoxTotales";
import BoxBotones from "../Components/BoxOptionsLite/BoxBotones";
import System from "./../Helpers/System";
import ScreenAbrirCaja from "../Components/ScreenDialog/AbrirCaja";
import { SelectedOptionsContext } from "../Components/Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../Components/Context/ProviderModales";

import {
  Box,
  Container,
  Grid
} from "@mui/material";
import UserEvent from "../Models/UserEvent";
import User from "../Models/User";
import ModelConfig from "../Models/ModelConfig";
import Licencia from "../Models/Licencia";
import { useNavigate } from "react-router-dom";
import BoxProductoFamilia from "../Components/BoxOptionsLite/BoxProductoFamilia";
import BoxFamiliaFija from "../Components/BoxOptionsLite/BoxFamiliaFija";
import BoxBusquedaRapidaFija from "../Components/BoxOptionsLite/BoxBusquedaRapidaFija";
import dayjs from "dayjs";
import Comercio from "../Models/Comercio";
import PrinterPaper from "../Models/PrinterPaper";
import Printer from "../Models/Printer";

const PuntoVenta = () => {
  const {
    userData,
    searchInputRef,
    showAlert,
    getUserData
  } = useContext(SelectedOptionsContext);



  const {
    GeneralElements2
  } = useContext(ProviderModalesContext);
  const navigate = useNavigate();

  const { GeneralElements } = useContext(SelectedOptionsContext);
  const [showAbrirCaja, setShowAbrirCaja] = useState(false);
  const [altoPanelProductos, setAltoPanelProductos] = useState(62);


  useEffect(() => {
    System.intentarFoco(searchInputRef)

    UserEvent.send({
      name: "carga pantalla Punto Venta",
      info: ""
    })

    if (!window.catchCloseOrUpload) {
      window.catchCloseOrUpload = 1
      window.addEventListener("beforeunload", function (e, e2) {
        console.log("antes de salir", e)
        ejecutar();
        (e || window.event).returnValue = null;
        return null
      });

      function ejecutar() {
        // UserEvent.send({
        //   name: "cierre de pantalla Punto Venta",
        //   info: ""
        // })

        UserEvent.send({
          name: "intento de cierre o actualizar ventana de punto de venta",
          info: ""
        })
      }


    }


    Licencia.check(showAlert, () => { navigate("/sin-licencia"); })

    document.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
  }, [])




  useEffect(() => {
    if (userData && !userData.inicioCaja) {
      console.log("no tiene iniciada la caja");
      console.log(userData)
      setShowAbrirCaja(true);
    }

    if (!userData && !User.getInstance().sesion.hasOne()) {
      navigate("/login")
      return
    }

    if (!userData) {
      getUserData()
      return
    }

    PrinterPaper.recolectInfo()
  }, [userData])





  return (
    <Grid>
      <CssBaseline />
      <Container sx={{
        background: "rgb(146, 181, 176)",
        padding: "0",
        position: "absolute",
        left: "0",
        top: "0",
        maxWidth: "100% !important",
        minHeight: "100%",
        margin: "0"
      }}
      >
        <ScreenAbrirCaja openDialog={showAbrirCaja}
          setOpenDialog={(val) => {
            setShowAbrirCaja(val)
            if (!val) {
              setTimeout(() => {
                searchInputRef.current.focus()
              }, 500);
            }
          }}
        />

        <GeneralElements />
        <GeneralElements2 />

        <Grid item xs={12} sm={12} md={12} lg={12} style={{
          padding: 0
        }}>

          <Grid container style={{
            padding: 0
          }}>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{
              padding: 0
            }}>
              <BoxTop />
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{
            margin: "0",
            padding: 0,

          }}>
            <Grid item xs={12} sm={12} md={8} lg={8}
              style={{
                padding: 0,

              }}
            >
              <Box sx={{
                // backgroundColor: "red",
                height: (altoPanelProductos) + "vh",
                overflow: "auto"
              }}>

                <BoxProducts />
              </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4}
              style={{
                padding: "0 17px"
              }}

            >
              <BoxTotales />
            </Grid>
          </Grid>

          <BoxFamiliaFija whenApply={() => {
            if (altoPanelProductos === 62) {
              setAltoPanelProductos(60)
            } else {
              setAltoPanelProductos(40)
            }
          }} />
          <BoxBusquedaRapidaFija whenApply={() => {
            if (altoPanelProductos === 62) {
              setAltoPanelProductos(60)
            } else {
              setAltoPanelProductos(50)
            }
          }} />

          {/* {!ModelConfig.get("fijarFamilia") && !ModelConfig.get("fijarBusquedaRapida") && (
            <div style={{
              height: (System.getInstance().getMiddleHeigth()),
            }}></div>
          )} */}

          <BoxBotones />

        </Grid>
      </Container>
    </Grid>
  );
};

export default PuntoVenta;
