import React, { useState, useContext, useEffect, useRef } from "react";

import {
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  DialogTitle,
  TextField
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";

import System from "../../Helpers/System";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Printer from "../../Models/Printer";
import Product from "../../Models/Product";
import Preventa from "../../Models/Preventa";
import Client from "../../Models/Client";
import ProductSold from "../../Models/ProductSold";
import TecladoNumeros from "../Teclados/TecladoNumeros";
import dayjs from "dayjs";

const LecturaFolioPreventa = ({
  openDialog,
  setOpenDialog
}) => {

  const {
    userData,
    showMessage,
    showLoading,
    hideLoading,
    sales,
    salesData,
    cliente,
    setCliente,

    setSalesData,
    grandTotal,
    setGrandTotal,
    addToSalesData,
    removeFromSalesData,
    quantity,
    setQuantity,
    clearSalesData,

    showConfirm,

    textSearchProducts,
    setTextSearchProducts,
    buscarCodigoProducto,
    setBuscarCodigoProducto,
    showTecladoBuscar,
    setShowTecladoBuscar,
    addNewProductFromCode,
  } = useContext(SelectedOptionsContext);

  const [folio, setFolio] = useState(0)
  const [idCabecera, setIdCabecera] = useState(0)
  const [listadoEmitidas, setListadoEmitidas] = useState([])
  const [preventaHash, setPreventaHash] = useState("")

  const refBuscar = useRef(null)

  const leerPreventa = () => {
    showLoading("Revisando preventa")

    Preventa.buscarPorFolio({
      "preVentaID": "",
      "idCabecera": idCabecera,
      "folio": folio
    }, (products, response) => {

      var valorAChequear = preventaHash
      if (folio > 0) valorAChequear = folio
      if (Preventa.yaFueUsada(valorAChequear, salesData)) {
        showMessage("Ya fue usada la preventa")
      } else {
        Preventa.adaptarLecturaProductos(products).forEach((produ) => {
          const tipo = ProductSold.getInstance().esPesable(produ) ? 2 : 1
          addToSalesData({
            ...produ, ...{
              idProducto: produ.codProducto,
              nombre: produ.descripcion,
              tipoVenta: tipo,
              precioCosto: produ.costo,
              precioVenta: produ.precioUnidad,
              preVenta: valorAChequear
            }
          })
        })

        if (response && response.preventa[0].codigoCliente > 0) {
          Client.getInstance().findById(response.preventa[0].codigoCliente, (clienteEncontrado) => {
            console.log("Respuesta del servidor:", response.data);
            clienteEncontrado.nombreResponsable = clienteEncontrado.nombre
            clienteEncontrado.apellidoResponsable = clienteEncontrado.apellido
            setCliente(clienteEncontrado)
          }, () => {
            showMessage("no se pudo seleccionar el cliente")
          })
        }
      }
      hideLoading()
      setFolio("")
      setOpenDialog(false)
    },
      (error) => {
        hideLoading()
        showMessage(error)
        // setProducts([])
      })

    return
  }


  const listarPreventas = () => {
    showLoading("Buscando ultimas...")
    Preventa.getInstance().searchPreventasInServer({
      fechadesde: dayjs().format("YYYY-MM-DD"),
      fechahasta: dayjs().format("YYYY-MM-DD"),
    }, (all) => {
      console.log("all", all)

      const noProcesadas = []
      all.preventaReportes.forEach((pre) => {
        if (!pre.procesada) {
          noProcesadas.push(pre)
        }
      })
      setListadoEmitidas(noProcesadas)
      hideLoading()
    }, (err) => {
      hideLoading()
      showMessage(err)
    })
  }

  useEffect(() => {
    if (!openDialog) {
      setPreventaHash("")
      setFolio(0)
      setIdCabecera(0)
      return
    }

    setListadoEmitidas([])

  }, [openDialog])


  return (
    <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }} fullWidth maxWidth="md">
      <DialogTitle>Lectura folio preventa</DialogTitle>
      <DialogContent onClose={() => { setOpenDialog(false) }}>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={7} lg={7}>
            <TextField
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
              }}
              fullWidth
              onClick={() => {
                // setTimeout(() => {
                //   setShowTecladoBuscar(true)
                // }, 300);
              }}
              focused
              placeholder="Buscar preventa"
              value={folio}
              // onKeyDown={handleKeydownSearchInput}
              onChange={(e) => setFolio(e.target.value)}
            />

            <Button
              sx={{
                margin: "1px",
                backgroundColor: " #283048",
                height: "70px",
                width: "100%",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1c1b17 ",
                  color: "white",
                },
              }}
              size="large"
              onClick={leerPreventa}
              ref={refBuscar}
            >
              Buscar
            </Button>


            <br></br>
            <br></br>
            <br></br>
            <Button
              sx={{
                margin: "1px",
                backgroundColor: " #44d800",
                height: "70px",
                width: "100%",
                marginBottom: "-20px",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1c1b17 ",
                  color: "white",
                },
              }}
              size="large"
              onClick={listarPreventas}
            >
              Ultimas emitidas
            </Button>

            {listadoEmitidas.length > 0 && (
              <div style={{
                minHeight: "50vh"
              }}>
                <table style={{
                  minWidth: "100%",
                  background: "#e3e3e3",
                  margin: "30px 0",
                  border: "1px solid #464646",
                  padding: "10px",
                  textAlign: "center",
                }}>
                  <thead>
                    <tr>
                      <th colSpan={100}>Listado preventas emitidas</th>
                    </tr>
                  </thead>
                  <thead>
                    <tr>
                      <th>Nro Folio</th>
                      <th>Emitida</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listadoEmitidas.map((pre, ix) => (
                      <tr key={ix} onClick={() => {
                        setFolio(0)
                        setIdCabecera(pre.idCabecera)
                        setPreventaHash(pre.preVentaID)

                        setTimeout(() => {
                          refBuscar.current.click()
                        }, 500);
                      }} style={{
                        backgroundColor: "#adadad",
                        height: " 70px",
                      }}>
                        <td>{pre.idCabecera}</td>
                        <td>{System.agoDatetime(pre.fechaIngreso, true)}</td>
                        <td>${System.formatMonedaLocal(pre.total, false)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </Grid>

          <Grid item xs={12} sm={12} md={5} lg={5}>

            <TecladoNumeros
              showFlag={true}
              varValue={folio}
              varChanger={(x) => {
                setFolio(x)
              }}
              maxValue={10000000001}
              onEnter={() => {
                if (onEnter) onEnter()
              }}
            />

          </Grid>
        </Grid>


      </DialogContent>
      <DialogActions>


      </DialogActions>
    </Dialog >
  );
};

export default LecturaFolioPreventa;
