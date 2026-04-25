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
  Paper,
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
import TecladoCierre from "../Teclados/TecladoCierre";
import Validator from "../../Helpers/Validator";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";
import IngresarNumeroORut from "./IngresarNumeroORut";
import SmallDangerButton from "../Elements/SmallDangerButton";
import TiposDescuentos from "../../definitions/TiposDescuentos";
import ModelConfig from "../../Models/ModelConfig";
import BalanzaDigi from "../../Models/BalanzaDigi";
import LogObject from "../../Models/LogObject";
import SeleccionarProductos from "../BoxOptionsLite/TableSelect/SeleccionarProductos";
import { Check, WrongLocation } from "@mui/icons-material";
import User from "../../Models/User";
import LoopProperties from "../../Helpers/LoopProperties";
import TableSelecUsuario from "../BoxOptionsLite/TableSelect/TableSelecUsuario";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import BuscarUsuario from "./BuscarUsuario";
import IngresarTexto from "./IngresarTexto";


export default ({
  openDialog,
  setOpenDialog,

}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showAlert,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const {
    pedirSupervision,
  } = useContext(ProviderModalesContext);

  const balanza = new BalanzaDigi()

  const [vendedores, setVendedores] = useState([])
  const [nuevoVendedor, setNuevoVendedor] = useState(null)

  const [verBuscarUsuario, setVerBuscarUsuario] = useState(false)
  const [vendedorClikeado, setVendedorClikeado] = useState(null)

  const [verPedirNombre, setVerPedirNombre] = useState(false)
  const [nombre, setNombre] = useState("")

  const agregarAlPos = (vendedorBal, ix) => {
    showAlert("agregar")
    setVendedorClikeado(ix)
  }

  const cambiarNombre = (vendedorBal, ix) => {
    setVendedorClikeado(ix)
    setNombre("")
    setVerPedirNombre(true)
  }
  const confirmarCambiarNombre = () => {
    var listaVendedores = System.clone(vendedores)
    setVendedores([])

    var listadoOk = []
    const vendedorBal = vendedores[vendedorClikeado]
    console.log("vendedorBal", vendedorBal)
    console.log("vendedorClikeado", vendedorClikeado)
    listaVendedores.forEach((ven, ix) => {
      if (ven.codigo == vendedorBal.codigo) {
        ven.nombre = nombre
      }
      listadoOk.push(ven)
    })

    balanza.enviarVendedores(listadoOk, (res) => {
      if (res.status) {
        showMessage("enviado a la balanza correctamente")
      } else {
        showAlert("No se pudo enviar a la balanza")
      }
    }, showAlert)

    setVerPedirNombre(false)
    setNombre("")
    setTimeout(() => {
      setVendedores(listadoOk)
      setVendedorClikeado(null)
    }, 500);
  }


  const onSelectUsuario = (usu) => {
    var listaVendedores = System.clone(vendedores)
    setVendedores([])
    console.log("selecciono usuario", usu);
    setNuevoVendedor(usu)

    var nuevo = {}
    nuevo.codigo = usu.idUsuario
    nuevo.nombre = usu.nombres + " " + usu.apellidos
    nuevo.clave = "2025"
    nuevo.tipo = "0"
    nuevo.enPos = usu

    listaVendedores.push(nuevo)
    balanza.enviarVendedores(listaVendedores, (res) => {
      if (res.status) {
        showMessage("enviado a la balanza correctamente")
      } else {
        showMessage("no se pudo enviar a la balanza")
      }
    }, showAlert)

  }

  const eliminar = (vendedorBal) => {
    var listaVendedores = System.clone(vendedores)
    setVendedores([])

    var listadoOk = []
    listaVendedores.forEach((ven, ix) => {
      if (ven.codigo != vendedorBal.codigo) {
        listadoOk.push(ven)
      }
    })

    balanza.enviarVendedores(listadoOk, (res) => {
      if (res.status) {
        showMessage("enviado a la balanza correctamente")
      } else {
        showAlert("No se pudo enviar a la balanza")
      }
    }, showAlert)

    setTimeout(() => {
      setVendedores(listadoOk)
    }, 500);
  }

  const revisarSiEstanEnPos = (listado) => {
    var listaBalPos = []

    showLoading("Revisando vendedores en el sistema")
    new LoopProperties(listado, (prop, venBal, looper) => {
      if (!venBal.enPos) {
        User.getByCode(venBal.codigo, (usus) => {
          if (usus.length > 0) {
            venBal.enPos = usus[0]
          }
          listaBalPos.push(venBal)
          looper.next()
        }, () => {
          listaBalPos.push(venBal)
          looper.next()
        })
      } else {
        listaBalPos.push(venBal)
        looper.next()
      }
    }, () => {
      setVendedores(listaBalPos)
      hideLoading()
    })
  }

  const cargarVendedoresDeBalanza = () => {
    showLoading("cargando informacion de la balanza")
    balanza.obtenerVendedores((res) => {
      hideLoading()
      if (!res.status) {
        showAlert("No se pudo cargar los vendedores de la balanza")
      } else {
        revisarSiEstanEnPos(res.info)
      }
    }, (er) => {
      hideLoading()
      showAlert("No se pudo cargar los vendedores de la balanza")
      console.log("callbackwrong", er)
    })
  }
  useEffect(() => {
    if (!openDialog) return
    cargarVendedoresDeBalanza()

  }, [openDialog])


  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        // setOpenDialog(false)
      }} maxWidth="lg"
      fullWidth>
      <DialogTitle>
        Vendedores Balanza Digi
      </DialogTitle>
      <DialogContent>

        <Grid container spacing={2} sx={{
          padding: "20px",
          minWidth: "50vw",
          position: "relative"
        }}>


          <Grid item xs={12} sm={12} md={12} lg={12}>

            <TableContainer
              component={Paper}
            // style={{
            //   overflowX: "auto"
            // }}
            >
              <Table>
                <TableHead sx={{
                  background: "#859398",
                  // height: "30%"
                  // height: "60px"
                }}>
                  <TableRow>
                    <TableCell sx={{
                      textAlign: "center"
                    }}>
                      Codigo
                    </TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>En Pos</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{
                  // maxHeight: "400px",
                  // maxHeight: "200px",
                  // overflowY: "auto"
                }}>
                  {vendedores.map((venBalanza, ix) => (
                    <TableRow key={ix}>
                      <TableCell sx={{
                        textAlign: "center"
                      }}>{parseInt(venBalanza.codigo)}</TableCell>
                      <TableCell>{venBalanza.nombre}</TableCell>
                      <TableCell>{venBalanza.enPos ? <Check
                        sx={{
                          color: "#00f"
                        }}
                      /> : <WrongLocation
                        sx={{
                          color: "#f00"
                        }}
                      />}</TableCell>
                      <TableCell>
                        {!["1", "2", "3", "4", "99"].includes(venBalanza.codigo) && (
                          <SmallButton
                            textButton={"eliminar"}
                            actionButton={() => {
                              eliminar(venBalanza)
                            }} />
                        )}

                        {!venBalanza.enPos && (
                          <SmallButton textButton={"agregar al pos"} actionButton={() => {
                            agregarAlPos(venBalanza, ix)
                          }} />
                        )}
                        <SmallButton textButton={"cambiar nombre"} actionButton={() => {
                          cambiarNombre(venBalanza, ix)
                        }} />
                      </TableCell>
                    </TableRow>
                  )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

        <IngresarTexto
          title={"Nombre"}
          openDialog={verPedirNombre}
          setOpenDialog={setVerPedirNombre}
          varChanger={setNombre}
          isUrl={false}
          varValue={nombre}

          onEnter={() => {
            setTimeout(() => {
              confirmarCambiarNombre()
            }, 300);
          }}

          onConfirm={() => {
            setTimeout(() => {
              confirmarCambiarNombre()
            }, 300);
          }}
        />

        <BuscarUsuario
          openDialog={verBuscarUsuario}
          setOpenDialog={setVerBuscarUsuario}
          onSelect={onSelectUsuario}
        />

      </DialogContent>
      <DialogActions>

        <SmallSecondaryButton
          textButton={"Agregar vendedor"}
          actionButton={() => {
            setVerBuscarUsuario(true)
          }} />

        <Button
          onClick={() => {
            setOpenDialog(false)
          }}
        >Volver</Button>
      </DialogActions>
    </Dialog >
  );
};
