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
import BoxStockCriticos from "../BoxOptionsLite/BoxStockCriticos";
import ProductosCriticos from "../BoxOptionsLite/ProductosCriticos";

const StockCriticos = ({
  openDialog,
  setOpenDialog
}) => {

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="lg" fullWidth>
      <DialogTitle>
        Stock criticos
      </DialogTitle>
      <DialogContent>
        <BoxStockCriticos />
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default StockCriticos;
