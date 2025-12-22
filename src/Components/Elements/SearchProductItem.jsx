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
import Product from "../../Models/Product";


export default ({
  itemIndex,
  product,
  products,
  onClick
}) => {

  const [image, setImage] = useState("")

  useEffect(() => {
    // console.log("mostrando item de producto")
    // console.log(product)

    Product.cargarImagen(product, (urlImagen) => {
      console.log("cargarImagen de ", product, "..resultado", urlImagen)
      setImage(urlImagen)
    })
  }, [product])

  return (product ? (
    <TableRow key={product.idProducto + "-" + itemIndex} sx={{ height: "15%" }}>
      <TableCell>

        <div style={{
          textAlign: "center",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}>

          {image != "" && (
            <>
              <br />
              <img
                style={{
                  "maxWidth": "60px",
                  "borderRadius": "10px",
                  "maxHeight": "60px",
                  flex: 0.5
                }}
                src={image}
                alt=""
              />
            </>
          )}

          <p style={{
          }}>
            {product.nombre}
          </p>

        </div>



      </TableCell>

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
    </TableRow >
  ) : (
    <></>
  )
  )
};

