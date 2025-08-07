/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  List,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import BoxSumaProd from "./BoxSumaProd";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BotonesCategorias = ({ onClose }) => {
  const { selectedOptions, setSelectedOptions } = useContext(
    SelectedOptionsContext
  );
  const { addToSalesData } = useContext(SelectedOptionsContext);
  const [value, setValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [families, setFamilies] = useState([]);
  const [subfamilies, setSubFamilies] = useState([]);

  const [openFamily, setOpenFamily] = useState(false);
  const [openSubFamily, setOpenSubFamily] = useState(false);

  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [openNoProductDialog, setOpenNoProductDialog] = useState(false);

  ////data para enviar a componente

  const handleCategorySelect = (categoryId) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      category: categoryId,
    }));
  };

  const [open, setOpen] = useState(false);

  const handleCloseAddProduct = () => {
    // Add logic to handle the selectedProduct, for example:
    // You can set the selectedProduct to the context
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      selectedProduct: selectedProduct,
    }));

    // You can also perform additional logic based on the selectedProduct

    // Finally, close the product dialog
    setOpenProductDialog(false);
  };
  const handleOpenDialog = async (categoryId) => {
    setOpen(true);
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${categoryId}`
      );
      if (response.data.subCategorias.length > 0) {
        setSubCategories(response.data.subCategorias);
        console.log("subCategorias:", response.data.subCategorias);
      } else {
        const noSubcategoriesResponse = await axios.get(
          "https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByIdNML?idcategoria=1&idsubcategoria=0&idfamilia=0&idsubfamilia=0"
        );
        console.log("noSubcategoriesResponse:", noSubcategoriesResponse);
        if (noSubcategoriesResponse.data.subCategorias.length > 0) {
          setSubCategories(noSubcategoriesResponse.data.subCategorias);
        } else {
          // No subcategories found even with default values
          // You can handle this scenario as needed
          console.log("No subcategories found.");
        }
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  // const handleOpenDialog = async (categoryId) => {
  //   setOpen(true);
  //   // Fetch the subcategories for the clicked category
  //   const response = await axios.get(
  //     `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${categoryId}`
  //   );
  //   setSubCategories(response.data.subCategorias);
  // };
  // const handleCloseDialog = () => {
  //   setOpen(false);
  // };

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategoryId !== "") {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubCategoriaByIdCategoria?CategoriaID=${selectedCategoryId}`
          );

          console.log("Subcategories Response:", response.data.subCategorias);
          setSubCategories(response.data.subCategorias);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      }
    };

    fetchSubCategories();
  }, [selectedCategoryId]);

  const handleOpenFamilyDialog = async (subCategoryId) => {
    console.log("Abrir diálogo de familias - Subcategoría ID:", subCategoryId);
    setOpen(false); // Cerrar el diálogo de subcategorías
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${subCategoryId}`
      );
      console.log("Respuesta familias:", response.data.familias);
      if (response.data.familias.length > 0) {
        setFamilies(response.data.familias);
        setOpenFamily(true); // Abrir el diálogo de familias
      } else {
        console.log(
          "No se encontraron familias. Realizando nueva búsqueda de productos."
        );
        const noFamiliesResponse = await axios.get(
          `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByIdNML?idcategoria=1&idsubcategoria=${subCategoryId}&idfamilia=0&idsubfamilia=0`
        );
        console.log(
          "Respuesta de búsqueda de productos:",
          noFamiliesResponse.data.productos
        );
        if (noFamiliesResponse.data.cantidadRegistros > 0) {
          // Mostrar los productos obtenidos
          setSelectedProduct(noFamiliesResponse.data.productos);
          console.log("selectedProduct:", selectedProduct);
          setOpenProductDialog(true);
        } else {
          console.log("No se encontraron productos.");
          // Aquí puedes manejar la situación en la que no se encuentran productos.
        }
      }
    } catch (error) {
      console.error("Error al obtener familias:", error);
    }
  };

  // const handleOpenFamilyDialog = async (subCategoryId) => {
  //   console.log("subCategoryId:", subCategoryId);
  //   setOpen(false); // Close the subcategory dialog
  //   // Fetch the families for the clicked subcategory
  //   const response = await axios.get(
  //     `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetFamiliaByIdSubCategoria?SubCategoriaID=${subCategoryId}`
  //   );
  //   setFamilies(response.data.familias);
  //   setOpenFamily(true); // Open the family dialog
  // };

  const handleCloseFamilyDialog = () => {
    setOpenFamily(false);
  };

  const handleNavigationChange = (event, newValue) => {
    console.log(`Button ${newValue} clicked`);
    setValue(newValue);
  };

  const handleCloseCategoria = () => {
    onClose(true);
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetAllCategorias"
        );
        console.log("API response:", response.data.categorias); // Add this line
        setCategories(response.data.categorias);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  const handleOpenSubFamilyDialog = async (familyId) => {
    console.log("familyId:", familyId);
    setOpenFamily(false); // Close the family dialog

    // Fetch the subfamilies for the clicked family
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/NivelMercadoLogicos/GetSubFamiliaByIdFamilia?FamiliaID=${familyId}`
      );

      // Set the selected family in state
      setSelectedFamilyId(familyId);

      // Set the fetched subfamilies in the state
      setSubFamilies(response.data.subFamilias);

      // Open the subfamily dialog
      setOpenSubFamily(true);
    } catch (error) {
      console.error("Error fetching subfamilies:", error);
    }
  };

  const handleCloseSubFamilyDialog = () => {
    setOpenSubFamily(false);
  };
  ///consumo de prodcutos por ids

  const handleSubfamilyClick = async (subfamily) => {
    console.log("Subfamily selected:", subfamily);

    // Log IDs of the selected subfamily
    const {
      idCategoria,
      idSubcategoria,
      idFamilia,
      idSubFamilia,
      descripcion,
    } = subfamily;
    console.log("IDs:", {
      idCategoria,
      idSubcategoria,
      idFamilia,
      idSubFamilia,
      descripcion,
    });

    // Fetch productos data based on the selected subfamily
    try {
      const productosResponse = await axios.get(
        `https://www.easyposdev.somee.com/api/ProductosTmp/GetProductosByIdNML?idcategoria=${idCategoria}&idsubcategoria=${idSubcategoria}&idfamilia=${idFamilia}&idsubfamilia=${idSubFamilia}`
      );

      // Handle the fetched productos data as needed
      console.log("Productos Response:", productosResponse.data);

      if (productosResponse.data.cantidadRegistros > 0) {
        // Create and display a map of products
        setSelectedProduct(productosResponse.data.productos);
        setOpenProductDialog(true);

        // Display the map of products (you may use a Dialog or any other UI component)
        console.log("Products Map:", productosResponse.data.productos[0]);
      } else {
        setOpenNoProductDialog(true);
      }
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleCloseNoProductDialog = () => {
    setOpenNoProductDialog(false);
  };
  const handleProductClick = (product) => {
    console.log("Product clicked:", product);
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      selectedProduct: product,
    }));
    addToSalesData(product);
    // You can also perform additional logic based on the selected product

    // Finally, close the product dialog
    setOpenProductDialog(false);
  };

  // const handleProductSelection = (selectedProduct) => {
  //   // Assuming you have access to addToSalesData function from the context
  //   // Add selected product to sales list
  //   addToSalesData(selectedProduct, 1);
  // };

  ///////////////////Manejo de Productos sin Subfamilia////
  const [showFamilies, setShowFamilies] = useState(false);

  const handleShowFamilies = () => {
    setShowFamilies(true);
  };

  const handleShowProducts = () => {
    setShowFamilies(false);
  };
  ///////////////////Manejo de Productos sin Subfamilia////

  return (
    <SelectedOptionsContext.Provider value={{}}>
      <Paper elevation={13}>
        <Box p={2}>
          <Typography variant="h5">Categorias</Typography>
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid
                item
                key={category.idCategoria}
                xs={12}
                sm={12}
                md={12}
                lg={12}
              >
                <Button
                
                sx={{
                  margin: 1,
                  width: "100%",
                 
                  backgroundColor: "lightSalmon",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "coral",
                    color: "white",
                  },
                }}
                  onClick={() => {
                    handleOpenDialog(category.idCategoria);
                    setSelectedOptions((prevOptions) => ({
                      ...prevOptions,
                      category: category.idCategoria,
                    }));
                  }}
                  fullWidth
                  variant="contained"
                >
                  {category.descripcion}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      <Dialog open={open} onClose={onClose}>
        <DialogTitle> Selecciona Subcategorias</DialogTitle>
        <DialogContent>
          {subcategories.map((subcategory) => (
            <Button
              key={subcategory.idSubcategoria}
              onClick={() => handleOpenFamilyDialog(subcategory.idSubcategoria)}
              sx={{
                margin: 1,
                width: "90px",
                height: "60px",
                backgroundColor: "lightSalmon",
                color: "white",
                "&:hover": {
                  backgroundColor: "coral",
                  color: "white",
                },
              }}
            >
              {subcategory.descripcion}
            </Button>
          ))}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openFamily || openProductDialog}
        onClose={handleCloseProductDialog}
      >
        <DialogTitle>{showFamilies ? "Familias" : "Productos"}</DialogTitle>
        <DialogContent>
          {showFamilies ? (
            <List>
              {families.map((family) => (
                <Button
                  key={family.idFamilia}
                  onClick={() => handleOpenSubFamilyDialog(family.idFamilia)}
                  sx={{
                    margin: 1,
                    width: "90px",
                    height: "60px",
                    backgroundColor: "lightSalmon",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "coral",
                      color: "white",
                    },
                  }}
                >
                  {family.descripcion}
                </Button>
              ))}
            </List>
          ) : (
            <List>
              {selectedProduct.map((product) => (
                <Button
                  key={product.idProducto}
                  onClick={() => {
                    addToSalesData(product);
                    handleCloseProductDialog();
                    handleCloseFamilyDialog();
                    onClose();
                  }}
                  sx={{
                    margin: 1,
                    width: "90px",
                    height: "60px",
                    backgroundColor: "lightSalmon",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "coral",
                      color: "white",
                    },
                  }}
                >
                  {product.nombre}
                </Button>
              ))}
            </List>
          )}
          {/* <Button onClick={handleShowFamilies}>Mostrar Familias</Button>
          <Button onClick={handleShowProducts}>Mostrar Productos</Button> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseProductDialog();
              handleCloseFamilyDialog();
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSubFamily} onClose={handleCloseSubFamilyDialog}>
        <DialogTitle>Subfamilias</DialogTitle>
        <DialogContent>
          {subfamilies.map((subfamily) => (
            <Button
              key={subfamily.idSubFamilia}
              onClick={() => handleSubfamilyClick(subfamily)}
              // onClick={() => {
              //   console.log("Subfamily selected:", subfamily);
              //   setSelectedOptions((prevOptions) => ({
              //     ...prevOptions,
              //     subFamily: subfamily,
              //   }));
              // }}
              sx={{
                margin: 1,
                width: "90px",
                height: "60px",
                backgroundColor: "lightSalmon",
                color: "white",
                "&:hover": {
                  backgroundColor: "coral",
                  color: "white",
                },
              }}
            >
              {subfamily.descripcion}
            </Button>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubFamilyDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </SelectedOptionsContext.Provider>
  );
};

export default BotonesCategorias;
