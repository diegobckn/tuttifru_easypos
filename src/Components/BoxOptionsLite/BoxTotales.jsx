import React, { useState, useContext, useEffect, useRef } from "react";

import {
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  TableContainer,
  Grid,
  Container,
  useTheme,
  useMediaQuery,

  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import PagoFactura from "../ScreenDialog/PagoFactura";
import PagoBoleta from "../ScreenDialog/PagoBoleta";
import Envases from "../ScreenDialog/Envases";
import MainButton from "../Elements/MainButton";
import System from "../../Helpers/System";
import LongClick from "../../Helpers/LongClick";
import Model from "../../Models/Model";
import ModelConfig from "../../Models/ModelConfig";
import PruebaImpresionEspecial from "../ScreenDialog/PruebaImpresionEspecial";
import Printer from "../../Models/Printer";
import UltimaVenta from "../ScreenDialog/UltimaVenta";
import LecturaFolioPreventa from "../ScreenDialog/LecturaFolioPreventa";
import NumeroAtencion from "../ScreenDialog/NumeroAtencion";
import User from "../../Models/User";
import Suspender from "../../Models/Suspender";
import Product from "../../Models/Product";


const BoxTotales = () => {
  const {
    userData,
    salesData,
    sales,
    clearSessionData,
    grandTotal,
    getUserData,
    showMessage,
    showAlert,
    showLoading,
    hideLoading,

    modoAvion,
    setModoAvion,
    showPrintButton,

    ultimoVuelto,
    setUltimoVuelto,
    searchInputRef,
    numeroAtencion,
    setNumeroAtencion,
    addToSalesData
  } = useContext(SelectedOptionsContext);
  const [vendedor, setVendedor] = useState(null);
  const [recargos, setRecargos] = useState(0);
  const [descuentos, setDescuentos] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showScreenPagoFactura, setShowScreenPagoFactura] = useState(false)
  const [showScreenPagoBoleta, setShowScreenPagoBoleta] = useState(false)
  const [showScreenEnvases, setShowScreenEnvases] = useState(false)

  const [openSpecialPrint, setOpenSpecialPrint] = useState(false)
  const [showScreenLastSale, setShowScreenLastSale] = useState(false)

  const [showPreventa, setShowPreventa] = useState(false)

  const [verBotonPreventa, setVerBotonPreventa] = useState(false)
  const [verBotonEnvases, setVerBotonEnvases] = useState(false)
  const [verBotonPagarFactura, setVerBotonPagarFactura] = useState(false)

  const [trabajaConNumeroAtencion, setTrabajaConNumeroAtencion] = useState(false)

  const [ingresarNumeroAtencion, setIngresarNumeroAtencion] = useState(false);

  const focusSearchInput = () => {
    System.intentarFoco(searchInputRef)
  }

  const longBoleta = new LongClick(2);
  longBoleta.onClick(() => {
    if (salesData.length < 1) {
      showMessage("No hay ventas")
      return
    }

    if (!System.configBoletaOk()) {
      showAlert("Se debe configurar emision de boleta")
      return
    }

    setShowScreenPagoBoleta(true)
  })
  longBoleta.onLongClick(() => {
    if (modoAvion) {
      showMessage("Cambiado a modo normal")
    } else {
      showMessage("Cambiado a modo avion")
    }
    setModoAvion(!modoAvion)

    ModelConfig.change("emitirBoleta", modoAvion)

    focusSearchInput()


    setTimeout(() => {
      focusSearchInput()
    }, 1000);
  })

  const navigate = useNavigate();

  useEffect(() => {
    setVerBotonPreventa(ModelConfig.get("verBotonPreventa"))
    setVerBotonEnvases(ModelConfig.get("verBotonEnvases"))
    setVerBotonPagarFactura(ModelConfig.get("verBotonPagarFactura"))
  }, [])


  useEffect(() => {
    // Simulación de obtención de datos del usuario después de un tiempo de espera
    const fetchData = () => {
      if (!userData) {
        getUserData();
        return
      }

      if (userData == null) {
        alert("Usuario no logueado");
        clearSessionData();
        navigate("/login");
        return
      }
      // setVendedor({
      //   codigo: userData.codigoUsuario || "21",
      //   nombre:
      //     userData.nombres + " " + userData.apellidos || "Nombre Apellido",
      //   caja: "1",
      //   rol: userData.rol || "Rol del usuario",
      //   boleta: "323232321",
      //   operacion: "12123141",
      // });
    };

    fetchData();


    setTrabajaConNumeroAtencion(ModelConfig.get("conNumeroAtencion"))

  }, [userData]);

  const abrirLecturaPreventa = () => {
    setShowPreventa(true)
  }









  // numeroAtencion
  // numeroAtencion
  // numeroAtencion


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

  const cargarProductosAtencion = () => {
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
      // } else {
      //   cargarListadoDeUsuario(userData, txtBuscar)
    }
  }



  useEffect(() => {

    if (numeroAtencion > 0) {
      cargarProductosAtencion()
    }
  }, [numeroAtencion])

  // fin numeroAtencion
  // fin numeroAtencion
  // fin numeroAtencion


  return (
    <Paper
      elevation={3}
      style={{
        backgroundColor: "rgb(188 188 188)",
        padding: "0px",
        width: "100%",
        marginTop: "20px"
      }}
    >

      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={12} md={12} lg={12}
              sx={{
                margin: "6px auto",
                color: "#E1213B",
                width: "80%",
                padding: "10px 0 !important",
                maxWidth: "80% !important",
                borderRadius: "5px",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  color: "rgb(225, 33, 59)",
                  fontSize: "36px",
                  fontFamily: "Victor Mono",
                  fontWeight: "700",
                  justifyContent: "center",
                }}
              >
                TOTAL: ${System.formatMonedaLocal(grandTotal, false)}
              </Typography>

              {ultimoVuelto !== null && (
                <Typography
                  sx={{
                    display: "flex",
                    color: "#000",
                    fontSize: "24px",
                    fontFamily: "Victor Mono",
                    fontWeight: "700",
                    textShadow: "1px 1px 2px #fff",
                    justifyContent: "center",
                    textAlign: "center"
                  }}
                >
                  Vuelto: ${System.formatMonedaLocal(ultimoVuelto, false)}
                </Typography>
              )}
            </Grid>

            <UltimaVenta
              openDialog={showScreenLastSale}
              setOpenDialog={(val) => {
                if (!val) {
                  focusSearchInput()
                }
                setShowScreenLastSale(val)
              }}
            />

            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: "6px" }}>
              <Button
                sx={{
                  width: "50%",
                  marginLeft: "25%",
                  height: "40px",
                  backgroundColor: "transparent",
                  color: "black",
                  borderRadius: "0",
                  "&:hover": {
                    border: "1px solid black",
                    color: "black",
                    backgroundColor: "#D6D5D1 ",
                  },
                }}
                onClick={() => {
                  setShowScreenLastSale(true)
                }}
              >
                <Typography variant="h7">&Uacute;ltima venta</Typography>
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: "6px" }}>
              <Typography
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                DESCUENTOS: ${descuentos}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: "6px" }}>
              <Typography
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                RECARGOS: ${recargos}
              </Typography>
            </Grid>






          </Grid>
        </Grid>
      </Grid>

      <Grid container style={{
        backgroundColor: "#859398",
        marginTop: 10
      }}>
        <Grid item xs={12}>
          <Grid container>


            <Grid item xs={12} sm={(verBotonPagarFactura ? 6 : 12)} md={(verBotonPagarFactura ? 6 : 12)} lg={(verBotonPagarFactura ? 6 : 12)}>
              <Button
                sx={{
                  width: "100%",
                  height: "80px",
                  backgroundColor: (!modoAvion ? "#b8eaad" : "#F5F2F2"),
                  border: "1px solid black",
                  borderRadius: "0",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#1c1b17 ",
                    color: "white",
                  },
                }}
                onClick={() => {



                }}

                onTouchStart={() => { longBoleta.onStart("touch") }}
                onMouseDown={() => { longBoleta.onStart("mouse") }}
                onTouchEnd={() => { longBoleta.onEnd("touch") }}
                onMouseUp={() => { longBoleta.onEnd("mouse") }}
                onMouseLeave={() => { longBoleta.cancel() }}
                onTouchMove={() => { longBoleta.cancel() }}
              >



                <Typography variant="h7">Pagar Boleta</Typography>
              </Button>

            </Grid>

            <PagoBoleta
              openDialog={showScreenPagoBoleta}
              setOpenDialog={(v) => {
                if (!v) {
                  focusSearchInput()
                }
                setShowScreenPagoBoleta(v)
              }}
            />


            {verBotonPagarFactura && (
              <>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "80px",
                      backgroundColor: " #fff",
                      border: "1px solid black",
                      borderRadius: "0",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#1c1b17 ",
                        color: "white",
                      },
                    }}

                    // disabled={true}
                    onClick={() => {
                      if (salesData.length < 1) {
                        showMessage("No hay ventas")
                        return
                      }
                      setShowScreenPagoFactura(true)
                    }}
                  >
                    <Typography variant="h7">Pagar Factura</Typography>
                  </Button>
                </Grid>
                <PagoFactura
                  openDialog={showScreenPagoFactura}
                  setOpenDialog={setShowScreenPagoFactura}
                />
              </>
            )}

            {verBotonPreventa && (
              <>
                <LecturaFolioPreventa openDialog={showPreventa}
                  setOpenDialog={(v) => {
                    if (!v) {
                      focusSearchInput()
                    }
                    setShowPreventa(v)
                  }}
                />
                <Grid item xs={12} sm={(verBotonEnvases ? 6 : 12)} md={(verBotonEnvases ? 6 : 12)} lg={(verBotonEnvases ? 6 : 12)}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "80px",
                      backgroundColor: " #FD7B17",
                      border: "1px solid black",
                      borderRadius: "0",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#1c1b17 ",
                        color: "white",
                      },
                    }}
                    onClick={() => {
                      abrirLecturaPreventa(true)
                    }}
                  >
                    <Typography variant="h7">PREVENTA</Typography>
                  </Button>
                  <Envases
                    openDialog={showScreenEnvases}
                    setOpenDialog={(v) => {
                      if (!v) {
                        focusSearchInput()
                      }
                      setShowScreenEnvases(v)
                    }}
                  />
                </Grid>
              </>
            )}


            {verBotonEnvases && (
              <>
                <Grid item xs={12} sm={(verBotonPreventa ? 6 : 12)} md={(verBotonPreventa ? 6 : 12)} lg={(verBotonPreventa ? 6 : 12)}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "80px",
                      backgroundColor: " #eefd17",
                      border: "1px solid black",
                      borderRadius: "0",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#1c1b17 ",
                        color: "white",
                      },
                    }}
                    onClick={() => {
                      setShowScreenEnvases(true)
                    }}
                  >
                    <Typography variant="h7">Envases</Typography>
                  </Button>
                  <Envases
                    openDialog={showScreenEnvases}
                    setOpenDialog={(v) => {
                      if (!v) {
                        focusSearchInput()
                      }
                      setShowScreenEnvases(v)
                    }}
                  />
                </Grid>
              </>
            )}

            {showPrintButton && (
              <>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "40px",
                      backgroundColor: " #000000",
                      border: "1px solid black",
                      borderRadius: "0",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1c1b17 ",
                        color: "white",
                      },
                    }}
                    onClick={() => {
                      showLoading("Preparando prueba de impresion")
                      Model.pruebaImpresion((serverResponseData) => {
                        Printer.printAll(serverResponseData)
                        hideLoading()
                      }, (err) => {
                        hideLoading()
                      })


                      return

                    }}
                  >
                    <Typography variant="h7">Probar impresion</Typography>
                  </Button>
                  <Envases
                    openDialog={showScreenEnvases}
                    setOpenDialog={setShowScreenEnvases}
                  />
                </Grid>

                <PruebaImpresionEspecial
                  openDialog={openSpecialPrint}
                  setOpenDialog={setOpenSpecialPrint}
                  onAssign={() => {

                  }}
                />

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "40px",
                      backgroundColor: " #000000",
                      border: "1px solid black",
                      borderLeftColor: "#fff",
                      borderRadius: "0",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1c1b17 ",
                        color: "white",
                      },
                    }}
                    onClick={() => {
                      setOpenSpecialPrint(true)
                    }}
                  >
                    <Typography variant="h7">Impresion Ejemplo</Typography>
                  </Button>
                  <Envases
                    openDialog={showScreenEnvases}
                    setOpenDialog={setShowScreenEnvases}
                  />
                </Grid>

              </>
            )}



            {trabajaConNumeroAtencion && (
              <>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Button
                    sx={{
                      width: "100%",
                      height: "40px",
                      backgroundColor: " #000000",
                      border: "1px solid black",
                      borderRadius: "0",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#1c1b17 ",
                        color: "white",
                      },
                    }}
                    onClick={() => {
                      setIngresarNumeroAtencion(true)
                    }}
                  >
                    <Typography variant="h7">Numero Atencion</Typography>
                  </Button>

                  <NumeroAtencion
                    openDialog={ingresarNumeroAtencion}
                    setOpenDialog={setIngresarNumeroAtencion}
                    onChange={setNumeroAtencion}
                  />
                </Grid>


              </>
            )}

          </Grid>

        </Grid>
      </Grid>
    </Paper>
  );
};

export default BoxTotales;
