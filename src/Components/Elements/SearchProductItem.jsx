import React, { useState, useContext, useEffect } from "react";

import {
  Typography,
  Grid,
  Button,
  TableRow,
  TableCell
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import System from "../../Helpers/System";


const SearchProductItem = ({
  itemIndex,
  product,
  products,
  onClick
}) => {

  return (product ? (
    <TableRow key={product.idProducto + "-" + itemIndex} sx={{ height: "15%" }}>
      <TableCell>{product.nombre}</TableCell>

      <TableCell sx={{ width: "21%" }}>
        Plu:{""}
        {product.idProducto} <br />
        ${System.formatMonedaLocal(product.precioVenta, false)}
      </TableCell>

      <TableCell sx={{ width: "21%" }}>

        <Button
          onClick={() => {
            onClick(product)
          }}
          variant="contained"
          color="secondary"
        >
          Agregar
        </Button>

      </TableCell>
      <TableCell sx={{ width: "5%" }}>
        Stk:{""}
        {product.stockActual}
      </TableCell>
    </TableRow>
  ) : (
    <></>
  )
  )
};

export default SearchProductItem;
