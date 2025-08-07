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
  InputLabel,
  Button,
  CircularProgress,
  IconButton,
  DialogContent,
  Dialog,
  Tab,
  Tabs,
  Card,
  CardActions,
  CardContent,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  DialogActions,
  DialogTitle,
  TableRow,
  Snackbar,
  MenuItem,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import BuscadorClientes from "./BuscadorClientes";
import IngresoClienteSucursal from "./IngresoClienteSucursal";

import MuiAlert from "@mui/material/Alert";

import axios from "axios";

const apiUrl = "https://www.easyposdev.somee.com/api/Clientes/AddCliente";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const IngresoClientes = ({ onClose }) => {
  const [rutError, setRutError] = useState("");
  const [correoError, setCorreoError] = useState("");
  const [loading, setLoading] = useState(false);

  // const validateEmail = (correo) => {
  //   console.log("Input correo:", correo);
  //   // Expresión regular para validar el formato de un correo electrónico
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   // Verificar si el correo electrónico cumple con el formato esperado
  //   if (!emailRegex.test(correo)) {
  //     setCorreoError("El correo electrónico ingresado no es válido.");
  //     return false;
  //   }

  //   // El correo electrónico tiene un formato válido
  //   return true;
  // };

  const validarRutChileno = (rut) => {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
      // Si el formato del RUT no es válido, retorna false
      return false;
    }

    // Separar el número del RUT y el dígito verificador
    const partesRut = rut.split("-");
    const digitoVerificador = partesRut[1].toUpperCase();
    const numeroRut = partesRut[0];

    // Función para calcular el dígito verificador
    const calcularDigitoVerificador = (T) => {
      let M = 0;
      let S = 1;
      for (; T; T = Math.floor(T / 10)) {
        S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
      }
      return S ? String(S - 1) : "K";
    };

    // Validar el dígito verificador
    return calcularDigitoVerificador(numeroRut) === digitoVerificador;
  };

  const validateEmail = () => {
    // Expresión regular para validar el formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.correo.trim()) {
      setRutError('Correo electrónico es requerido');
      return false;
    } else if (!emailPattern.test(formData.correo.trim())) {
      setRutError('Formato de correo electrónico inválido');
      return false;
    } else {
      setRutError('');
    }
  };


  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    region: "",
    comuna: "",
    correo: "",
    giro: "",
    urlPagina: "",
    formaPago: "",
    razonSocial: "",
    usaCuentaCorriente: 0,
    // fechaIngreso: new Date().toISOString(),
    // fechaUltAct: new Date().toISOString(),
    // bajaLogica: true,
    // clientesSucursalAdd: [
    //   {
    //     rutResponsable: "",
    //     nombreResponsable: "",
    //     apellidoResponsable: "",
    //     direccion: "",
    //     telefono: "",
    //     region: "",
    //     comuna: "",
    //     correo: "",
    //     giro: "",
    //     urlPagina: "",
    //     formaPago: "",
    //     razonSocial: "",
    //     usaCuentaCorriente: 0,
    //     // fechaIngreso: new Date().toISOString(),
    //     // fechaUltAct: new Date().toISOString(),
    //     // bajaLogica: true,
    //   },
    // ],
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedComuna, setSelectedComuna] = useState("");
  const [selectedSucursalRegion, setSelectedSucursalRegion] = useState("");
  const [selectedSucursalComuna, setSelectedSucursalComuna] = useState("");

  const [regionOptions, setRegionOptions] = useState([]);
  const [comunaOptions, setComunaOptions] = useState([]);
  const [sucursalRegionOptions, setSucursalRegionOptions] = useState([]);
  const [sucursalComunaOptions, setSucursalComunaOptions] = useState([]);

  const [selectedTab, setSelectedTab] = useState(0);

  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/;

  const [branchData, setBranchData] = useState({
    codigoCliente: 0,
    rutResponsable: "",
    nombreResponsable: "",
    apellidoResponsable: "",
    direccion: "",
    telefono: "",
    region: "",
    comuna: "",
    correo: "",
    giro: "",
    urlPagina: "",
    formaPago: "",
    razonSocial: "",
    usaCuentaCorriente: 0,
    // Add other branch data fields
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Clientes/GetAllClientes"
        );
        setCustomers(response.data.cliente);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenModal = (customerId) => {
    setSelectedCustomerId(customerId);
    setBranchData({
      ...branchData,
      codigoCliente: customerId,
    });
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleAddBranch = async () => {
    try {
      console.log("Before formatting:", branchData);

      // Format branch data according to the URL schema
      const formattedBranchData = {
        codigoCliente: branchData.codigoCliente,
        rutResponsable: branchData.rutResponsable,
        nombreResponsable: branchData.nombreResponsable,
        apellidoResponsable: branchData.apellidoResponsable,
        direccion: branchData.direccion,
        telefono: branchData.telefono,
        region: branchData.region,
        comuna: branchData.comuna,
        correo: branchData.correo,
        giro: branchData.giro,
        razonSocial: branchData.razonSocial,
        urlPagina: branchData.urlPagina,
        formaPago: branchData.formaPago,
        usaCuentaCorriente: branchData.usaCuentaCorriente,
      };

      console.log("After formatting:", formattedBranchData);

      // Make API request to add branch using formattedBranchData
      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/Clientes/AddClienteSucursal",
        formattedBranchData
      );
      console.log("Response:", response.data);

      // Close the modal and update data
      setOpenModal(false);
      const fetchResponse = await axios.get(
        "https://www.easyposdev.somee.com/api/Clientes/GetAllClientes"
      );
      setCustomers(fetchResponse.data.cliente);
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  const handleBranchDataChange = (event) => {
    setBranchData({
      ...branchData,
      [event.target.name]: event.target.value,
    });
  };

  /////////Buscador////////
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  ///////////Fin Buscador///////
  /////////sucursalClientes////////////

  const filteredCustomers = customers.filter((customer) => {
    if (customer) {
      const { nombre, apellido, rut, codigoCliente } = customer;
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        nombre.toLowerCase().includes(lowerSearchTerm) ||
        apellido.toLowerCase().includes(lowerSearchTerm) ||
        rut.toLowerCase().includes(lowerSearchTerm) ||
        codigoCliente.toString().includes(lowerSearchTerm)
      );
    }
    return false; // or handle the case when customer is null or undefined
  });

  //////////fin suursalcleinte///////////

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/RegionComuna/GetAllRegiones"
        );
        setRegionOptions(response.data.regiones);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchComunas = async () => {
      if (selectedRegion) {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedRegion}`
          );
          setComunaOptions(
            response.data.comunas.map((comuna) => comuna.comunaNombre)
          );
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchComunas();
  }, [selectedRegion]);

  useEffect(() => {
    const fetchSucursalRegions = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/RegionComuna/GetAllRegiones"
        );

        setSucursalRegionOptions(response.data.regiones);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSucursalRegions();
  }, []);

  useEffect(() => {
    const fetchSucursalComunas = async () => {
      if (selectedSucursalRegion) {
        try {
          const response = await axios.get(
            `https://www.easyposdev.somee.com/api/RegionComuna/GetComunaByIDRegion?IdRegion=${selectedSucursalRegion}`
          );
          setSucursalComunaOptions(
            response.data.comunas.map((comuna) => comuna.comunaNombre)
          );
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchSucursalComunas();
  }, [selectedSucursalRegion]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const emptyFields = Object.entries(formData)
        .filter(([key, value]) => value === "")
        .map(([key]) => key);

      if (emptyFields.length > 0) {
        const emptyField = emptyFields[0];
        setRutError(
          `El campo ${emptyField} está vacío. Por favor completa todos los campos antes de enviar el formulario.`
        );
        return;
      } else {
        setRutError("");
      }
      setRutError("");

      if (!formData.rut) {
        setRutError("Por favor ingresa un RUT.");
        return;
      } else if (!validarRutChileno(formData.rut)) {
        setRutError("El RUT ingresado NO es válido.");
        return;
      } else {
        setRutError(""); // Clear any previous error message
      }
      if (!validateEmail(formData.correo)) {
        setCorreoError("El correo electrónico ingresado no es válido.");
        return;
      } else {
        setCorreoError(""); // Clear any previous error message
      }

      setLoading(true);

      // if(validateEmail()==false){
      //   console.log(" Email no valido")
      // }

      const formDataToSend = {
        ...formData,
        rut: String(formData.rut),
        region: String(formData.region),
        comuna: String(formData.comuna),
      };
      console.log("Form Data antes de submit:", formDataToSend);

      const response = await axios.post(apiUrl, formDataToSend);
      console.log(
        "Propiedad 'cliente' en la respuesta:",
        response.data.cliente
      );
      if (response.status === 200) {
        const responseData = response.data;
        console.log("Form Data after submission:", responseData);
        setFormData({
          rut: "",
          nombre: "",
          apellido: "",
          direccion: "",
          telefono: "",
          region: setSelectedRegion(""),
          comuna: setSelectedComuna(""),
          correo: "",
          giro: "",
          urlPagina: "",
          formaPago: "",
          razonSocial: "",
          usaCuentaCorriente: 0,
        });

        if (responseData) {
          setSnackbarMessage("Cliente generado exitosamente");
          setOpenSnackbar(true);

          setTimeout(() => {
            onClose(); ////Cierre Modal al finalizar
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      // setSnackbarMessage("Error en la operación");
      // setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  //////Manejo de sucursales//////

  // const [sucursalData, setSucursalData] = useState(null);
  const [selectedBranchData, setSelectedBranchData] = useState({});

  const handleShowBranch = async (codigoCliente) => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesSucursalByCodigoCliente?codigocliente=${codigoCliente}`
      );

      const sucursales = response.data.clienteSucursal;
      setSelectedBranchData({
        ...selectedBranchData,
        [codigoCliente]: sucursales,
      });

      toggleBranchDetails(codigoCliente);
    } catch (error) {
      console.error("Error al obtener los datos de la sucursal:", error);
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario.
    }
  };
  ///////////togle resultados/////
  const [showResults, setShowResults] = useState(false);
  //////deatleas mostara surscal button///
  const [showDetails, setShowDetails] = useState(false);
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleToggleResults = () => {
    setShowResults(!showResults);
  };

  ///Manejo de toglesursal////////
  const [showBranchDetails, setShowBranchDetails] = useState({});

  const toggleBranchDetails = (customerId) => {
    setShowBranchDetails((prevState) => ({
      ...prevState,
      [customerId]: !prevState[customerId], // Invierte el estado anterior
    }));
  };
  return (
    <Paper>
      <Grid container item xs={12} sm={11} md={12} lg={12} spacing={2}>
        {selectedTab === 0 && (
          <Grid
            container
            sx={{ margin: "auto", display: "flex", justifyContent: "center" }}
            item
            xs={12}
            sm={11}
            md={12}
            lg={12}
            spacing={2}
          >
            {" "}
            <Grid item xs={12} sm={12} md={12}>
              {" "}
              {correoError && <p style={{ color: "red" }}> {correoError}</p>}
              {rutError && <p style={{ color: "red" }}> {rutError}</p>}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                label="ej: 11111111-1"
                name="rut"
                placeholder="Ingrese rut con puntos y con guión"
                fullWidth
                value={formData.rut}
                onChange={handleInputChange}
                inputProps={{
                  inputMode: "numeric", // textEstablece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                label="Nombre"
                name="nombre"
                type="text"
                fullWidth
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Apellido
              </InputLabel>
              <TextField
                type="text"
                label="Apellido"
                name="apellido"
                fullWidth
                value={formData.apellido}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Dirección
              </InputLabel>
              <TextField
                label="Dirección"
                name="direccion"
                fullWidth
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Teléfono
              </InputLabel>
              <TextField
                label="Teléfono"
                type="number"
                name="telefono"
                fullWidth
                value={formData.telefono}
                onChange={handleInputChange}
                inputProps={{
                  inputMode: "numeric", // Establece el modo de entrada como numérico
                  pattern: "[0-9]*", // Asegura que solo se puedan ingresar números
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Selecciona región
              </InputLabel>
              <TextField
                fullWidth
                id="region"
                select
                label="Región"
                value={selectedRegion}
                onChange={(e) => {
                  const regionID = e.target.value;
                  setSelectedRegion(regionID);
                  // Actualizar el valor en formData
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    region: regionID,
                  }));
                }}
              >
                {regionOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.regionNombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} ssm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Selecciona comuna
              </InputLabel>
              <TextField
                id="comuna"
                select
                fullWidth
                label="Comuna"
                value={selectedComuna}
                onChange={(e) => {
                  const comunaValue = e.target.value;
                  setSelectedComuna(comunaValue);
                  // Actualizar el valor en formData.comuna (sin sucursal)
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    comuna: comunaValue,
                  }));
                }}
              >
                {comunaOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa correo electrónico
              </InputLabel>
              <TextField
              required
                label="Correo"
                name="correo"
                type="email"
                fullWidth
                value={formData.correo}
                onChange={handleInputChange}
              
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Giro</InputLabel>
              <TextField
                label="Giro"
                name="giro"
                fullWidth
                value={formData.giro}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Giro</InputLabel>
              <TextField
                label="URL Página"
                name="urlPagina"
                fullWidth
                value={formData.urlPagina}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Forma de Pago
              </InputLabel>
              <TextField
                label="Forma de Pago"
                name="formaPago"
                fullWidth
                value={formData.formaPago}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Razón social
              </InputLabel>
              <TextField
                fullWidth
                label="Razón Social"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item sx={{ marginBottom: "10px" }} xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={loading} // Deshabilita el botón si loading es true
                onClick={handleSubmit} // Asegúrate de que esta sea la función correcta para manejar el envío de datos
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} /> Procesando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </Grid>
          </Grid>
        )}

        {/* 
        {selectedTab === 1 && (
          <Grid
            container
            sx={{ margin: "auto" }}
            item
            xs={12}
            sm={11}
            md={12}
            lg={12}
            xl={12}
            spacing={2}
          >
           <IngresoClienteSucursal/>

            
          </Grid>
        )} */}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          // onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Grid>
    </Paper>
  );
};

export default IngresoClientes;
