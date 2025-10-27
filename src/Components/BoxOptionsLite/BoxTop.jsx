import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Autorenew, BuildCircle, Circle, GMobiledata, Inventory, Margin, MobileFriendly, PointOfSale, ProductionQuantityLimits, ProductionQuantityLimitsRounded, Settings, Traffic, WifiOff } from "@mui/icons-material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import dayjs from "dayjs";

import System from "../../Helpers/System";
import SmallGrayButton from "./../Elements/SmallGrayButton"
import SmallDangerButton from "./../Elements/SmallDangerButton"
import ScreenBuscarCliente from "./../ScreenDialog/BuscarCliente"
import ScreenCloseSession from "../ScreenDialog/CloseSession"
import User from "../../Models/User";
import Client from "../../Models/Client";
import ModelConfig from "../../Models/ModelConfig";
import Atudepa from "../../Models/Atudepa";
import VentasOffline from "../ScreenDialog/VentasOffline"
import PrinterPaper from "../../Models/PrinterPaper";
import StockCriticos from "../ScreenDialog/StockCriticos";
import Product from "../../Models/Product";
import SalesOffline from "../../Models/SalesOffline";
import IconButtonBadge from "../Elements/IconButtonBadge";
import AdminApp from "../ScreenDialog/AdminApp";

