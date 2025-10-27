import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Paper,
  Avatar,
  Box,
  Grid,
  Stack,
  InputLabel,
  Typography,
  CircularProgress,
  Snackbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  MenuItem,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  TextField,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import PagoBoleta from "../../Models/PagoBoleta";
import TecladoPagoCaja from "./../Teclados/TecladoPagoCaja"
import BoxSelectPayMethod from "./BoxSelectPayMethod"
import BotonClienteOUsuario from "../ScreenDialog/BotonClienteOUsuario";
import BuscarUsuario from "../ScreenDialog/BuscarUsuario";
import ProductSold from "../../Models/ProductSold";
import Validator from "../../Helpers/Validator";
import SmallButton from "../Elements/SmallButton";
import Client from "../../Models/Client";
import Printer from "../../Models/Printer";
import LastSale from "../../Models/LastSale";
import PagoTransferencia from "../ScreenDialog/PagoTransferencia";
import BoxEntregaEnvases from "./BoxEntregaEnvases";
import BoxPagos from "./BoxPagos";
import UniqueVal from "../../Helpers/UniqueVal";
import ModelConfig from "../../Models/ModelConfig";
import UserEvent from "../../Models/UserEvent";
import Product from "../../Models/Product";
import BoxMultiPago from "./BoxMultiPago";
import Oferta5 from "../../Models/Oferta5";
import Model from "../../Models/Model";
import IngresarTexto from "../ScreenDialog/IngresarTexto";
import Sales from "../../Models/Sales";
import Comercio from "../../Models/Comercio";
import Retiro from "../../Models/Retiro";
import SalesOffline from "../../Models/SalesOffline";
import OfflineAutoIncrement from "../../Models/OfflineAutoIncrement";
import PrinterPaper from "../../Models/PrinterPaper";
import Descuento from "../ScreenDialog/Descuento";
import ModosTrabajoConexion from "../../definitions/ModosConexion";
import ParaEnviar from "../../Models/ParaEnviar";

