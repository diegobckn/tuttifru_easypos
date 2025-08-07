import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";

const GrillaProductosVendidos = ({
  productsSold,
  subtotal = 0,
  redondeo = 0,
  vuelto = 0,
  total = 0
}) => {

  return (
    <table style={{
      width:"100%",
      margin: "0",
      border: "1px solid"
    }}>
      <tbody>

        {
          productsSold.map((sale, index) => {
            return (
              <tr key={sale.idProducto + "" + index}>
                <td style={{ fontSize: "20px" }}>{sale.cantidad} x ${System.formatMonedaLocal(sale.precioUnidad,false)} </td>
                <td style={{ fontSize: "20px", padding: "0 20px" }}>{sale.descripcion}</td>
                <td style={{ fontSize: "20px", textAlign: "right" }}>${System.formatMonedaLocal(Math.round(sale.precioUnidad * sale.cantidad),false)}</td>
              </tr>
            )
          })
        }
        <tr>
          <td>&nbsp;</td>
          <td style={{ fontSize: "20px", padding: "0 20px", textAlign: "right" }}>Subtotal</td>
          <td style={{ fontSize: "20px" }}>${subtotal ? System.formatMonedaLocal(subtotal,false) : 0}</td>
        </tr>

        <tr>
          <td>&nbsp;</td>
          <td style={{ fontSize: "20px", padding: "0 20px", textAlign: "right" }}>redondeo</td>
          <td style={{ fontSize: "20px" }}>${redondeo ? System.formatMonedaLocal(redondeo,false) : 0}</td>
        </tr>

        <tr>
          <td>&nbsp;</td>
          <td style={{ fontSize: "20px", padding: "0 20px", textAlign: "right" }}>vuelto</td>
          <td style={{ fontSize: "20px" }}>${vuelto ? System.formatMonedaLocal(vuelto,false) : 0}</td>
        </tr>

        <tr>
          <td>&nbsp;</td>
          <td style={{ fontSize: "20px", padding: "0 20px", textAlign: "right" }}>Total pagado</td>
          <td style={{ fontSize: "20px" }}>${total ? System.formatMonedaLocal(total,false) : 0}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default GrillaProductosVendidos;
