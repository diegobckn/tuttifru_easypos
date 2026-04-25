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
import SmallPrimaryButton from "../Elements/SmallPrimaryButton";
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
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const {
    pedirSupervision,
  } = useContext(ProviderModalesContext);

  const [productosBalanza, setProductosBalanza] = useState([])
  const [productosPos, setProductosPos] = useState([])
  const [verSeleccionarProductosPos, setVerSeleccionarProductosPos] = useState(false)
  const balanza = new BalanzaDigi()

  const [prodClickeado, setProdClickeado] = useState(null)

  const [verPedirNombre, setVerPedirNombre] = useState(false)
  const [nombre, setNombre] = useState("")
  const [cambioAlgo, setCambioAlgo] = useState(false)

  const nombrar = (ix) => {
    setProdClickeado(ix)
    setVerPedirNombre(true)
  }

  const confirmarCambiarNombre = () => {
    var listaProds = System.clone(productosBalanza)
    setProductosBalanza([])

    const prodBal = listaProds[prodClickeado]
    prodBal.nombre = nombre
    listaProds[prodClickeado] = prodBal

    // balanza.enviarVendedores(listadoOk, (res) => {
    //   if (res.status) {
    //     showMessage("enviado a la balanza correctamente")
    //   } else {
    //     showAlert("No se pudo enviar a la balanza")
    //   }
    // }, showAlert)
    setCambioAlgo(true)

    setVerPedirNombre(false)
    setNombre("")
    setTimeout(() => {
      setProductosBalanza(listaProds)
      setProdClickeado(null)
    }, 500);
  }


  const getNombre = (prodBal)=>{
    if(prodBal.nombre){
      return prodBal.nombre
    }else{
      return prodBal.descripcion
    }
  }

  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        // setOpenDialog(false)
      }} maxWidth="lg"
      fullWidth>
      <DialogTitle>
        Productos Balanza Digi
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
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{
                  // maxHeight: "400px",
                  // maxHeight: "200px",
                  // overflowY: "auto"


                }}>
                  {productosBalanza.map((prodBalanza, ix) => (
                    <TableRow key={ix}>
                      <TableCell sx={{
                        textAlign: "center"
                      }}>{parseInt(prodBalanza.plu)}</TableCell>
                      <TableCell>{getNombre(prodBalanza)}</TableCell>
                      <TableCell>${System.formatMonedaLocal(prodBalanza.precio, false)}</TableCell>
                      <TableCell>
                        <SmallButton textButton={"renombrar"} actionButton={() => {
                          nombrar(ix)
                          setNombre(getNombre(prodBalanza))
                        }} />
                        <SmallButton textButton={"Detalles"} actionButton={() => {
                          showAlert(<textarea cols={100} rows={50} value={LogObject(prodBalanza)} readOnly />)
                        }} />
                      </TableCell>
                    </TableRow>
                  )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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


        </Grid>




      </DialogContent>
      <DialogActions>


        <SeleccionarProductos
          productosSeleccionados={productosPos}
          setProductosSeleccionados={setProductosPos}
          openDialog={verSeleccionarProductosPos}
          setOpenDialog={setVerSeleccionarProductosPos}

          txtButtonConfirm={"Enviar a la balanza"}

          onConfirm={(productosPos) => {
            showLoading("Enviando a la balanza...")
            balanza.enviarProductos({
              productosPos
            }, (res) => {
              if (res.status) {
                showAlert("Enviado correctamente")
              }
              hideLoading()
            }, (er) => {
              hideLoading()
              showAlert(er)
              setVerSeleccionarProductosPos(true)
            })
          }}
        />
        <SmallButton
          style={{
            backgroundColor: "#99017D"
          }}
          textButton={"Enviar Productos"}
          actionButton={() => {
            setVerSeleccionarProductosPos(true)
          }}
          isDisabled={cambioAlgo}
        />




        <SmallButton
          textButton={"Recibir de la balanza"}
          actionButton={() => {
            showLoading("Recibiendo de la balanza...")
            balanza.recibirYLeerProductos((res) => {
              if (res.status && res.info.length > 0) {
                setProductosBalanza(res.info)
                showMessage("Recibido correctamente")
              }
              hideLoading()
            }, (er) => {
              console.log("error", er)
              hideLoading()
              showAlert(er)
            })
          }}
          isDisabled={cambioAlgo}
        />
        <SmallDangerButton
          textButton={"Vaciar la balanza"}
          actionButton={() => {
            showLoading("Vaciando la balanza...")
            balanza.eliminarProductos((res) => {
              if (res.status) {
                showAlert("Vaciada correctamente")
              }
              hideLoading()
            }, (er) => {
              hideLoading()
              showAlert(er)
            })
          }}

          style={{
            marginRight:"50px"
          }}
          isDisabled={cambioAlgo}
        />
        <SmallPrimaryButton
          textButton={"Enviar cambios"}
          actionButton={() => {
            console.log("enviar a la balanza", productosBalanza)
            showLoading("Enviando cambios a la balanza")
            balanza.enviarProductosFormatoBalanza(productosBalanza, (res) => {
              if (res.status && res.info.length > 0) {
                showMessage("Enviado correctamente")
              }
              hideLoading()
            }, (er) => {
              hideLoading()
              showAlert(er)
            })
          }}
          isDisabled={!cambioAlgo}
        />

        <Button
          onClick={() => {
            setOpenDialog(false)
            setProductosBalanza([])
            setCambioAlgo(false)
          }}
        >Volver</Button>
      </DialogActions>
    </Dialog >
  );
};