const BoxTop = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const {
    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showDialogSelectClient,
    setShowDialogSelectClient,


    userData,
    addToSalesData,
    clearSessionData,
    getUserData,
    listSalesOffline,
    setListSalesOffline,
    showAlert,
    showConfirm,
    showLoading,
    hideLoading,
    tieneInternet,
    conexionesOkInternet,
    conexionesMalInternet,
    searchInputRef,
  } = useContext(SelectedOptionsContext);

  const navigate = useNavigate();
  const [showCloseSessionDialog, setShowCloseSessionDialog] = useState(false);
  const [showSalesOffline, setShowSalesOffline] = useState(false);
  const [showAdminApp, setShowAdminApp] = useState(false);
  const [showCritics, setShowCritics] = useState(false);

  const [date, setDate] = useState(null);
  const [sucursal, setSucursal] = useState("");
  const [caja, setCaja] = useState("");
  const [time, setTime] = useState(null);

  const [widthPrinter, setWidthPrinter] = useState(null);
  const [stockCriticoSuperados, setStockCriticoSuperados] = useState(0);


  const focusSearchInput = () => {
    System.intentarFoco(searchInputRef)
  }

  const cargarStockCriticoSuperados = () => {
    var superados = 0
    setStockCriticoSuperados(superados)


    Product.getInstance().getCriticosPaginate({
      pageNumber: 1,
      rowPage: 101
    }, (prods, response) => {
      if (Array.isArray(response.data.productos)) {
        response.data.productos.forEach((prod) => {
          if (prod.stockActual < prod.stockCritico) {
            superados++
          }
        })
      }
      setStockCriticoSuperados(superados)
    }, (error) => {
    })

  }


  const cargarVentasOfllines = (preguntar = true) => {
    var ventas = []
    const so = SalesOffline.getInstance()
    const vos = so.loadFromSesion()
    // console.log("cargarVentasOfllines")
    // console.log("vos", vos)

    if (vos.length > 0) {
      ventas = vos
      if (preguntar) {
        showConfirm("Hay ventas sin guardar, quiere intentar enviarlas ahora?", () => {
          SalesOffline.sincronizar(() => { }, () => { cargarVentasOfllines(false) })
        }, () => { })
      }
    }

    // console.log("ventas", ventas)

    // listSalesOffline
    setListSalesOffline(ventas)

  }

  useEffect(() => {
    setDate(dayjs().format('DD/MM/YYYY'))

    setInterval(() => {
      setTime(dayjs().format('HH:mm:ss'))

      setSucursal(ModelConfig.get("sucursalNombre"))
      setCaja(ModelConfig.get("puntoVentaNombre"))
    }, 1000)

    if (!PrinterPaper.getInstance().width) {
      PrinterPaper.getInstance().loadWidthFromSesion()
      setWidthPrinter(PrinterPaper.getInstance().width)
    }

    cargarStockCriticoSuperados()
    cargarVentasOfllines()

    // console.log("listSalesOffline", listSalesOffline)
  }, [])

  useEffect(() => {
    // Simulación de obtención de datos del usuario después de un tiempo de espera
    if (!User.getInstance().sesion.hasOne()) {
      // alert("Usuario no logueado");

      if (Atudepa.intervaloFuncion) {
        clearInterval(Atudepa.intervaloFuncion)
      }
      Atudepa.checkNuevosPedidos = false
      Atudepa.nuevoPedidoFuncion = null

      clearSessionData();
      navigate("/login");
    }
  }, [userData]);


  const descargarProductos = () => {
    showLoading("Descargando productos del servidor...")
    Product.getInstance().almacenarParaOffline((prods, resp) => {
      hideLoading()
      showAlert("Actualizado correctamente", "", () => {
        focusSearchInput()
      })
    }, () => {
      hideLoading()
      showMessage("No se pudo realizar")
      focusSearchInput()
    })
  }



  return (
    <Paper
      elevation={3}
      style={{ backgroundColor: "#283048", padding: "10px", width: "100%", marginTop: "2px" }}
    >
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Grid container spacing={2}>

            <ScreenCloseSession openDialog={showCloseSessionDialog} setOpenDialog={setShowCloseSessionDialog} />

            <Grid item xs={12} sm={12} md={2} lg={2}
              sx={{
                marginTop: "6px",
                padding: 0
              }}
            >
              <Box variant="h5" color="white"
                style={{
                  margin: " 0 50px 0 0"
                }}
              >
                <Typography>
                  {System.getInstance().getAppName()}
                </Typography>

                {userData && (
                  <Typography>
                    {userData.nombres} {userData.apellidos}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8} sx={{
              margin: "6px 0 0 0",
              padding: "0",
              textAlign: "center"
            }}>
              <SmallDangerButton
                textButton="Cerrar Sesion"
                actionButton={() => {
                  setShowCloseSessionDialog(true)
                }}
              />
              <Chip
                label={(cliente != null ? (cliente.nombreResponsable + " " + cliente.apellidoResponsable) : "Seleccionar cliente")}
                sx={{
                  borderRadius: "6px",
                  backgroundColor: "white",
                  width: "60%",
                }}>
              </Chip>
              {!cliente ? (

                <SmallGrayButton
                  textButton="Sel. Cliente"
                  actionButton={() => {
                    setAskLastSale(true)
                    setShowDialogSelectClient(true)
                  }}
                />
              ) : (
                <SmallDangerButton
                  style
                  textButton="Quit. Cliente"
                  actionButton={() => {
                    setCliente(null)
                    Client.getInstance().sesion.truncate()
                  }}
                />
              )}
              <Typography sx={{
                color: "white",
                fontSize: "12px"
              }}>Sucursal {sucursal} PV {caja}


                {widthPrinter && (
                  <Button style={{
                    color: "#FB9090",
                    display: "inline-block",
                    border: "1px solid #ccc",
                    margin: "0 10px",
                    padding: "2px 5px",
                    position: "relative"
                  }} onClick={() => {
                    showAlert("Impresora de " + widthPrinter, "", () => {
                      focusSearchInput()
                    })

                  }}>
                    {widthPrinter}
                  </Button>
                )}
              </Typography>
            </Grid>






            <Grid item xs={12} sm={2} md={2} lg={2}
              sx={{
                padding: "0",
              }}>
              <VentasOffline
                openDialog={showSalesOffline}
                setOpenDialog={(v) => {
                  setShowSalesOffline(v)

                  if (!v) {
                    focusSearchInput()
                  }
                }}
              />
              <AdminApp
                openDialog={showAdminApp}
                setOpenDialog={(v) => {
                  setShowAdminApp(v)

                  if (!v) {
                    focusSearchInput()
                  }
                }}
              />

              <StockCriticos
                openDialog={showCritics}
                setOpenDialog={(x) => {
                  setShowCritics(x)
                  if (!x) {
                    focusSearchInput()
                  }
                }}
              />

              <Box style={{
                // backgroundColor: "orange",
                display: "flex",
                textAlign: "center",
                flexDirection: "column",
              }}>

                <Box color="white" style={{
                  // backgroundColor: "blue",
                }}>
                  <Typography sx={{
                    marginTop: "15px",
                    fontSize: "15px",
                    textAlign: "right",
                  }}>
                    {date} {"  "} {time}
                  </Typography>
                </Box>




                <Box color="white" style={{
                  // backgroundColor: "green",
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "end"
                }}>

                  <IconButtonBadge
                    actionButton={() => {
                      setShowAdminApp(true)
                    }}
                    icon={<MobileFriendly fontSize="medium" />}
                    style={{
                      color: "rgb(251 219 18)"
                    }}
                  />
                  <IconButtonBadge
                    actionButton={() => {
                      descargarProductos()
                      focusSearchInput()
                    }}
                    icon={<Autorenew fontSize="medium" />}
                    style={{
                      color: "rgb(166 184 243)"
                    }}
                  />

                  <IconButtonBadge
                    actionButton={() => {
                      var txt = "";

                      txt += "Las conexiones correctas son " + conexionesOkInternet
                      txt += " y las incorrectas " + conexionesMalInternet + "."

                      showAlert("Estado de conexiones a internet", txt, () => {
                        focusSearchInput()
                      })
                    }}
                    icon={<Circle fontSize="medium" />}
                    style={{
                      color: (tieneInternet === null ? "#C0DA03" : tieneInternet ? "#00ff00" : "#FF0000"),
                    }}
                  />

                  {listSalesOffline.length > 0 && (
                    <IconButtonBadge
                      icon={<WifiOff fontSize="medium" />}
                      actionButton={() => {
                        setShowSalesOffline(true)
                      }}
                      badgeValue={listSalesOffline.length}
                    />
                  )}

                  <IconButtonBadge
                    actionButton={() => {
                      setShowCritics(true)
                    }}
                    icon={<Inventory fontSize="medium" />}
                    badgeValue={stockCriticoSuperados > 100 ? "100+" : stockCriticoSuperados}
                    style={{
                      color: "#D000FF",
                    }}
                  />

                </Box>





              </Box>
            </Grid>


          </Grid>
        </Grid>
      </Grid>
    </Paper >
  );
};

export default BoxTop;