const BoxBoleta = ({
  onClose,
  openDialog
}) => {
  const {
    userData,
    salesData,
    grandTotal,
    setSelectedUser,
    setTextSearchProducts,
    clearSalesData,

    cliente,
    setCliente,
    setAskLastSale,
    showMessage,
    showLoading,
    hideLoading,
    setShowDialogSelectClient,
    modoAvion,
    showAlert,
    setUltimoVuelto,
    sales,
    setSolicitaRetiro,
    showConfirm,
    setListSalesOffline,
    createQrString,
  } = useContext(SelectedOptionsContext);

  // DECLARACIONES
  // DECLARACIONES

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pagarCon, setPagarCon] = useState(0);
  const [vuelto, setVuelto] = useState(0);
  const [redondeo, setRedondeo] = useState(0);
  const [productosConEnvases, setProductosConEnvases] = useState([]);

  const [descuentoEnvases, setDescuentoEnvases] = useState(0);
  const [tieneEnvases, settieneEnvases] = useState(false);

  const [totalYDescuentoYRedondeo, setTotalYDescuentoYRedondeo] = useState(0);

  const [yaApretoPrimeraTecla, setYaApretoPrimerTecla] = useState(false);

  const [pagos, setPagos] = useState([]);
  const [totalPagos, setTotalPagos] = useState(0);

  const [aplicaRedondeo, setAplicaRedondeo] = useState(false);
  const [faltaPagar, setFaltaPagar] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);

  const [totalVentas, setTotalVentas] = useState(0);

  const [productosVendidos, setProductosVendidos] = useState([]);

  const [trabajaConComanda, setTrabajaConComanda] = useState(false);
  const [nombreClienteComanda, setNombreClienteComanda] = useState("");

  const [queOperacionHace, setQueOperacionHace] = useState("");

  const [tecladoBloqueado, setTecladoBloqueado] = useState(false);

  //preparamos los valores unicos para guardar la venta
  const [hashEnvase, setHashEnvase] = useState(null);
  const [nFolioBoleta, setNFolioBoleta] = useState(null);
  const [idTurno, setIdTurno] = useState(null);
  const [nFolioBoletaExenta, setNFolioBoletaExenta] = useState(null);
  const [nFolioTicket, setNFolioTicket] = useState(null);

  const [descuentoManual, setDescuentoManual] = useState(0);
  const [verModalDescuentos, setVerModalDescuentos] = useState(false);

  useEffect(() => {

    PrinterPaper.getInstance().loadWidthFromSesion()

    const offAI = OfflineAutoIncrement.getInstance()
    setHashEnvase(offAI.nuevoHashEnvase());
    offAI.generar("nFolioBoleta", (nv) => {
      setNFolioBoleta(nv)
      // console.log("nFolioBoleta", nv)
    }, (err) => {
    }, true);

    offAI.generar("idTurno", (nv) => {
      setIdTurno(nv)
    }, (err) => {
    }, true);

    offAI.generar("nFolioBoletaExenta", (nv) => {
      setNFolioBoletaExenta(nv)
    }, (err) => {
    }, true);

    offAI.generar("nFolioTicket", (nv) => {
      setNFolioTicket(nv)
      // console.log("nFolioTicket", nv)
    }, (err) => {
    }, true);

  }, [])

  const revisarOfertas = (ofertas) => {
    if (ofertas.length > 0) {
      var copiaProductos = salesData
      var resultadoOfertas = {
        productosQueAplican: [],
        productosQueNoAplican: copiaProductos
      }

      ofertas.forEach((ofer, ix) => {
        // if (ofer.tipo === 5) {//temporalmente, luego activar


        var of = new Oferta5();
        of.setInfo(ofer)


        while (of.debeAplicar(resultadoOfertas.productosQueNoAplican)) {
          const resultadoAplicar = of.aplicar(resultadoOfertas.productosQueNoAplican)
          // console.log("luego de aplicar queda asi", resultadoAplicar)

          resultadoOfertas.productosQueAplican =
            resultadoOfertas.productosQueAplican.concat(resultadoAplicar.productosQueAplican)
          resultadoOfertas.productosQueNoAplican =
            resultadoAplicar.productosQueNoAplican

        }
        // console.log("")
        // console.log("")
        // console.log("")
        // console.log("resultado final", resultadoOfertas)

        var totalVentasx = 0
        var productosVendidosx = []

        resultadoOfertas.productosQueAplican.forEach((prod) => {
          totalVentasx += prod.total
          productosVendidosx.push(prod)
        })

        resultadoOfertas.productosQueNoAplican.forEach((prod) => {
          totalVentasx += prod.total
          productosVendidosx.push(prod)
        })

        // console.log("total de las ventas aplicando ofertas es $", totalVentasx)
        setTotalVentas(totalVentasx)
        setProductosVendidos(productosVendidosx)
        // }else{//temporalmente, luego activar
        // setProductosVendidos(salesData)//temporalmente, luego activar
        // setTotalVentas(grandTotal)//temporalmente, luego activar
        // }
      })
    } else {
      setProductosVendidos(salesData)
      setTotalVentas(grandTotal)
    }
  }

  const aplicarOfertas = () => {
    // console.log("aplicando ofertas")

    if (!ModelConfig.get("checkOfertas")) {
      setProductosVendidos(salesData)
      setTotalVentas(grandTotal)
      return
    }
    const modoTrabajoConexion = ModelConfig.get("modoTrabajoConexion")

    if (
      (modoTrabajoConexion == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
        || modoTrabajoConexion == ModosTrabajoConexion.SOLO_OFFLINE)
      && Oferta5.session.hasOne()
    ) {
      revisarOfertas(Oferta5.session.cargar(1))
      return
    }

    Model.getOfertas((ofertas) => {
      Oferta5.guardarOffline(ofertas)
      revisarOfertas(ofertas)
    }, () => {

      if (
        (modoTrabajoConexion == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
          || modoTrabajoConexion == ModosTrabajoConexion.SOLO_OFFLINE)
        && Oferta5.session.hasOne()
      ) {
        revisarOfertas(Oferta5.session.cargar(1))
      } else {
        setProductosVendidos(salesData)
        setTotalVentas(grandTotal)
      }
    })


    // Comercio.getServerImpresionConfigs((serverImpresionConfigs) => {
    //   serverImpresionConfigs.forEach((impresion) => {
    //     if (
    //       impresion.grupo === "Ticket"
    //       && impresion.entrada === "ImprimirComanda"
    //       && impresion.valor === "SI"
    //     ) {
    //       setTrabajaConComanda(true)
    //     }
    //   })
    // }, () => { })

    setTrabajaConComanda(ModelConfig.get("trabajarConComanda"))
  }

  // ACCIONES
  // ACCIONES

  const pagoCompleto = () => {
    if (totalPagos <= 0) return false
    const pagaConEfectivo = System.pagaConEfectivo(pagos)
    // console.log("pagaConEfectivo", pagaConEfectivo)
    // console.log("totalPagos", totalPagos)
    // console.log("totalYDescuentoYRedondeo", totalYDescuentoYRedondeo)
    // console.log("totalPagos >= totalYDescuentoYRedondeo", (totalPagos >= totalYDescuentoYRedondeo))

    return (
      (totalPagos >= (totalYDescuentoYRedondeo + redondeo - 10) && pagaConEfectivo)
      || (!pagaConEfectivo && totalPagos >= totalYDescuentoYRedondeo)
    )
  }

  const handlePagoBoleta = async () => {
    // console.log("totalPagos", totalPagos)
    // console.log("totalYDescuentoYRedondeo ", totalYDescuentoYRedondeo)
    // console.log("totalPagos", totalPagos)
    // console.log("totalYDescuentoYRedondeo", totalYDescuentoYRedondeo)
    // console.log("redondeo", redondeo)

    if (totalPagos === 0 && grandTotal === 0) {
      showMessage("No se puede hacer una venta con valor 0")
      return
    }

    if (!pagoCompleto()) {
      showMessage("Debe completar los pagos para continuar")
      return
    }

    if (trabajaConComanda && nombreClienteComanda.length < 1) {
      showMessage("Debe completar el nombre de la comanda")
      return
    }

    const pagosTruncados = []

    pagos.forEach((pago) => {
      pagosTruncados.push({
        ...pago,
        montoMetodoPago: System.truncarMoneda(pago.montoMetodoPago)
      })
    })

    var algunaPreventa = ""
    const requestBody = {
      idUsuario: userData.codigoUsuario,
      fechaIngreso: System.getInstance().getDateForServer(),
      // codigoClienteSucursal: 0,
      codigoCliente: 0, // despues abajo se cambia si es necesario
      codigoUsuarioVenta: 0, // despues abajo se cambia si es necesario
      // total: (grandTotal - descuentoEnvases + redondeo),
      subtotal: System.truncarMoneda(totalYDescuentoYRedondeo),
      totalPagado: System.truncarMoneda(totalPagos),
      totalRedondeado: System.truncarMoneda(totalFinal),
      vuelto: vuelto,
      descuento: System.truncarMoneda(descuentoManual * -1),
      // redondeo: (aplicaRedondeo ? redondeo + redondeoTolerancia : 0),
      redondeo: (aplicaRedondeo ? redondeo : 0),
      products: [],
      pagos: pagosTruncados,
      preVentaID: algunaPreventa,
      nombreClienteComanda: nombreClienteComanda
    };

    //agregamos los productos

    requestBody.products =
      Sales.prepararProductosParaPagar(productosConEnvases, requestBody)

    var transferenciaDatos = {}

    pagos.forEach((pago, ix) => {
      if (pago.metodoPago == "TRANSFERENCIA") {
        // transferenciaDatos.push(pago.transferencia)
        transferenciaDatos = pago.transferencia
      }
    })

    pagos.forEach((pago, ix) => {
      if (pago.metodoPago == "CUENTACORRIENTE") {
        console.log("es cuenta corrientes..cliente", cliente)
        console.log("pago", pago)
        if (pago.data && pago.data.codigoUsuario) {
          requestBody.codigoUsuarioVenta = pago.data.codigoUsuario
        } else if (pago.data && pago.data.codigoCliente) {
          requestBody.codigoCliente = pago.data.codigoCliente
        }
      }
    })

    requestBody.transferencias = transferenciaDatos

    requestBody.queOperacionHace = queOperacionHace
    var debeActualizar = ""
    if (queOperacionHace == "Boleta") {
      requestBody.nFolioBoleta = nFolioBoleta
      debeActualizar = "nFolioBoleta"
    } else {
      requestBody.nFolioTicket = nFolioTicket
      debeActualizar = "nFolioTicket"
    }
    requestBody.hashEnvase = hashEnvase

    //chequear que con lo que paga >= al total a pagar
    setError(" ")

    var MPago = new PagoBoleta();
    MPago.fill(requestBody);

    const limpiarYCerrar = () => {
      clearSalesData();
      setVuelto(0)
      setSelectedUser(null);
      setTextSearchProducts("")
      setCliente(null)
      onClose()
    }

    const imprimirOffline = () => {
      console.log("imprimirOffline")
      Printer.adminContent({
        createQrString,
        content: requestBody,
        functionConfirm: showConfirm
      })
    }

    // console.log("requestBody", requestBody)
    // return
    const modoTrabajoConexion = ModelConfig.get("modoTrabajoConexion")


    const callbackOk = (response) => {
      hideLoading()
      showMessage(response.descripcion);
      limpiarYCerrar()
      Retiro.revisarSiDebeSolicitar(response, setSolicitaRetiro, showAlert)

      if (response.imprimirResponse == undefined) {
        response.imprimirResponse = {}
        response.imprimirResponse.test = ""
      }
      LastSale.prepare(requestBody)
      LastSale.confirm(response)

      Printer.printContent(response, showConfirm, showAlert)

      setUltimoVuelto(vuelto)
      setTimeout(() => {
        onClose();
        UserEvent.send({
          name: "realiza venta",
          info: JSON.stringify(requestBody)
        })


        //alert("Pago realizado correctamente");
        setLoading(false);
      }, 500);


    }


    const callbackWrong = (error, response) => {
      // console.log("response", response)
      hideLoading()
      setLoading(false);
      if (response.status === 409) {
        error = "Intento de pago: " + error
      }
      setError(error);

      //intenta pero al fallar lo guarda para intentar despues
      if (modoTrabajoConexion == ModosTrabajoConexion.PREGUNTAR) {
        showConfirm("No se pudo enviar la venta, desea guardar para intentar mas tarde?",
          () => {
            console.log("debeActualizar", debeActualizar)
            OfflineAutoIncrement.getInstance().actualizarEnSesion(debeActualizar, () => {
              console.log("luego de actualizar en sesion")
              setListSalesOffline(SalesOffline.add(requestBody))
              setUltimoVuelto(vuelto)

              const response = {}
              if (response.imprimirResponse == undefined) {
                response.imprimirResponse = {}
                response.imprimirResponse.test = ""
              }
              LastSale.prepare(requestBody)
              LastSale.confirm(response)


              limpiarYCerrar()
              imprimirOffline()
            }, (err) => {
              showAlert("No se pudo guardar la venta: ", err)
            })


          })
      } else {
        //solo online pero fallo.. queda como antes de enviar
      }
    }


    if (
      modoTrabajoConexion == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
      && requestBody.queOperacionHace != "Boleta"
    ) {
      console.log("debeActualizar", debeActualizar)
      OfflineAutoIncrement.getInstance().actualizarEnSesion(debeActualizar, () => {
        console.log("luego de actualizar en sesion")
        setListSalesOffline(SalesOffline.add(requestBody))
        // ParaEnviar.agregar("", requestBody, "", ParaEnviar.TIPO.VENTA_TICKET)

        setUltimoVuelto(vuelto)

        const response = {}
        if (response.imprimirResponse == undefined) {
          response.imprimirResponse = {}
          response.imprimirResponse.test = ""
        }
        LastSale.prepare(requestBody)
        LastSale.confirm(response)


        limpiarYCerrar()
        imprimirOffline()
        console.log("preparando para enviar luego de 10 seg")
        setTimeout(() => {
          SalesOffline.sincronizar(() => { }, () => {
            setListSalesOffline([])
          })
        }, 10 * 1000);
      }, (err) => {
        showAlert("No se pudo guardar la venta: ", err)
      })
      return
    }

    if (modoTrabajoConexion == ModosTrabajoConexion.SOLO_OFFLINE) {
      console.log("debeActualizar", debeActualizar)
      OfflineAutoIncrement.getInstance().actualizarEnSesion(debeActualizar, () => {
        setListSalesOffline(SalesOffline.add(requestBody))
        // ParaEnviar.agregar("", requestBody, "", ParaEnviar.TIPO.VENTA_TICKET)


        const response = {}
        if (response.imprimirResponse == undefined) {
          response.imprimirResponse = {}
          response.imprimirResponse.test = ""
        }
        LastSale.prepare(requestBody)
        LastSale.confirm(response)


        limpiarYCerrar()
        imprimirOffline()
        setUltimoVuelto(vuelto)
      }, (err) => {
        showAlert("No se pudo guardar la venta: ", err)
      })
    } else {
      setLoading(true);
      showLoading("Realizando el pago")
      setLoading(false);
      MPago.hacerPago(requestBody, callbackOk, callbackWrong)
    }

  };

  useEffect(() => {
    aplicarOfertas()
  }, [])

  useEffect(() => {
    setTecladoBloqueado(pagoCompleto())
  }, [totalVentas, totalPagos])

  // useEffect(() => {
  //   console.log("cambio tecladoBloqueado", tecladoBloqueado)
  // }, [tecladoBloqueado])

  useEffect(() => {
    if (PagoBoleta.analizarSiHaceBoleta({
      pagos: pagos
    })) {
      setQueOperacionHace("Boleta")
    } else {
      setQueOperacionHace("Ticket")
    }

    setTecladoBloqueado(pagoCompleto())
  }, [totalPagos])


  const [showNombreComanda, setShowNombreComanda] = useState(false)

  return (
    <>
      <Grid container spacing={2} style={{
        marginLeft: "-20px",
        padding: "20px",
      }}>

        <IngresarTexto
          title="Ingresar Nombre para comanda"
          openDialog={showNombreComanda}
          setOpenDialog={setShowNombreComanda}
          varChanger={setNombreClienteComanda}
          varValue={nombreClienteComanda}
        />

        <Descuento
          openDialog={verModalDescuentos}
          setOpenDialog={setVerModalDescuentos}
          descuentos={descuentoManual}
          setDescuentos={(des) => {
            setDescuentoManual(des)
          }}
          totalVentas={totalYDescuentoYRedondeo + descuentoManual}
        />

        <Grid item xs={12} sm={12} md={8} lg={8} style={{
          textAlign: "right",
          // backgroundColor:"blue"
          paddingRight: "20px"
        }}>

          <Grid container>


            {error && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography variant="body1" color="error" sx={{
                  // backgroundColor:"red"
                }}>
                  {error}
                </Typography>
              </Grid>
            )}



            <Grid item xs={12} sm={12} md={7} lg={7}>
              <TextField
                InputLabelProps={{
                  style: {
                    color: '#518eb9',
                    fontSize: 17,
                    margin: "0",
                    padding: "0"
                  }
                }}
                fullWidth
                label="Pagar con"
                value={System.showIfHasDecimal(pagarCon)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value.trim()) {
                    setPagarCon(0);

                  } else {
                    if (parseFloat(value) > 0) {
                      setPagarCon(parseFloat(value));
                    }
                  }
                }}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />

              <SmallButton textButton={"Descuentos %"} actionButton={() => {
                setVerModalDescuentos(true)
              }} style={{
                width: "100%",
                backgroundColor: "rgb(39 225 6)",
                height: "50px",
                position: "relative",
                left: "-5px"
              }} />
            </Grid>

            <Grid item xs={12} sm={12} md={5} lg={5}>
              <div style={{ minHeight: "25px" }}>
                {/* {verVuelto && ( */}

                <Typography style={{
                  color: "rgb(225, 33, 59)",
                  fontSize: "32px",
                  fontWeight: "bold",
                  fontFamily: "Victor Mono"
                }}>
                  Total: $
                  {System.showIfHasDecimal(totalFinal)}
                </Typography>

                <Typography style={{
                  color: "rgb(68 65 65)",
                  fontSize: "17px",
                  fontWeight: "bold",
                  fontFamily: "Victor Mono"
                }}>
                  SubTotal:
                  ${System.showIfHasDecimal(totalYDescuentoYRedondeo)}
                </Typography>



                <Typography style={{
                  // color:"green",
                  // fontSize:"25px",
                  fontSize: "18px",
                  position: "relative",
                  top: "1px"
                }}>
                  Total pagos:
                  ${System.showIfHasDecimal(totalPagos)}
                </Typography>


                {faltaPagar > 0 && (
                  <Typography style={{
                    color: "rgb(225, 33, 59)",
                    // fontSize:"25px",
                    fontSize: "18px",
                    position: "relative",
                    top: "1px"
                  }}>
                    Falta pagar:
                    ${System.showIfHasDecimal(faltaPagar)}
                  </Typography>
                )}

                {aplicaRedondeo && (
                  <Typography style={{
                    // color:"green",
                    // fontSize:"25px",
                    fontSize: "18px",
                    position: "relative",
                    top: "1px"
                  }}>
                    Redondeo:
                    ${System.showIfHasDecimal(redondeo)}
                  </Typography>
                )}

                <Typography style={{
                  // color:"green",
                  // fontSize:"25px",
                  fontSize: "18px",
                  position: "relative",
                  top: "1px"
                }}>
                  Vuelto:
                  ${System.showIfHasDecimal(vuelto)}
                </Typography>
                <Typography style={{
                  // color:"green",
                  // fontSize:"25px",
                  fontSize: "18px",
                  position: "relative",
                  top: "1px"
                }}>
                  Descuento:
                  ${System.showIfHasDecimal(descuentoManual)}
                </Typography>

              </div>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <BoxEntregaEnvases
                tieneEnvases={tieneEnvases}
                settieneEnvases={settieneEnvases}
                products={productosVendidos}
                productosConEnvases={productosConEnvases}
                setProductosConEnvases={setProductosConEnvases}
                descuentoEnvases={descuentoEnvases}
                setDescuentoEnvases={setDescuentoEnvases}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <BoxPagos
                pagos={pagos}
                setPagos={setPagos}
                totalPagos={totalPagos}
                setTotalPagos={setTotalPagos}
                onRemove={() => {
                  console.log("cambia yaApretoPrimeraTecla cuando elimina un pago")
                  setYaApretoPrimerTecla(false)
                }}
              />
            </Grid>

          </Grid>

        </Grid>


        <Grid item xs={12} sm={12} md={4} lg={4} sx={{
          // backgroundColor:"green"
        }}>
          <Grid
            container
            style={{
            }}
          >
            {queOperacionHace != "" && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography sx={{
                  backgroundColor: "#A7FCE9",
                  color: "black",
                  width: "20%",
                  fontSize: "23px",
                  padding: "5px 2px",
                  borderRadius: "4px",
                }} >{queOperacionHace}</Typography>
              </Grid>
            )}

            <TecladoPagoCaja
              showFlag={true}
              varValue={pagarCon}
              varChanger={(v) => {
                setPagarCon(v)
                // console.log("cambia yaApretoPrimeraTecla a true cuando apreta una tecla teclado pago..", v)
                setYaApretoPrimerTecla(true)
              }}

              onEnter={() => {

              }}
              esPrimeraTecla={!yaApretoPrimeraTecla}
              tecladoBloqueado={tecladoBloqueado}
              textoBloqueoTeclado="Teclado Bloqueado. Quite un pago para poder realizar otro."
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={8} lg={8}>

          <BoxMultiPago
            {... {
              pagarCon,
              setPagarCon,
              vuelto,
              setVuelto,
              redondeo,
              setRedondeo,
              descuentos: (descuentoEnvases + descuentoManual),
              totalVentas: totalVentas,
              totalYDescuentoYRedondeo,
              setTotalYDescuentoYRedondeo,
              yaApretoPrimeraTecla,
              setYaApretoPrimerTecla,
              pagos,
              setPagos,
              totalPagos,
              setTotalPagos,
              setAplicaRedondeo,
              setFaltaPagar,
              setTotalFinal,
              // excluirMetodos:["CUENTACORRIENTE", "DEBITO"]
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} sx={{
          // backgroundColor:"blue",
          textAlign: "center"
        }}>
          {trabajaConComanda && (
            <>
              <InputLabel>Nombre de comanda</InputLabel>
              <TextField
                sx={{
                  marginLeft: "10px",
                  marginBottom: "10px",
                  width: "101%",
                }}
                value={nombreClienteComanda}
                onChange={(e) => { setNombreClienteComanda(e.target.value) }}
                onClick={() => {
                  setShowNombreComanda(true)
                }}
              />
            </>
          )}

          <Button
            sx={{
              // position:"relative",
              // top:"5px",
              width: "104%",
              marginLeft: "5px",
              height: "58px"
            }}
            variant="contained"
            color="secondary"
            // disabled={(totalPagos >= totalYDescuentoYRedondeo)}
            onClick={handlePagoBoleta}
          >
            {loading ? (
              <>
                <CircularProgress size={20} /> Procesando...
              </>
            ) : (
              "Finalizar"
            )}
          </Button>

        </Grid>
      </Grid>
    </>
  );
};

export default BoxBoleta;
