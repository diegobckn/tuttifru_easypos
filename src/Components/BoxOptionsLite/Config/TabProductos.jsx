import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import TouchInputPage from "../../TouchElements/TouchInputPage";
import ModelConfig from "../../../Models/ModelConfig";
import SmallButton from "../../Elements/SmallButton";
import Sucursal from "../../../Models/Sucursal";
import TiposPasarela from "../../../definitions/TiposPasarela";
import BoxOptionList from "../BoxOptionList";
import InputCheckbox from "../../Elements/Compuestos/InputCheckbox";
import InputCheckboxAutorizar from "../../Elements/Compuestos/InputCheckboxAutorizar";
import BoxBat from "../BoxBat";
import System from "../../../Helpers/System";
import Product from "../../../Models/Product";
import ProductFastSearch from "../../../Models/ProductFastSearch";
import ModosTrabajoConexion from "../../../definitions/ModosConexion";
import OrdenListado from "../../../definitions/OrdenesListado";

const TabProductos = ({
  onFinish = () => { }
}) => {
  const {
    userData,
    salesData,
    sales,
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
    showLoading,
    hideLoading,
    showDialogSelectClient,
    setShowDialogSelectClient,
    modoAvion,
    ultimoVuelto,
    setUltimoVuelto,
    showAlert,
  } = useContext(SelectedOptionsContext);

  const [ordenesMostrarListado, setOrdenesMostrarListado] = useState([])

  const [ordenMostrarListado, setOrdenMostrarListado] = useState(null)
  const [pedirPermisoBorrarProducto, setPedirPermisoBorrarProducto] = useState(false)
  const [permitirVentaPrecio0, setPermitirVentaPrecio0] = useState(false)

  const [agruparProductoLinea, setAgruparProductoLinea] = useState(false)
  const [modoTrabajoConexion, setModoTrabajoConexion] = useState(null)


  const cargarOrdenesListados = () => {
    var seleccionables = []
    const keys = Object.keys(OrdenListado)

    keys.forEach((key, ix) => {
      var idx = OrdenListado[key]
      seleccionables.push({
        id: idx,
        value: key.replaceAll("_", " ")
      })
    })

    setOrdenesMostrarListado(seleccionables)
  }


  const loadConfigSesion = () => {
    // console.log("loadConfigSesion")
    setOrdenMostrarListado(ModelConfig.get("ordenMostrarListado"))
    setPedirPermisoBorrarProducto(ModelConfig.get("pedirPermisoBorrarProducto"))
    setPermitirVentaPrecio0(ModelConfig.get("permitirVentaPrecio0"))
    setAgruparProductoLinea(ModelConfig.get("agruparProductoLinea"))
    setModoTrabajoConexion(ModelConfig.get("modoTrabajoConexion"))

  }

  const handlerSaveAction = () => {
    if (
      !ModelConfig.isEqual("ordenMostrarListado", ordenMostrarListado)
    ) {
      showConfirm("Hay que recargar la pantalla principal para aplicar los cambios. Desea hacerlo ahora?", () => {
        window.location.href = window.location.href
      })
    }

    ModelConfig.change("ordenMostrarListado", ordenMostrarListado)
    ModelConfig.change("pedirPermisoBorrarProducto", pedirPermisoBorrarProducto)
    ModelConfig.change("permitirVentaPrecio0", permitirVentaPrecio0)

    ModelConfig.change("agruparProductoLinea", agruparProductoLinea)
    ModelConfig.change("modoTrabajoConexion", modoTrabajoConexion)

    showMessage("Guardado correctamente")
    // onFinish()
  }

  const descargarProductos = ()=>{
    showLoading("Descargando productos del servidor...")
    Product.getInstance().almacenarParaOffline((prods,resp)=>{
      hideLoading()
      // showAlert("Se descargaron " + prods.length + " productos")
      descargarProductosBusquedaRapida()
    },()=>{
      hideLoading()
      showMessage("No se pudo realizar")
    })
  }

  const descargarProductosBusquedaRapida = ()=>{
    showLoading("Descargando productos del servidor...")
    ProductFastSearch.getInstance().almacenarParaOffline((prods,resp)=>{
      hideLoading()
      showAlert("Descargado correctamente")
    },()=>{
      hideLoading()
      showMessage("No se pudo realizar")
    })
  }

  useEffect(() => {
    loadConfigSesion()
  }, [])



  useEffect(() => {
    cargarOrdenesListados()
  }, [])



  return (
    <Grid container spacing={2}>

      <Grid item xs={12} lg={12}>
        <Typography>Orden Listado Productos</Typography>
        <BoxOptionList
          optionSelected={ordenMostrarListado}
          setOptionSelected={(e) => {
            setOrdenMostrarListado(e)
          }}
          options={ordenesMostrarListado}
        />
      </Grid>


      <Grid item xs={12} md={12} lg={12}>
        <InputCheckboxAutorizar
          inputState={[pedirPermisoBorrarProducto, setPedirPermisoBorrarProducto]}
          label={"Solicitar permiso para eliminar un producto"}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <InputCheckbox
          inputState={[permitirVentaPrecio0, setPermitirVentaPrecio0]}
          label={"Permitir venta con precio 0"}
        />
      </Grid>

      <Grid item xs={12} md={12} lg={12}>
        <InputCheckbox
          inputState={[agruparProductoLinea, setAgruparProductoLinea]}
          label={"Agrupar Producto Linea"}
        />
      </Grid>



      <Grid item xs={12} md={12} lg={12}>
        <label
          style={{
            userSelect: "none",
            fontSize: "19px",
            display: "inline-block",
            margin: "10px 0"
          }}>
          Trabajar con conexion
        </label>
        <BoxOptionList
          optionSelected={modoTrabajoConexion}
          setOptionSelected={setModoTrabajoConexion}
          options={System.arrayIdValueFromObject(ModosTrabajoConexion, true)}
        />
      </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <SmallButton
          isDisabled={modoTrabajoConexion == ModosTrabajoConexion.SOLO_ONLINE}
            textButton={"Descargar productos"}
            actionButton={descargarProductos}
          />
            <br />
            <br />
        </Grid>



      <Grid item xs={12} sm={12} md={12} lg={12}>
        <SmallButton textButton="Reiniciar sistema" actionButton={() => {
          window.location.href = window.location.href
        }} style={{
          backgroundColor: "blueviolet",
          width: "inherit"
        }} />

        <SmallButton textButton="Guardar" actionButton={handlerSaveAction} />
        <SmallButton textButton="Guardar y Salir" actionButton={() => {
          handlerSaveAction()
          setTimeout(() => {
            onFinish()
          }, 300);
        }} />
      </Grid>


    </Grid>
  );
};

export default TabProductos;
