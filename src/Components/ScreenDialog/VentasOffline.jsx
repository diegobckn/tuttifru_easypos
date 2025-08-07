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
import BoxVentasOffline from "../BoxOptionsLite/BoxVentasOffline";

const VentasOffline = ({
  openDialog,
  setOpenDialog
}) => {

  return (
    <Dialog open={openDialog} onClose={() => {
      setOpenDialog(false)
    }} maxWidth="lg" fullWidth>
      <DialogTitle>
        Ventas Offline
      </DialogTitle>
      <DialogContent>
        <BoxVentasOffline
          isVisible={openDialog}
          onClose={() => {
            setOpenDialog(false)
          }}
        />
      </DialogContent>
      <DialogActions>
      </DialogActions>
    </Dialog>
  );
};

export default VentasOffline;
