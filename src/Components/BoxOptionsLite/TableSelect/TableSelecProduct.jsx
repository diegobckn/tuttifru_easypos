/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  Snackbar,
  IconButton,
  Table,
  Autocomplete,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Popper,
  Grow,
  ClickAwayListener,
  MenuItem,
  MenuList,
  Slider,
  Dialog,
  DialogContent,
} from "@mui/material";
import { SelectedOptionsContext } from "./../../Context/SelectedOptionsProvider";
import SystemHelper from "../../../Helpers/System";
import SmallButton from "../../Elements/SmallButton";
import Product from "../../../Models/Product";
import MainButton from "../../Elements/MainButton";
import IngresarTexto from "../../ScreenDialog/IngresarTexto";
import Validator from "../../../Helpers/Validator";

const TableSelecProduct = ({
  show,
  onSelect,
  title = "Buscar producto"
}) => {

  const {
    cliente,
    snackMessage,
    showMessage,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [searchTerm, setSearchTerm] = useState("");//variable del cuadro de busqueda

  const inputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);



  useEffect(() => {
    handleDescripcionSearchButtonClick()
  }, [searchTerm]);

  useEffect(() => {
    if (!show) return
    setProducts([])
  }, [show]);



  const buscarPorCodigoBarras = (callbackOk, callbackWrong) => {
    var codigoCliente = 0
    if (cliente) codigoCliente = cliente.codigoCliente


    Product.getInstance().findByCodigoBarras({
      codigoProducto: searchTerm,
      codigoCliente: codigoCliente
    }, callbackOk, callbackWrong)
  }

  const buscarPorCodigoProducto = (callbackOk, callbackWrong) => {
    var codigoCliente = 0
    if (cliente) codigoCliente = cliente.codigoCliente

    Product.getInstance().findByCodigo({
      codigoProducto: searchTerm,
      codigoCliente: codigoCliente
    }, callbackOk, callbackWrong)
  }


  const handlePluSearchButtonClick = async () => {
    if (!parseFloat(searchTerm)) return

    showLoading("Buscando")
    const caok = (products, response) => {
      hideLoading()
      if (response.data.cantidadRegistros > 0) {
        setProducts(products)
      } else {
        showMessage("Producto no encontrado.");
      }
    }
    
    const cnok = (error) => {
      hideLoading()
      showMessage("No se encontraron resultados para: " + searchTerm);
    }

    buscarPorCodigoBarras(caok, () => {
      buscarPorCodigoProducto(caok, cnok)
    })
  };



  const handleDescripcionSearchButtonClick = async () => {
    if (parseFloat(searchTerm) || searchTerm.trim() == "") return


    var codigoCliente = 0
    if (cliente) codigoCliente = cliente.codigoCliente

    Product.getInstance().findByDescriptionPaginado({ description: searchTerm, codigoCliente: codigoCliente }, (products, response) => {
      if (response.data.cantidadRegistros > 0) {
        setProducts(products);
      } else {
        console.log("Producto no encontrado.");
        setProducts([]);
        showMessage("Descripción o producto no encontrado");
      }
      setProducts(products)
    },
      () => {
        setProducts([])
      })
  };

  const handlePluClick = () => {
    if (searchTerm.trim() !== "") {
      if (parseInt(searchTerm) != NaN) {
        handlePluSearchButtonClick();
      } else {
        handleDescripcionSearchButtonClick();
      }
    } else {
      showMessage("Ingrese un valor para buscar");
    }
  }



  const handleChangeSearchInput = (e, a) => {
    setSearchTerm(e.target.value)
  }

  const handleKeydownSearchInput = (e, a) => {
    if (e.keyCode == 13) {
      handlePluClick()
    }
  }


  const validateSearchText = (newvalue) => {
    if (Validator.isSearch(newvalue))
      setSearchTerm(newvalue)
  }

  const [dialogSearchText, setDialogSearchText] = useState(false)


  return (
    <Paper
      elevation={13}
      sx={{
        background: "#859398",
        display: (show ? "flex" : "none"),
        flexDirection: "column",
        margin: "0 auto",
        justifyContent: "center",
        width: "100%",
        minHeight: "400px"
      }}
    >
      <IngresarTexto
        title="Ingrese una descripcion de productos"
        openDialog={dialogSearchText}
        setOpenDialog={setDialogSearchText}
        varChanger={validateSearchText}
        varValue={searchTerm}
      />


      <Grid container item xs={12} md={12} lg={12}>
        <Paper
          elevation={13}
          sx={{
            background: "#859398",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "5px",
            margin: "5px",
            minWidth: "600px",
            width: "100%",
          }}
        >

          <Typography variant="h5" style={{ display: "flex", width: "100%", margin: 20 }}>{title}</Typography>
          <div style={{ display: "flex", width: "100%" }}>
            <Grid item xs={12} md={12} lg={12} sx={{ margin: "1px" }}>
              <TextField
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                }}
                inputRef={inputRef}
                fullWidth
                focused
                placeholder="Buscar producto"
                value={searchTerm}
                onKeyDown={handleKeydownSearchInput}
                onChange={(e) => {
                  validateSearchText(e.target.value)
                }}
                onClick={() => {
                  setDialogSearchText(true)
                }}
              />
            </Grid>
            <Button
              sx={{
                margin: "1px",
                backgroundColor: " #283048",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1c1b17 ",
                  color: "white",
                },
              }}
              size="large"
              onClick={() => {
                handlePluClick()
              }}
            >
              PLU
            </Button>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper
          elevation={1}
          sx={{
            background: "#859398",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px",
          }}
        >
          <TableContainer
            component={Paper}
            style={{ overflowX: "auto", maxHeight: "200px" }}
          >
            <Table sx={{ background: "white", height: "30%" }}>
              <TableBody style={{ maxHeight: "100px", overflowY: "auto" }}>
                {searchTerm.trim() !== "" && products.length > 0 ? (
                  products.map((product, index) => (
                    <TableRow key={product.idProducto + index} sx={{ height: "15%" }}>
                      <TableCell>{product.nombre}</TableCell>
                      <TableCell sx={{ width: "21%" }}>
                        Plu:{""}
                        {product.idProducto}
                      </TableCell>
                      <TableCell sx={{ width: "21%" }}>
                        <Button
                          onClick={() => {
                            onSelect(product)
                          }}
                          variant="contained"
                        >
                          Seleccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : searchTerm.trim() !== "" &&
                  searchTerm.length < 2 &&
                  !isNaN(searchTerm) ? (
                  <TableRow>
                    <TableCell colSpan={1}>
                      <Typography variant="body4" color="error">
                        {snackMessage}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Paper>
  );
};

export default TableSelecProduct;
