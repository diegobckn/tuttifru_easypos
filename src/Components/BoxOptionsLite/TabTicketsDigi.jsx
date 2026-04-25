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
import { ProviderModalesContext } from "../Context/ProviderModales";
import TouchInputPage from "../TouchElements/TouchInputPage";
import ModelConfig from "../../Models/ModelConfig";
import SmallButton from "../Elements/SmallButton";
import Sucursal from "../../Models/Sucursal";
import TiposPasarela from "../../definitions/TiposPasarela";
import BaseConfig from "../../definitions/BaseConfig";
import BoxOptionList from "./BoxOptionList";
import InputCheckbox from "../Elements/Compuestos/InputCheckbox";
import InputCheckboxAutorizar from "../Elements/Compuestos/InputCheckboxAutorizar";
import BoxBat from "./BoxBat";
import MainButton from "../Elements/MainButton";
import TouchInputNumber from "../TouchElements/TouchInputNumber";
import System from "../../Helpers/System";
import InputFile from "../Elements/Compuestos/InputFile";
import ProductFastSearch from "../../Models/ProductFastSearch";
import Product from "../../Models/Product";
import AdminStorage from "../ScreenDialog/AdminStorage";
import TouchInputName from "../TouchElements/TouchInputName";
import ModosTrabajoConexion from "../../definitions/ModosConexion";
import TouchInputEmail from "../TouchElements/TouchInputEmail";
import BoxElegirSucursalYCaja from "./BoxElegirSucursalYCaja";
import LeerValeDigi from "../ScreenDialog/LeerValeDigi";
import DetalleTicketDigi from "../ScreenDialog/DetalleTicketDigi";
import BalanzaDigi from "../../Models/BalanzaDigi";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import SmallPrimaryButton from "../Elements/SmallPrimaryButton";
import SmallDangerButton from "../Elements/SmallDangerButton";

const TabTicketsDigi = ({
  onFinish = () => { }
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

    setTotal(0)

    cargarItemsDeBalanza()
  }, [])

  useEffect(() => {
    console.log("infoBalanza", infoBalanza)
  }, [infoBalanza])

  const confirmar = () => {
    setOpenDialog(false)
  }

  return (
    <Grid container spacing={2}>


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
  );
};

export default TabTicketsDigi;
