import React, { useState, useContext, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Settings, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Components/Context/SelectedOptionsProvider";

import SmallButton from "../Components/Elements/SmallButton";
import BigButton from "../Components/Elements/BigButton";
import Printer from "../Models/Printer";
import ModelConfig from "../Models/ModelConfig";

const GenerarNumeroAtencion = () => {
  const {
    GeneralElements,
  } = useContext(SelectedOptionsContext);

  const navigate = useNavigate();

  const [numeroDeAtencion, setNumeroDeAtencion] = useState(0)

  const contenidoImpresion = "<!DOCTYPE html>    <html lang='es'>    <head>        <meta charset='UTF-8'>        <meta name='viewport' content='width=device-width, initial-scale=1.0'>        <title>Numero Atencion</title>        <style>            body {                font-family: Arial, sans-serif;                margin: 0;                padding: 0;            }            .receipt {                width: 80mm;                /* Ancho ajustado a la impresora de recibos */                margin: 20px auto 10px;                border: 1px solid black;                padding: 20px;                box-sizing: border-box;            }            .header {                text-align: center;                font-size: 12px;                margin-bottom: 10px;            }            .header strong {                font-size: 14px;            }            .info {                text-align: center;                font-size: 24px;                margin-top: 10px;            }            .footer {                text-align: center;                font-size: 12px;                margin-top: 10px;            }            @media print {                @page {                    size: 80mm auto;                    /* Ajuste el tamaño de la página al ancho de la impresora */                    margin: 0;                    /* Eliminar márgenes predeterminados */                }                body {                    margin: 0;                }                .receipt {                    border: none;                    /* Opcional: eliminar borde para impresión */                    margin: 0;                }            }        </style>    </head>    <body>        <div class='receipt'>            <div class='header'>                <p>N&uacute;mero de atenci&oacute;n</p>                <p class='info'>{{numeroAtencion}}</p>                <p>Conservar &eacute;ste n&uacute;mero hasta finalizar la compra</p>            </div>            <div class='footer'>                <!-- www.easypos.cl -->            </div>        </div>    </body></html>"

  const generarTicket = () => {
    const nuevo = numeroDeAtencion + 1
    setNumeroDeAtencion(nuevo)

    const anImp = ModelConfig.get("widthPrint")

    var imprimirPapel = (contenidoImpresion + "")
    imprimirPapel = imprimirPapel.replace("{{numeroAtencion}}", nuevo)
    // imprimirPapel.replace("{{anchoImpresora}}",anImp)
    imprimirPapel = imprimirPapel.replace("{{anchoImpresora}}", "80mm")

    Printer.printAll({
      imprimir: {
        imprimirNumeroAtencion: imprimirPapel
      }
    }, 2)
  }

  return (
    <div style={{
      alignContent: "center",
      height: "100vh",
      // backgroundColor: "blue",
    }}>
      <GeneralElements />

      <div style={{
        width: "60%",
        padding: "10px",
        margin: "auto",

        backgroundColor: "#fbfbfb",
        textAlign: "center",
      }}>
        <div style={{ width: "100%", display: "inline-block", height: "100px" }}></div>

        <Typography component="h1" variant="h5" sx={{
          marginTop: "20px"
        }}>
          N&uacute;mero de atenci&oacute;n
        </Typography>


        <div style={{ width: "100%", display: "inline-block", height: "100px" }}></div>

        <BigButton
          textButton={"Obtener"}
          actionButton={generarTicket}

        />
        <div style={{ width: "100%", display: "inline-block", height: "100px" }}></div>
      </div>


    </div>
  );
};

export default GenerarNumeroAtencion;
