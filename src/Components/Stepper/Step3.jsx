/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";

const Step3Component = ({ data, onNext,stepData }) => {
  const [newUnidad, setNewUnidad] = useState("");
  const [stockInicial, setStockInicial] = useState(data.stockInicial || "");
  const [precioCosto, setPrecioCosto] = useState(data.precioCosto || "");
  const [selectedUnidadId, setSelectedUnidadId] = useState(
    data.selectedUnidadId || ""
  );
  const [precioVenta, setPrecioVenta] = useState(data.precioVenta || "");
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState("");
  const [openDialog1, setOpenDialog1] = useState(false);

  console.log("data:",data)
  // console.log("onNext:",onNext)
  // console.log("stepData:",stepData)
  useEffect(() => {
    if (!selectedUnidadId || !precioCosto || !stockInicial || !precioVenta) {
      setEmptyFieldsMessage("Todos los campos son obligatorios.");
    } else {
      setEmptyFieldsMessage(""); // Si todos los campos están llenos, limpiar el mensaje de error
    }
  }, [selectedUnidadId, precioCosto, stockInicial, precioVenta]);

  const handleNext = async () => {
    // Crear objeto con los datos del paso 1
    const step1Data = {
      respuestaSINO: "string",
      pesoSINO: "string",
      marca: data.marca,
      categoriaID: data.selectedCategoryId || 0, // Utilizamos 0 si el valor es undefined
      subCategoriaID: data.selectedSubCategoryId || 0,
      familiaID: data.selectedFamilyId || 0,
      subFamilia: data.selectedSubFamilyId || 0,
      nombre: data.nombre // Debes proporcionar un valor adecuado aquí
    };
  
    // Crear objeto con los datos del paso 3
    const step3Data = {
      unidad:selectedUnidadId, // Debes proporcionar un valor adecuado aquí
      precioCosto: parseFloat(precioCosto) || 0, // Convertir a número y usar 0 si no hay valor
      stockInicial: parseInt(stockInicial) || 0 // Convertir a número entero y usar 0 si no hay valor
    };
  
    // Crear objeto con los datos del paso 4
    const step4Data = {
      formatoVenta: 0, // Debes proporcionar un valor adecuado aquí
      precioVenta: parseFloat(precioVenta) || 0 // Convertir a número y usar 0 si no hay valor
    };
  
    // Combinar todos los pasos en un solo objeto
    const requestData = {
      name: "string", // Debes proporcionar un valor adecuado aquí
      step1: step1Data,
      step2: {
        bodega: "string", // Debes proporcionar un valor adecuado aquí
        proveedor: "string" // Debes proporcionar un valor adecuado aquí
      },
      step3: step3Data,
      step4: step4Data,
      step5: {
        stockCritico: 0, // Debes proporcionar un valor adecuado aquí
        impuesto: "string", // Debes proporcionar un valor adecuado aquí
        selectedFile: {}, // Debes proporcionar un valor adecuado aquí
        nota: "string" // Debes proporcionar un valor adecuado aquí
      }
    };

     console.log("Datos objeto productos",requestData) 
  
    try {
      // Enviar la petición POST al endpoint con los datos combinados
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/ProductosTmp/AddProducto",
        requestData
      );
      
      // Manejar la respuesta de la API
      console.log("Response:", response);
      
      // Llamar a la función onNext para continuar con el siguiente paso
      onNext(requestData, 3);
    } catch (error) {
      // Manejar el error de la petición
      console.error("Error:", error);
      
      // Mostrar mensaje de error
      // Por ejemplo:
      // if (error.response) {
      //   console.log("Error response:", error.response.data);
      //   console.log("Error status:", error.response.status);
      // } else if (error.request) {
      //   console.log("Error request:", error.request);
      // } else {
      //   console.log("Error message:", error.message);
      // }
    }
  };
  

  const handleOpenDialog1 = () => {
    setOpenDialog1(true);
  };
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };

  const handleUnidadSelect = (unidadId) => {
    setSelectedUnidadId(unidadId);
  };
  const handleCreateUnidad = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
  };

  // useEffect(() => {
  //   async function fetchBodegas() {
  //     try {
  //       const response = await axios.get(
  //         "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllBodegas"
  //       );
  //       setBodegas(response.data.categorias);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   fetchBodegas();
  // }, []);

  const unidades = [
    { id: 1, unidad: "KG" },
    { id: 2, unidad: "UNI" },
    { id: 3, unidad: "MM" },
    { id: 4, unidad: "CM" },
    { id: 5, unidad: "LT" },
    { id: 6, unidad: "OZ" },
    { id: 7, unidad: "CAJON" },
    { id: 8, unidad: "DISPLAY" },
    { id: 9, unidad: "PALLET" },
    { id: 10, unidad: "MALLA" },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        width: "100%",
      }}
    >
      {" "}
      <form onSubmit={handleNext}>
        <Grid container spacing={2} item xs={12} md={12}>
          <Grid item xs={12} md={6}>
            <InputLabel sx={{ marginBottom: "2%" }}>Unidad de Compra</InputLabel>
            <Grid display="flex" alignItems="center">
              <Select
                fullWidth
                sx={{ width: "100%" }}
                value={selectedUnidadId}
                onChange={(e) => handleUnidadSelect(e.target.value)}
                label="Selecciona Unidad"
              >
                {unidades.map((unidad) => (
                  <MenuItem key={unidad.id} value={unidad.id}>
                    {unidad.unidad}
                  </MenuItem>
                ))}
              </Select>
              {/* <Button
              size="large"
              variant="outlined"
              style={{ marginLeft: "18px", padding: "14px" }}
              onClick={handleOpenDialog1}
            >
              +
            </Button> */}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Precio Costo</InputLabel>
              <TextField
                sx={{ width: "100%" }}
                label="Precio Costo"
                fullWidth
                value={precioCosto}
                onChange={(e) => setPrecioCosto(e.target.value)}
                inputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <InputLabel sx={{ marginBottom: "4%" }} >Ingresa Precio Venta</InputLabel>

              <TextField
                sx={{
                  width: "100%",
                }}
                fullWidth
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                inputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <InputLabel sx={{ marginBottom: "4%" }} >Ingresa Stock Inicial</InputLabel>
              <TextField
                sx={{ width: "100%" }}
                label="Stock Inicial"
                fullWidth
                value={stockInicial}
                onChange={(e) => setStockInicial(e.target.value)}
                inputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
             fullWidth
             
              variant="contained"
              color="secondary"
              onClick={handleNext}
            >
              Guardar Producto 
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            {/* <Box mt={2}>
              {(!selectedUnidadId ||
                !precioCosto ||
                !stockInicial ||
                !precioVenta) && (
                <Typography variant="body2" color="error">
                  {emptyFieldsMessage}
                </Typography>
              )}
            </Box> */}
          </Grid>
        </Grid>
      </form>
      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Unidad de Compra</DialogTitle>
        <DialogContent sx={{ marginTop: "9px" }}>
          <TextField
            label="Ingresa Unidad de Compra"
            fullWidth
            value={newUnidad}
            onChange={(e) => setNewUnidad(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog1} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateUnidad} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Step3Component;
