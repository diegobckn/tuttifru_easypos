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
import BoxLoginVolantes from "../BoxOptionsLite/BoxLoginVolantes";
import User from "../../Models/User";
import BoxNumeroAtencion from "../BoxOptionsLite/BoxNumeroAtencion";


const NumeroAtencion = ({
  openDialog,
  setOpenDialog,
  onChange
}) => {
  const {
    userData,
    updateUserData,
    showMessage
  } = useContext(SelectedOptionsContext);



  return (
    <Dialog open={openDialog} onClose={() => { }} maxWidth="lg">
      <DialogTitle>

      </DialogTitle>
      <DialogContent>

        <BoxNumeroAtencion onChange={(data) => {
          onChange(data)
          setOpenDialog(false)
        }} />

      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default NumeroAtencion;
