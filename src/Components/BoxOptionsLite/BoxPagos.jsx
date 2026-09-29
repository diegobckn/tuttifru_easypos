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
  IconButton,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import PagoBoleta from "../../Models/PagoBoleta";
import TecladoPagoCaja from "../Teclados/TecladoPagoCaja"
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
import { TabContainer } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import { RemoveCircleOutline } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Product from "../../Models/Product";
import ModelConfig from "../../Models/ModelConfig";
import PasarelaPago from "../../Models/PasarelaPago";
import PagandoPasarela from "../ScreenDialog/PagandoPasarela";

const BoxPagos = ({
  pagos, setPagos,
  totalPagos, setTotalPagos,
  onRemove = () => { },
  onRequireFinalice = () => { }
}) => {
  const {
    userData,
    salesData,
    sales,
    addToSalesData,
    setPrecioData,
    grandTotal,
    ventaData,
    setVentaData,
    searchResults,
    // setSearchResults,
    updateSearchResults,
    selectedUser,
    setSelectedUser,
    // selectedCodigoCliente,
    // setSelectedCodigoCliente,
    // selectedCodigoClienteSucursal,
    // setSelectedCodigoClienteSucursal,
    // setSelectedChipIndex,
    // selectedChipIndex,
    searchText,
    setTextSearchProducts,
    clearSalesData,

    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showMessage,
    showAlert,
    showConfirm,
    showDialogSelectClient,
    setShowDialogSelectClient,
    modoAvion,
    ultimoVuelto,
    setUltimoVuelto
  } = useContext(SelectedOptionsContext);


  const [tienePasarelaPago, setTienePasarelaPago] = useState(false)

  const [verPagandoPasarela, setVerPagandoPasarela] = useState(false)
  const [pagoParaPasarela, setPagoParaPasarela] = useState(null)
  // OBSERVERS

  useEffect(() => {
    const conPasarela = ModelConfig.get("tienePasarelaPago")
    setTienePasarelaPago(conPasarela)
    if (conPasarela) {
      pagos.forEach((pag, ix) => {
        if (
          ix == pagos.length - 1
          && !pag.pagadoPasarela
          && pag.metodoPago == "TARJETA"
          &&
          (
            pag.tipoTarjeta == "DEBITO"
            || pag.tipoTarjeta == "CREDITO")
        ) {
          setPagoParaPasarela(pag)
          setVerPagandoPasarela(true)
        }
      })
    }
  }, [totalPagos]);


  const esDataUsuario = (pago) => {
    return (pago.data && pago.data.codigoUsuario != undefined)
  }

  const esDataCliente = (pago) => {
    return (pago.data && pago.data.codigoCliente != undefined)
  }

  const esDataTarjetas = (pago) => {
    return (pago.metodoPago == "TARJETA")
  }

  const esDataTarjetaCredito = (pago) => {
    return (pago.tipoTarjeta && pago.tipoTarjeta == "DEBITO")
  }
  const esDataTarjetaDebito = (pago) => {
    return (pago.tipoTarjeta && pago.tipoTarjeta == "DEBITO")
  }


  const esDataTransferencia = (pago) => {
    return (pago.metodoPago == "TRANSFERENCIA")
  }


  const getDataUsuario = (pago) => {
    if (esDataUsuario(pago)) {
      return pago.data.nombres + " " + pago.data.apellidos
    }
    return ""
  }

  const getDataCliente = (pago) => {
    if (esDataCliente(pago)) {
      return pago.data.nombreResponsable + " " + pago.data.apellidoResponsable
    }
    return ""
  }

  const getDataTarjetas = (pago) => {
    if (esDataTarjetas(pago)) {
      return pago.tipoTarjeta
    }
    return ""
  }

  const getDataTransferencia = (pago) => {
    if (esDataTransferencia(pago)) {
      if (pago.transferencia.nombre === "string") {
        return "N/D"
      } else {
        return pago.transferencia.nombre
      }
    }
    return ""
  }



  const confirmarEliminarPago = (ix) => {
    const pagoEliminado = pagos.splice(ix, 1)
    setPagos([...pagos])
    var total = 0
    pagos.forEach((pago, ix) => {
      total += pago.montoMetodoPago
    })

    setTotalPagos(total)
    onRemove(pagoEliminado)
  }

  const eliminarPago = (pago, ix) => {
    if (pago.metodoPago == "TRANSFERENCIA") {
      showConfirm("Eliminar el pago con transferencia?", () => {
        confirmarEliminarPago(ix)
      })
      return
    }
    confirmarEliminarPago(ix)
  }

  const checkMontoEfectivo = (pago) => {
    if (pago.metodoPago !== "EFECTIVO") {
      return pago.montoMetodoPago
    } else {
      const redondeo = Product.logicaRedondeoUltimoDigito(pago.montoMetodoPago)
      var res = pago.montoMetodoPago
      if (redondeo != 0) {
        res += redondeo
      }
      return res
    }
  }

  return (
    <div style={{
      textAlign: "left",
      backgroundColor: "#f4f4f4",
      padding: "5px",
      marginTop: "10px",

    }}>
      {totalPagos > 0 && (
        <div>
          <Typography>Pagos</Typography>
          <TabContainer>
            <Table>
              <TableBody sx={{
                display: "block",
                maxHeight: "240px",
                overflow: "auto"
              }}>

                {pagos.map((pago, ix) => {
                  return (
                    <TableRow key={ix}>
                      <TableCell>
                        ${checkMontoEfectivo(pago)}
                      </TableCell>

                      <TableCell>
                        {pago.metodoPago}
                      </TableCell>


                      <TableCell>
                        {
                          getDataUsuario(pago)
                          + getDataCliente(pago)
                          + getDataTarjetas(pago)
                          + getDataTransferencia(pago)
                        }
                      </TableCell>


                      <TableCell>
                        {/* <IconButton onClick={() =>{
                  console.log("editar pago")
                }}>
                  <EditIcon />
                </IconButton> */}

                        <IconButton
                          sx={{
                            color: "tomato",
                            backgroundColor: "whitesmoke",
                            "&:hover": {
                              color: "white",
                              backgroundColor: "red",
                            },
                            border: "1px solid tomato",
                            borderRadius: "2px"
                          }}
                          onClick={() => {
                            eliminarPago(pago, ix)
                          }}>
                          <DeleteIcon />
                        </IconButton>

                      </TableCell>
                      <TableCell>

                        <PagandoPasarela
                          openDialog={verPagandoPasarela}
                          setOpenDialog={setVerPagandoPasarela}
                          pago={pagoParaPasarela}
                          onPayedOk={() => {
                            var copiaPagos = []
                            pagos.forEach((pag) => {
                              if (!System.tienenAlgoDiferente(pag, pagoParaPasarela)) {
                                pag.pagadoPasarela = true
                                copiaPagos.push(pag)
                              } else {
                                copiaPagos.push(pag)
                              }
                            })

                            setPagos(copiaPagos)
                            onRequireFinalice()
                          }}
                        />
                        {/* {
                          tienePasarelaPago
                          && pago.metodoPago == "TARJETA"
                          &&
                          (
                            pago.tipoTarjeta == "DEBITO"
                            || pago.tipoTarjeta == "CREDITO")
                          && (
                            <SmallButton
                              textButton={"Enviar a pasarela"}
                              actionButton={() => {
                                PasarelaPago.enviarVenta(pago, () => {
                                  showMessage("enviado correctamente")
                                }, () => {
                                  showMessage("No se pudo enviar")
                                })
                              }}
                            />
                          )} */}
                      </TableCell>


                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TabContainer>
        </div>
      )
      }
    </div>
  );
};

export default BoxPagos;
