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
  Typography,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const Step1Component = ({ data, onNext, setStepData }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    data.selectedCategoryId || 0
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(
    data.selectedSubCategoryId || 0
  );
  const [selectedFamilyId, setSelectedFamilyId] = useState(
    data.selectedFamilyId || 0
  );
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState(
    data.selectedSubFamilyId || 0
  );
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [respuestaSINO, setRespuestaSINO] = useState(data.respuestaSINO || "");
  const [pesoSINO, setPesoSINO] = useState(data.pesoSINO || "");
  const [nombre, setNombre] = useState(data.nombre || "");
  const [marca, setMarca] = useState(data.marca || "");

  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [openDialog4, setOpenDialog4] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newFamily, setNewFamily] = useState("");
  const [newSubFamily, setNewSubFamily] = useState("");
  const [emptyFieldsMessage, setEmptyFieldsMessage] = useState("");
  const [selectionErrorMessage, setSelectionErrorMessage] = useState("");
  const handleRespuesta = (e) => {
    const value = e.target.value;
    setRespuestaSINO(value);
  };
  const handlePeso = (e) => {
    const value = e.target.value;
    setPesoSINO(value);
  };
  const validateFields = () => {
    const selectedOptions = [
      selectedCategoryId,
      selectedSubCategoryId,
      selectedFamilyId,
      selectedSubFamilyId,
      marca,
      nombre,
    ];
  
    // Verificar si la categoría está seleccionada
    if (selectedCategoryId === 0) {
      setEmptyFieldsMessage("La categoría es obligatoria.");
      return false;
    }
  
    // Contar el número de opciones seleccionadas o completadas
    const selectedCount = selectedOptions.filter(option => option !== 0 && option !== '').length;
  
    // Verificar si al menos tres opciones están seleccionadas o completadas
    if (selectedCount < 3) {
      setEmptyFieldsMessage("Debes seleccionar al menos tres opciones.");
      return false;
    } else {
      setEmptyFieldsMessage("");
      return true;
    }
  };
  
  // const validateFields = () => {
  //   if (
 

  //     !nombre ||
  //     !marca
  //   ) {
  //     setEmptyFieldsMessage("Todos los campos son obligatorios.");
  //   } else {
  //     setEmptyFieldsMessage(""); // Si todos los campos están llenos, limpiar el mensaje de error
  //   }
  // };

  // Llamamos a la función validateFields cada vez que cambie uno de los estados relevantes

  const handleNext = () => {
    // Validar campos antes de continuar
    const isValid = validateFields();
    if (isValid) {
      // Resto del código para continuar si los campos son válidos
      const step1Data = {
        selectedCategoryId,
        selectedSubCategoryId,
        selectedFamilyId,
        selectedSubFamilyId,
        marca,
        nombre,
      };
      setStepData((prevData) => ({ ...prevData, ...step1Data }));
      onNext();
    }
  };
  // const handleNext = () => {
  //   validateFields();
  //   const step1Data = {
  //     selectedCategoryId,
  //     selectedSubCategoryId,
  //     selectedFamilyId,
  //     selectedSubFamilyId,
  //     marca,
  //     nombre,
  //   };
  //   setStepData((prevData) => ({ ...prevData, ...step1Data }));
  //   onNext();
  // };

  // const handleOpenDialog1 = () => {
  //   setOpenDialog1(true);
  // };
  const handleCloseDialog1 = () => {
    setOpenDialog1(false);
  };
  // const handleOpenDialog2 = () => {
  //   setOpenDialog2(true);
  // };
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
  const handleCloseDialog4 = () => {
    setOpenDialog4(false);
  };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setStepData((prevData) => ({ ...prevData, [name]: value }));
  // };

  // Funciones de Seleccion
  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSubCategorySelect = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
  };

  const handleFamilySelect = (familyId) => {
    setSelectedFamilyId(familyId);
  };

  const handleSubFamilySelect = (subFamilyId) => {
    setSelectedSubFamilyId(subFamilyId);
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
  const handleCreateSubFamily = () => {
    // Implement the logic to create a new category here.
    // You can use the newCategory state to get the input value.

    // After creating the category, you can close the dialog.
    setOpenDialog4(false);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias"
        );
        setCategories(response.data.categorias);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
          );
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  useEffect(() => {
    const fetchFamilies = async () => {
      if (selectedSubCategoryId !== "" && selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${selectedSubCategoryId}`
          );
          setFamilies(response.data.familias);
        } catch (error) {
          console.error("Error fetching families:", error);
        }
      }
    };

    fetchFamilies();
  }, [selectedCategoryId, selectedSubCategoryId]);

  useEffect(() => {
    const fetchSubFamilies = async () => {
      if (
        selectedFamilyId !== "" &&
        selectedCategoryId !== "" &&
        selectedSubCategoryId !== ""
      ) {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${selectedFamilyId}`
          );
          setSubFamilies(response.data.subFamilias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubFamilies();
  }, [selectedFamilyId, selectedCategoryId, selectedSubCategoryId]);

  const validateSelections = () => {
    const selectedOptions = [
      selectedCategoryId,
      selectedSubCategoryId,
      selectedFamilyId,
      selectedSubFamilyId,
    ];
    const selectedCount = selectedOptions.filter(
      (option) => option !== 0
    ).length;
    if (selectedCount < 3) {
      setSelectionErrorMessage("Debes seleccionar al menos tres opciones.");
      return false;
    } else {
      setSelectionErrorMessage("");
      return true;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "16px",
        width: "100%",
      }}
    >
      <Grid container spacing={2} item xs={12} md={12}>
        {/* <Grid item xs={12} md={8} disabled={true} style={{ pointerEvents: "none" }}>
          <Typography>¿Este producto requiere trazabilidad?</Typography>
          <FormControl component="fieldset">
            <RadioGroup
              disabled={true}
              value={respuestaSINO}
              onChange={handleRespuesta}
            >
              <Grid sx={{ display: "flex" }} disabled={true}>
                <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </Grid>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8}  disabled={true}  style={{ pointerEvents: "none" }}>
          <Typography>¿Este producto es pesable?</Typography>
          <FormControl component="fieldset" >
            <RadioGroup
              disabled={true}
              value={pesoSINO}
              onChange={handlePeso}
            >
              <Grid sx={{ display: "flex" }} disabled={true}>
                <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </Grid>
            </RadioGroup>
          </FormControl>
        </Grid> */}
        <Grid item xs={12} md={6}>
          <InputLabel>Selecciona Categoría</InputLabel>
          <Select
            fullWidth
            value={selectedCategoryId}
            onChange={(e) => handleCategorySelect(e.target.value)}
            label="Selecciona Categoría"
          >
            {categories.map((category) => (
              <MenuItem key={category.idCategoria} value={category.idCategoria}>
                {category.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Selecciona Sub-Categoría</InputLabel>
          <Select
            fullWidth
            value={selectedSubCategoryId}
            onChange={(e) => handleSubCategorySelect(e.target.value)}
            label="Selecciona Sub-Categoría"
          >
            {subcategories.map((subcategory) => (
              <MenuItem
                key={subcategory.idSubcategoria}
                value={subcategory.idSubcategoria}
              >
                {subcategory.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Selecciona Familia</InputLabel>
          <Select
            fullWidth
            value={selectedFamilyId}
            onChange={(e) => handleFamilySelect(e.target.value)}
            label="Selecciona Familia"
          >
            {families.map((family) => (
              <MenuItem key={family.idFamilia} value={family.idFamilia}>
                {family.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <InputLabel>Selecciona Subfamilia</InputLabel>
          <Select
            fullWidth
            value={selectedSubFamilyId}
            onChange={(e) => handleSubFamilySelect(e.target.value)}
            label="Selecciona Subfamilia"
          >
            {subfamilies.map((subfamily) => (
              <MenuItem
                key={subfamily.idSubFamilia}
                value={subfamily.idSubFamilia}
              >
                {subfamily.descripcion}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ingrese Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Ingrese Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={12}>
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
            {(!nombre || !marca) && (
              <Typography variant="body2" color="error">
                {emptyFieldsMessage}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openDialog1} onClose={handleCloseDialog1}>
        <DialogTitle>Crear Categoría</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Categoria"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
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
        <DialogTitle>Crear Sub-Categoría</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Sub-Categoría"
            fullWidth
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
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

      <Dialog open={openDialog2} onClose={handleCloseDialog2}>
        <DialogTitle>Crear Sub-Categoría</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Sub-Categoría"
            fullWidth
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog3} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateSubCategory} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog3} onClose={handleCloseDialog3}>
        <DialogTitle>Crear Familia</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Familia"
            fullWidth
            value={newFamily}
            onChange={(e) => setNewFamily(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog3} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateFamily} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDialog4} onClose={handleCloseDialog4}>
        <DialogTitle>Crear Sub-Familia</DialogTitle>
        <DialogContent>
          <TextField
            label="Nueva Familia"
            fullWidth
            value={newSubFamily}
            onChange={(e) => setNewSubFamily(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog4} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreateSubFamily} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Step1Component;
