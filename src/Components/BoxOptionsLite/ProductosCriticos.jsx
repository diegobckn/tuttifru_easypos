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
} from "@mui/material";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import Product from "../../Models/Product";
import ProductoCriticoItem from "./ProductoCriticoItem";


const ITEMS_PER_PAGE = 10;
const ProductosCriticos = ({
  onFinish = () => { },
  refresh,
  setRefresh
}) => {

  const {
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1000);
  const [pageProduct, setPageProduct] = useState([]);
  // const [refresh, setRefresh] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [hasResult, setHasResult] = useState(false);
  const [product, setProduct] = useState([]);

  const handleTabChange = (event, newValue) => {
    // setSelectedTab(newValue);
  };

  const setPageCount = (productCount) => {
    // console.log("calculando total")
    const totalPages = Math.ceil(productCount / ITEMS_PER_PAGE);
    // console.log("totalPages", totalPages)
    if (!isNaN(totalPages)) {
      // console.log("asigna", totalPages)
      setTotalPages(totalPages);
    } else {
      console.error("Invalid product count:", productCount);
    }
  };

  const listarProductos = async () => {
    showLoading("Cargando productos...")

    Product.getInstance().getCriticosPaginate({
      pageNumber: currentPage,
      rowPage:ITEMS_PER_PAGE
    }, (prods, response) => {
      if (Array.isArray(response.data.productos)) {
        setProduct(response.data.productos);
        // setFilteredProducts(response.data.productos);
        setPageCount(response.data.cantidadRegistros);
        setPageProduct(response.data.productos);
        setHasResult(response.data.productos.length > 0)
      }
      hideLoading()
    }, (error) => {
      console.error("Error fetching product:", error);
      setHasResult(false)
      hideLoading()
    })
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const updateList = () => {
    listarProductos()
  }

  useEffect(() => {
    updateList()
    // console.log("cambio de pagina")
  }, [currentPage]);


  // Dentro de useEffect, después de eliminar el producto, actualiza la lista de productos
  useEffect(() => {
    updateList()
  }, [refresh]);



  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };
  const handleOpenDialog = (product) => {
    setProductToDelete(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setProductToDelete(null);
  };

  return (
    <Box sx={{ p: 2, mb: 4 }}>
      <div>
        {/* <Tabs value={selectedTab} onChange={handleTabChange}> */}
        

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
              {!hasResult ? (
                <TableRow>
                  <TableCell colSpan={2}>No se encontraron productos</TableCell>
                </TableRow>
              ) : (
                pageProduct.map((product, index) => (
                  <ProductoCriticoItem
                    product={product}
                    key={index}
                    index={index}
                    currentPage={currentPage}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />

    </Box>
  );
};

export default ProductosCriticos;
