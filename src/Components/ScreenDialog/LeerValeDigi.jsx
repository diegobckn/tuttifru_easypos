/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,

  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField,
  Paper
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import IngresarTexto from "./IngresarTexto";
import BalanzaDigi from "../../Models/BalanzaDigi";
import Product from "../../Models/Product";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ProductSold from "../../Models/ProductSold";
import TableItemTicketDigi from "../BoxOptionsLite/TableItemTicketDigi";
import TableListItemsTicketDigi from "../BoxOptionsLite/TableListItemsTicketDigi";
import IngresarNumeroORut from "./IngresarNumeroORut";

const LeerValeDigi = ({
  openDialog,
  setOpenDialog,
  anyNumber = 0,
  autofocoInput = false
}) => {

  const {
    addToSalesData,
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


  const [verIngresoTicket, setVerIngresoTicket] = useState(false)
  const [valorTicket, setValorTicket] = useState("")

  const [infoBalanza, setInfoBalanza] = useState([])
  const [productos, setProductos] = useState([])

  const [total, setTotal] = useState(0)

  const balanza = new BalanzaDigi()

  const refBuscar = useRef(null)

  const handlerSaveAction = () => {
    setOpenDialog(false)
  }

  const cargarLosTicketsDeLaBalanza = () => {
    // console.log("cargarLosTicketsDeLaBalanza")
    balanza.estadoVales((res) => {
      // console.log("res", res)
      if (res.status) {
        // setInfoBalanza(res.info.info51)
        // console.log("setInfoBalanza1 con ", res.info.info51)
        balanza.guardarEnSesionTodos(res.info)
      } else {
        // showAlert("No se pudo leer los tickets de la balanza.")
      }
      setTimeout(() => {
        cargarLosTicketsDeLaBalanza()
      }, 30 * 1000);
      // hideLoading()
    }, () => {
    })
  }

  const cargarLosTickets = () => {
    // console.log("cargarLosTickets")
    // showLoading("Buscando los tickets de la balanza...")

    if (balanza.sesion.hasOne()) {
      balanza.obtenerDeSesionTodos((infoSesion) => {
        hideLoading()
        // console.log("infoSesion", infoSesion)
        if (!infoSesion) {
          showMessage("No se pudo leer los tickets de la balanza o no hay ninguno. Se reintentara en 10 segundos.")
          // console.log("setInfoBalanza2 con ", [])
          setInfoBalanza([])
        } else {
          // console.log("setInfoBalanza3 con ", infoSesion.info51)
          setInfoBalanza(infoSesion.info51)
        }

        setTimeout(() => {
          cargarLosTicketsDeLaBalanza()
        }, 10 * 1000);

      })
      return
    }

    cargarLosTicketsDeLaBalanza()
  }

  const revisarFoco = () => {
    setVerIngresoTicket(false)
    setTimeout(() => {
      if (autofocoInput && refBuscar && refBuscar.current) {
        refBuscar.current.click()
      }
    }, 300);
  }

  useEffect(() => {
    if (!openDialog) return

    // console.log("LeerValeDigi openDialog", openDialog)
    setProductos([])
    setTotal(0)
    setValorTicket("")

    revisarFoco()
    cargarLosTickets()
  }, [openDialog])

  useEffect(() => {
    // console.log("infoBalanza", infoBalanza)
    if (infoBalanza) {
      revisarFoco()
    }
  }, [infoBalanza])

  useEffect(() => {
    // console.log("valorTicket", valorTicket)
    if (productos.length > 0) {
      confirmar()
    }
  }, [productos])

  useEffect(() => {
    if (anyNumber != 0 && infoBalanza) {
      hacerCarga(anyNumber)
    }
  }, [anyNumber, infoBalanza])

  const hacerCarga = (manualTicketValue = 0) => {
    // console.log("hacerCarga..manualTicketValue", manualTicketValue)
    // console.log("hacerCarga..infoBalanza", infoBalanza)
    if (infoBalanza.length < 1) {
      showAlert("No se pudo leer los tickets de la balanza")
      return
    }
    var nroValeBuscado = valorTicket
    if (manualTicketValue != 0 && valorTicket == "") {
      nroValeBuscado = manualTicketValue
      setValorTicket(manualTicketValue)
    }

    var nroTicketSm300 = parseInt(nroValeBuscado.substring(2, 6))

    const nroValeTicket = parseInt(nroValeBuscado)
    const coinciden = []

    const hay = infoBalanza.length
    var va = 0
    var totalProds = 0

    const revisarSiTermino = () => {
      if (va == hay) {
        setProductos(coinciden)
        // console.log("coinciden", coinciden)
        setTotal(totalProds)
        if (coinciden.length < 1) {
          showAlert("No se encontro el ticket " + valorTicket)
        }
      }
    }

    if (balanza.yaEstaUsado(nroValeTicket) || balanza.yaEstaUsado(nroTicketSm300)) {
      showAlert("El vale ya fue usado")
      return
    }

    // console.log("infoBalanza", infoBalanza)
    // console.log("hay", hay)
    // console.log("nroValeTicket", nroValeTicket)
    infoBalanza.forEach((item) => {
      // console.log("item.nroVale", item.nroVale)
      if (parseInt(item.nroVale) == nroValeTicket || parseInt(item.nroVale) == nroTicketSm300) {
        // console.log("coincide")
        // coinciden.push(item)

        Product.getInstance().findByCodigoBarras({
          codigoProducto: parseInt(item.pluItem)
        }, (prods) => {

          if (prods.length > 0) {
            const prod = new ProductSold()
            prod.fill(prods[0])
            prod.cantidad = parseFloat(item.pesoItem) / 1000
            prod.updateSubtotal()
            prod.total = parseFloat(item.precioTotalItem)
            item.inPos = prod
            // console.log("haciendo push en coincide 1")
            coinciden.push(item)
            totalProds += prod.total
          } else {
            // console.log("coincide pero no esta en el po")
            item.inPos = null
            // console.log("haciendo push en coincide 2")
            coinciden.push(item)
          }
          va++
          revisarSiTermino()
        }, (er) => {
          // console.log("coincide pero no esta en el po")
          item.inPos = null
          // console.log("haciendo push en coincide 3")
          coinciden.push(item)
          va++
          revisarSiTermino()
          showAlert(er)
        })
      } else {
        // console.log("no coincide")
        va++
        revisarSiTermino()
      }
    })

  }



  const confirmar = () => {
    productos.forEach((item) => {
      if (item.inPos) {
        item.inPos.nroValeDigi = parseInt(valorTicket)
        addToSalesData(item.inPos)
      }
    })

    balanza.agregarUsado(parseInt(valorTicket))
    setProductos([])
    setOpenDialog(false)
  }


  const handlerBuscar = () => {
    var nroTicketSm300 = valorTicket.substring(2, 6)
    if (
      balanza.yaEstaUsado(valorTicket)
      || balanza.yaEstaUsado(nroTicketSm300)
    ) {
      showAlert("El vale ya fue usado")
      return
    }
    hacerCarga()
  }

  return (
    <Dialog
      open={openDialog} onClose={() => { }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Leer captura vale Digi
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">

            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <TextField
              fullWidth

              ref={refBuscar}
              placeholder="Lectura de vale"
              value={valorTicket}
              onChange={(e) => setValorTicket(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                margin: "1px",
              }}
              onClick={() => {
                setVerIngresoTicket(true)
              }}
              onKeyDown={(e) => {
                if (e.keyCode == 13) {
                  handlerBuscar()
                }
              }}
            />

            {/* <IngresarTexto
              title="Lectura de vale"
              openDialog={verIngresoTicket}
              setOpenDialog={setVerIngresoTicket}
              varChanger={setValorTicket}
              varValue={valorTicket}
              onEnter={handlerBuscar}
            /> */}

            <IngresarNumeroORut
              title="Lectura de vale"
              openDialog={verIngresoTicket}
              setOpenDialog={setVerIngresoTicket}
              varChanger={setValorTicket}
              varValue={valorTicket}
              onEnter={handlerBuscar}
              onBack={() => {
                setOpenDialog(false)
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={5} lg={5}>
            <SmallButton
              style={{
                height: "52px",
                position: "relative",
                top: "-3px",
              }}
              textButton={"Buscar"}
              actionButton={handlerBuscar} />

          </Grid>

          <TableListItemsTicketDigi listadoItems={productos} />

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>Total ${System.formatMonedaLocal(total, false)}</Typography>
          </Grid>

        </Grid>

      </DialogContent>
      <DialogActions>

        {productos.length > 0 && (
          <SmallButton
            style={{
              width: "inherit",
              height: "55px"
            }}
            textButton={"Confirmar y agregar productos"} actionButton={() => {
              confirmar()
            }} />
        )}

        <Button onClick={() => {
          setOpenDialog(false)
        }}>Volver</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeerValeDigi;
