import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Card,
  Avatar,
  Chip,
  TextField,
  Typography,
  Button,
  DialogContent,
  Dialog,
  Table,
  TableBody,
  TableCell,
  Autocomplete,
  TableContainer,
  TableHead,
  DialogActions,
  DialogTitle,
  TableRow,
  Snackbar,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

import axios from "axios";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxRecuperarVenta from "./BoxRecuperarVenta";
import BoxDevolucion from "./BoxDevolucion";
import BoxIngreso from "./BoxIngreso";
import BoxStock from "./BoxStock";
import IngresoClientes from "./IngresoClientes";
import BoxPago from "./BoxPago";
import BoxPagoTicket from "./BoxPagoTicket";
import BoxBuscador from "./../BoxOptionsLite/BoxBuscadorCliente";

const BoxPreciosClientes = ({
  onClosePreciosClientes,
  onOpenPreciosClientesDialog,
}) => {
  const {
    precioData,
    setPrecioData,
    clearSalesData,
    userData,
    setUserData,
    searchResults,
    selectedUser,
    setSelectedUser,
    setSearchResults,
    selectedCodigoCliente,
    selectedCodigoClienteSucursal,
    setSelectedCodigoCliente,
    setSelectedCodigoClienteSucursal,
  } = useContext(SelectedOptionsContext);
  console.log("PrecioDataAA:", precioData);
  console.log("searchResults:", searchResults);
  console.log("selectedCodigoCliente:", selectedCodigoCliente);
  console.log("selectedCodigoClienteSucursal:", selectedCodigoClienteSucursal);

  const [preciosModificados, setPreciosModificados] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchPrecioData = async () => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${selectedCodigoCliente}&codigoClienteSucursal=${selectedCodigoClienteSucursal}`
      );

      console.log("Nuevos precios:", response.data);
      setPrecioData(response.data);
    } catch (error) {
      console.error("Error al obtener los nuevos precios:", error);
    }
  };

  useEffect(() => {
    fetchPrecioData();
  }, [selectedCodigoCliente, selectedCodigoClienteSucursal, setPrecioData]);

  // useEffect(() => {
  //   // Cuando se realiza una búsqueda vacía o se borran los términos de búsqueda,
  //   // ocultar los componentes de precios y cta corriente
  //   if (searchText.trim() === "" || searchResults.length === 0) {
      
  //   }
  // }, [searchText, searchResults]);

  useEffect(() => {
    if (!selectedUser) {
      // Si no hay usuario seleccionado, limpiar los datos relacionados
      clearSalesData();
      setSelectedChipIndex([]); // Limpiar el índice del chip seleccionado
    }
  }, [selectedUser, clearSalesData]);

  const handlePrecioChange = (e, itemId) => {
    const updatedPrices = {
      ...preciosModificados,
      [itemId]: e.target.value.trim() !== "" ? parseFloat(e.target.value) : "",
    };
    setPreciosModificados(updatedPrices);
  };

  const handleSaveChanges = async (
    idProducto,
    codigoCliente,
    codigoClienteSucursal
  ) => {
    try {
      const requestBody = {
        codigoCliente: codigoCliente,
        codigoClienteSucursal: codigoClienteSucursal,
        preciosProductos: [
          {
            idProducto: parseInt(idProducto),
            precio: preciosModificados[idProducto],
          },
        ],
      };

      console.log("Datos antes de la solicitud:", requestBody);

      const response = await axios.put(
        "https://www.easyposdev.somee.com/api/Clientes/PutClientesProductoActualizarPrecioByIdCliente",
        requestBody
      );

      console.log("Datos después de la solicitud:", requestBody);
      console.log("Respuesta de la API:", response.data);

      if (response.status === 200) {
        const updatePrecios = await axios.get(
          `https://www.easyposdev.somee.com/api/Clientes/GetClientesProductoPrecioByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );

        setSnackbarMessage(response.data.descripcion);
        setSnackbarOpen(true);

        // Realizar la segunda llamada a la API para obtener las deudas del cliente
        const deudasResponse = await axios.get(
          `https://www.easyposdev.somee.com/api/Clientes/GetClientesDeudasByIdCliente?codigoCliente=${codigoCliente}&codigoClienteSucursal=${codigoClienteSucursal}`
        );

        console.log("Respuesta de la API de deudas:", deudasResponse.data);

        // Esperar 4 segundos antes de cerrar el modal
        setTimeout(() => {
          // setSearchResults();
          onClosePreciosClientes(); ////Cierre Modal al finalizar
        }, 2000);
      }
    } catch (error) {
      console.error("Error al actualizar los precios:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
    {console.log("searchResultsssss:", searchResults)}
      {searchResults&&searchResults.length > 0 && selectedUser && precioData && precioData.clientesProductoPrecioMostrar && (
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={12} lg={12}>
            <Paper>
              <Box
                display="flex"
                p={1.5}
                gap={2}
                bgcolor={"#f5f5f5"}
                borderRadius={4}
                sx={{ alignItems: "center" }}
              >
                <Box>
                  <Avatar sx={{ borderRadius: 3, width: 48, height: 48 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  
                <Typography variant="body2" sx={{ color: "#696c6f" }}>
                      ID:
                      {selectedUser.rutResponsable}
                      {/* {precioData.clientesProductoPrecioMostrar[0] &&
                        precioData.clientesProductoPrecioMostrar[0]
                          .codigoCliente}{" "}
                      {" " + " "} */}
                      <br />
                     {selectedUser.nombreResponsable}{""} {selectedUser.apellidoResponsable}
                    </Typography>
                </Box>
      
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={10} >
                  <TableContainer>
                    <Table sx={{ minWidth: 500 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: "1%" }}>ID</TableCell>
                          <TableCell sx={{ width: "1%" }}>Producto</TableCell>
                          <TableCell sx={{ width: "3%" }}>Precio</TableCell>
                          <TableCell sx={{ width: "6%" }}>Guardar</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {precioData.clientesProductoPrecioMostrar.map(
                          (item) => (
                            <TableRow key={item.idProducto}>
                              <TableCell>{item.idProducto}</TableCell>
                              <TableCell>{item.nombre}</TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  value={
                                    preciosModificados[item.idProducto] !==
                                    undefined
                                      ? preciosModificados[item.idProducto]
                                      : item.precio
                                  }
                                  onChange={(e) =>
                                    handlePrecioChange(e, item.idProducto)
                                  }
                                  inputProps={{
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    handleSaveChanges(
                                      item.idProducto,
                                      precioData
                                        .clientesProductoPrecioMostrar[0]
                                        .codigoCliente,
                                      precioData
                                        .clientesProductoPrecioMostrar[0]
                                        .codigoClienteSucursal
                                    );
                                  }}
                                >
                                  Guardar
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>

             
            </Paper>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
};

export default BoxPreciosClientes;
