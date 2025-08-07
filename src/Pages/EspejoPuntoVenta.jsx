/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import BoxClient from "../Components/BoxOptionsLite/BoxTop";
import BoxProductsEspejo from "../Components/BoxOptionsLite/BoxProductsEspejo";
import BoxTotalesEspejo from "../Components/BoxOptionsLite/BoxTotalesEspejo";
import BoxBotones from "../Components/BoxOptionsLite/BoxBotones";
import System from "./../Helpers/System";
import ScreenAbrirCaja from "../Components/ScreenDialog/AbrirCaja";
import { SelectedOptionsContext } from "../Components/Context/SelectedOptionsProvider";

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

const EspejoPuntoVenta = () => {
  const {
    userData,
    searchInputRef,
    showAlert
  } = useContext(SelectedOptionsContext);
  const navigate = useNavigate();

  const { GeneralElements } = useContext(SelectedOptionsContext);
  const [showAbrirCaja, setShowAbrirCaja] = useState(false);
  const [altoPanelProductos, setAltoPanelProductos] = useState(70);

  useEffect(() => {
    if (userData && !userData.inicioCaja) {
      console.log("no tiene iniciada la caja");
      setShowAbrirCaja(true);
    }
  }, [userData])

  useEffect(() => {
    // System.intentarFoco(searchInputRef)

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

      // function ejecutar() {
        // UserEvent.send({
        //   name: "cierre de pantalla Punto Venta",
        //   info: ""
        // })

      //   UserEvent.send({
      //     name: "intento de cierre o actualizar ventana de punto de venta",
      //     info: ""
      //   })
      // }


    }


    Licencia.check(showAlert, () => { navigate("/sin-licencia"); })

    // if(!System.configBoletaOk()){
    //   showAlert("Se debe configurar emision de boleta")
    //   return
    // }

  }, [])



  return (
    <Grid>
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

        <Grid item xs={12} sm={12} md={12} lg={12} style={{
          padding: 0
        }}>

          <Grid container style={{
            padding: 0
          }}>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{
              padding: 0
            }}>
              <BoxClient />
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

                <BoxProductsEspejo />
              </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4}
              style={{
                padding: "0 17px"
              }}

            >
              <BoxTotalesEspejo />
            </Grid>
          </Grid>

          <BoxFamiliaFija whenApply={()=>{
            if(altoPanelProductos === 70){
              setAltoPanelProductos(60)
            }else{
              setAltoPanelProductos(40)
            }
          }}/>
          {/* <BoxBusquedaRapidaFija whenApply={()=>{
            if(altoPanelProductos === 70){
              setAltoPanelProductos(60)
            }else{
              setAltoPanelProductos(50)
            }
          }}/> */}

          {/* {!ModelConfig.get("fijarFamilia") && !ModelConfig.get("fijarBusquedaRapida") && (
            <div style={{
              height: (System.getInstance().getMiddleHeigth()),
            }}></div>
          )} */}

          {/* <BoxBotones /> */}

        </Grid>
      </Container>
    </Grid>
  );
};

export default EspejoPuntoVenta;
