import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import TableSelecCategory from "../BoxOptionsLite/TableSelect/TableSelecCategory";
import TableSelecSubCategory from "../BoxOptionsLite/TableSelect/TableSelecSubCategory";
import TableSelecFamily from "../BoxOptionsLite/TableSelect/TableSelecFamily";
import TableSelecProductNML from "../BoxOptionsLite/TableSelect/TableSelecProductNML";
import TableSelecSubFamily from "../BoxOptionsLite/TableSelect/TableSelecSubFamily";
import BuscarProductoFamilia from "./BuscarProductoFamilia";

const AsignarProducto = ({
  openDialog,
  setOpenDialog,
  onAssign
}) => {

  const {
    userData,
    addToSalesData
  } = useContext(SelectedOptionsContext);

  return (
      <BuscarProductoFamilia
      openDialog={openDialog}
      setOpenDialog={setOpenDialog}
      onSelect={onAssign}
      />
  );
};

export default AsignarProducto;
