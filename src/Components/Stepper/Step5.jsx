/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Box,
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
  Input,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Step5Component = ({ data, onNext }) => {
  const [newStock, setNewStock] = useState("");
  const [newImpuesto, setNewImpuesto] = useState("");
  const [nota, setNota] = useState(data.nota||"");

  const [stockCritico, setStockCritico] = useState(data.stockCritico||"");
  const [selectedImpuestoId, setSelectedImpuestoId] = useState(data.selectedImpuestoId||"");

  const [selectedFile, setSelectedFile] = useState(data.selectedFile||null);

  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [emptyFieldsMessage,setEmptyFieldsMessage]= useState("");

  const handleNext = () => {

    //   if (!stockCritico || !selectedImpuestoId || !nota|| !selectedFile) {
    //   setEmptyFieldsMessage('Por favor, completa todos los campos antes de continuar.');
    //   return;
    // }
    const stepData = {
      stockCritico,
      selectedImpuestoId,
      selectedFile,
      nota,
    };
    console.log("Step 5 Data:", stepData); // Log the data for this step
    onNext(stepData);
    
  };

  const handlePrevious = () => {
    // Navigate to previous step
    onNext(data); // Send the current data to the previous step
  };
  const handleSubmitAll = async () => {
    try {
      const allData = { ...data, step5: { stockCritico, selectedImpuestoId, selectedFile, nota } };
      console.log("All Data:", allData); // Log all data before sending to server
      const response = await axios.post( "https://www.easyposdev.somee.com/api/ProductosTmp/AddProducto", allData);
      console.log("Server Response:", response.data);
      // Optionally, reset the state or perform other actions upon successful submission
    } catch (error) {
      console.error("Error:", error);
      // Handle any errors
    }
  };

  const handleOpenDialog1 = () => {
    setOpenDialog1(true);
  };
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };

  const handleOpenDialog2 = () => {
    setOpenDialog2(true);
  };
  const handleCloseDialog2 = () => {
    setOpenDialog2(false);
  };

  const handleImpuestoSelect = (formatoId) => {
    setSelectedImpuestoId(formatoId);
  };
  const handleCreateStock = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
  };
  const handleCreateImpuesto = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog2(false);
  };

  // const handleUpload = () => {
  //   // Implement your upload logic here
  //   if () {
  //     // You can use a library like Axios to send the file to your server or
  //     // implement the logic to handle the file on the client-side.
  //     console.log("Uploading file:", imagen);
  //   }
  // };

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

  const impuestos = [
    { id: 1, tipo: "IVA 19%" },
    { id: 2, tipo: "EXENTO" },
    { id: 3, tipo: "OTRO IMPUESTO" },
  ];

 return (
  <Paper
    elevation={3}
    sx={{
      padding: "16px",
      width: "100%",
    }}
  >
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box>
          <InputLabel>Ingresa Stock Crítico</InputLabel>
          <TextField
            sx={{ marginTop: "7px", width: "100%" }}
            label="Stock Crítico"
            fullWidth
            value={stockCritico}
            onChange={(e) => setStockCritico(e.target.value)}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <InputLabel>Impuestos Adicionales</InputLabel>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <Select
                sx={{ width: "100%" }}
                value={selectedImpuestoId}
                onChange={(e) => handleImpuestoSelect(e.target.value)}
                label="Selecciona Impuesto adicional"
              >
                {impuestos.map((impuesto) => (
                  <MenuItem key={impuesto.id} value={impuesto.tipo}>
                    {impuesto.tipo}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2}>
              <Button
                size="large"
                variant="outlined"
                onClick={handleOpenDialog2}
                fullWidth
              >
                +
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <InputLabel>Ingresa Imagen</InputLabel>
          <label htmlFor="file-input">
            <input
              type="file"
              id="file-input"
              style={{ display: "none" }}
              accept="image/*" // Puedes especificar los tipos de archivo aceptados aquí
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
                // Maneja el archivo seleccionado directamente aquí
                console.log("Selected File:", file);
              }}
            />
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Seleccionar Imagen
            </Button>
          </label>
          {selectedFile && <p>Archivo: {selectedFile.name}</p>}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <InputLabel>Ingresa Nota</InputLabel>
          <TextField
            sx={{ marginTop: "5px", width: "100%" }}
            label="Ingrese nota..."
            multiline
            rows={4}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmitAll}
          fullWidth
          sx={{ marginTop: "16px" }}
        >
          Guardar
        </Button>

        <Grid item xs={12} md={8}>
        <Box mt={2}>
          {(!stockCritico || !selectedImpuestoId || !nota|| !selectedFile) && (
            <Typography variant="body2" color="error">
              {emptyFieldsMessage}
            </Typography>
          )}
        </Box>
      </Grid>
      </Grid>
    </Grid>

    <Dialog open={openDialog1} onClose={handleCloseDialog1}>
      <DialogTitle>Crear Impuesto</DialogTitle>
      <DialogContent sx={{ marginTop: "9px" }}>
        <TextField   
          label="Ingresa Stock"
          fullWidth
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog1} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleCreateStock} color="primary">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
    <Dialog open={openDialog2} onClose={handleCloseDialog2}>
      <DialogTitle>Crear Impuesto Adicional</DialogTitle>
      <DialogContent sx={{ marginTop: "9px" }}>
        <TextField
          label="Impuesto Adicional"
          fullWidth
          value={newImpuesto}
          onChange={(e) => setNewImpuesto(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog2} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleCreateImpuesto} color="primary">
          Crear
        </Button>
      </DialogActions>
    </Dialog>
  </Paper>
);

};

export default Step5Component;
