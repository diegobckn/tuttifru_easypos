import React, { useState, useContext, useEffect } from "react";

import {
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  DialogTitle
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import Suspender from "../../Models/Suspender";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "./IngresarTexto";
import LastSale from "../../Models/LastSale";
import Printer from "../../Models/Printer";
import ProductSold from "../../Models/ProductSold";
import PrinterServer from "../../Models/PrinterServer";
import dayjs from "dayjs";
import GrillaProductosVendidos from "../BoxOptionsLite/GrillaProductosVendidos";

var prods = [];
for (let index = 1; index <= 5; index++) {
  prods.push(index);
}

const UltimaVenta = ({
  openDialog,
  setOpenDialog
}) => {
  const {
    userData,
    salesData,
    sales,
    clearSalesData,
    showMessage,
    showAlert,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [lastSaleProducts, setlastSaleProducts] = useState([])
  const [total, settotal] = useState(0)
  const [subtotal, setsubtotal] = useState(0)
  const [redondeo, setredondeo] = useState(0)
  const [vuelto, setvuelto] = useState(0)
  const [lastSaleInfo, setlastSaleInfo] = useState(null)

  const [canReprint, setcanReprint] = useState(false)
  const [esPreventa, setEsPreventa] = useState(false)

  useEffect(() => {
    if (!openDialog) {
      return
    }
    const lastSaleInfox = LastSale.loadFromSesion()
    setlastSaleInfo(lastSaleInfox)
    if (lastSaleInfox) {
      setlastSaleProducts(lastSaleInfox.data.products)
      var total = 0
      // lastSaleInfox.data.products.forEach((prod,ix)=>{
      //   total += prod.cantidad * prod.precioUnidad
      // })

      setsubtotal(lastSaleInfox.data.subtotal)
      setredondeo(lastSaleInfox.data.redondeo)
      setvuelto(lastSaleInfox.data.vuelto)
      settotal(lastSaleInfox.data.totalPagado)

      // console.log("revisando si se puede reimprimir")
      if (lastSaleInfox.response) {
        const keyItems = Object.keys(lastSaleInfox.response.imprimirResponse)
        const hasToProcess = keyItems.length
        if (hasToProcess > 0) {
          var hasToPrint = false
          keyItems.forEach((itPrint) => {
            // console.log("item:", itPrint)
            // console.log("valor:", (lastSaleInfox.response.imprimirResponse[itPrint]).trim())
            if ((lastSaleInfox.response.imprimirResponse[itPrint]).trim() != "") {
              // console.log("tiene algo")
              hasToPrint = true
            }
          })
          setcanReprint(hasToPrint)
        } else {
          setcanReprint(false)
        }
      } else {
        showMessage("No se pudo guardar la respuesta de ultima venta")
      }
    } else {
      showMessage("Debe hacer una venta")
      setOpenDialog(false)
    }

    setEsPreventa(window.location.href.indexOf("pre-venta") > -1)
  }, [openDialog])


  return (
    <Dialog open={openDialog} maxWidth="lg" onClose={() => {
      setOpenDialog(false)
    }}
    >
      <DialogTitle>
        &Uacute;ltima {esPreventa ? "gen. ticket" : "Venta"}
      </DialogTitle>
      <DialogContent>



        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} lg={12}>
            <GrillaProductosVendidos
              productsSold={lastSaleProducts}
              subtotal={subtotal}
              redondeo={redondeo}
              vuelto={vuelto}
              total={total}
            />
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>

        <SmallButton style={{
          width: "230px",
        }} textButton={"Reimprimir en servidor"} actionButton={() => {

          const cantAImprimir = parseInt(ModelConfig.get("cantidadTicketImprimir"))
          // Printer.printAll(lastSaleInfo.response, parseInt(cantAImprimir))

          console.log("antes de enviar..", dayjs().format("HH:mm:ss"))

          PrinterServer.printAll(lastSaleInfo.data, (res) => {
            console.log("finaliza..", dayjs().format("HH:mm:ss"))

            showAlert("Realizado correctamente")
          }, showAlert)

          setOpenDialog(false)
          setTimeout(() => {
            setOpenDialog(true)
          }, 100);
        }}
          isDisabled={!canReprint}
        />

        <SmallButton style={{
          width: "230px",
        }} textButton={"Reimprimir ticket"} actionButton={() => {

          Printer.printContent(lastSaleInfo.response,showConfirm,showAlert)
          setOpenDialog(false)
          setTimeout(() => {
            setOpenDialog(true)
          }, 100);
        }}
          isDisabled={!canReprint}
        />


        <Button onClick={() => {
          setOpenDialog(false)
        }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UltimaVenta;
