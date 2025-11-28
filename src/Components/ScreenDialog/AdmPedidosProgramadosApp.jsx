/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext } from "react";
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
import BoxAdminAppPedidosProgramados from "../BoxOptionsLite/BoxAdminAppPedidosProgramados";


export default ({
  openDialog,
  setOpenDialog
}) => {
  const {
    userData,
    updateUserData,
    showMessage
  } = useContext(SelectedOptionsContext);


  return (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md">
      <DialogTitle>
        Pedidos programados
      </DialogTitle>
      <DialogContent>
        <BoxAdminAppPedidosProgramados openDialog={openDialog} setOpenDialog={setOpenDialog} visible={openDialog} />
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

