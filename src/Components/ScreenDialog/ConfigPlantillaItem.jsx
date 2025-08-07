import React, { useState, useContext, useEffect, useRef } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import MainButton from "../Elements/MainButton";
import System from "../../Helpers/System";
import ConfigPlantillasDatosPrueba from "./ConfigPlantillasDatosPrueba";
import EditarPlantilla from "./EditarPlantilla";

const ConfigPlantillaItem = ({
  plantilla,
  index,
  datosPrueba,
  onChange
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
  const [contenido, setContenido] = useState("")
  const [reemplazables, setReemplazables] = useState([])
  const [showDatosPrueba, setShowDatosPrueba] = useState(false)

  const refContent = useRef(null)

  const [showEditarPlantilla, setShowEditarPlantilla] = useState(false)

  const refreshPreview = (contenido = null) => {
    if (refContent && refContent.current) {
      // console.log("refContent de " + plantilla.entrada, refContent)
      // console.log("plantilla", plantilla)
      if (!contenido) contenido = plantilla.valor
      setContenido(contenido)
      refContent.current.innerHTML = contenido
    }
  }

  const printSimple = (imprimirTxt) => {
    if (imprimirTxt === "") return

    console.log("print printsimpleplantilla")
    // console.log(imprimirTxt)
    let simplePrintWindow = window.open("about:blank", "printsimpleplantilla", `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no` +
      `,width=100px,left=0,top=0`);

    simplePrintWindow.document.write(imprimirTxt)
    simplePrintWindow.document.write(
      `<script>
      window.print();
      setTimeout(() => {
          console.log("cerrando")
          window.close();
      }, 1000);
      <\/script>`
    );
  }

  const rellenar = () => {
    var copiaContenido = plantilla.valor + ""
    if (reemplazables.length < 1) {

      var reemps = []
      datosPrueba.forEach((dp) => {
        const reemplazable = "{{" + dp.name + "}}"
        if (copiaContenido.indexOf(reemplazable) > -1) {
          reemps.push(dp)
          copiaContenido = copiaContenido.replaceAll(
            reemplazable,
            System.valorReemplazoPlantilla(dp, plantilla.entrada
            ))
        }
      })
      setReemplazables(reemps)
    } else {
      reemplazables.forEach((dp) => {
        const reemplazable = "{{" + dp.name + "}}"
        if (copiaContenido.indexOf(reemplazable) > -1) {
          copiaContenido = copiaContenido.replaceAll(
            reemplazable,
            System.valorReemplazoPlantilla(dp, plantilla.entrada
            ))
        }
      })
    }
    refreshPreview(copiaContenido)
  }

  useEffect(() => {
    refreshPreview()
  }, [refContent])

  return (
    <Paper
      // elevation={3}
      style={{
        backgroundColor: ((index + 1) % 2 != 0 ? "#EDF4FF" : "#DEE2F1"),
        padding: "20px",
        width: "100%",
        position: "relative",
      }}
    >

      <Typography sx={{
        // backgroundColor:"red",
        marginBottom: "-15px"
      }} onClick={() => {
        setShowDetails(!showDetails)
        if (!showDetails) {
          setTimeout(() => {
            refreshPreview()
          }, 300);
        }
      }}>
        {plantilla.entrada}

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

              <Paper ref={refContent}></Paper>

            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <MainButton
                md={12} lg={12}
                textButton={"Refresh preview"}
                actionButton={() => {
                  refreshPreview()
                }}
              />

              <MainButton
                style={{
                  backgroundColor: "blueviolet"
                }}
                md={12} lg={12}
                textButton={"Probar"}
                actionButton={() => {
                  printSimple(contenido)
                }}
              />

              <MainButton
                style={{
                  backgroundColor: "firebrick"
                }}
                md={12} lg={12}
                textButton={"Rellenar datos"}
                actionButton={rellenar}
              />

              <ConfigPlantillasDatosPrueba
                openDialog={showDatosPrueba}
                setOpenDialog={setShowDatosPrueba}
                datosPrueba={reemplazables}
                onChange={(cambiosConArray) => {
                  // const cambiosConObj = System.objectPropValueFromIdValueArray(cambiosConArray, "name")
                  // const p = PrinterPaper.getInstance()
                  // p.saveDummy(cambiosConObj)
                  setReemplazables(cambiosConArray)
                }}
              />

              <MainButton
                style={{
                  backgroundColor: "forestgreen"
                }}
                md={12} lg={12}
                textButton={"Datos de prueba"}
                actionButton={() => {
                  setShowDatosPrueba(true)
                }}
              />

              <br />

              <MainButton
                style={{
                  backgroundColor: "rgb(80 83 84)"
                }}
                md={12} lg={12}
                textButton={"Editar plantilla"}
                actionButton={() => {
                  refreshPreview()
                  setShowEditarPlantilla(true)
                }}
              />
            </Grid>

            <EditarPlantilla
              openDialog={showEditarPlantilla}
              setOpenDialog={setShowEditarPlantilla}
              plantillaItem={plantilla}
              onChange={onChange}
            />
          </Grid>

        </Box>
      )}
    </Paper>

  );
};

export default ConfigPlantillaItem;
