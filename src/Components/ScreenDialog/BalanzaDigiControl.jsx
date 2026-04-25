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
import BalanzaDigiControlProductos from "./BalanzaDigiControlProductos";
import BalanzaDigiControlVendedores from "./BalanzaDigiControlVendedores";
import BalanzaDigiControlTeclas from "./BalanzaDigiControlTeclas";


export default ({
  openDialog,
  setOpenDialog,

}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showAlert,
  } = useContext(SelectedOptionsContext);

  const {
    pedirSupervision,
  } = useContext(ProviderModalesContext);

  const [modalProductos, setModalProductos] = useState(false)
  const [modalVendedores, setModalVendedores] = useState(false)
  const [modalTeclasRapidas, setModalTeclasRapidas] = useState(false)

  // useEffect(() => {
  // }, [])


  return (
    <Dialog
      open={openDialog}
      onClose={() => {
        // setOpenDialog(false)
      }} maxWidth="lg"
      fullWidth>
      <DialogTitle>
        Balanza Digi
      </DialogTitle>
      <DialogContent>


        <Grid container spacing={2} sx={{
          padding: "20px",
          minWidth: "50vw",
          position: "relative"
        }}>

          <Grid item xs={12} md={12} lg={12}>

            <SmallButton style={{
              height: "100px"
            }}
              textButton={"Productos"}
              actionButton={() => {
                setModalProductos(true)
              }} />
            <SmallButton style={{
              height: "100px"
            }}
              textButton={"Vendedores"}
              actionButton={() => {
                setModalVendedores(true)
              }} />
            <SmallButton style={{
              height: "100px"
            }}
              textButton={"Teclas rapidas"}
              actionButton={() => {
                setModalTeclasRapidas(true)
              }}
            />
          </Grid>

        </Grid>

        <BalanzaDigiControlProductos
          openDialog={modalProductos}
          setOpenDialog={setModalProductos}
        />
        <BalanzaDigiControlVendedores
          openDialog={modalVendedores}
          setOpenDialog={setModalVendedores}
        />
        <BalanzaDigiControlTeclas
          openDialog={modalTeclasRapidas}
          setOpenDialog={setModalTeclasRapidas}
        />

      </DialogContent>
      <DialogActions>


        <Button
          onClick={() => {
            setOpenDialog(false)
            setProductosBalanza([])
          }}
        >Volver</Button>
      </DialogActions>
    </Dialog >
  );
};
