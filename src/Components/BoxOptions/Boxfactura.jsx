import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Avatar,
  Box,
  Grid,
  Stack,
  InputLabel,
  Typography,
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
const Boxfactura = ({ onClose }) => {
  const {
    userData,
    ventaData,
    grandTotal,
    clearSalesData,
    salesData,
    setVentaData,
    searchResults,
    selectedCodigoCliente,
    selectedCodigoClienteSucursal,
  } = useContext(SelectedOptionsContext);
  const [cantidadPagada, setCantidadPagada] = useState(0);

  const [loading, setLoading] = useState(false);

  const [metodoPago, setMetodoPago] = useState("");
  const [error, setError] = useState(null);
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
  console.log("salesData:", salesData);
  console.log("searchResults FACTURA:", searchResults);
  // const [clienteDatosFactura, setClienteDatosFactura] = useState({
  //   rut: searchResults[0].rutResponsable,
  //   razonSocial: searchResults[0].razonSocial,
  //   nombre: searchResults[0].nombreResponsable,
  //   apellido: searchResults[0].apellidoResponsable,
  //   direccion: searchResults[0].direccion,
  //   region: searchResults[0].region,
  //   comuna: searchResults[0].comuna,
  //   giro: searchResults[0].giro,
  // });

  useEffect(() => {
    // Calcular el total de los productos seleccionados
    const totalVenta = salesData.reduce(
      (total, producto) => total + producto.precio,
      0
    );
    // Establecer el total como el monto pagado
    setCantidadPagada(totalVenta);
  }, [salesData]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleTransferenciaModalOpen = () => {
    setMetodoPago("Transferencia"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
   
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };

  // const handleGenerarTicket = async () => {
  //   try {
  //     if (metodoPago === "TRANSFERENCIA" && !transferenciaExitosa) {
  //       // Si el método de pago es transferencia y la transferencia no ha sido exitosa,
  //       // entonces no procesar el pago y mostrar un mensaje de error
  //       setError(
  //         "Por favor, complete la transferencia correctamente antes de generar el ticket."
  //       );
  //       return;
  //     }

  //     if (grandTotal === 0) {
  //       setError(
  //         "No se puede generar el ticket de pago porque el total a pagar es cero."
  //       );
  //       return;
  //     }

  //     if (isNaN(cantidadPagada) || cantidadPagada < 0) {
  //       setError("Por favor, ingresa una cantidad pagada válida.");
  //       return;
  //     }

  //     const codigoClienteSucursal = searchResults[0].codigoClienteSucursal;
  //     const codigoCliente = searchResults[0].codigoCliente;

  //     const ticket = {
  //       idUsuario: userData.codigoUsuario,
  //       codigoClienteSucursal: codigoClienteSucursal,
  //       codigoCliente: codigoCliente,
  //       total: grandTotal,
  //       products: salesData.map((sale) => ({
  //         codProducto: sale.idProducto,
  //         cantidad: sale.quantity,
  //         precioUnidad: sale.precio,
  //         descripcion: sale.descripcion,
  //       })),
  //       metodoPago: metodoPago,
  //       transferencias: {
  //         nombre: nombre,
  //         rut: rut,
  //         banco: selectedBanco,
  //         tipoCuenta: tipoCuenta,
  //         nroCuenta: nroCuenta,
  //         fecha: fecha,
  //         nroOperacion: nroOperacion,
  //       },
  //     };

  //     console.log("Datos enviados por Axios:", ticket);
  //     const response = await axios.post(
  //       "https://www.easyposdev.somee.com/api/Ventas/RedelcomImprimirTicket",
  //       ticket
  //     );

  //     console.log("Respuesta del servidor:", response.data);
  //     if (response.status === 200) {
  //       setSnackbarMessage(response.data.descripcion);
  //       setSnackbarOpen(true);
  //       setSearchResults([]);
  //       clearSalesData();
  //       setTransferenciaExitosa(true);

  //       // Esperar 4 segundos antes de cerrar el modal
  //       setTimeout(() => {
  //         onCloseTicket();
  //       }, 3000);
  //     }
  //     console.log(
  //       "Información TICKET al servidor en:",
  //       new Date().toLocaleString()
  //     );
  //   } catch (error) {
  //     console.error("Error al generar la boleta electrónica:", error);
  //     setError("Error al generar la boleta electrónica.");
  //   }
  // };

  const handlePagoFactura = async () => {
    try {
      const pagoFactura = {
        idUsuario: userData.codigoUsuario,
        codigoClienteSucursal: selectedCodigoClienteSucursal,
        codigoCliente: selectedCodigoCliente,
        total: grandTotal,
        products: salesData.map((producto) => ({
          codProducto: producto.idProducto,
          cantidad: producto.quantity,
          precioUnidad: producto.precio,
          descripcion: producto.descripcion,
        })),
        metodoPago: metodoPago,
        clienteDatosFactura: {
          rut: searchResults[0].rutResponsable,
          razonSocial: searchResults[0].razonSocial,
          nombre: searchResults[0].nombreResponsable,
          apellido: searchResults[0].apellidoResponsable,
          direccion: searchResults[0].direccion,
          region: searchResults[0].region,
          comuna: searchResults[0].comuna,
          giro: searchResults[0].giro,
        },
      };

      console.log("Datos Factura antes de enviar la solicitud:", pagoFactura);

      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/GestionDTE/GenerarFacturaDTE",
        pagoFactura
      );
      if (response.status === 200) {
        setSnackbarMessage("Factura guardada exitosamente");
        setSnackbarOpen(true);
        setTimeout(() => {
          onClose(); ////Cierre Modal al finalizar
        }, 2000);
        clearSalesData();
      }

      console.log("Datos después de enviar la solicitud:", response.data);
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setSnackbarMessage("Error en el proceso");
    }
  };
  const handleMetodoPagoClick = (metodo) => {
    setSelectedMethod(metodo);
  };
 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleTransferData = async (
    
   
    metodoPago,
    transferencias
  ) => {
    try {
      console.log("Datos de transferencia:");
      console.log("Monto pagado:", grandTotal);
      console.log("Método de pago:", metodoPago);
      console.log("Datos de transferencia:", transferencias);
      console.log("Tipo de selectedDebts:", typeof selectedDebts);

      // Convertir selectedDebts en un array de valores
      const selectedDebtsArray = Object.values(selectedDebts);

      // Iterar sobre el array selectedDebtsArray
      for (const deuda of selectedDebtsArray) {
        console.log("Deuda seleccionada:");
        console.log("ID de la deuda:", deuda.id);
        console.log("ID de la cabecera:", deuda.idCabecera);
        console.log("Total de la deuda:", deuda.total);

        const requestBody = {
          deudaIds: [
            {
              idCuentaCorriente: deuda.id,
              idCabecera: deuda.idCabecera,
              total:  grandTotal,
            },
          ],
          cantidadPagada: grandTotal,
          metodoPago: metodoPago,
          idUsuario: userData.codigoUsuario,
          transferencias: {
            // idCuentaCorrientePago: 0,
            nombre: nombre,
            rut: rut,
            banco: banco,
            tipoCuenta: tipoCuenta,
            nroCuenta: nroCuenta,
            fecha: fecha,
            nroOperacion: nroOperacion,
          },
        };

        console.log("Datos de la solicitud antes de enviarla:");
        console.log(requestBody);

        // Aquí realizamos la llamada POST para cada deuda
        const response = await axios.post(
          "https://www.easyposdev.somee.com/api/Clientes/PostClientePagarDeudaTransferenciaByIdCliente",
          requestBody
        );

        if (response.status === 200) {
          console.log("Transferencia realizada con éxito");
          setSnackbarMessage(response.data.descripcion);
          setSnackbarOpen(true);

          setSearchResults([]);

          clearSalesData();

          setTimeout(() => {
            handleClosePaymentDialog(true);
            handleTransferenciaModalClose(true);
            onClose(); ////Cierre Modal al finalizar
          }, 3000);
        } else {
          console.error("Error al realizar la transferencia");
        }
      }
    } catch (error) {
      console.error("Error al realizar la transferencia:", error);
    }
  };
  const calcularVuelto = () => {
    const cambio = cantidadPagada - grandTotal;
    return cambio > 0 ? cambio : 0;
  };
  return (
    <Grid container spacing={2}>
    <Grid item xs={12} md={6} lg={6}>
      <Typography variant="h4">Pagar Factura</Typography>
  
      {error && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Grid>
      )}
      <TextField
        margin="dense"
        fullWidth
        label="Monto a Pagar"
        variant="outlined"
        value={grandTotal}
        InputProps={{ readOnly: true }}
        onChange={(e) => setCantidadPagada(e.target.value)}
      />
      <TextField
        margin="dense"
        fullWidth
        type="number"
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
  
    <Grid item xs={12} sm={12} md={6}>
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Typography sx={{ marginTop: "7%" }} variant="h6">
            Selecciona Método de Pago:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            sx={{ height: "100%" }}
            fullWidth
            variant={metodoPago === "Efectivo" ? "contained" : "outlined"}
            onClick={() => setMetodoPago("Efectivo")}
          >
            Efectivo
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            sx={{ height: "100%" }}
            variant={
              metodoPago === "Tarjeta Débito" ? "contained" : "outlined"
            }
            onClick={() => setMetodoPago("Tarjeta Débito")}
            fullWidth
          >
            Débito
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            sx={{ height: "100%" }}
            variant={
              metodoPago === "Tarjeta Crédito" ? "contained" : "outlined"
            }
            onClick={() => setMetodoPago("Tarjeta Crédito")}
            fullWidth
          >
            Crédito
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            sx={{ height: "100%" }}
            variant={
              metodoPago === "Transferencia" ? "contained" : "outlined"
            }
            onClick={() => handleTransferenciaModalOpen(selectedDebts)}
            fullWidth
          >
            Transferencia
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
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
            </Grid>
      </Grid>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        disabled={!metodoPago || cantidadPagada <= 0}
        onClick={handlePagoFactura}
      >
        Pagar
      </Button>
    </Grid>
  
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
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
                disabled={!metodoPago || cantidadPagada <= 0 || loading}
                onClick={handlePagoFactura }
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
        <Button
          onClick={() => {
            if (
              !nombre ||
              !rut ||
              !selectedBanco ||
              !tipoCuenta ||
              !nroCuenta ||
              !fecha ||
              !nroOperacion
            ) {
              setTransferenciaError(
                "Por favor complete todos los campos obligatorios."
              );
              return;
            }
            handleTransferData(selectedDebts, cantidadPagada, metodoPago, {
              nombre: nombre,
              rut: rut,
              banco: selectedBanco,
              tipoCuenta: tipoCuenta,
              nroCuenta: nroCuenta,
              fecha: fecha,
              nroOperacion: nroOperacion,
            });
          }}
          variant="contained"
          color="secondary"
        >
          Guardar Datos Transferencia
        </Button>
      </DialogActions>
    </Dialog>
  </Grid>
  
  );
};

export default Boxfactura;
