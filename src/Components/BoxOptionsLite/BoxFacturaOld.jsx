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
import System from "../../Helpers/System";
import TecladoPagoCaja from "../Teclados/TecladoPagoCaja"
import BoxSelectPayMethod from "./BoxSelectPayMethod"
import BotonClienteOUsuario from "../ScreenDialog/BotonClienteOUsuario";
import BuscarUsuario from "../ScreenDialog/BuscarUsuario";
import ProductSold from "../../Models/ProductSold";
import Validator from "../../Helpers/Validator";
import SmallButton from "../Elements/SmallButton";
import Client from "../../Models/Client";
import PagoFactura from "../../Models/PagoFactura";

const BoxFactura = ({ 
  onClose,
  openDialog
  }) => {
  const {
    userData,
    salesData,
    addToSalesData,
    setPrecioData,
    grandTotal,
    ventaData,
    setVentaData,
    searchResults,
    // setSearchResults,
    updateSearchResults,
    selectedUser,
    setSelectedUser,
    // selectedCodigoCliente,
    // setSelectedCodigoCliente,
    // selectedCodigoClienteSucursal,
    // setSelectedCodigoClienteSucursal,
    // setSelectedChipIndex,
    // selectedChipIndex,
    searchText,
    setTextSearchProducts,
    clearSalesData,

    cliente,
    setCliente,
    askLastSale,
    setAskLastSale,
    showMessage,
    showConfirm,
    showDialogSelectClient,
    setShowDialogSelectClient

  } = useContext(SelectedOptionsContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para controlar la apertura del Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [metodoPago, setMetodoPago] = useState("EFECTIVO");

  const [montoPagado, setMontoPagado] = useState(0); // Estado para almacenar el monto a pagar
  const [pagarCon, setPagarCon] = useState(grandTotal);
  const [vuelto, setVuelto] = useState(0);
  const [productosConEnvases, setProductosConEnvases] = useState([]);
  
  //para las transferecias
  const [openTransferenciaModal, setOpenTransferenciaModal] = useState(false);
  const [nombre, setNombre] = useState(""); // Estado para almacenar el nombre
  const [rut, setRut] = useState(""); // Estado para almacenar el rut
  const [nroCuenta, setNroCuenta] = useState(""); // Estado para almacenar el número de cuenta
  const [nroOperacion, setNroOperacion] = useState(""); // Estado para almacenar el número de operación
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [errorTransferenciaError, setTransferenciaError] = useState("");
  const tiposDeCuenta = System.getInstance().tiposDeCuenta()

  const bancosChile = System.getInstance().bancosChile();
  const [fecha, setFecha] = useState(dayjs()); // Estado para almacenar la fecha actual

  // Estado para el valor seleccionado del banco
  const [selectedBanco, setSelectedBanco] = useState("");

  const [showSelectClientUser, setShowSelectClientUser] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [showDialogSelectUser, setShowDialogSelectUser] = useState(false);
  
  const [descuentoEnvases, setDescuentoEnvases] = useState(0);

  // Agrega este console.log para verificar el valor de selectedDebts justo antes de abrir el diálogo de transferencia
  
  useEffect(() => {
    checkEnvases()
  }, []);
  
  useEffect(() => {
    if(metodoPago == "EFECTIVO"){

      if(pagarCon>grandTotal + 20000){
        setPagarCon(grandTotal - descuentoEnvases)
        alert("monto incorrecto");
      }

      setVuelto(calcularVuelto());
    }else{
      if(pagarCon>grandTotal){
        setPagarCon(grandTotal - descuentoEnvases)
      }
      setVuelto(0)
    }
  }, [pagarCon]);

  useEffect(() => {
    checkPayMethod()
  }, [metodoPago]);


  useEffect(() => {
    // Calcular el total de los productos seleccionados
    const totalVenta = salesData.reduce(
      (total, producto) => total + producto.precio,
      0
    );
    // Establecer el total como el monto pagado
    setMontoPagado(totalVenta);
  }, [salesData]);


  useEffect(() => {
    setShowDialogSelectUser(false)
    setShowSelectClientUser(false)
    if(usuario != null){
      setCliente(null)
      Client.getInstance().sesion.truncate();
    }
  }, [usuario]);

  useEffect(() => {
    setShowDialogSelectClient(false)
    setShowSelectClientUser(false)
    if(cliente != null){
      setUsuario(null)
    }
  }, [cliente]);

  const checkPayMethod = ()=>{
    if(metodoPago == "EFECTIVO"){
      setVuelto(calcularVuelto());
    }
    else if(metodoPago == "CUENTACORRIENTE"){
      setVuelto(0);
      setPagarCon(grandTotal - descuentoEnvases)

      // if(!cliente && !usuario){
      //   setShowSelectClientUser(true)//mostrar alert
      // }else if(cliente){
      //   console.log(cliente)
      //   showConfirm("Ya esta seleccionado al cliente " + cliente.nombreResponsable + " " + cliente.apellidoResponsable + ", quiere cambiar?", ()=>{
      //     setShowSelectClientUser(true)//mostrar alert
      //   },()=>{

      //   })
      // }else if(usuario){
      //   console.log(usuario)

      //   showConfirm("Ya esta seleccionado el usuario " + usuario.nombres + " " + usuario.apellidos + ", quiere cambiar?", ()=>{
      //     setShowSelectClientUser(true)//mostrar alert
      //   },()=>{

      //   })
      // }
    }else if(metodoPago == "TRANSFERENCIA"){
      handleTransferenciaModalOpen(selectedDebts);
      setVuelto(0);
      setPagarCon(grandTotal - descuentoEnvases)
    }else{
      setVuelto(0);
      setPagarCon(grandTotal - descuentoEnvases)
    }
  }

  const onChangePayMethod = (method)=>{
    if(method == metodoPago){
      checkPayMethod()
    }else{
      setMetodoPago(method);
    }
  }

 


  //fin observers
  const handleChangeTipoCuenta = (event) => {
    setTipoCuenta(event.target.value); // Actualizar el estado del tipo de cuenta seleccionado
  };

  const handleDateChange = (newDate) => {
    setFecha(newDate);
  };

  // Función para manejar el cambio en el selector de banco
  const handleBancoChange = (event) => {
    setSelectedBanco(event.target.value);
  };



  const handleTransferenciaModalOpen = () => {
    setMetodoPago("TRANSFERENCIA"); // Establece el método de pago como "Transferencia"
    setOpenTransferenciaModal(true);
  };
  const handleTransferenciaModalClose = () => {
    setOpenTransferenciaModal(false);
  };


  const handlePagoBoleta = async () => {
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

      // Validar el monto pagado
      if (pagarCon <= 0) {
        setError("Por favor, ingresa un monto válido para el pago.");
        return;
      }
      
      // Validar el método de pago
      if (!metodoPago) {
        setError("Por favor, selecciona un método de pago.");
        return;
      }
      
      // Validar el código de usuario
      if (
        typeof userData.codigoUsuario !== "number" ||
        userData.codigoUsuario <= 0
      ) {
        setError("El código de usuario no es válido.");
        return;
      }

      if (metodoPago == "CUENTACORRIENTE" && (!cliente && !usuario)) {
        abrirDialogCliente()
        // setError("Debe ingresar un cliente o un usuario");
        // alert("Debe ingresar un cliente o un usuario");
        return;
      }
      const requestBody = {
        idUsuario: userData.codigoUsuario,
        codigoClienteSucursal: 0,
        codigoCliente: 0, // despues abajo se cambia si es necesario
        codigoUsuarioVenta: 0, // despues abajo se cambia si es necesario
        total: pagarCon,
        products: productosConEnvases.map((producto) => ({
          codProducto: 0,
          codbarra: (producto.idProducto + ""),
          cantidad: System.getInstance().typeIntFloat(producto.quantity),
          precioUnidad: producto.price,
          descripcion: producto.description,
        })),
        metodoPago: metodoPago,
        transferencias: {
          idCuentaCorrientePago: 0,
          nombre: "",
          rut: userData.rut,
          banco: "",
          tipoCuenta: "",
          nroCuenta: "",
          fecha: System.getInstance().getDateForServer(),
          nroOperacion: "",
        },
      };
      
      if(usuario){
        requestBody.codigoUsuarioVenta = usuario.codigoUsuario
      }else{
        requestBody.codigoCliente = cliente.codigoCliente
      }
      
      var MPago = new PagoFactura();
      MPago.fill(requestBody);
      
      setLoading(true);

      MPago.hacerPagoFactura(requestBody,(response)=>{
        setSnackbarOpen(true);
        showMessage(response.descripcion);
        clearSalesData();
        setSelectedUser(null);
        // setSelectedChipIndex([]);
        // setSearchResults([]);
        // setSelectedCodigoCliente(0);
        setTextSearchProducts("")
        handleTransferenciaModalClose();
        setCliente(null)

        setTimeout(() => {
          onClose();
          //alert("Pago realizado correctamente");
          setLoading(false);
        }, 1000);
      }, (error)=>{
        console.error("Error al realizar el pago:", error);
        setError("Error al realizar el pago");
        setLoading(false);
      })
  };

  const calcularVuelto = () => {
    const cambio = pagarCon - grandTotal;
    return cambio > 0 ? cambio : 0;
  };

  const abrirDialogCliente = ()=>{
    setAskLastSale(false)
    setShowDialogSelectClient(true)
  }

  const updateDescuentosEnvases = (productos)=>{
    var descuentos = 0
    productos.forEach((pro)=>{
      if(pro.isEnvase){
        descuentos += pro.total
      }
    })
    setDescuentoEnvases(descuentos)
  }

  const checkEnvases = ()=>{
    var tieneAlguno = false
    var descuentosDeEnvases = 0

    var copiaSales = JSON.parse(JSON.stringify(salesData))
    
    copiaSales.forEach((pro)=>{
      if(pro.isEnvase){
        tieneAlguno = true
        // pro.quantity = 0
        // pro.updateSubtotal()
        descuentosDeEnvases += pro.total
      }
    })

    setProductosConEnvases(copiaSales)
    setDescuentoEnvases(descuentosDeEnvases)
    setPagarCon(grandTotal - descuentosDeEnvases)
  }

  const changeQuantityIfEnvase = (prod, index ,newQuantity) => {
    if(!prod.isEnvase) return
    if(newQuantity !==0 && !Validator.isCantidad(newQuantity))return false

    const orig = ProductSold.getOwnerByEnvase(prod, productosConEnvases)
    if(newQuantity> orig.quantity || newQuantity<0) {
      return
    }

    const prods = productosConEnvases
    var stSold = ProductSold.getInstance()
    prods[index].quantity = newQuantity
    stSold.fill(prods[index])
    prods[index].total = stSold.getSubTotal()

    setProductosConEnvases(prods)
    updateDescuentosEnvases(prods)
  }

  return (
    <>

    <BotonClienteOUsuario
    setOpenDialog={setShowSelectClientUser}
    openDialog={showSelectClientUser}
    onSelect={(opcion)=>{
      if(opcion == "cliente"){
        abrirDialogCliente()
      }else{
        setShowDialogSelectUser(true)
      }
    }}
    />

    <BuscarUsuario
      setOpenDialog={setShowDialogSelectUser}
      openDialog={showDialogSelectUser}
      onSelect={(usuario)=>{
        setUsuario(usuario)
      }}
    />
      <Grid container spacing={2} style={{
        maxWidth: "inherit",
        maxHeight: "inherit",
      }}>

        <Grid item xs={12} md={5} lg={5} style={{
          textAlign:"right",
          maxWidth: "inherit",
          maxHeight: "inherit",
        }}>
          {error && (
            <Grid item xs={12}>
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            </Grid>
          )}

          <Typography style={{
            color:"rgb(225, 33, 59)",
            fontSize: "25px",
            fontWeight: "bold",
            fontFamily: "Victor Mono"
            }}>
            Total: $
            {grandTotal - descuentoEnvases}
          </Typography>
          
          <TextField
            margin="dense"
            fullWidth
            label="Pagar con"
            value={pagarCon || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!value.trim()) {
                setPagarCon(0);
                
              } else {
                if(parseFloat(value)>0){
                  setPagarCon(parseFloat(value));
                }
              }
            }}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />

            <div style={{height:"25px"}}>
            {/* {verVuelto && ( */}
              <Typography style={{color:"green"}}>
                Vuelto: 
                {vuelto > 0 ? "$" + vuelto : 'sin vuelto'}
              </Typography>

              {/* <Typography style={{color:"green"}}>
                descuentos: 
                ${descuentoEnvases}
              </Typography> */}

              {/* )} */}
          </div>
          


          {/* <TextField
            margin="dense"
            fullWidth
            type="number"
            label="Por pagar"
            value={Math.max(0, grandTotal - pagarCon)}
            InputProps={{ readOnly: true }}
          /> */}
          
          <table width="100%" cellPadding={5} cellSpacing={0} style={{
            border:"2px solid #1b1b1ba3"
          }}>
            <tbody>

              {productosConEnvases.map((prod, index) => {
                if(prod.isEnvase){
                  const original = ProductSold.getOwnerByEnvase(prod, productosConEnvases)
                return(
                  <tr key={index} style={{
                    backgroundColor:(index  % 2 == 0 ? "#f3f3f3" : "#dfdfdf")
                  }}>
                    <td>
                    <Typography
                      style={{
                        width: "60px",
                        height: "60px",
                        border:"1px solid #a09797",
                        borderRadius:"5px",
                        alignContent:"center",
                        backgroundColor:"#f5f5f5",
                        textAlign:"center"
                      }}
                      >{prod.quantity === 0 ? "0" : prod.quantity}</Typography>
                      </td>
                      <td style={{textAlign:"left"}}>
                        <SmallButton style={{
                          height:"45px",
                          width:"45px",
                          backgroundColor:"#6c6ce7",
                          fontSize:"25px",
                          margin:"0",

                          color:"white"
                        }}
                        withDelay={false}
                        actionButton={()=>{
                          changeQuantityIfEnvase(prod,index,prod.quantity-1)
                        }}
                        textButton={"-"} />
                      </td>
                      <td style={{textAlign:"left"}}>
                        <SmallButton style={{
                          height:"45px",
                          width:"45px",
                          backgroundColor:"#6c6ce7",
                          fontSize:"25px",
                          margin:"0",
                          color:"white"
                        }}
                        withDelay={false}
                        actionButton={()=>{
                          changeQuantityIfEnvase(prod,index,prod.quantity+1)
                        }}
                        textButton={"+"} />
                      </td>
                      
                      <td style={{textAlign:"left"}}>
                    <Typography>{prod.description}</Typography>
                      </td>
                      <td>
                      ${System.getInstance().en2Decimales(prod.total)}
                      </td>
                  </tr>
                )
                }
              }
            )}
            </tbody>
          </table>
        </Grid>


        <Grid item xs={12} md={7} lg={7} style={{
          maxWidth: "inherit",
          maxHeight: "inherit",
        }}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
            style={{
              maxWidth: "inherit",
          maxHeight: "inherit",
            }}
          >

        <TecladoPagoCaja 
          showFlag={true} 
          varValue={pagarCon} 
          varChanger={setPagarCon} 
          
          onEnter={()=>{
            
          }}
          />
          <div style={{
            height:"100px"
          }}></div>
            
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Button
                sx={{ height: "100%" }}
                variant="contained"
                fullWidth
                color="secondary"
                disabled={!metodoPago || pagarCon <= 0 || loading}
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









        <Grid item xs={12} md={12} lg={12}>
          <BoxSelectPayMethod metodoPago={metodoPago} onChange={onChangePayMethod}/>
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

export default BoxFactura;
