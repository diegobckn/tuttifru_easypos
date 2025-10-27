import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import GrillaProductosVendidos from "./GrillaProductosVendidos";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import System from "../../Helpers/System";
import MainButton from "../Elements/MainButton";
import SalesOffline from "../../Models/SalesOffline";
import PagoBoleta from "../../Models/PagoBoleta";
import Retiro from "../../Models/Retiro";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import LastSale from "../../Models/LastSale";
import ModelConfig from "../../Models/ModelConfig";
import PrinterPaper from "../../Models/PrinterPaper";
import PrinterServer from "../../Models/PrinterServer";

const ItemVentaOffline = ({
  sale,
  index,
  onSent = () => { },
  onRemove = () => { }
}) => {
  const {
    userData,
    showConfirm,
    listSalesOffline,
    setListSalesOffline,

    hideLoading,
    showMessage,
    clearSalesData,
    setSelectedUser,
    setTextSearchProducts,
    setCliente,
    showLoading,
    showAlert,
    setSolicitaRetiro,
    createQrString
  } = useContext(SelectedOptionsContext);

  const [showDetails, setShowDetails] = useState(false)
  const [datetimeInfo, setDatetimeInfo] = useState("")

  const [trabajaConComanda, setTrabajaConComanda] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);


  const reintentarPago = () => {
    const callbackOk = (response) => {
      // MPago.hacerPago(sale, (responsex) => {
      // var response = { ...responsex }
      hideLoading()
      showMessage("Realizado correctamente");

      setListSalesOffline(SalesOffline.getInstance().remove(index))

      UserEvent.send({
        name: "reintento correcto de pago ventaoffline",
        info: JSON.stringify(sale)
      })
      console.log("onSent de ", sale)
      onSent(sale)
    }

    const callbackWrong = (error, response) => {
      // console.log("response", response)
      hideLoading()
      if (response.status === 409) {
        error = "Intento de pago: " + error
      }
      showAlert(error);
    }

    showLoading("Realizando el pago")
    SalesOffline.reintentarPago(sale, callbackOk, callbackWrong)
  }

  const imprimir = () => {

    Printer.adminContent({
      showAlert,
      functionConfirm: showConfirm,
      content: sale,
      createQrString
    })


  }

  const descartar = () => {
    showConfirm("Eliminar del listado?", () => {
      setListSalesOffline(SalesOffline.getInstance().remove(index))
      console.log("onRemove de ", sale)
    })
  }

  useEffect(() => {
    setDatetimeInfo(System.formatDateServer(sale.fechaIngreso, true) + "")
    PrinterPaper.getInstance().loadWidthFromSesion()
    setTrabajaConComanda(ModelConfig.get("trabajarConComanda"))
  }, [])


  useEffect(() => {
    setSincronizando(SalesOffline.enviando)
  }, [])

  return (
    <Paper
      // elevation={3}
      style={{
        backgroundColor: ((index + 1) % 2 != 0 ? "#ffeded" : "#F1DEDE"),
        padding: "20px",
        width: "100%",
        position: "relative",
        marginTop: "10px"
      }}
    >

      <Typography sx={{
        // backgroundColor:"red",
        marginBottom: "-15px"
      }} onClick={() => {
        // console.log("show details")
        setShowDetails(!showDetails)
      }}>
        Venta:
        {" "}
        {sale.queOperacionHace + " - "}
        {datetimeInfo} 
        { " - nro folio: " + (sale.queOperacionHace == "Ticket" ? sale.nFolioTicket : (sale.queOperacionHace == "Boleta" ? sale.nFolioBoleta: "N/D")) }

        <Button sx={{
          position: "absolute",
          top: "0px",
          right: "0px",
          padding: "15px 0 !important",
          margin: "0",
          // backgroundColor:"red"
        }}>
          {!showDetails ? (
            <KeyboardArrowDown />
          ) : (
            <KeyboardArrowUp />
          )}
        </Button>

      </Typography>

      {showDetails && (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <GrillaProductosVendidos
                productsSold={sale.products}
                subtotal={sale.subtotal}
                redondeo={sale.redondeo}
                vuelto={sale.vuelto}
                total={sale.totalRedondeado}
              />

            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <MainButton
                md={12} lg={12}
                textButton={"Reintentar el pago"}
                actionButton={reintentarPago}
                isDisabled={sincronizando}
              />

              <MainButton
                style={{
                  backgroundColor: "blueviolet"
                }}
                md={12} lg={12}
                textButton={"Imprimir"}
                actionButton={imprimir}
              />

              <MainButton
                style={{
                  backgroundColor: "firebrick"
                }}
                md={12} lg={12}
                textButton={"Descartar la venta"}
                actionButton={descartar}
                isDisabled={sincronizando}
              />
            </Grid>
          </Grid>

        </Box>
      )}
    </Paper>

  );
};

export default ItemVentaOffline;
