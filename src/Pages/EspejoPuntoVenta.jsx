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
  Grid,
  Paper,
  Typography
} from "@mui/material";
import UserEvent from "../Models/UserEvent";
import User from "../Models/User";
import ModelConfig from "../Models/ModelConfig";
import Licencia from "../Models/Licencia";
import { useNavigate } from "react-router-dom";
import BoxProductoFamilia from "../Components/BoxOptionsLite/BoxProductoFamilia";
import BoxFamiliaFija from "../Components/BoxOptionsLite/BoxFamiliaFija";
import BoxBusquedaRapidaFija from "../Components/BoxOptionsLite/BoxBusquedaRapidaFija";
import Sales from "../Models/Sales";
import RefreshInfoControl from "../Components/BoxOptionsLite/RefreshInfoControl";
import dayjs from "dayjs";

const EspejoPuntoVenta = () => {
  const {
    userData,
    showAlert,
    sales,
    setSalesData,
    showMessage,
    setGrandTotal
  } = useContext(SelectedOptionsContext);
  const navigate = useNavigate();

  const { GeneralElements } = useContext(SelectedOptionsContext);
  const [showAbrirCaja, setShowAbrirCaja] = useState(false);
  const [altoPanelProductos, setAltoPanelProductos] = useState(70);

  // useEffect(() => {
  //   if (userData && !userData.inicioCaja) {
  //     console.log("no tiene iniciada la caja");
  //     setShowAbrirCaja(true);
  //   }
  // }, [userData])

  useEffect(() => {

    UserEvent.send({
      name: "carga pantalla espejo",
      info: ""
    })



    // ModelConfig.get("sucursal")

    const varsUrl = System.getUrlVars()
    if (varsUrl.puntoVenta) {
      ModelConfig.change("puntoVenta", varsUrl.puntoVenta)
    }
    if (varsUrl.sucursal) {
      ModelConfig.change("sucursal", varsUrl.sucursal)
    }

  }, [])



  const refreshInfo = () => {
    console.log("actualizando ", dayjs().format("HH:mm:ss"))
    // setSalesData([...sales.loadFromSesion()])

    const sl = new Sales()
    sl.getFromMirror((respData) => {
      // console.log("respData", respData)
      const prods = JSON.parse(respData.products)
      // console.log("prods", prods)
      sl.sesionProducts.guardar(prods)
      setTimeout(() => {
        setSalesData(sales.loadFromSesion())
        // setGrandTotal(sl.getTotal());
      }, 500);
    }, showMessage)

  }


  return (
    <Grid>
      <CssBaseline />
      <Container sx={{
        background: "rgb(146, 181, 176)",
        padding: "30px 0 0 0",
        position: "absolute",
        left: "0",
        top: "0",
        // maxWidth: "90% !important",
        maxWidth: "92% !important",
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
          }} spacing={0}>
            <Grid item xs={12} sm={12} md={8} lg={8}
              style={{
                // padding: 0
              }}>
              <Paper
                elevation={13}
                sx={{
                  background: "#dfe4e6ff",
                  padding: "20px",
                  display: "flex",
                  width: "101.3%",
                  flexDirection: "row",
                  margin: "0 auto",
                  justifyContent: "center",
                }}

              >
                <Typography sx={{
                  fontSize: "25px",
                  width: "50%",
                  fontWeight: "bold"
                }}>Productos</Typography>

                <Typography sx={{
                  paddingTop: "10px",
                  textAlign: "right",
                  width: "35%",
                }}>
                  {System.getInstance().getAppName()}
                </Typography>
              </Paper>

            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4}
              style={{
                padding: "0 17px"
              }}

            >

              <div style={{
                width: "101.35%",
                height: "70px",
                // position: "absolute",
                // right: "130px",
                // top: "50vh",
                backgroundColor: "#494949",
                textAlign: "center",
                alignItems: "center",
                display: "flex",
                padding: "0",
                marginLeft: "10px",
                justifyContent: "center",
                flexDirection: "row",
                gap: "20px"
              }}>

                <Typography sx={{
                  color: "#D4D3D3",
                }}>Refresca</Typography>

                <RefreshInfoControl
                  variableEnSesion={"refreshInfoEspejo"}
                  fetchInfo={refreshInfo}
                />
              </div>



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

        </Grid>
      </Container>
    </Grid>
  );
};

export default EspejoPuntoVenta;
