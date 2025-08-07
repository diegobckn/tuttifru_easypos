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
  Grid,
  Typography,
  TextField,
  Box,
  IconButton
} from "@mui/material";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import MainButton from "../Elements/MainButton";
import Agregar from "./Agregar";
import Quitar from "./Quitar";

import DeleteIcon from '@mui/icons-material/Delete';

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";
import { EXTRA_ENTREGA, extraDefaultLlevar } from "../../Types/TExtra";

const AgregarQuitar = ({
  openDialog,
  setOpenDialog,
  product,
  indexInSales
  // onChange
}) => {

  const {
    userData,
    updateUserData,
    showMessage,
    sales,
    showConfirm,
    replaceToSalesData,
    decrementQuantity,
    removeFromSalesData,

    setSalesData,
    setGrandTotal
  } = useContext(SelectedOptionsContext);

  const [showModalAgregar, setShowModalAgregar] = useState(false)
  const [showModalQuitar, setShowModalQuitar] = useState(false)

  const [agregados, setAgregados] = useState([])
  const [quitados, setQuitados] = useState([])

  const [entrega, setEntrega] = useState("")
  const [showCambiarEntrega, setShowCambiarEntrega] = useState(false)

  const desagregar = (agregado, index) => {
    // console.log("desagregar", agregado)
    showConfirm("Eliminar de agregados a '" + agregado.nombre + "'?", () => {
      const copiaAgregados = []
      product.extras.agregar.forEach((agr, ix) => {
        if (ix != index) {
          copiaAgregados.push(agr)
        }
      })

      const copiaProduct = System.clone(product)
      copiaProduct.extras.agregar = copiaAgregados

      replaceToSalesData(indexInSales, copiaProduct)

      setAgregados([...copiaAgregados])

      // console.log("agregado", agregado)
      const indexADescontar = sales.findKeyAndPriceInProducts(agregado.idProducto, agregado.precioVenta)
      // console.log("indexADescontar", indexADescontar)
      if (indexADescontar > -1) {
        const producADescontar = sales.products[indexADescontar]
        console.log("producADescontar", producADescontar)
        // if (producADescontar.quantity > 1) {
        // decrementQuantity(indexADescontar)
        sales.changeQuantityByIndex(indexADescontar, producADescontar.cantidad - product.cantidad, true)
        setSalesData(sales.products)
        setGrandTotal(sales.getTotal())


        // console.log("solo descontando")
        // } else {
        // console.log("eliminando directamente sin descontar")
        // removeFromSalesData(indexADescontar)
        // }
      }
    })
  }

  const desquitar = (quitado, index) => {
    showConfirm("Eliminar de quitados a '" + quitado.nombre + "'?", () => {
      const copiaQuitar = []
      product.extras.quitar.forEach((agr, ix) => {
        if (ix != index) {
          copiaQuitar.push(agr)
        }
      })

      const copiaProduct = System.clone(product)
      copiaProduct.extras.quitar = copiaQuitar

      replaceToSalesData(indexInSales, copiaProduct)

      setQuitados([...copiaQuitar])
    })
  }

  useEffect(() => {

    if (!openDialog) return
    // console.log("analizando si tiene extras", product)
    if (product.extras.agregar) {
      setAgregados([...product.extras.agregar])
      // console.log("tiene agregados", product.extras.agregar)
    }

    if (product.extras.quitar) {
      setQuitados([...product.extras.quitar])
      // console.log("tiene quitados", product.extras.quitar)
    }

    setEntrega(product.extras.entrega)


  }, [openDialog, showModalAgregar, showModalQuitar])

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="lg">
      <DialogTitle>
        Agregar o quitar
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} sm={12} md={12} lg={12}>



          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Agregar openDialog={showModalAgregar} setOpenDialog={setShowModalAgregar} product={product} indexInSales={indexInSales} />
            <Quitar openDialog={showModalQuitar} setOpenDialog={setShowModalQuitar} product={product} indexInSales={indexInSales} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography variant="body4" color="black" sx={{
              paddingLeft: "5px 0 10px",
              // backgroundColor:"red",
              fontSize: "20px",
              fontWeight: "bold",
              margin: "10px"
            }}>
              {product.description}
            </Typography>
          </Grid>


          {(agregados.length > 0 || quitados.length > 0) && (
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Typography sx={{
                fontSize: "15px",
                paddingLeft: "10px"
              }}>Agregados:</Typography>
              <Box sx={{
                // backgroundColor: "blue",
                height: "250px",
                overflow: "scroll",
              }}>

                {agregados.map((agregado, key) => (
                  <div style={{
                    padding: "10px 20px 10px 0px",
                    margin: "-1px 10px 10px 5px",
                    borderBottom: "1px solid #e9e9e9",
                    position: "relative"
                  }} key={key}>
                    <Typography>{agregado.description}</Typography>
                    <IconButton sx={{
                      position: "absolute",
                      top: "1px",
                      color: "red",
                      // border:"1px solid blue",
                      borderRadius: "0",
                      right: "0px",
                    }}
                      onClick={() => {
                        desagregar(agregado, key)
                      }}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )
                )}
              </Box>
            </Grid>
          )}

          {(agregados.length > 0 || quitados.length > 0) && (
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Typography sx={{
                fontSize: "15px",
                paddingLeft: "10px"
              }}>Quitados:</Typography>
              <Box sx={{
                // backgroundColor: "blue",
                height: "250px",
                overflow: "scroll",
              }}>

                {quitados.map((quitado, key) => (
                  <div style={{
                    padding: "10px 20px 10px 0px",
                    margin: "-1px 10px 10px 5px",
                    borderBottom: "1px solid #e9e9e9",
                    position: "relative"
                  }} key={key}>
                    <Typography>{quitado.description}</Typography>
                    <IconButton sx={{
                      position: "absolute",
                      top: "1px",
                      color: "red",
                      // border:"1px solid blue",
                      borderRadius: "0",
                      right: "0px",
                    }}
                      onClick={() => {
                        desquitar(quitado, key)
                      }}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )
                )}
              </Box>
            </Grid>
          )}


          <Grid item xs={12} sm={12} md={6} lg={6}>
            <MainButton xs={12} sm={12} md={12} lg={12} textButton={"Agregar"} actionButton={() => {
              setShowModalAgregar(true)
            }} />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6}>
            <MainButton xs={12} sm={12} md={12} lg={12} textButton={"Quitar"} actionButton={() => {
              setShowModalQuitar(true)
            }} />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} sx={{
            padding: "10px"
          }}>
            <Typography>
              Entrega:
            </Typography>

            <BoxOptionList
              optionSelected={entrega}
              setOptionSelected={(e) => {
                setEntrega(e)

                product.extras.entrega = e

                console.log("cambiando modo de entrega")
                console.log("indexInSales", indexInSales)

                const copiaProduct = System.clone(product)
                replaceToSalesData(indexInSales, copiaProduct)
              }}
              options={System.arrayIdValueFromObject(EXTRA_ENTREGA)}
            />

          </Grid>


        </Grid>

      </DialogContent>
      <DialogActions>
        {/* <SmallButton textButton="Confirmar" actionButton={handlerSaveAction}/> */}

        <Grid container item xs={12} sm={12} md={12} lg={12}>
          <Grid item xs={4} sm={4} md={6} lg={6}>
          </Grid>
          <Grid item xs={8} sm={8} md={6} lg={6}>
            <MainButton xs={12} sm={12} md={12} lg={12}
              textButton={"Volver"}
              actionButton={() => {
                setOpenDialog(false)
              }}

              style={{
                backgroundColor: "red"
              }}
            />
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default AgregarQuitar;
