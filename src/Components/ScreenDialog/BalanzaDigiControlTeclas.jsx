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
import { Check, Person, ProductionQuantityLimitsSharp, QuestionAnswerRounded, WrongLocation } from "@mui/icons-material";
import User from "../../Models/User";
import LoopProperties from "../../Helpers/LoopProperties";
import TableSelecUsuario from "../BoxOptionsLite/TableSelect/TableSelecUsuario";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import SelectOption from "./SelectOption";
import TiposInfoTeclasBalanzaDigi from "../../definitions/TiposInfoTeclasBalanzaDigi";
import SeleccionarProductoDigi from "./SeleccionarProductoDigi";
import SeleccionarVendedorDigi from "./SeleccionarVendedorDigi";


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
  const [productos, setProductos] = useState([])
  const [teclasBalanza, setTeclasBalanza] = useState([])


  const [canLoadResources, setCanLoadResources] = useState(false)

  const [showModalTipo, setShowModalTipo] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null)

  const [verBuscarUsuario, setVerBuscarUsuario] = useState(false)
  const [verBuscarProducto, setVerBuscarProducto] = useState(false)

  const [teclaClickeada, setTeclaClickeada] = useState(null)
  const [cambioAlgo, setCambioAlgo] = useState(false)

  const onSelectUsuario = (usu) => {
    console.log("selecciono el usuario", usu)
    setVerBuscarUsuario(false)

    const teclas = teclasBalanza
    teclas[teclaClickeada].tipo = TiposInfoTeclasBalanzaDigi.VENDEDOR
    teclas[teclaClickeada].valor = usu.codigo

    setTeclasBalanza(teclas)

    setCambioAlgo(true)
  }
  const desasignar = (ix) => {
    const teclas = System.clone(teclasBalanza)

    var teclasList = []
    var found = -1
    teclas.forEach((tec, ixTecla) => {
      if (ixTecla == ix) {
        found = ixTecla
        tec.valor = "0"
        tec.tipo = "0"
      }
      teclasList.push(tec)
    })
    if (found != -1) {
      setCambioAlgo(true)
      setTeclasBalanza(teclasList)
    } else {
      showAlert("no se pudo desasignar")
    }
  }

  const onSelectProducto = (prod) => {
    console.log("selecciono el prod", prod)
    setVerBuscarProducto(false)

    const teclas = teclasBalanza
    teclas[teclaClickeada].tipo = TiposInfoTeclasBalanzaDigi.PRODUCTO
    teclas[teclaClickeada].valor = prod.plu

    setTeclasBalanza(teclas)
    setCambioAlgo(true)
  }

  const cargarVendedoresDeBalanza = (onFinish = (loadedOk) => { }) => {
    showLoading("cargando vendedores de la balanza")
    balanza.obtenerVendedores((res) => {
      hideLoading()
      if (!res.status) {
        showAlert("No se pudo cargar los vendedores de la balanza")
        onFinish(false)
      } else {
        console.log("cargado los vendedores de la balanza correctamente", res.info)
        onFinish(true)
        setVendedores(res.info)
      }
    }, (er) => {
      hideLoading()
      showAlert("No se pudo cargar los vendedores de la balanza")
      onFinish(false)
      console.log("callbackwrong", er)
    })
  }
  const cargarProductosDeBalanza = (onFinish = (loadedOk) => { }) => {
    showLoading("cargando productos de la balanza")
    balanza.recibirYLeerProductos((res) => {
      hideLoading()
      if (!res.status) {
        showAlert("No se pudo cargar los productos de la balanza")
        onFinish(false)
      } else {
        onFinish(true)
        console.log("cargado los productos de la balanza correctamente", res.info)
        setProductos(res.info)
      }
    }, (er) => {
      onFinish(false)
      hideLoading()
      showAlert("No se pudo cargar los productos de la balanza")
      console.log("callbackwrong", er)
    })
  }

  const getTipo = (teclaBalanza) => {
    const inv = System.invertirProps(TiposInfoTeclasBalanzaDigi)
    // console.log("inv", inv)
    if (inv[teclaBalanza]) {
      return inv[teclaBalanza]
    } else {
      return "N/D"
    }
  }

  const getIconByType = (teclaBalanza) => {
    if (teclaBalanza.tipo == TiposInfoTeclasBalanzaDigi.VENDEDOR) {
      return <Person />
    } else if (teclaBalanza.tipo == TiposInfoTeclasBalanzaDigi.PRODUCTO) {
      return <ProductionQuantityLimitsSharp />
    } else {
      return <QuestionAnswerRounded />
    }
  }

  const getInfoByType = (teclaBalanza) => {
    // console.log("getInfoByType", teclaBalanza)
    if (teclaBalanza.tipo == TiposInfoTeclasBalanzaDigi.VENDEDOR) {
      var found = -1
      vendedores.forEach((ven, ixVen) => {
        if (ven.codigo == teclaBalanza.valor) {
          // console.log("coincide ven.codigo == teclaBalanza.valor", ven, teclaBalanza)
          found = ixVen
          // } else {
          // console.log("no ven.codigo == teclaBalanza.valor", ven, teclaBalanza)
        }
      })
      if (found == -1) return "N/D"

      if (vendedores[found].nombre != "") {
        return vendedores[found].nombre
      } else {
        return "Sin nombre"
      }
    } else if (teclaBalanza.tipo == TiposInfoTeclasBalanzaDigi.PRODUCTO) {
      var found = -1
      productos.forEach((prod, ixPro) => {
        if (prod.plu == teclaBalanza.valor) {
          found = ixPro
        }
      })
      if (found == -1) return "N/D"
      if (productos[found].nombre != "") {
        return productos[found].nombre
      } else {
        return "Sin nombre"
      }
    } else {//tipo desconocido
      return "N/D"
    }
  }

  const cargarTeclasDeBalanza = (onFinish = (loadedOk) => { }) => {
    showLoading("cargando teclas de la balanza")
    balanza.enviarObtenerTeclasRapidas((res) => {
      console.log("respusta de la balanza", res)
      hideLoading()
      if (!res.status) {
        showAlert("No se pudo cargar las teclas de la balanza")
        onFinish(false)
      } else {
        onFinish(true)
        console.log("cargado las teclas de la balanza correctamente", res.info)
        setTeclasBalanza(res.info)
      }
    }, (er) => {
      hideLoading()
      onFinish(false)
      showAlert("No se pudo cargar las teclas de la balanza")
      console.log("callbackwrong", er)
    })
  }

  useEffect(() => {
    if (!openDialog) return
    setCanLoadResources(false)
    new LoopProperties([1, 2, 3], (ix, value, looper) => {
      if (value == 1) {
        console.log("cargando teclas")
        cargarTeclasDeBalanza((todOkTec) => {
          if (!todOkTec) {
            showAlert("No se pudo cargar las teclas")
          } else {
            setTimeout(() => {
              looper.next()
            }, 700)
          }
        })
      } else if (value == 2) {
        cargarVendedoresDeBalanza((todOkVen) => {
          if (!todOkVen) {
            showAlert("No se pudo cargar los vendedores")
          } else {
            setTimeout(() => {
              looper.next()
            }, 700)
          }
        })
      } else {
        cargarProductosDeBalanza((todOkPro) => {
          if (!todOkPro) {
            showAlert("No se pudo cargar los productos")
          } else {
            setCanLoadResources(true)
          }
        })
      }


    }, () => {
      // on end
    })

    // cargarVendedoresDeBalanza()
    // cargarProductosDeBalanza()
    // cargarTeclasDeBalanza()

  }, [openDialog])

  useEffect(() => {
    if (!tipoSeleccionado) return
    if (tipoSeleccionado == TiposInfoTeclasBalanzaDigi.VENDEDOR) {
      setVerBuscarUsuario(true)
    } else if (tipoSeleccionado == TiposInfoTeclasBalanzaDigi.PRODUCTO) {
      setVerBuscarProducto(true)
    }
    setTipoSeleccionado(-1)
  }, [tipoSeleccionado])

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        // setOpenDialog(false)
      }} maxWidth="lg"
      fullWidth>
      <DialogTitle>
        Teclas Balanza Digi
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
                      Pagina
                    </TableCell>
                    <TableCell>Numero</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Info</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{
                  // maxHeight: "400px",
                  // maxHeight: "200px",
                  // overflowY: "auto"
                }}>
                  {teclasBalanza.map((tecBalanza, ix) => (
                    <TableRow key={ix}>
                      <TableCell sx={{
                        textAlign: "center"
                      }}>{parseInt(tecBalanza.pagina)}</TableCell>
                      <TableCell>{tecBalanza.numero}</TableCell>
                      <TableCell>{getTipo(tecBalanza)}</TableCell>
                      <TableCell>{tecBalanza.valor}</TableCell>
                      <TableCell>
                        {getIconByType(tecBalanza)}
                        {canLoadResources && (
                          <Typography>
                            {getInfoByType(tecBalanza)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <SmallButton textButton={(tecBalanza.valor == "0" ? "Asignar" : "Cambiar")} actionButton={() => {
                          setShowModalTipo(true)
                          setTeclaClickeada(ix)
                        }} />

                        {tecBalanza.valor != "0" && (
                          <SmallDangerButton textButton={("Desasignar")} actionButton={() => {
                            desasignar(ix)
                          }} />
                        )}

                      </TableCell>
                    </TableRow>
                  )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>


        <SelectOption
          openDialog={showModalTipo}
          setOpenDialog={setShowModalTipo}
          onSelect={(tp) => {
            setTipoSeleccionado(tp)
          }}
          optionObject={TiposInfoTeclasBalanzaDigi}
        />

        <SeleccionarProductoDigi
          openDialog={verBuscarProducto}
          setOpenDialog={setVerBuscarProducto}
          listadoItems={productos}
          onSelect={onSelectProducto}
        />

        <SeleccionarVendedorDigi
          openDialog={verBuscarUsuario}
          setOpenDialog={setVerBuscarUsuario}
          listadoItems={vendedores}
          onSelect={onSelectUsuario}
        />

      </DialogContent>
      <DialogActions>

        <SmallSecondaryButton
          textButton={"Enviar cambios a la balanza"}
          actionButton={() => {
            showAlert("enviando...")
            setCambioAlgo(false)
            console.log("enviar", teclasBalanza)
            balanza.enviarTeclasRapidas(teclasBalanza, () => {
              showAlert("Enviadas correctamente")
              setOpenDialog(false)
            })
          }}
          isDisabled={!cambioAlgo}
          style={{
            width: "140px"
          }}
        />
        <Button
          onClick={() => {
            setOpenDialog(false)
          }}
        >Volver</Button>
      </DialogActions>
    </Dialog >
  );
};
