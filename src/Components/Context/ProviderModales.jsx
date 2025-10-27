import React, { useState, useEffect, useMemo, useRef } from "react";
import ModelConfig from "../../Models/ModelConfig";
import User from "../../Models/User";
import Sale from "../../Models/Sale";
import ModelSales from "../../Models/Sales";
import ProductSold from "../../Models/ProductSold";
import LoadingDialog from "../Dialogs/LoadingDialog";
import AsignarPrecio from "../ScreenDialog/AsignarPrecio";

import TecladoAlfaNumerico from "../Teclados/TecladoAlfaNumerico";

import QRCode from "react-qr-code";
import ReactDOM from "react-dom/server";

import {
  Typography,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import Product from "../../Models/Product";
import System from "../../Helpers/System";
import NuevoProductoExpress from "../ScreenDialog/NuevoProductoExpress";
import AsignarPeso from "../ScreenDialog/AsignarPeso";
import Confirm from "../Dialogs/Confirm";
import Client from "../../Models/Client";
import Alert from "../Dialogs/Alert";
import PedirSupervision from "../ScreenDialog/PedirSupervision";
import UserEvent from "../../Models/UserEvent";
import ScreenDialogBuscarCliente from "../ScreenDialog/BuscarCliente";
import Log from "../../Models/Log";
import SalesOffline from "../../Models/SalesOffline";
import Model from "../../Models/Model";

export const ProviderModalesContext = React.createContext();

export const ProviderModales = ({ children }) => {
  //init configs values

  const [showAsignarPeso, setShowAsignarPeso] = useState(false)
  const [productoSinPeso, setProductoSinPeso] = useState(null)
  const [onConfirmAsignWeight, setonAsignWeight] = useState(null)

  const [showNuevoExpress, setShowNuevoExpress] = useState(false)
  const [codigoNuevoExpress, setCodigoNuevoExpress] = useState(0)
  const [handleNuevoProducto, setHandleGuardarNuevoProducto] = useState(null)


  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [textConfirm, setTextConfirm] = useState("")
  const [handleConfirm, setHandleConfirm] = useState(null)
  const [handleNotConfirm, setHandleNotConfirm] = useState(null)

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("")

  const [showAlertDialog, setShowAlert] = useState(false)
  const [titleMsg, setTitleMsg] = useState("")
  const [textMsg, setTextMsg] = useState("")

  const [showDialogSelectClientModal, setShowDialogSelectClientModal] = useState(false)
  const [clienteModal, setClienteModal] = useState(null)
  const [askLastSaleModal, setAskLastSaleModal] = useState(true)
  const [addToSalesDataModal, setAddToSalesDataModal] = useState(null)

  const [verPedirSupervision, setVerPedirSupervision] = useState(false)
  const [accionPedirSupervision, setAccionPedirSupervision] = useState("")
  const [handleConfirmarSupervision, setHandleConfirmarSupervision] = useState(null)
  const [datosConfirmarSupervision, setDatosConfirmarSupervision] = useState({})

  useEffect(() => {
    if (!showConfirmDialog) {
      setTextConfirm("")
    }
  }, [showConfirmDialog])

  useEffect(() => {
    if (!showAsignarPeso) {
      setProductoSinPeso(null)
    }
  }, [showAsignarPeso])

  useEffect(() => {
    if (!showAlertDialog) {
      setTextMsg("")
    }
  }, [showAlertDialog])


  const pedirSupervision = (accion, callbackOk, datos) => {
    const us = User.getInstance().getFromSesion()

    if (us === null) {
      setTitleMsg("Debe iniciar sesion para realizar esta operacion")
      setShowAlert(true)
      return
    }

    setAccionPedirSupervision(accion)
    setDatosConfirmarSupervision(datos)
    setHandleConfirmarSupervision(() => callbackOk)
    setVerPedirSupervision(true)
  }

  const GeneralElements2 = () => {
    return (
      <>
        <ScreenDialogBuscarCliente
          openDialog={showDialogSelectClientModal}
          setOpenDialog={setShowDialogSelectClientModal}
          setCliente={setClienteModal}
          askLastSale={askLastSaleModal}
          addToSalesData={addToSalesDataModal}
        />

        <AsignarPeso
          openDialog={showAsignarPeso}
          setOpenDialog={setShowAsignarPeso}
          product={productoSinPeso}
          onAsignWeight={onConfirmAsignWeight}
        />

        <Confirm
          openDialog={showConfirmDialog}
          setOpenDialog={setShowConfirmDialog}
          textConfirm={textConfirm}
          handleConfirm={handleConfirm}
          handleNotConfirm={handleNotConfirm}
        />

        <NuevoProductoExpress
          openDialog={showNuevoExpress}
          setOpenDialog={(e) => {
            if (!e) setCodigoNuevoExpress(0)
            setShowNuevoExpress(e)
          }}
          onComplete={handleNuevoProducto}
          codigoIngresado={codigoNuevoExpress}
        />

        <Snackbar
          open={openSnackbar}
          message={snackMessage}
          autoHideDuration={3000}
          onClose={() => {
            setOpenSnackbar(false)
            setSnackMessage("")
          }}
        />

        <Alert
          openDialog={showAlertDialog}
          setOpenDialog={setShowAlert}
          title={titleMsg}
          message={textMsg}
        />


        <PedirSupervision
          openDialog={verPedirSupervision}
          accion={accionPedirSupervision}
          infoEnviar={datosConfirmarSupervision}
          setOpenDialog={setVerPedirSupervision}
          onConfirm={() => {
            if (handleConfirmarSupervision) handleConfirmarSupervision()
          }}
        />



      </>
    )
  }

  return (
    <ProviderModalesContext.Provider
      value={{
        GeneralElements2,
        showAsignarPeso,
        setShowAsignarPeso,
        productoSinPeso,
        setProductoSinPeso,
        setonAsignWeight,
        onConfirmAsignWeight,

        setShowNuevoExpress,
        setCodigoNuevoExpress,
        setHandleGuardarNuevoProducto,
        codigoNuevoExpress,

        setShowConfirmDialog,
        textConfirm,
        setTextConfirm,
        setHandleConfirm,
        setHandleNotConfirm,

        setOpenSnackbar,
        snackMessage,
        setSnackMessage,

        setShowAlert,
        setTitleMsg,
        textMsg,
        setTextMsg,

        pedirSupervision,

        setShowDialogSelectClientModal,
        showDialogSelectClientModal,
        setClienteModal,
        clienteModal,
        setAskLastSaleModal,
        setAddToSalesDataModal,
      }}
    >
      {children}
    </ProviderModalesContext.Provider>
  );
};

export default ProviderModales;
