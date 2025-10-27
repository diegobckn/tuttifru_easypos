/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

import BoxTop from "../Components/BoxOptionsLite/BoxTopVolantes";
import BoxProducts from "../Components/BoxOptionsLite/BoxProducts";
import BoxTotales from "../Components/BoxOptionsLite/BoxTotalesVolantes";
import BoxBotonesVendedoresVolantes from "../Components/BoxOptionsLite/BoxBotonesVendedoresVolantes";
import System from "../Helpers/System";
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
import SelUsuariosVolantes from "../Components/ScreenDialog/SelUsuariosVolantes";
import Suspender from "../Models/Suspender";
import Product from "../Models/Product";
import NumeroAtencion from "../Components/ScreenDialog/NumeroAtencion";

const VentasVolantes = () => {
  const {
    userData,
    updateUserData,
    focusSearchInput,
    showAlert,
    showMessage,
    showLoading,
    hideLoading,
    addToSalesData,
    numeroAtencion,
    setNumeroAtencion,
    getUserData,
  } = useContext(SelectedOptionsContext);
  const navigate = useNavigate();

  const { GeneralElements } = useContext(SelectedOptionsContext);

  const {
    GeneralElements2
  } = useContext(ProviderModalesContext);
  const [seleccionarUsuario, setSeleccionarUsuario] = useState(false);
  const [ingresarNumeroAtencion, setIngresarNumeroAtencion] = useState(false);


  const cicloRecuperar = (listado, info) => {
    if (listado.length > 0) {
      const product = listado.splice(0, 1)[0]
      product.idProducto = parseInt(product.codProducto)
      Product.getInstance().findByCodigoBarras({
        codigoProducto: product.codProducto,
        codigoCliente: 0
      }, (prodsEncontrados) => {
        prodsEncontrados[0].quantity = product.cantidad
        prodsEncontrados[0].cantidad = product.cantidad
        addToSalesData(prodsEncontrados[0])

        setTimeout(() => {
          cicloRecuperar(listado, info)
        }, 200);
      }, (err) => {
        showMessage("No se pudo encontrar el producto." + err)
      })


    } else {
      Suspender.getInstance().recuperar(info.id, () => {
        showMessage("Recuperado correctamete")
      }, () => {
        showMessage("No se pudo actualizar la informacion en el servidor")
      })
    }
  }


  const cargarListadoDeUsuario = (usuario, descripcion) => {
    showLoading("Cargando productos acumulados...")
    Suspender.getInstance().listarVentas(usuario.codigoUsuario, (ventas) => {
      console.log("listado", ventas)

      ventas.forEach((venta) => {
        if (venta.descripcion.indexOf(descripcion) > -1) {
          cicloRecuperar(venta.ventaSuspenderDetalle, venta)
        }
      })

      hideLoading()
    }, (error) => {
      console.log("listarVentas:" + error)
      hideLoading()
    })
  }

  const cargarProductos = () => {
    const trabajaConNumeroAtencion = ModelConfig.get("conNumeroAtencion")
    var txtBuscar = "vendedorvolante_"

    if (trabajaConNumeroAtencion) {
      txtBuscar += "_nroAtencion_" + numeroAtencion + "_"

      showLoading("Cargando informacion del numero de atencion...")
      User.getInstance().getAllFromServer((users) => {
        hideLoading()
        users.forEach((user) => {
          cargarListadoDeUsuario(user, txtBuscar)
        })
      }, (err) => {
        hideLoading()
        showAlert("No se pudo cargar informacion del servidor.", err)
      })
    } else {
      cargarListadoDeUsuario(userData, txtBuscar)
    }
  }

  useEffect(() => {
    console.log("useEffect de control vendedores volantes")

    if (!userData && !User.getInstance().sesion.hasOne()) {
      setSeleccionarUsuario(true)
      return
    }

    if (!userData && User.getInstance().sesion.hasOne()) {
      getUserData()
      return
    }

    const trabajaConNumeroAtencion = ModelConfig.get("conNumeroAtencion")

    if (userData && trabajaConNumeroAtencion && numeroAtencion < 1) {
      setIngresarNumeroAtencion(true)
      return
    }

    console.log("userData", userData)
    console.log("trabajaConNumeroAtencion", trabajaConNumeroAtencion)
    console.log("numeroAtencion", numeroAtencion)

    cargarProductos()
  }, [seleccionarUsuario, userData, numeroAtencion])


  useEffect(() => {
    focusSearchInput()

    UserEvent.send({
      name: "carga pantalla Vendedores Volantes",
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
          name: "intento de cierre o actualizar ventana de vendedores volantes",
          info: ""
        })
      }


    }


    Licencia.check(showAlert, () => { navigate("/sin-licencia"); })

  }, [])



  return (
    <Box>
      <CssBaseline />
      <Container sx={{
        background: "rgb(146, 181, 176)",
        padding: "0",
        position: "absolute",
        left: "0",
        top: "0",
        // maxWidth: "90% !important",
        minHeight: "99.9%",
        minWidth: "99.9%",
        margin: "0"
      }}
      >
        <GeneralElements />
        <GeneralElements2 />


        <SelUsuariosVolantes
          openDialog={seleccionarUsuario}
          setOpenDialog={setSeleccionarUsuario}
          onSelect={updateUserData}
        />

        <NumeroAtencion
          openDialog={ingresarNumeroAtencion}
          setOpenDialog={setIngresarNumeroAtencion}
          onChange={setNumeroAtencion}
        />

        <Grid item xs={12} sm={12} md={12} lg={12} style={{
          padding: 0
        }}>

          <Grid container style={{
            padding: 0
          }}>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{
              padding: 0
            }}>
              {!seleccionarUsuario && userData && (
                <BoxTop />
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{
            margin: "0",
            padding: 0,

          }}>
            <Grid item xs={12} sm={12} md={9} lg={9}
              style={{
                padding: "0",
              }}
            >
              <Box sx={{
                // backgroundColor: "red",
                height: (75) + "vh",
                overflow: "auto"
              }}>

                <BoxProducts />
              </Box>
            </Grid>

            <Grid item xs={12} sm={12} md={3} lg={3}
              style={{
                padding: "0"
              }}

            >
              <BoxTotales />
            </Grid>
          </Grid>

        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <BoxBotonesVendedoresVolantes />
        </Grid>
      </Container>
    </Box >
  );
};

export default VentasVolantes;
