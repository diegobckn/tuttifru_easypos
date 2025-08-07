import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Tabs,
  Tab,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
} from "@mui/material";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import ProductoCriticoItem from "./ProductoCriticoItem";
import TableSelecProduct from "./TableSelect/TableSelecProduct";
import SmallButton from "../Elements/SmallButton";


const ITEMS_PER_PAGE = 10;
const ProductosCriticosBuscarUno = ({
  onFinish = () => { },
  refresh,
  setRefresh
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [products, setProducts] = useState([]);
  const [hasResult, setHasResult] = useState(false);

  return (
    <Grid container spacing={2}>


      {!hasResult && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TableSelecProduct
            show={true}
            onSelect={(pr) => {
              setHasResult(true)
              setProducts([pr])
            }}
          />
        </Grid>
      )}

      {hasResult && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <SmallButton textButton={"Buscar otro"} actionButton={() => {
            setHasResult(false)
          }} />
        </Grid>
      )}
      {hasResult && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Codigo Producto </TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Precio costo </TableCell>
                <TableCell>Precio venta </TableCell>
                <TableCell>Stock actual</TableCell>
                <TableCell>Stock critico</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Ranking</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <ProductoCriticoItem
                  product={product}
                  key={index}
                  index={index}
                  currentPage={1}
                />
              ))
              }
            </TableBody>
          </Table>


        </Grid>
      )}
    </Grid>
  );
};

export default ProductosCriticosBuscarUno;
