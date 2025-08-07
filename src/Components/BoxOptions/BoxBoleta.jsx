import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  Paper,
  Avatar,
  Box,
  Grid,
  Stack,
  InputLabel,
  Typography,
  CircularProgress,
  Snackbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  MenuItem,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  TextField,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxBoleta = ({ onClose }) => {
  const {
    userData,
    salesData,
    addToSalesData,
    setPrecioData,
    grandTotal,
    ventaData,
    setVentaData,
    searchResults,
    setSearchResults,
    updateSearchResults,
    selectedUser,
    setSelectedUser,
    selectedCodigoCliente,
    setSelectedCodigoCliente,
    selectedCodigoClienteSucursal,
    setSelectedCodigoClienteSucursal,
    setSelectedChipIndex,
    selectedChipIndex,
    searchText,
    setSearchText,
    clearSalesData,
  } = useContext(SelectedOptionsContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log("salesData:", salesData);

  const navigate = useNavigate();
  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [metodoPago, setMetodoPago] = useState("");
  const [cantidadPagada, setCantidadPagada] = useState(grandTotal);
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [errorTransferenciaError, setTransferenciaError] = useState("");
  const tiposDeCuenta = {
    "Cuenta Corriente": "Cuenta Corriente",
    "Cuenta de Ahorro": "Cuenta de Ahorro",
    "Cuenta Vista": "Cuenta Vista",
    "Cuenta Rut": "Cuenta Rut",
    "Cuenta de Depósito a Plazo (CDP)": "Cuenta de Depósito a Plazo (CDP)",
    "Cuenta de Inversión": "Cuenta de Inversión",
  };

  const handleChangeTipoCuenta = (event) => {
    setTipoCuenta(event.target.value); // Actualizar el estado del tipo de cuenta seleccionado
  };

  const bancosChile = [
    { id: 1, nombre: "Banco de Chile" },
    { id: 2, nombre: "Banco Santander Chile" },
    { id: 3, nombre: "Banco Estado" },
    { id: 4, nombre: "Scotiabank Chile" },
    { id: 5, nombre: "Banco BCI" },
    { id: 6, nombre: "Banco Itaú Chile" },
    { id: 7, nombre: "Banco Security" },
    { id: 8, nombre: "Banco Falabella" },
    { id: 9, nombre: "Banco Ripley" },
    { id: 10, nombre: "Banco Consorcio" },
    { id: 11, nombre: "Banco Internacional" },
    { id: 12, nombre: "Banco Edwards Citi" },
    { id: 13, nombre: "Banco de Crédito e Inversiones" },
    { id: 14, nombre: "Banco Paris" },
    { id: 15, nombre: "Banco Corpbanca" },
    { id: 16, nombre: "Banco BICE" },

    // Agrega más bancos según sea necesario
  ];

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const day = fecha.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [fecha, setFecha] = useState(dayjs()); // Estado para almacenar la fecha actual
  // const fechaDayjs = dayjs(fecha);
  const handleDateChange = (newDate) => {
    setFecha(newDate);
  };

  // Estado para el valor seleccionado del banco
  const [selectedBanco, setSelectedBanco] = useState("");

  // Función para manejar el cambio en el selector de banco
  const handleBancoChange = (event) => {
    setSelectedBanco(event.target.value);
  };

  // Agrega este console.log para verificar el valor de selectedDebts justo antes de abrir el diálogo de transferencia
  console.log(
    "selectedDebts justo antes de abrir el diálogo de transferencia:",
    selectedDebts
  );
  useEffect(() => {
    console.log("selectedDebts cambió:", selectedDebts);
  }, [selectedDebts]);

  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  useEffect(() => {
    // Calcular el total de los productos seleccionados
    const totalVenta = salesData.reduce(
      (total, producto) => total + producto.precio,
      0
    );
    // Establecer el total como el monto pagado
    setMontoPagado(totalVenta);
  }, [salesData]);
  const handlePagoBoleta = async () => {
    try {
      // Validar si el usuario ha ingresado el código de vendedor
      if (!userData.codigoUsuario) {
        setError("Por favor, ingresa el código de vendedor para continuar.");
        return;
      }

      // Validar si el total a pagar es cero
      if (grandTotal === 0) {
        setError(
          "No se puede generar la boleta de pago porque el total a pagar es cero."
        );
        return;
      }

      // Validar que se haya seleccionado al menos una deuda

      setLoading(true);

      let endpoint =
        "https://www.easyposdev.somee.com/api/GestionDTE/GenerarBoletaDTE";

      // Si el método de pago es TRANSFERENCIA, cambiar el endpoint y agregar datos de transferencia
      if (metodoPago === "TRANSFERENCIA") {
        endpoint =
          "https://www.easyposdev.somee.com/api/GestionDTE/GenerarBoletaDTE";

        // Validar datos de transferencia
        if (
          !nombre ||
          !rut ||
          !selectedBanco ||
          !tipoCuenta ||
          !nroCuenta ||
          !fecha ||
          !nroOperacion
        ) {
          setError(
            "Por favor, completa todos los campos necesarios para la transferencia."
          );
          setLoading(false);
          return;
        }
        if (!validarRutChileno(rut)) {
          setError("El RUT ingresado NO es válido.");
          setLoading(false);
          return;
        } else {
          // Limpiar el error relacionado con el RUT
          setError("");
        }
      }

      // Validar el monto pagado
      if (!metodoPago || cantidadPagada <= 0) {
        setError("Por favor, ingresa un monto válido para el pago.");
        setLoading(false);
        return;
      }

      // Validar el método de pago
      if (!metodoPago) {
        setError("Por favor, selecciona un método de pago.");
        setLoading(false);
        return;
      }

      // Validar el código de usuario
      if (
        typeof userData.codigoUsuario !== "number" ||
        userData.codigoUsuario <= 0
      ) {
        setError("El código de usuario no es válido.");
        setLoading(false);
        return;
      }

      // Otras validaciones que consideres necesarias...

      // Si se llega a este punto, todas las validaciones han pasado, proceder con la llamada a la API

      const requestBody = {
        idUsuario: userData.codigoUsuario,
        codigoClienteSucursal: selectedCodigoClienteSucursal, // Ajustar según la lógica de tu aplicación
        codigoCliente: selectedCodigoCliente, // Ajustar según la lógica de tu aplicación
        total: grandTotal,
        products: salesData.map((producto) => ({
          codProducto: producto.idProducto, // Ajustar la propiedad según el nombre real en tus datos
          cantidad: producto.quantity, // Ajustar la propiedad según el nombre real en tus datos
          precioUnidad: producto.precio, // Ajustar la propiedad según el nombre real en tus datos
          descripcion: producto.descripcion, // Ajustar la propiedad según el nombre real en tus datos
        })),
        metodoPago: metodoPago,
        transferencias: {
          idCuentaCorrientePago: 0,
          nombre: nombre,
          rut: rut,
          banco: selectedBanco,
          tipoCuenta: tipoCuenta,
          nroCuenta: nroCuenta,
          fecha: fecha,
          nroOperacion: nroOperacion,
        },
      };

      console.log("Request Body:", requestBody);

      const response = await axios.post(endpoint, requestBody);

      console.log("Response:", response.data);

      if (response.status === 200) {
        // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.descripcion);
        clearSalesData();
        setSelectedUser(null);
        setSelectedChipIndex([]);
        setSearchResults([]);
        setSelectedCodigoCliente(0);
        setSearchText(""), handleTransferenciaModalClose();

        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    } finally {
      setLoading(false);
    }
  };
  // const handlePagoBoleta = async () => {
  //  try {
  //     // Validar si el usuario ha ingresado el código de vendedor
  //     if (!userData.codigoUsuario) {
  //       setError("Por favor, ingresa el código de vendedor para continuar.");
  //       return;
  //     }

  //     // Validar si el total a pagar es cero
  //     if (grandTotal === 0) {
  //       setError(
  //         "No se puede generar la boleta de pago porque el total a pagar es cero."
  //       );
  //       return;
  //     }

  //     // Validar que se haya seleccionado al menos una deuda

  //     setLoading(true);

  //     let endpoint =
  //       'https://www.easyposdev.somee.com/api/GestionDTE/GenerarBoletaDTE';

  //     // Si el método de pago es TRANSFERENCIA, cambiar el endpoint y agregar datos de transferencia
  //     if (metodoPago === "TRANSFERENCIA") {
  //       endpoint =
  //         'https://www.easyposdev.somee.com/api/GestionDTE/GenerarBoletaDTE';

  //       // Validar datos de transferencia
  //       if (
  //         !nombre ||
  //         !rut ||
  //         !selectedBanco ||
  //         !tipoCuenta ||
  //         !nroCuenta ||
  //         !fecha ||
  //         !nroOperacion
  //       ) {
  //         setError(
  //           "Por favor, completa todos los campos necesarios para la transferencia."
  //         );
  //         setLoading(false);
  //         return;
  //       }
  //       if (!validarRutChileno(rut)) {
  //         setError("El RUT ingresado NO es válido.");
  //         setLoading(false);
  //         return;
  //       }
  //     }

  //     // Validar el monto pagado
  //     if (!montoPagado || montoPagado <= 0) {
  //       setError("Por favor, ingresa un monto válido para el pago.");
  //       setLoading(false);
  //       return;
  //     }

  //     // Validar el método de pago
  //     if (!metodoPago) {
  //       setError("Por favor, selecciona un método de pago.");
  //       setLoading(false);
  //       return;
  //     }

  //     // Validar el código de usuario
  //     if (
  //       typeof userData.codigoUsuario !== "number" ||
  //       userData.codigoUsuario <= 0
  //     ) {
  //       setError("El código de usuario no es válido.");
  //       setLoading(false);
  //       return;
  //     }

  //     // Otras validaciones que consideres necesarias...

  //     // Si se llega a este punto, todas las validaciones han pasado, proceder con la llamada a la API

  //     const requestBody = {
  //       deudaIds: selectedDebts.map((deuda) => ({
  //         idCuentaCorriente: deuda.id,
  //         idCabecera: deuda.idCabecera,
  //         total: deuda.total,
  //       })),
  //       montoPagado: montoPagado,
  //       metodoPago: metodoPago,
  //       idUsuario: userData.codigoUsuario,
  //       transferencias: {
  //         idCuentaCorrientePago: 0,
  //         nombre: nombre,
  //         rut: rut,
  //         banco: selectedBanco,
  //         tipoCuenta: tipoCuenta,
  //         nroCuenta: nroCuenta,
  //         fecha: fecha,
  //         nroOperacion: nroOperacion,
  //       },
  //     };

  //     console.log("Request Body:", requestBody);

  //     const response = await axios.post(endpoint, requestBody);

  //     console.log("Response:", response.data);

  //     if (response.status === 200) {
  //       // Restablecer estados y cerrar diálogos después de realizar el pago exitosamente
  //       setSnackbarOpen(true);
  //       setSnackbarMessage(response.data.descripcion);
  //       clearSalesData();
  //       setSelectedUser(null);
  //       setSelectedChipIndex([]);
  //       setSearchResults([]);
  //       setSelectedCodigoCliente(0);
  //        setSearchText(""),
  //        handleClosePaymentDialog();
  //        handleTransferenciaModalClose();
  //        onClose();

  //       // setTimeout(() => {

  //       //   onClose();
  //       // }, 1000);
  //     } else {
  //       console.error("Error al realizar el pago");
  //     }
  //   } catch (error) {
  //     console.error("Error al realizar el pago:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleMetodoPagoClick = (metodo) => {
    setSelectedMethod(metodo);
  };

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

  const calcularVuelto = () => {
    const cambio = cantidadPagada - grandTotal;
    return cambio > 0 ? cambio : 0;
  };

  const validateFields = () => {
    const requiredFields = [
      "nombre",
      "rut",
      "selectedBanco",
      "tipoCuenta",
      "nroCuenta",
      "fecha",
      "nroOperacion",
    ];
    let isValid = true;
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        newErrors[field] = `El campo ${field} es requerido.`;
        isValid = false;
      }
    });

    // Validación específica para RUT

    // Validación de cantidad pagada
    if (cantidadPagada < grandTotal) {
      newErrors.cantidadPagada = "La cantidad pagada es insuficiente.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Typography variant="h4" sx={{ marginBottom: "2%" }}>
            Pagar Boleta
          </Typography>
          {error && (
            <Grid item xs={12}>
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            </Grid>
          )}
          <TextField
            sx={{ marginBottom: "5%" }}
            margin="dense"
            label="Monto a Pagar"
            variant="outlined"
            value={grandTotal}
            onChange={(e) => setMontoPagado(e.target.value)}
            fullWidth
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
          <TextField
            margin="dense"
            fullWidth
            label="Cantidad pagada"
            value={cantidadPagada || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value.trim()) {
                setCantidadPagada(0);
              } else {
                setCantidadPagada(parseFloat(value));
              }
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />
          <TextField
            margin="dense"
            fullWidth
            type="number"
            label="Por pagar"
            value={Math.max(0, grandTotal - cantidadPagada)}
            InputProps={{ readOnly: true }}
          />
          {calcularVuelto() > 0 && (
            <TextField
              margin="dense"
              fullWidth
              type="number"
              label="Vuelto"
              value={calcularVuelto()}
              InputProps={{ readOnly: true }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography sx={{ marginTop: "7%" }} variant="h6">
                Selecciona Método de Pago:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                fullWidth
                variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
                onClick={() => setMetodoPago("EFECTIVO")}
              >
                Efectivo
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                variant={metodoPago === "DEBITO" ? "contained" : "outlined"}
                onClick={() => setMetodoPago("DEBITO")}
                fullWidth
              >
                Débito
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                variant={metodoPago === "CREDITO" ? "contained" : "outlined"}
                onClick={() => setMetodoPago("CREDITO")}
                fullWidth
              >
                Crédito
              </Button>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={12}>
              <Button
                sx={{ height: "100%" }}
                id={`${metodoPago}-btn`}
                fullWidth
                variant={
                  metodoPago === "CUENTACORRIENTE"
                    ? "contained"
                    : "outlined"
                }
                onClick={() => setMetodoPago("CUENTACORRIENTE")}
              >
                Cuenta Corriente
              </Button>
            </Grid> */}
            <Grid item xs={12} sm={6} md={12}>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "100%" }}
                variant={
                  metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
                }
                onClick={() => {
                  setMetodoPago("TRANSFERENCIA");
                  handleTransferenciaModalOpen(selectedDebts);
                }}
                fullWidth
              >
                Transferencia
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || montoPagado <= 0 || loading}
                onClick={handlePagoBoleta}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} /> Procesando...
                  </>
                ) : (
                  "Pagar"
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={onClose}
        message={snackbarMessage}
      />

      <Dialog
        open={openTransferenciaModal}
        onClose={handleTransferenciaModalClose}
      >
        <DialogTitle>Transferencia</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              {errorTransferenciaError && (
                <p style={{ color: "red" }}> {errorTransferenciaError}</p>
              )}
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Nombre
              </InputLabel>
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa rut sin puntos y con guión
              </InputLabel>
              <TextField
                label="ej: 11111111-1"
                variant="outlined"
                fullWidth
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Banco</InputLabel>
              <TextField
                select
                label="Banco"
                value={selectedBanco}
                onChange={handleBancoChange}
                fullWidth
              >
                {bancosChile.map((banco) => (
                  <MenuItem key={banco.id} value={banco.nombre}>
                    {banco.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Tipo de Cuenta{" "}
              </InputLabel>
              <TextField
                select
                label="Tipo de Cuenta"
                value={tipoCuenta}
                onChange={handleChangeTipoCuenta}
                fullWidth
              >
                {Object.entries(tiposDeCuenta).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Número de Cuenta{" "}
              </InputLabel>
              <TextField
                label="Número de cuenta"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                value={nroCuenta}
                onChange={(e) => setNroCuenta(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Fecha</InputLabel>
              <DatePicker
                label="Selecciona una fecha"
                value={fecha} // Pasa el estado 'fecha' como valor del DatePicker
                onChange={handleDateChange} // Proporciona la función para manejar los cambios de fecha
                renderInput={(params) => <TextField {...params} fullWidth />} // Esto es solo un ejemplo, asegúrate de proporcionar el componente de entrada correcto para renderizar el DatePicker
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ marginBottom: "4%" }}>
                Ingresa Numero Operación
              </InputLabel>
              <TextField
                label="Numero Operación"
                variant="outlined"
                type="number"
                fullWidth
                value={nroOperacion}
                onChange={(e) => setNroOperacion(e.target.value)}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || montoPagado <= 0 || loading}
                onClick={handlePagoBoleta}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} /> Procesando...
                  </>
                ) : (
                  "Pagar"
                )}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTransferenciaModalClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BoxBoleta;
