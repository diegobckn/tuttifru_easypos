/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Typography,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxAbrirCaja from "../BoxOptionsLite/BoxAbrirCaja";
import SystemHelper from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import AperturaCaja from "../../Models/AperturaCaja";
import dayjs from "dayjs";
import System from "../../Helpers/System";
import Printer from "../../Models/Printer";
import UserEvent from "../../Models/UserEvent";
import PrinterPaper from "../../Models/PrinterPaper";
import Comercio from "../../Models/Comercio";
import ConfigPlantillaItem from "./ConfigPlantillaItem";
import ConfigPlantillasDatosPrueba from "./ConfigPlantillasDatosPrueba";
import SmallDangerButton from "../Elements/SmallDangerButton";


const ConfigPlantillas = ({
  openDialog,
  setOpenDialog
}) => {
  const {
    userData,
    updateUserData,
    showMessage,
    showConfirm
  } = useContext(SelectedOptionsContext);

  const [plantillas, setPlantillas] = useState([])
  const [datosPrueba, setDatosPrueba] = useState([])
  const [showDatosPrueba, setShowDatosPrueba] = useState(false)

  const cargarInfo = () => {
    console.log("cargarInfo")


    const procesarPlantillas = (plants) => {
      console.log("asignando plantillas", plants)
      setPlantillas(plants)
    }

    const p = PrinterPaper.getInstance()
    if (p.templates.length < 1) {

      // Comercio.getServerAllConfigs((serverConfigs) => {
      const actual = Comercio.sesionServerAllConfig.cargar(1)
      // actual.forEach((configEnSesion) => {
      PrinterPaper.loadTeamplatesFromServer(actual, (tems) => {
        if (tems.length < 1) {
          showAlert("No hay plantillas")
          return
        }
        procesarPlantillas(tems)
      })
      // })
    } else {
      procesarPlantillas(p.templates)
    }

    const dummy = p.getDummy()
    setDatosPrueba(dummy)

    var variables = {}
    if (dummy.length < 1 && p.templates.length > 0) {
      const defaults = {
        "AnchoTicket": "80mm",
        "Padding": "5px",
        "Nom_RazonSocial": "Razon",
        "Nro_Rut": "rut",
        "Nom_Direccion": "direccion",
        "Nom_Giro": "giro",
        "Usuario": "usuario",
        "CodSucursal": " sucursal",
        "PuntoVenta": "punto de venta",
        "Cod_Scanner": "1234567890123",
        "num_Cant": "3",
        "Desc_Prod": "descripcion producto",
        "Valor_Unit": "375",
        "Valor_Total": "1125",
        "imprimirItems": "items",
        "NumFolio": "12345",
        "Fecha_Hora": "01/01/1970",
        "Nom_MetodoPago": "efectivo",
        "TotalGeneral": "1825",
        "EnvaseTotal": "700",
        "Total": "2000",
        "Redondeo": "1825",
        "Vuelto": "175",
        "PDFQR": "",
        "QR_CODE": "",
        "valor": "1125",
        "Cantidad": "3",
        "HORA": "21:00",
        "FECHA": "01/01/1970",
        "user": "192",
        "nomRazonSocial": "Razon",
        "Concepto": "concepto",
        "Valor": "1125",
        "Observacion": "observacion",
        "FechaHora": "01/01/1970 21:00",
        "ClienteUsuario": "340",
        "ValorPagado": "2000",
        "SaldoPagar": "1825",
        "UsuarioCargo": "350",
        "NombreCompleto": "Juan Perez",
        "RUT": "rut",
        "Sucursal": "sucursal",
        "Proveedor": "proveedor",
        "Folio": "12345",
        "NroAtencion": "1327",
        "Descuento": "0",
        "NombreClienteComanda": "nombre comanda"
      }

      p.templates.forEach((temp) => {
        variables = {
          ...variables,
          ...System.sustraerVariablesDePlantilla(temp.valor, undefined, undefined, defaults)
        }
      })
    } else {
      variables = dummy
    }
    // console.log("variables", variables)
    if (Object.keys(variables).length > 0) {
      p.saveDummy(variables)
      // console.log("asigna", (System.arrayIdValueFromObject(variables, false, "name")))
      setDatosPrueba(System.arrayIdValueFromObject(variables, false, "name"))
    }
  }

  useEffect(() => {
    if (!openDialog) return
    cargarInfo()
  }, [openDialog])

  return (
    <Dialog open={openDialog} onClose={() => { }} fullWidth maxWidth="lg">
      <DialogTitle>
        Plantillas de impresion
      </DialogTitle>
      <DialogContent>

        <Typography>Listado de Plantillas</Typography>

        <div style={{
          height: "500px",
          border: "2px solid #000",
          overflow: "scroll"
        }}>
          {plantillas.map((plantilla, ix) => (
            <ConfigPlantillaItem
              key={ix}
              plantilla={plantilla}
              index={ix}
              datosPrueba={datosPrueba}
              onChange={() => {
                setPlantillas([])
                setDatosPrueba([])
                setTimeout(() => {
                  PrinterPaper.recolectInfo(() => {
                    cargarInfo()
                  })
                }, 0.5 * 1000);
              }}
            />
          ))}
        </div>

        <Typography>{plantillas.length} plantillas</Typography>
        <ConfigPlantillasDatosPrueba
          openDialog={showDatosPrueba}
          setOpenDialog={setShowDatosPrueba}
          datosPrueba={datosPrueba}
          onChange={(cambiosConArray) => {
            const cambiosConObj = System.objectPropValueFromIdValueArray(cambiosConArray, "name")
            const p = PrinterPaper.getInstance()
            p.saveDummy(cambiosConObj)
            setDatosPrueba(cambiosConArray)
          }}
        />

      </DialogContent>
      <DialogActions>
        <SmallDangerButton textButton={"Descargar del servidor"} actionButton={() => {
          // console.log("datos de prueba", datosPrueba)
          showConfirm("Esto va a reemplazar todas las plantillas locales. Continuar?", () => {
            setPlantillas([])
            setDatosPrueba([])
            Comercio.sesionServerAllConfig.truncate()
            setTimeout(() => {
              PrinterPaper.recolectInfo(() => {
                cargarInfo()
              })
            }, 0.5 * 1000);
          })
        }} />

        <SmallButton textButton={"Datos de prueba"} actionButton={() => {
          // console.log("datos de prueba", datosPrueba)
          setShowDatosPrueba(true)
        }} />

        <SmallButton textButton="Volver" actionButton={() => { setOpenDialog(false) }} />
      </DialogActions>
    </Dialog>
  );
};

export default ConfigPlantillas;
