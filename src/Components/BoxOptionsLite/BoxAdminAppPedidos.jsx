import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../Context/ProviderModales";
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
import SmallButton from "../Elements/SmallButton";
import GrillaProductosVendidos from "./GrillaProductosVendidos";
import ItemVentaOffline from "./ItemVentaOffline";
import SalesOffline from "../../Models/SalesOffline";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import CorregirFolios from "../ScreenDialog/CorregirFolios";
import Atudepa from "../../Models/Atudepa";
import TouchInputName from "../TouchElements/TouchInputName";
import dayjs from "dayjs";
import SmallGrayButton from "../Elements/SmallGrayButton";
import EstadosPedidosApp from "../../definitions/EstadosPedidosApp";
import Printer from "../../Models/Printer";
import Sales from "../../Models/Sales";
import System from "../../Helpers/System";
import LoopProperties from "../../Helpers/LoopProperties";
import PrinterIframe from "../../Models/PrinterIframe";
import SmallPrimaryButton from "../Elements/SmallPrimaryButton";
import SmallWarningButton from "../Elements/SmallWarningButton";
import SmallSuccessButton from "../Elements/SmallSuccessButton";


const BoxAdminAppPedidos = ({
  pedidos,
  setPedidos,
  visible
}) => {
  const {
    userData,
    salesData,
    clearSessionData,
    clearSalesData,
    getUserData,
    setShowLoadingDialogWithTitle,
    showLoading,
    hideLoading,
    setShowLoadingDialog,
    showConfirm,
    showMessage,
    showAlert,

    suspenderYRecuperar,
    listSalesOffline,
    setListSalesOffline,
    createQrString,
  } = useContext(SelectedOptionsContext);


  const {
    pedirSupervision,
  } = useContext(ProviderModalesContext);

  const showMessageLoading = (msg) => {
    showMessage(msg)
    hideLoading()
  }

  const cargarPedidos = () => {
    showLoading("Cargando pedidos...")
    Atudepa.obtenerPedidos((resp) => {
      console.log("pedidos", resp.purchases)

      setPedidos(resp.purchases)
      setTxtNuevos("")
      hideLoading();
    }, showMessageLoading)
  }

  // sistema de check

  const [isCheck, setIsCheck] = useState([]);
  const [iniciado, setIniciado] = useState(null);
  const [primeraCarga, setPrimeraCarga] = useState(false);
  const [txtNuevos, setTxtNuevos] = useState("");


  const checkboxClick = (e) => {
    const { id, checked } = e.target;

    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter(item => item !== id));
    }
  }

  // fin sistema de check


  const cambiarEstado = (nuevoEstado, idEspecial = 0) => {

    console.log("cambiar de estado a", nuevoEstado)
    var ids = []
    if (!idEspecial) {
      isCheck.forEach((index) => {
        ids.push(pedidos[index].id)
      })
    } else {
      ids.push(idEspecial)
    }

    console.log("a los ids", ids)

    showLoading("cambiando estados...")
    Atudepa.cambiarEstadosPedidos(ids, nuevoEstado, () => {
      setIsCheck([])//reseteamos los checks
      cargarPedidos()
      hideLoading();
    }, showMessageLoading)

  }

  const imprimir = (pedido, callbackEnd = null) => {
    console.log("imprimiendo", pedido)
    Atudepa.imprimir(pedido, createQrString, userData, showAlert, showConfirm, callbackEnd)
  }

  useEffect(() => {

    setIsCheck([])//reseteamos los checks
    Atudepa.nuevoPedidoFuncion = (peds) => {
      console.log("nuevos pedidos2", peds)


      Atudepa.checkNuevosPedidos = false

      new LoopProperties(peds, (prop, value, looper) => {
        if (peds[prop].status_id == EstadosPedidosApp.COMPRADO) {
          imprimir(peds[prop], () => {
            // alert("siguiente");
            setTimeout(() => {
              looper.next()
            }, 1000);
          })

          cambiarEstado(EstadosPedidosApp.PREPARANDO, peds[prop].id)
        } else {
          looper.next()

        }
      }, () => {
        // console.log("termino el ciclo")
        Atudepa.checkNuevosPedidos = true
        cargarPedidos()
      })


      var txt = "Cargando Nuevo pedido";
      if (peds.length > 1) {
        txt = "Cargando Nuevos pedidos"
      }
      setTxtNuevos(txt)
    }

    Atudepa.iniciarCiclo()
    setIniciado(true)


  }, [])

  useEffect(() => {
    if (visible && !primeraCarga) {
      setPrimeraCarga(true)
    }
  }, [visible])

  useEffect(() => {
    if (primeraCarga) {
      cargarPedidos()
    }
  }, [primeraCarga])

  useEffect(() => {
    console.log("cambio iniciado", iniciado)
  }, [iniciado])


  useEffect(() => {
    if (pedidos.length > 0 && !iniciado) {
      setIniciado(true)
    }
  }, [pedidos])

  return visible ? (
    <Grid container spacing={2} >
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Typography style={{
          fontSize: "20px",
          border: "1px solid #ccc",
          padding: "10px",
          width: "100%",
          backgroundColor: "#ddd",
          margin: "0px 0px 20px 0"
        }}>
          Pedidos

          {!iniciado && (
            <SmallButton
              style={{ width: "200px", margin: "0 0 0 100px" }}
              textButton={"Comenzar"}
              actionButton={() => {
                showMessage("Iniciado")
                Atudepa.iniciarCiclo()
                setIniciado(true)
              }}
            />
          )}

          {txtNuevos != "" && (
            <Typography sx={{
              textTransform: "uppercase",
              fontSize: "16px",
              backgroundColor: "#e1ff00",
              padding: "10px",
              marginLeft: "10px",
            }} variant="span">{txtNuevos}</Typography>
          )}
        </Typography>
      </Grid>


      <Grid item xs={12} sm={12} md={9} lg={9}>
        <Paper
          elevation={1}
          sx={{
            background: "#859398",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px",
          }}
        >
          {pedidos.length > 0 ? (
            <TableContainer
              component={Paper}
              style={{ overflowX: "auto", maxHeight: "80vh" }}
            >
              <Table sx={{ background: "white", height: "30%" }}>
                <TableHead style={{ maxHeight: "100px", overflowY: "auto" }}>
                  <TableRow >
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>#</TableCell>
                    <TableCell>cliente</TableCell>
                    <TableCell>entregar</TableCell>
                    <TableCell>productos</TableCell>
                    <TableCell>estado</TableCell>
                    <TableCell>imprimir</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ maxHeight: "100px", overflowY: "auto" }}>
                  {pedidos.map((pedido, index) => {
                    const envioInfo = JSON.parse(pedido.shipping_data)

                    var prodsTxt = "";
                    pedido.items.forEach((itm) => {
                      if (prodsTxt != "") prodsTxt += ", "
                      prodsTxt += itm.name
                    })

                    return (<TableRow key={index} onClick={(e) => {
                      var el = e.target//td
                      el = el.parentNode//tr
                      el = el.firstElementChild//td 1
                      el = el.firstElementChild//span
                      if (el) {
                        el = el.firstElementChild//inp
                        if (el) {
                          // console.log("click en input", el)
                          el.click();
                        }
                      }
                    }} style={{
                      cursor: "pointer",

                    }} sx={{
                      "&:hover": {
                        backgroundColor: "#e1e1e1",
                      }
                    }}>
                      <TableCell>

                        <Checkbox
                          id={index + ""}
                          checked={isCheck.includes(index + "")}
                          onChange={checkboxClick}
                        />

                      </TableCell>
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>{pedido.client.name}</TableCell>
                      <TableCell>{envioInfo.hora}</TableCell>
                      <TableCell>{prodsTxt}</TableCell>
                      <TableCell>{pedido.status.showable}</TableCell>
                      <TableCell>
                        {pedido.status_id == EstadosPedidosApp.PREPARANDO && (
                          <SmallButton textButton={"reimprimir"} actionButton={() => imprimir(pedidos[index])} />
                        )}
                        {pedido.status_id == EstadosPedidosApp.LISTO_PARA_ENTREGAR && (
                          <>
                            <SmallPrimaryButton textButton={"Ver Codigo de entrega"} actionButton={() => {
                              const sd = JSON.parse(pedido.shipping_data)
                              console.log("sd", sd)
                              showAlert("El codigo de entrega es: " + sd.codigoEntrega)
                            }} />
                            <SmallSuccessButton textButton={"Entregado"} actionButton={() => {
                              cambiarEstado(EstadosPedidosApp.ENTREGADO, pedido.id)
                            }} />
                          </>
                        )}
                      </TableCell>

                    </TableRow>)
                  }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <></>
          )}
        </Paper>
      </Grid>

      {
        pedidos.length > 0 && (
          <Grid item xs={12} sm={12} md={3} lg={3}>
            {/* <SmallSecondaryButton
              textButton={"Preparando"}
              style={{ with: "100%" }}
              actionButton={() => cambiarEstado(EstadosPedidosApp.PREPARANDO)}
            /> */}
            <SmallSecondaryButton
              textButton={"Listo para entrega"}
              actionButton={() => {
                if (isCheck.length < 1) {
                  showMessage("Seleccionar algun pedido")
                  return
                }
                cambiarEstado(EstadosPedidosApp.LISTO_PARA_ENTREGAR)
              }}
            />
            {/* <SmallSecondaryButton
              textButton={"Entregado"}
              actionButton={() => cambiarEstado(EstadosPedidosApp.ENTREGADO)}
            /> */}
            <SmallDangerButton
              textButton={"Anular"}
              actionButton={() => {
                if (isCheck.length < 1) {
                  showMessage("Seleccionar algun pedido")
                  return
                }
                pedirSupervision("Anular Pedido", () => {
                  cambiarEstado(EstadosPedidosApp.CANCELAR)
                }, {
                  "idPedidos": isCheck, //parseInt(product.idProducto),
                })




              }
              }

            />
          </Grid>
        )
      }



    </Grid >
  ) : (
    <></>
  );
}

export default BoxAdminAppPedidos;
