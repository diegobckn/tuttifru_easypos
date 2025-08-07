import React, { useContext, useState, useEffect } from "react";
import {
  Paper,
  Avatar,
  Box,
  Grid,
  Stack,
  Typography,
  Snackbar,
  InputLabel,
  Button,
  Table,
  TableBody,
  CircularProgress,
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
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const BoxCtaCorriente = ({ onClose }) => {
  const {
    userData,
    precioData,
    grandTotal,
    searchResults,
    setSearchResults,
    setPrecioData,
    clearSalesData,
    selectedUser,
    setSelectedUser,

    ventaData,
    setVentaData,
    selectedCodigoCliente,
    setSelectedCodigoCliente,
    selectedCodigoClienteSucursal,

    setSelectedChipIndex,
    selectedChipIndex,
    searchText,
    setSearchText,
  } = useContext(SelectedOptionsContext);

  const fetchDeudaData = async () => {
    try {
      const response = await axios.get(
        `https://www.easyposdev.somee.com/api/Clientes/GetClientesDeudasByIdCliente?codigoClienteSucursal=${selectedCodigoClienteSucursal}&codigoCliente=${selectedCodigoCliente}`
      );

      console.log("Nuevas Deudas:", response.data);

      setVentaData(response.data.clienteDeuda);
    } catch (error) {
      console.error("Error al obtener los nuevos DEUDAS:", error);
    }
  };
  useEffect(() => {
    fetchDeudaData();
  }, [searchResults]);

  const [errorTransferenciaError, setTransferenciaError] = useState("");
  const [cantidadPagada, setCantidadPagada] = useState(grandTotal);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [metodoPago, setMetodoPago] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [tipoCuenta, setTipoCuenta] = useState(""); // Estado para almacenar el tipo de cuenta seleccionado
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

  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
    setMontoPagado(getTotalSelected());
  };

  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  const handleSelectAll = () => {
    // Invertir el estado de selección de todas las deudas
    setSelectAll(!selectAll);
    // Actualizar el estado de selección de cada deuda en ventaData
    const updatedVentaData = ventaData.map((deuda) => ({
      ...deuda,
      selected: !selectAll,
    }));
    setVentaData(updatedVentaData);
  };
  /////revisar si este codigo  
  const getTotalSelected = () => {
    let totalSelected = 0;
    ventaData.forEach((deuda) => {
      if (deuda.selected) {
        totalSelected += deuda.total;
      }
    });
    return totalSelected;
  };

  const totalDeuda = ventaData
    ? ventaData.reduce((total, deuda) => total + deuda.total, 0)
    : 0;

  const handleOpenPaymentDialog = (selectedDebts) => {
    setOpenDialog(true);
    setSelectedDebts(ventaData.filter((deuda) => deuda.selected));

    setMontoPagado(getTotalSelected());
  };
  const handleCheckboxChange = (index) => {
    const updatedVentaData = [...ventaData];
    updatedVentaData[index].selected = !updatedVentaData[index].selected;
    setVentaData(updatedVentaData);

    // Identificar todos los objetos seleccionados
    const selectedDebts = updatedVentaData.filter((deuda) => deuda.selected);
    setSelectedDebts(selectedDebts);
    // Mostrar los datos seleccionados en la consola
    console.log("Datos seleccionados por checkbox:", selectedDebts);
  };

  const handleClosePaymentDialog = () => {
    setOpenDialog(false);

    setMontoPagado(0); // Reiniciar el valor del monto a pagar al cerrar el diálogo
    setMetodoPago("");
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
  const handlePayment = async () => {
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
      if (selectedDebts.length === 0) {
        setError(
          "Por favor, selecciona al menos una deuda para realizar el pago."
        );
        return;
      }

      setLoading(true);

      let endpoint =
        "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaByIdCliente";

      // Si el método de pago es TRANSFERENCIA, cambiar el endpoint y agregar datos de transferencia
      if (metodoPago === "TRANSFERENCIA") {
        endpoint =
          "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaTransferenciaByIdCliente";

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
      if (!montoPagado || montoPagado <= 0) {
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
        deudaIds: selectedDebts.map((deuda) => ({
          idCuentaCorriente: deuda.id,
          idCabecera: deuda.idCabecera,
          total: deuda.total,
        })),
        montoPagado: grandTotal,
        metodoPago: metodoPago,
        idUsuario: userData.codigoUsuario,
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
         setSearchText(""), 
         handleClosePaymentDialog();
         handleTransferenciaModalClose();
         onClose();

        // setTimeout(() => {
          
        //   onClose();
        // }, 1000);
      } else {
        console.error("Error al realizar el pago");
      }
    } catch (error) {
      console.error("Error al realizar el pago:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString("es-CL");
  };
  const calcularVuelto = () => {
    const cambio = cantidadPagada - grandTotal;
    return cambio > 0 ? cambio : 0;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Cuenta Corriente
        </Typography>
      </Grid>
      {/* precioData &&
         precioData.clientesProductoPrecioMostrar &&  */}
      {searchResults && searchResults.length > 0 && selectedUser && (
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
                    {selectedUser.nombreResponsable}
                    {""} {selectedUser.apellidoResponsable}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
     <Grid item xs={12}>
  {ventaData && ventaData.length > 0 && (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Folio</TableCell>
            <TableCell>Pago Parcial</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Total</TableCell>
            {/* <TableCell>Acciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Ordenar ventaData por fecha ascendente */}
          {ventaData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).map((deuda, index) => (
            <TableRow key={deuda.id}>
              <TableCell>
                <Checkbox
                  checked={deuda.selected || false}
                  onChange={() => handleCheckboxChange(index)}
                  color="primary"
                />
              </TableCell>
              <TableCell>{deuda.descripcionComprobante}</TableCell>
              <TableCell>{deuda.nroComprobante}</TableCell>
              <TableCell>${deuda.totalPagadoParcial}</TableCell>
              <TableCell sx={{ width: 1 }}>
                {formatFecha(deuda.fecha)}
              </TableCell>

              <TableCell>${deuda.total}</TableCell>
              <TableCell sx={{ display: "none" }}>
                ${deuda.idCabecera}
              </TableCell>

              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableRow>
          <TableCell colSpan={3} align="right">
            <Typography> Total Deuda : ${totalDeuda}</Typography>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell colSpan={3} align="right">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenPaymentDialog}
              disabled={getTotalSelected() === 0}
            >
              Pagar Total Seleccionado (${getTotalSelected()})
            </Button>
          </TableCell>

          <TableCell></TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  )}
</Grid>

      <Dialog open={openDialog} onClose={handleClosePaymentDialog}>
        <DialogTitle>Pagar Deuda </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} item xs={12} md={12} lg={6}>
            <Grid item xs={12} md={6} lg={6}>
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

            {/* <Typography variant="body1">Monto a Pagar:</Typography> */}

            <Grid
              container
              spacing={2}
              item
              sm={12}
              md={6}
              lg={12}
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              {" "}
              <Typography sx={{ marginTop: "7%" }} variant="h6">
                Selecciona Método de Pago:
              </Typography>
              <Grid item  xs={12} sm={12} md={12}>
                <Button
                  sx={{ height: "100%" }}
                  id="efectivo-btn"
                  fullWidth
                  variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
                  onClick={() => setMetodoPago("EFECTIVO")}
                >
                  Efectivo
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  sx={{ height: "100%" }}
                  id="debito-btn"
                  variant={metodoPago === "DEBITO" ? "contained" : "outlined"}
                  onClick={() => setMetodoPago("DEBITO")}
                  fullWidth
                >
                  Débito
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  sx={{ height: "100%" }}
                  id="credito-btn"
                  variant={metodoPago === "CREDITO" ? "contained" : "outlined"}
                  onClick={() => setMetodoPago("CREDITO")}
                  fullWidth
                >
                  Crédito
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Button
                  fullWidth
                  sx={{ height: "100%" }}
                  id="transferencia-btn"
                  variant={
                    metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
                  }
                  onClick={() => handleTransferenciaModalOpen(selectedDebts)}
                >
                  Transferencia
                </Button>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Button
                  sx={{ height: "100%" }}
                  variant="contained"
                  fullWidth
                  color="secondary"
                  disabled={!metodoPago || montoPagado <= 0}
                  onClick={handlePayment}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>Cerrar</Button>

          {/* <Button
            onClick={handleTransferData}
            variant="contained"
            color="secondary"
          >
            Pagarr
          </Button> */}
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
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
                onClick={handlePayment}
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
    </Grid>
  );
};

export default BoxCtaCorriente;
