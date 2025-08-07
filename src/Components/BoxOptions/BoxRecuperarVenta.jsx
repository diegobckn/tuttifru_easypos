/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import MuiAlert from "@mui/material/Alert";

import axios from "axios";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxRecuperarVenta = () => {
  console.log("BoxRecuperarVenta component is rendering");
  const {
    grandTotal,
    setGrandTotal,
    suspenderVenta,
    salesData,
    calculateTotalPrice,
    clearSalesData,
    addToSalesData,
  } = useContext(SelectedOptionsContext);
  const [openRecoveryDialog, setOpenRecoveryDialog] = useState(false);
  const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedSaleEntry, setSelectedSaleEntry] = useState(salesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedId, setSelecteddId] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [selectedCabecera, setSelectedCabecera] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [productoData, setProductoData] = useState([]);

  

  console.log("Data:", data);

  const fetchDataProducts = () => {
    axios
      .get("https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos")
      .then((response) => {
        setProducts(response.data.productos);

        console.log("prod:", response.data.productos);
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const fetchData = async () => {
    console.log("Fetching data...");
  
    try {
      // Fetch ventaSuspenderResponse
      const ventaSuspenderResponse = await axios.get(
        "https://www.easyposdev.somee.com/api/Ventas/GetAllSuspenderVenta"
      );
  
      console.log("Venta Suspender Response:", ventaSuspenderResponse.data);
  
      // Fetch productsResponse
      const productsResponse = await axios.get(
        "https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos"
      );
  
      console.log("Products Response:", productsResponse.data);
  
      const ventaSuspenderCabeceras = ventaSuspenderResponse.data.ventaSuspenderCabeceras;
      const productos = productsResponse.data.productos;
  
      // Map ventaSuspenderCabeceras and include product details
      const enhancedData = ventaSuspenderCabeceras.map((cabecera) => {
        const enhancedDetalle = cabecera.ventaSuspenderDetalle.map((detalle) => {
          const matchingProduct = productos.find(
            (product) => product.idProducto === detalle.idProducto
          );
  
          return {
            ...detalle,
            productDetails: matchingProduct || null,
          };
        });
  
        return {
          ...cabecera,
          ventaSuspenderDetalle: enhancedDetalle,
        };
      });
  
      console.log("Enhanced Data:", enhancedData);
  
      setData(enhancedData);
    } catch (error) {
      console.error("Error fetching data:", error);
  
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received. Request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", error.message);
      }
    }
  };
 

  useEffect(() => {
    fetchData();
    fetchDataProducts();
  }, []);

  const handleButtonRecuperarVenta = () => {
    fetchData();
    fetchDataProducts();
    setOpenRecoveryDialog(true);
  };

  const handleButtonClick = (cabeceraId) => {
    setSelectedCabecera(cabeceraId);
    setOpenDialog(true);
  };

  const handleAccordionChange = (panel) => async (event, isExpanded) => {
    console.log("Accordion button pressed:", panel);
    setExpandedAccordion(isExpanded ? panel : null);
  
    if (!panel) {
      // If panel is falsy, return early
      return;
    }
  
    // Realizar la solicitud de datos del producto
    try {
      const productResponse = await axios.get(
        "https://www.easyposdev.somee.com/api/ProductosTmp/GetProductos"
      );
  
      // Extract the array of products from the response data
      const productos = productResponse.data.productos;
  
      // Log the extracted array for debugging
      console.log("Productos Array:", productos);
  
      // Iterate over ventaSuspenderDetalle and fetch data for each codProducto
      const updatedVentaSuspenderDetalle = await Promise.all(
        data
          .filter((cabecera) => cabecera.ventaSuspenderDetalle?.[0]?.codProducto === panel)
          .map(async (cabecera) =>
            cabecera.ventaSuspenderDetalle.map(async (detalle) => {
              console.log("Current detalle:", detalle);
              const matchingProduct = productos.find(
                (product) => product.idProducto === parseInt(detalle.codProducto)
              );
              console.log("matchingProd:", matchingProduct);
  
              // Inicializa productDetails con un objeto vacío si no hay coincidencia
              const productDetails = matchingProduct
                ? {
                    // Agrega aquí cualquier propiedad adicional que desees
                    nombre: matchingProduct.nombre || "N/A",
                    precioVenta: matchingProduct.precioVenta || 0,
                  }
                : {};
  
              if (matchingProduct) {
                // Fetch additional data based on matchingProduct or perform any other actions
                try {
                  const additionalDataResponse = await axios.get(
                    `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByCodigo?idproducto=${matchingProduct.idProducto}`
                  );
  
                  const additionalData = additionalDataResponse.data;
  
                  // Add the additional data to the detalle object
                  return {
                    ...detalle,
                    productDetails: { ...productDetails, additionalData },
                  };
                } catch (error) {
                  console.error("Error fetching additional data:", error);
                }
              }
  
              return {
                ...detalle,
                productDetails: productDetails,
              };
            })
          )
      );
  
      // Update the state with the modified data
      setData(updatedVentaSuspenderDetalle);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  
  
  

  const handleAgregarVenta = (product, quantity) => {
    console.log("Datos recibidos en handleAgregarVenta:", {
      product,
      quantity,
    });

    // Verifica si product y productDetails están presentes
    if (product && product.productDetails) {
      // Accede a productDetails y otros datos
      const matchingProduct = product.productDetails;

      // Agrega el precio al objeto que pasas a addToSalesData
      const precioVenta = matchingProduct
        ? matchingProduct.precioVenta || 0
        : 0;

      console.log("Datos para addToSalesData:", {
        ...product,
        cantidad: quantity,
        precio: precioVenta,
        total: quantity * precioVenta,
      });

      // Llamas a addToSalesData con los datos necesarios
      addToSalesData({
        ...product,
        cantidad: quantity,
        precio: precioVenta,
        total: quantity * precioVenta,
      });
    } else {
      console.error("Error: product o productDetails es null o undefined");
      // Puedes manejar este caso según tus necesidades, por ejemplo, mostrar un mensaje de error
    }
  };
  const handleCloseRecoveryDialog = () => {
    setOpenRecoveryDialog(false);
    setLoaded(false);
  };

  return (
   <div>
     {data && data.map((cabecera,index) => (
        <Accordion
        key={cabecera.id} 
          expanded={
            expandedAccordion ===
            (cabecera.ventaSuspenderDetalle?.[0]?.codProducto || null)
          }
          onChange={handleAccordionChange(
            cabecera.ventaSuspenderDetalle[0]?.codProducto
          )}
        >
          <AccordionSummary>
            <Button variant="outlined">
              {`ID: ${cabecera.id}, Descripción: ${cabecera.descripcion}`}
            </Button>
          </AccordionSummary>
          <AccordionDetails>
            {cabecera.ventaSuspenderDetalle && cabecera.ventaSuspenderDetalle.map((detalle, index) => {
              const codProductoTrimmed = detalle.codProducto || "";
              const matchingProduct = detalle.productDetails;

              return (
                <Paper key={cabecera.id}>
                  <Button
                    onClick={() =>
                      handleAgregarVenta(
                        matchingProduct,
                        detalle.cantidad
                      )
                    }
                  >
                    <p>{`ID Suspender: ${detalle.idSuspender}`}</p>
                    <p>{`Cantidad: ${detalle.cantidad}`}</p>
                    <p>{`Código de Producto: ${detalle.codProducto}`}</p>
                    {matchingProduct ? (
                      <div>
                        <p>{`Datos del Producto:`}</p>
                        <p>{`Nombre: ${
                          matchingProduct.nombre || "N/A"
                        }`}</p>
                        <p>{`Precio: ${
                          matchingProduct.precioVenta || "N/A"
                        }`}</p>
                        {/* Agregamos el nuevo valor de Precio */}
                        <hr />
                      </div>
                    ) : (
                      <p>{`Producto no encontrado`}</p>
                    )}
                  </Button>
                </Paper>
              );
            })}
          </AccordionDetails>
        </Accordion>
      ))}

   </div>
  );
};

export default BoxRecuperarVenta;
