import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ItemVentaOffline from "./ItemVentaOffline";
import SalesOffline from "../../Models/SalesOffline";
import SmallDangerButton from "../Elements/SmallDangerButton";
import SmallSecondaryButton from "../Elements/SmallSecondaryButton";
import CorregirFolios from "../ScreenDialog/CorregirFolios";


const BoxVentasOffline = ({
  isVisible
}) => {
  const {
    userData,
    salesData,
    clearSessionData,
    clearSalesData,
    getUserData,
    setShowLoadingDialogWithTitle,
    hideLoadingDialog,
    setShowLoadingDialog,
    showConfirm,
    showMessage,
    showAlert,

    suspenderYRecuperar,
    listSalesOffline,
    setListSalesOffline
  } = useContext(SelectedOptionsContext);

  const [openScreenCreateClient, setOpenScreenCreateClient] = useState(false);
  const [showCorreccion, setShowCorreccion] = useState(false);

  const recargarVentas = () => {
    setListSalesOffline([])
    setTimeout(() => {
      setListSalesOffline(SalesOffline.getInstance().loadFromSesion())
    }, 300);
  }

  return (
    <Box>
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography>Listado ventas</Typography>
          {SalesOffline.sincronizando && (
            <Typography>El sistema esta intentando enviar las ventas...</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <SmallButton
            style={{
              height: "60px"
            }}
            textButton={"Sincronizar Todo"}
            actionButton={() => {
              SalesOffline.sincronizar((sale) => {
                console.log("sincronizado recien", sale)
                recargarVentas()
              }, () => {
                if (isVisible) showAlert("sincronizado correctamente")
                recargarVentas()
              })
            }}

            isDisabled={listSalesOffline.length < 1 || SalesOffline.sincronizando}
          />

          <SmallDangerButton
            textButton={"Descartar Todo"}
            actionButton={() => {
              showConfirm("Eliminar todo?", () => {
                SalesOffline.borrarTodos()
                setTimeout(() => {
                  recargarVentas()
                }, 200);
              })
            }}

            style={{
              height: "60px"
            }}
            isDisabled={listSalesOffline.length < 1}
          />

          <SmallSecondaryButton
            textButton={"Frenar sincronizacion"}
            actionButton={() => {
              SalesOffline.frenarSincro()
            }}

            style={{
              height: "60px"
            }}
            isDisabled={!SalesOffline.sincronizando}
          />

          <CorregirFolios
            openDialog={showCorreccion}
            setOpenDialog={setShowCorreccion}
            onConfirm={(tipo, nroFolio) => {
              SalesOffline.corregirFolios(tipo, nroFolio, () => {
                setTimeout(() => {
                  recargarVentas()
                }, 300);
              })
            }}
          />

          <SmallButton
            style={{
              height: "60px",
              backgroundColor: "darkorange"
            }}
            textButton={"Corregir folios"}
            actionButton={() => {
              setShowCorreccion(true)
            }}
            isDisabled={listSalesOffline.length < 1 || SalesOffline.sincronizando}
          />


          {listSalesOffline.map((sale, ix) => (
            <ItemVentaOffline
              sale={sale}
              key={ix}
              index={ix}
              onRemove={recargarVentas}
              onSent={recargarVentas}
            />
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BoxVentasOffline;
