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
import Tabs, { Tab } from "../Elements/Tabs";
import TabTicketsDigi from "../BoxOptionsLite/TabTicketsDigi";
import TabTicketsDigiNoUsados from "../BoxOptionsLite/TabTicketsDigiNoUsados";
import TabTicketsDigiUsados from "../BoxOptionsLite/TabTicketsDigiUsados";



const ListarTicketsDigi = ({
  openDialog,
  setOpenDialog,
  product,
  onAsignPrice
}) => {



  const onFinish = () => {

  }

  return (
    <Dialog
      open={openDialog} onClose={() => { }}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Listado de tickets
      </DialogTitle>
      <DialogContent>

        <Tabs
          tabsItems={[
            {
              title: "Todos",
              content: (
                <TabTicketsDigi onFinish={onFinish} />
              )
            },
            {
              title: "Usados",
              content: (
                <TabTicketsDigiUsados onFinish={onFinish} />
              )
            },
            {
              title: "No usados",
              content: (
                <TabTicketsDigiNoUsados onFinish={onFinish} />
              )
            },

          ]}
        />


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
