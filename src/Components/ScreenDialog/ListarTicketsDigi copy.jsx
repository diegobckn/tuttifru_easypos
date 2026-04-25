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
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallPrimaryButton from "../Elements/SmallPrimaryButton";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import DetalleTicketDigi from "./DetalleTicketDigi";
import LeerValeDigi from "./LeerValeDigi";



const ListarTicketsDigi = ({
  openDialog,
  setOpenDialog,
  product,
  onAsignPrice
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

  const [infoBalanza, setInfoBalanza] = useState(null)
  const [item52Selected, setItem52Selected] = useState(null)

  const [total, setTotal] = useState(0)
  const [procesar, setProcesar] = useState(false)
  const [verDetalles, setVerDetalles] = useState(false)

  const balanza = new BalanzaDigi()

  const cargarItemsDeBalanza = () => {
    showLoading("cargando informacion de la balanza")
    balanza.estadoVales((res) => {
      // balanza.obtenerReporteZ((res) => {
      console.log("res", res)
      if (res.status) {
        console.log("info a usar ", res.info)
        setInfoBalanza(res.info)
        // setInfoBalanza(res.info)
      } else {
        showMessage("No se pudo cargar la informacion")
      }
      hideLoading()
    }, () => {
      showMessage("No se pudo cargar la informacion")
      hideLoading()
    })
  }

  const anularUnTicketEnBalanza = (nroVale) => {
    showLoading("Anulando vale #" + nroVale)
    balanza.anularVale(nroVale, (res) => {
      // balanza.obtenerReporteZ((res) => {
      console.log("res", res)
      if (res.status) {
        showMessage("anulado correctamente")
        cargarItemsDeBalanza()
        // setInfoBalanza(res.info)
      } else {
        showMessage("No se pudo anular")
      }
      hideLoading()
    }, () => {
      showMessage("No se pudo anular")
      hideLoading()
    })
  }

  useEffect(() => {
    if (!openDialog) return

    setTotal(0)

    cargarItemsDeBalanza()
  }, [openDialog])

  useEffect(() => {
    console.log("infoBalanza", infoBalanza)
  }, [infoBalanza])

  const confirmar = () => {
    setOpenDialog(false)
  }

  return (
    <Dialog
      open={openDialog} onClose={() => { }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Listado de tickets
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">

            </Typography>
          </Grid>

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
                      # nro vale
                    </TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Vendedor</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Peso</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{
                  // maxHeight: "400px",
                  // maxHeight: "200px",
                  // overflowY: "auto"


                }}>
                  {infoBalanza && infoBalanza.info52 && infoBalanza.info52.map((vale, ix) => vale.borradoLogico ? null : (
                    <TableRow key={ix}>
                      <TableCell sx={{
                        textAlign: "center"
                      }}>{parseInt(vale.nroVale)}</TableCell>
                      <TableCell>{vale.fechaVale}</TableCell>
                      <TableCell>{vale.horaVale}</TableCell>
                      <TableCell>{vale.nroVendedor}</TableCell>
                      <TableCell>{vale.cantidadTotalVale}</TableCell>
                      <TableCell>{vale.pesoVale}</TableCell>
                      <TableCell>${System.formatMonedaLocal(vale.totalAmount, true)}</TableCell>
                      <TableCell>
                        {/* <SmallButton textButton={"Quitar"} actionButton={() => {
                          quitar(ix)
                        }} /> */}
                        <SmallSecondaryButton textButton={"Detalles"} actionButton={() => {
                          console.log("seleccionando", vale)
                          setItem52Selected(vale)
                          setVerDetalles(true)
                        }} />
                        <SmallPrimaryButton textButton={"Procesar"} actionButton={() => {
                          setItem52Selected(vale)
                          setProcesar(true)
                        }} />
                        <SmallDangerButton textButton={"Anular"} actionButton={() => {
                          anularUnTicketEnBalanza(vale.nroVale)
                        }} />
                      </TableCell>
                    </TableRow>
                  )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <DetalleTicketDigi
              openDialog={item52Selected && verDetalles}
              setOpenDialog={setVerDetalles}
              itemTicket52={item52Selected}
              listado51={infoBalanza ? infoBalanza.info51 : []}
            />

            <LeerValeDigi
              openDialog={item52Selected && procesar}
              setOpenDialog={setProcesar}
              anyNumber={(item52Selected ? item52Selected.nroVale : 0)}
            />

          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            {/* <Typography>Total ${System.formatMonedaLocal(total, false)}</Typography> */}
          </Grid>

        </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setOpenDialog(false)
        }}>Volver</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ListarTicketsDigi;
