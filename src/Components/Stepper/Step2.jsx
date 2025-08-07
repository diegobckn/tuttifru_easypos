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
  Typography
  
} from "@mui/material";

const Step2Component = ({ data, onNext }) => {
  const [selectedBodegaId, setSelectedBodegaId] = useState(data.selectedBodegaId||"");
  const [selectedProveedorId, setSelectedProveedorId] = useState(data.selectedProveedorId||"");

  const [bodegas, setBodegas] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [proveedores, setProveedores] = useState([]);
 

  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [emptyFieldsMessage,setEmptyFieldsMessage]= useState("");
  
  const [bodega, setBodega] = useState("");
 

  const handleNext = () => {
    // if (!selectedBodegaId || !selectedProveedorId ) {
    //   setEmptyFieldsMessage('Por favor, completa todos los campos antes de continuar.');
    //   return;
    // }
    const stepData = {
      selectedBodegaId,
      selectedProveedorId
    };
    console.log("Step 2 Data:", stepData); // Log the data for this step
    onNext(stepData);
   
  };

  const listasbodegas = [
    {id:1,nombre:"RRLX59"},
    {id:2,nombre:"bodega2"},
    
    

  ]
  const listasproveedores = [
    {id:1,nombre:"Panificadora Marcelo"},
   
    

  ]
 

  

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
  // const handleOpenDialog3 = () => {
  //   setOpenDialog3(true);
  // };
  const handleCloseDialog3 = () => {
    setOpenDialog3(false);
  };
  // const handleOpenDialog4 = () => {
  //   setOpenDialog4(true);
  // };
  

  // Define selection-related functions
  const handleBodegaSelect = (bodegaId) => {
    setSelectedBodegaId(bodegaId);
  };

  const handleProveedorSelect = (proveedorId) => {
    setSelectedProveedorId(proveedorId);
  };

 
  const handleCreateCategory = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog1(false);
  };
  const handleCreateSubCategory = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog2(false);
  };
  const handleCreateFamily = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog3(false);
  };
  
  const handlebodegaSelect = (bodegaId) => {
    setSelectedBodegaId(bodegaId);
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

  

  
  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        width: "100%",
      }}
    >
     <Grid container spacing={2} item xs={12} md={12}  >
      <Grid item xs={12} md={12} >
      <InputLabel margin="dense" >Ingresa Bodega</InputLabel>
        <Box display="flex" alignItems="center">
          
          <Select
            sx={{ width: '70%', marginLeft: '16px' }}
            value={selectedBodegaId}
            onChange={(e) => handlebodegaSelect(e.target.value)}
            label="Selecciona Bodega"
          >
            {listasbodegas.map((bodega) => (
              <MenuItem key={bodega.id} value={bodega.nombre}>
                {bodega.nombre}
              </MenuItem>
            ))}
          </Select>
          {/* <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "18px", padding:"14px"}}
            onClick={handleOpenDialog1}
          >
            +
          </Button> */}
        </Box>
      </Grid>
      <Grid item xs={12}>
      <InputLabel margin="dense" >Ingresa Proveedor</InputLabel>
        <Box display="flex" alignItems="center">
         
          <Select
            sx={{ width: '70%', marginLeft: '16px' }}
            value={selectedProveedorId}
            onChange={(e) => handleProveedorSelect(e.target.value)}
            label="Selecciona Proveedor"
          >
            {listasproveedores.map((proveedor) => (
              <MenuItem key={proveedor.id} value={proveedor.nombre}>
                {proveedor.nombre}
              </MenuItem>
            ))}
          </Select>
          <Button
            size="large"
            variant="outlined"
            style={{ marginLeft: "18px", padding:"14px"}}
            onClick={handleOpenDialog2}
          >
            +
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Button 
          variant="contained"
          color="secondary"
          onClick={handleNext}
          fullWidth
        >
          Guardar y continuar
        </Button>
      </Grid>
      {/* Mensaje de validación */}
      <Grid item xs={12} md={8}>
        <Box mt={2}>
          {(!selectedBodegaId || !selectedProveedorId ) && (
            <Typography variant="body2" color="error">
              {emptyFieldsMessage}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>


      

      
      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Bodega</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Bodega"
            fullWidth
            value={bodega}
            onChange={(e) => setBodega(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog1} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateCategory} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle>Crear Proveedor</DialogTitle>
        <DialogContent>
          <TextField
            label="Nuevo Proveedor"
            fullWidth
            value={proveedor}
            onChange={(e) => setProveedor(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog2} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateCategory} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      


      
    </Paper>
  );
};

export default Step2Component;
