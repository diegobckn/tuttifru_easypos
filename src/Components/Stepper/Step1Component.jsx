/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
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
} from "@mui/material";

const Step1Component = ({ data, onNext }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    data.categoriaID || ""
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(
    data.subCategoriaID || ""
  );
  const [selectedFamilyId, setSelectedFamilyId] = useState(
    data.familiaID || ""
  );
  const [selectedSubFamilyId, setSelectedSubFamilyId] = useState(
    data.subFamilia || ""
  );
  const [selectedMarcaId, setSelectedMarcaId] = useState(
    data.marca || "");

  const [marcas, setMarcas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);
  const [respuestaSINO, setRespuestaSINO] = useState(data.respuestaSINO || "");
  const [nombre, setNombre] = useState(data.nombre || "");
  const [marca, setMarca] = useState(data.marca || "");
  const [pesoSINO, setPesoSINO] = useState(data.pesoSINO || "");

  const [openDialog1, setOpenDialog1] = useState(false);
  const [openDialog2, setOpenDialog2] = useState(false);
  const [openDialog3, setOpenDialog3] = useState(false);
  const [openDialog4, setOpenDialog4] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [newFamily, setNewFamily] = useState("");
  const [newSubFamily, setNewSubFamily] = useState("");

  const handleRespuesta = (e) => {
    const value = e.target.value;
    setRespuestaSINO(value);
  };
  const handlePeso = (e) => {
    const value = e.target.value;
    setPesoSINO(value);
  };
  const handleNext = () => {
    const stepData = {
      respuestaSINO: respuestaSINO,
      pesoSINO: pesoSINO,
      marca: marca,
      categoriaID: selectedCategoryId,
      subCategoriaID: selectedSubCategoryId,
      familiaID: selectedFamilyId,
      subFamilia: selectedSubFamilyId,
      nombre: nombre,
    };
    console.log("Step 1 Dataa:", stepData); // Log the data for this step
    onNext(stepData);
  };

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

  const handleMarcaSelect = (MarcaId) => {
    setSelectedMarcaId(MarcaId);
    const selectedMarca = marcas.find((marca) => marca.id === MarcaId);
    if (selectedMarca) {
      setMarca(selectedMarca.nombre); // Assuming 'nombre' holds the 'marca' value
    }
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
    async function fetchMarcas() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Marcas/GetAllMarcas"
        );
        setMarcas(response.data.marcas);
        console.log(response.data.marcas);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMarcas();
  }, []);

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

  return (
    <Paper
      elevation={3}
      style={{
        padding: "20px",
        width: "750px",
        display: "flex",
        justifyContent: "center",
    
      }}
    >
      <Box>
        <Typography>¿Este producto requiere trazabilidad?</Typography>
        <div style={{ display: "flex",marginLeft: "10px" }}>
          
          <FormControl
            component="fieldset"
           
          >
            <RadioGroup  value={respuestaSINO} onChange={handleRespuesta}>
              <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </div>
        <Typography>¿Este producto es pesable?</Typography>
        <div style={{ display: "flex", marginLeft: "10px" }}>
          <FormControl component="fieldset">
            <RadioGroup value={pesoSINO} onChange={handlePeso}>
              <FormControlLabel value="Sí" control={<Radio />} label="Sí" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </div>
        <InputLabel>Selecciona Categoría</InputLabel>
        <Select
          sx={{ width: "700px" }}
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
        <InputLabel>Selecciona Sub-Categoría</InputLabel>
        <Select
          sx={{ width: "700px" }}
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
        <InputLabel>Selecciona Familia</InputLabel>
        <Select
          sx={{ width: "700px" }}
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
        <InputLabel>Selecciona Subfamilia</InputLabel>
        <Select
          sx={{ width: "700px" }}
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
        <InputLabel>Ingrese Nombre</InputLabel>
        <TextField
          sx={{ marginTop: "5px", width: "700px" }}
          label=" Nombre"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <InputLabel>Ingrese Marca</InputLabel>
        <Select
          sx={{ width: "700px" }}
          fullWidth
          value={selectedMarcaId}
          onChange={(e) => handleMarcaSelect(e.target.value)}
          label="Selecciona Marca"
        >
          {marcas.map((marca) => (
            <MenuItem key={marca.id} value={marca.id}>
              {marca.nombre}
            </MenuItem>
          ))}
        </Select>
        <Button
          sx={{ marginLeft: "40px", marginTop: "5px", marginBottom: "12px" }}
          variant="contained"
          color="secondary"
          onClick={handleNext}
        >
          Guardar y continuar
        </Button>
      </Box>

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
