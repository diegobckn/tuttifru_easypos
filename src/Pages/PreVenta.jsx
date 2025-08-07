/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import BoxTop from "../Components/BoxOptionsLite/BoxTop";
import BoxProducts from "../Components/BoxOptionsLite/BoxProducts";
import BoxTotalesPreventa from "../Components/BoxOptionsLite/BoxTotalesPreventa";
import BoxBotonesPreventa from "../Components/BoxOptionsLite/BoxBotonesPreventa";
import System from "./../Helpers/System";

import { SelectedOptionsContext } from "../Components/Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../Components/Context/ProviderModales";

import {
  Container,
  Grid,
  Typography
} from "@mui/material";
import Licencia from "../Models/Licencia";
import { useNavigate } from "react-router-dom";
import UserEvent from "../Models/UserEvent";
import User from "../Models/User";
import PrinterPaper from "../Models/PrinterPaper";

const PreVenta = () => {
  const {
    GeneralElements,
    searchInputRef,
    showAlert,
    userData
  } = useContext(SelectedOptionsContext);


  const {
    GeneralElements2
  } = useContext(ProviderModalesContext);


  const navigate = useNavigate();

  useEffect(() => {
    System.intentarFoco(searchInputRef)

    UserEvent.send({
      name: "carga pantalla Pre Venta",
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
          name: "intento de cierre o actualizar ventana de preventa",
          info: ""
        })
      }


    }

    Licencia.check(showAlert, () => { navigate("/sin-licencia"); })
  }, [])

  useEffect(() => {
    if (!userData && !User.getInstance().sesion.hasOne()) {
      navigate("/login")
    }

    console.log("userData", userData)
    PrinterPaper.recolectInfo()
  }, [userData])

  return (
    <>
      <CssBaseline />
      <Container sx={{
        background: "rgb(146, 181, 176)",
        padding: "0",
        position: "absolute",
        left: "0",
        top: "0",
        maxWidth: "90% !important",
        minHeight: "100%",
        margin: "0 0 0 5%"
      }}
      >
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
            height: (System.getInstance().getMiddleHeigth() + 290),
            margin: "0",
            padding: 0,
            overflow: "auto"
          }}>
            <Grid item xs={12} sm={12} md={8} lg={8}
              style={{
                padding: 0,

              }}
            >
              <BoxProducts />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4}
              style={{
                padding: "0 17px"
              }}

            >
              <BoxTotalesPreventa />
            </Grid>
          </Grid>


          <Grid container style={{
            padding: 0
          }}>
            <Grid item xs={12} sm={12} md={12} lg={12}
              style={{
                padding: 0
              }}
            >


              <BoxBotonesPreventa />
            </Grid>
          </Grid>



        </Grid>
      </Container>
    </>
  );
};

export default PreVenta;
