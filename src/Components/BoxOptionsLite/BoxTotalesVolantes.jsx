import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  TableContainer,
  Grid,
  Container,
  useTheme,
  useMediaQuery,

  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import TicketPreventa from "../../Models/TicketPreventa"
import ScreenTicketPreventa from "../ScreenDialog/TicketPreventa";
import Printer from "../../Models/Printer";
import ModelConfig from "../../Models/ModelConfig";
import LastSale from "../../Models/LastSale";

import UltimaVenta from "../ScreenDialog/UltimaVenta";
import FlatButton from "../Elements/FlatButton";
import BusquedaRapida from "../ScreenDialog/BusquedaRapida";
import TecladoNumerico from "../Teclados/TecladoNumerico";
import TecladoNumeros from "../Teclados/TecladoNumeros";


const BoxTotalesVolantes = () => {
  const {
    userData,
    salesData,
    sales,
    cliente,
    clearSessionData,
    clearSalesData,
    grandTotal,
    getUserData,
    showMessage,
    showAlert,
    setSelectedUser,
    setTextSearchProducts,
    textSearchProducts,
    showLoading,
    hideLoading,
    searchInputRef,
    showConfirm,
    setBuscarCodigoProducto,
  } = useContext(SelectedOptionsContext);
  const [vendedor, setVendedor] = useState(null);
  const [recargos, setRecargos] = useState(0);
  const [descuentos, setDescuentos] = useState(0);

  const [showScreenGenerarTicket, setShowScreenGenerarTicket] = useState(false)
  const [showScreenLastSale, setShowScreenLastSale] = useState(false)

  const [showFastSearchDialog, setShowFastSearchDialog] = useState(false);

  const focusSearchInput = () => {
    System.intentarFoco(searchInputRef)
  }

  const onTicketClick = () => {
    if (!userData) {
      showAlert("Seleccionar usuario")
      return
    }

    showLoading("Generando ticket...")
    const requestBody = {
      idUsuario: userData.codigoUsuario,
      fechaIngreso: System.getInstance().getDateForServer(),
      idCabecera: 0,
      codigoClienteSucursal: 0,
      codigoCliente: 0, // despues abajo se cambia si es necesario
      codigoUsuarioVenta: userData.codigoUsuario, // despues abajo se cambia si es necesario
      total: grandTotal,
      products: salesData.map((producto) => ({
        codProducto: 0,
        codbarra: producto.idProducto + "",
        cantidad: System.getInstance().typeIntFloat(producto.quantity),
        precioUnidad: producto.price,
        descripcion: producto.description,
        costo: producto.precioCosto ?? 0,
      })),
      metodoPago: "",
    };

    if (cliente) {
      requestBody.codigoCliente = cliente.codigoCliente
      requestBody.codigoClienteSucursal = cliente.codigoClienteSucursal
    }

    LastSale.prepare(requestBody)

    var MTicket = new TicketPreventa();
    MTicket.fill(requestBody);

    MTicket.hacerTicket(requestBody, (response) => {

      showMessage(response.descripcion ?? 'Realizado correctamente');
      clearSalesData();
      setSelectedUser(null);
      hideLoading()

      LastSale.confirm(response)

      const cantAImprimir = parseInt(ModelConfig.get("cantidadTicketImprimir"))
      Printer.printAll(response, cantAImprimir)
      setTextSearchProducts("")
      focusSearchInput()
    }, (error) => {
      console.error("Error al realizar el ticket:", error);
      showMessage("Error al realizar el ticket");
      hideLoading()

      focusSearchInput()
    })
  }

  return (
    <Paper
      elevation={3}
      style={{
        backgroundColor: "rgb(188 188 188)",
        padding: "0px",
        width: "100%",
        marginTop: "20px"
      }}
    >

      <Grid container spacing={2} >
        <Grid item xs={12} sm={12} md={12} lg={12}
          sx={{
            margin: "6px auto",
            color: "#E1213B",
            width: "80%",
            padding: "10px 0 !important",
            maxWidth: "80% !important",
            borderRadius: "5px",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              color: "rgb(225, 33, 59)",
              fontSize: "36px",
              fontFamily: "Victor Mono",
              fontWeight: "700",
              justifyContent: "center",
            }}
          >
            TOTAL: ${System.getInstance().en2Decimales(grandTotal)}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} sx={{ marginTop: "6px" }}>
          <Button
            sx={{
              width: "50%",
              marginLeft: "25%",
              height: "40px",
              backgroundColor: "transparent",
              color: "black",
              borderRadius: "0",
              "&:hover": {
                border: "1px solid black",
                color: "black",
                backgroundColor: "#D6D5D1 ",
              },
            }}
            onClick={() => {
              setShowScreenLastSale(true)
            }}
          >
            <Typography variant="h7">Reimprimir ticket</Typography>
          </Button>

          <UltimaVenta
            openDialog={showScreenLastSale}
            setOpenDialog={(val) => {
              if (!val) {
                focusSearchInput()
              }
              setShowScreenLastSale(val)
            }}
          />
        </Grid>
      </Grid>

      <Grid container style={{
        backgroundColor: "#859398",
        marginTop: 10
      }}>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Button
            sx={{
              width: "100%",
              height: "80px",
              backgroundColor: "#ffb266",
              border: "1px solid black",
              borderRadius: "0",
              color: "black",
              "&:hover": {
                backgroundColor: "#1c1b17 ",
                color: "white",
              },
            }}
            onClick={() => {

              if (salesData.length < 1) {
                showMessage("El listado esta vacio")
                focusSearchInput()
                return
              }


              onTicketClick()

            }}
          >
            <Typography variant="h7">Ticket</Typography>
          </Button>
        </Grid>

        <ScreenTicketPreventa
          openDialog={showScreenGenerarTicket}
          setOpenDialog={setShowScreenGenerarTicket}
        />

        <br />
        <br />
        <br />
        <br />
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <TecladoNumeros
            flat={true}
            showFlag={true}
            withLateralEnter={true}
            varValue={textSearchProducts}
            varChanger={setTextSearchProducts}
            onEnter={() => {
              setBuscarCodigoProducto(true)
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <br />
        </Grid>

      </Grid>



    </Paper>
  );
};

export default BoxTotalesVolantes;
