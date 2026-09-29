/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  TableContainer,
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../Context/ProviderModales";

import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import AperturaCaja from "../../Models/AperturaCaja";
import dayjs from "dayjs";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import User from "../../Models/User";
import OfflineAutoIncrement from "../../Models/OfflineAutoIncrement";
import AperturaCierreOffline from "../../Models/AperturaCierreOffline";
import PasarelaPago from "../../Models/PasarelaPago";
import LoopProperties from "../../Helpers/LoopProperties";


export default ({
  openDialog,
  setOpenDialog
}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showLoading,
    hideLoading,
    showAlert,
    showConfirm
  } = useContext(SelectedOptionsContext);


  const {
    pedirSupervision,
  } = useContext(ProviderModalesContext);


  const [transacciones, setTransacciones] = useState([])


  const cargarTransacciones = () => {
    var trs = []

    const pp = PasarelaPago.getInstance()

    const car = pp.sesion.cargar(1)
    console.log("cargado", car)
    if (car && car.ventas) {
      setTransacciones(car.ventas)
    }
  }

  useEffect(() => {
    if (!openDialog) return

    cargarTransacciones()

  }, [openDialog])

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        setOpenDialog(false)
      }}
      maxWidth="md"
    >
      <DialogTitle>
        Transacciones
      </DialogTitle>
      <DialogContent>





        <TableContainer
          style={{ overflowX: "auto" }}
        >
          <Table sx={{ background: "white" }}>
            <TableHead>
              <TableRow>
                <TableCell>Nro comp.</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Tarjeta</TableCell>
                <TableCell>Cuotas</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transacciones.map((tran, ix) => (
                <TableRow key={ix}>
                  <TableCell>
                    {tran.response && (
                      <Typography>
                        {tran.response.operationId}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {tran.response && (
                      <Typography>
                        ${System.formatMonedaLocal(tran.response.amount, true)}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {tran.response && (
                      <Typography>
                        {tran.response.cardType == "PR" ?
                          "DEBITO" :
                          tran.response.cardType == "CR" ?
                            "CREDITO" :
                            "-"
                        }
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {tran.response && (
                      <Typography>
                        {tran.response.sharesNumber}x
                        {" "}
                        ${System.formatMonedaLocal(tran.response.sharesAmount, true)}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>{System.formatDateServer(tran.fechaOperacion)}</TableCell>
                  <TableCell>{tran.horaOperacion}</TableCell>
                  <TableCell>{tran.estado ? tran.estado : "-"}</TableCell>
                  <TableCell>
                    <SmallButton
                      textButton={"Info"}
                      actionButton={() => {
                        showLoading("Consultando informacion...")
                        PasarelaPago.consultar(tran.idPosTxs, (res) => {
                          console.log("res", res)
                          new LoopProperties([1, 2, 3], (val, ix, looper) => {
                            console.log("val", val)
                            if (val == 0) {
                              PasarelaPago.actualizarEstadoVenta(
                                tran.idPosTxs,
                                res.data.response.responseMessage,
                                () => { },
                                () => { })
                            } else if (val == 1) {
                              PasarelaPago.actualizarMontoVenta(
                                tran.idPosTxs,
                                res.data.response.amount,
                                () => { }, () => { })
                            } else if (val == 2) {
                              PasarelaPago.actualizarCodAutorizaVenta(
                                tran.idPosTxs,
                                res.data.response.authorizationCode,
                                () => { }, () => { })
                            }
                            looper.next()
                          }, () => {
                            hideLoading()
                            cargarTransacciones()
                            showMessage("Realizado correctamente")
                          })
                        }, (er) => {
                          hideLoading()
                          showMessage(er)
                        })
                      }}
                    />
                    {/* <SmallButton
                      textButton={"Info Directo"}
                      actionButton={() => {
                        PasarelaPago.consultaPos(tran.idPosTxs, (res) => {
                          console.log("res2", res)
                          PasarelaPago.actualizarEstadoVenta(
                            tran.idPosTxs,
                            res.data.response.responseMessage, () => {
                              cargarTransacciones()
                            }, () => { })
                          showMessage("Realizado correctamente")
                        }, showMessage)
                      }}
                    /> */}

                    {tran.monto && tran.monto > 0 && tran.codigoAutorizacion && (
                      <SmallButton
                        textButton={"Devolver"}
                        actionButton={() => {
                          var monto = prompt("Monto a devolver")
                          if (!monto) return
                          if (monto > tran.monto) {
                            showAlert("Monto incorrecto. Maximo " + tran.monto)
                            return
                          }
                          showLoading("Devolviendo...")
                          PasarelaPago.devolver(monto, tran.codigoAutorizacion, () => {
                            hideLoading()
                            showMessage("Realizado correctamente")

                            PasarelaPago.actualizarEstadoVenta(
                              tran.idPosTxs,
                              "Devolucion aprobada",
                              () => {
                                cargarTransacciones()
                              },
                              () => { })
                          }, (er) => {
                            hideLoading()
                            showMessage(er)
                          })
                        }}
                      />
                    )}
                    {tran.estado && tran.estado == "Aprobado" && (
                      <SmallButton
                        textButton={"Anular"}
                        actionButton={() => {
                          showLoading("Anulando...")
                          PasarelaPago.anular(tran.response.operationId, () => {
                            hideLoading()
                            showMessage("Realizado correctamente")
                            PasarelaPago.actualizarEstadoVenta(
                              tran.idPosTxs,
                              "Anulacion aprobada",
                              () => {
                                cargarTransacciones()
                              },
                              () => { })
                          }, (er) => {
                            hideLoading()
                            showMessage(er)
                          })
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>
        </TableContainer>





      </DialogContent>
      <DialogActions>

        <SmallButton
          isDisabled={transacciones.length < 1}
          textButton={"Vaciar"}
          actionButton={() => {
            pedirSupervision("vaciar transacciones de pagos", () => {
              PasarelaPago.vaciarSesion()
              cargarTransacciones()
            })
          }}
        />

        <Button onClick={() => {
          setOpenDialog(false)
        }}>Volver</Button>
      </DialogActions>
    </Dialog>
  );
};
