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
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import AperturaCaja from "../../Models/AperturaCaja";
import dayjs from "dayjs";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import InputGeneric from "../Elements/Compuestos/InputGeneric";
import BoxOptionList from "../BoxOptionsLite/BoxOptionList";


const CorregirFolios = ({
  openDialog,
  setOpenDialog,
  onConfirm
}) => {

  const {
    userData,
    updateUserData,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [tipoVenta, setTipoVenta] = useState("Ticket")
  const [nuevoFolio, setNuevoFolio] = useState(0)

  return (
    <Dialog open={openDialog} onClose={() => { }} maxWidth="md">
      <DialogTitle>
        Corregir Folios
      </DialogTitle>
      <DialogContent>

        <Typography>Tipo de venta</Typography>
        <BoxOptionList
          optionSelected={tipoVenta}
          setOptionSelected={setTipoVenta}
          options={System.arrayIdValueFromObject({
            TICKET: "Ticket",
            BOLETA: "Boleta",
          }, true)}
        />

        <br />

        <InputGeneric
          inputState={[nuevoFolio, setNuevoFolio]}
          label={"Nuevo Folio"}
          onEnter={() => {
            onConfirm(tipoVenta, nuevoFolio)
            setTimeout(() => {
              setOpenDialog(false)
            }, 200);
          }}
        />
        <Typography>&Eacute;ste n&uacute;mero se tomar&aacute; como el primero, los demas son consecutivos.</Typography>

      </DialogContent>
      <DialogActions>
        <SmallButton textButton="Aceptar" actionButton={() => {
          onConfirm(tipoVenta, nuevoFolio)
          setOpenDialog(false)
        }} />
        <SmallButton textButton="Cancelar" actionButton={() => {
          setOpenDialog(false)
        }} />
      </DialogActions>
    </Dialog>
  );
};

export default CorregirFolios;
