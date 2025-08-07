import React, { useState, useContext, useEffect } from "react";
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
import System from "../../Helpers/System";
import TeclaButton from "./../Elements/TeclaButton"
import TeclaEnterButton from "./../Elements/TeclaEnterButton"
import TeclaBorrarButton from "./../Elements/TeclaBorrarButton"
import TeclaOkButton from "../Elements/TeclaOkButton";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const TecladoPagoCaja = ({
  showFlag,
  varValue,
  varChanger,
  onEnter,
  onChange = null,
  maxValue = 10000000,
  esPrimeraTecla = null,
  tecladoBloqueado = false,
  textoBloqueoTeclado = "Teclado bloqueado"
}) => {

  const [primeraTecla, setPrimeraTecla] = useState(true)
  
  const [esperaInicial, setEsperaInicial] = useState(true)


  useEffect(() => {
    if (esPrimeraTecla === true || esPrimeraTecla === false) {
      setPrimeraTecla(esPrimeraTecla)
    }
  }, [esPrimeraTecla])

  useEffect(() => {
    // console.log("cambio showFlag", showFlag)
    if(!showFlag) setEsperaInicial(true)
    if(showFlag){
      setTimeout(() => {
        setEsperaInicial(false)
      }, 100);
    }
  }, [showFlag])

  const {
    showMessage,
    showAlert
  } = useContext(SelectedOptionsContext);


  const handleKeyButton = (key) => {

    if (key == "enter") {
      onEnter()
      return
    }

    if (key == "borrar") {
      var nuevoValor = (varValue + "").slice(0, -1);
      if (nuevoValor == "") {
        nuevoValor = "0"
      }
      varChanger(nuevoValor)
      return
    }
    if (key.toLowerCase() == "limpiar") {
      varChanger("0")
      return
    }

    const valorAnteriorValido = (parseInt(varValue) > 0) ? varValue : ""
    var nuevoValor = valorAnteriorValido + "" + key

    if (primeraTecla) {
      nuevoValor = parseInt(key.replace(".", ""));

      if (onChange != null) {
        const changeCustom = onChange(nuevoValor)
        if (changeCustom != undefined) {
          varChanger(changeCustom)
        } else {
          varChanger(nuevoValor)
        }
      } else {
        varChanger(nuevoValor)
      }

      return
    }

    if (
      key == "20.000"
      || key == "10.000"
      || key == "5.000"
      || key == "2.000"
      || key == "1.000"
    ) {
      nuevoValor = parseInt(valorAnteriorValido)
      if (isNaN(nuevoValor)) nuevoValor = 0
      if (primeraTecla) {
        nuevoValor = parseInt(key.replace(".", ""));
      } else {
        nuevoValor += parseInt(key.replace(".", ""));
      }
      setPrimeraTecla(false)
    }

    if (parseInt(nuevoValor) > maxValue) {
      showMessage("Valor muy grande");
      return
    }

    if (onChange != null) {
      const changeCustom = onChange(nuevoValor)
      if (changeCustom != undefined) {
        varChanger(changeCustom)
      } else {
        varChanger(nuevoValor)
      }
    } else {
      varChanger(nuevoValor)
    }
  }

  return (
    showFlag && !esperaInicial ? (
      <div style={{

        // width: "370px",
        // padding: "10px",
        // background: "orange",
        position: "relative",
        // left: "calc(50% - 111px)",
        // bottom: "50px",
        // zIndex: "10",
        // margin:"0 auto"
        margin: "0",
        padding: "0"
      }}>

        {tecladoBloqueado && (
          <div style={{
            backgroundColor: "black",
            opacity: .4,
            border: "1px solid red",
            width: "100%",
            height: "100%",
            position: "absolute"
          }} onClick={()=>{
            showAlert(textoBloqueoTeclado)
          }}></div>
        )}

        <div style={{
          display: "flex",
          flexDirection: "row"
        }}>

          <TeclaButton textButton="LIMPIAR" style={{
            width: "150px",
            height: "70px",
            padding: "10px 0",
            backgroundColor: "#f05a5a",
            color: "white"
          }} actionButton={handleKeyButton} />
          <TeclaBorrarButton style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />

          <TeclaButton style={{
            width: "140px", height: "70px",
            padding: "10px 0",
            backgroundColor: "#baf7d3"
          }} textButton="20.000" actionButton={handleKeyButton} />

        </div>

        <div style={{
          display: "flex",
          flexDirection: "row"
        }}>

          <TeclaButton textButton="1" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />
          <TeclaButton textButton="2" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />
          <TeclaButton textButton="3" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />

          <TeclaButton style={{
            width: "140px", height: "70px",
            padding: "10px 0",
            backgroundColor: "#baf7d3"
          }} textButton="10.000" actionButton={handleKeyButton} />


        </div>



        <div style={{
          display: "flex",
          flexDirection: "row"
        }}>


          <TeclaButton textButton="4" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />
          <TeclaButton textButton="5" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />
          <TeclaButton textButton="6" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />

          <TeclaButton style={{
            width: "140px", height: "70px",
            padding: "10px 0",
            backgroundColor: "#baf7d3"
          }} textButton="5.000" actionButton={handleKeyButton} />

        </div>


        <div style={{
          display: "flex",
          flexDirection: "row"
        }}>

          <TeclaButton textButton="7" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />
          <TeclaButton textButton="8" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />
          <TeclaButton textButton="9" style={{ width: "70px", height: "70px", }} actionButton={handleKeyButton} />
          <TeclaButton style={{
            width: "140px", height: "70px",
            padding: "10px 0",
            backgroundColor: "#baf7d3"
          }} textButton="2.000" actionButton={handleKeyButton} />
        </div>

        <div style={{
          display: "flex",
          flexDirection: "row"
        }}>

          <TeclaButton style={{ width: "70px", height: "70px", }} textButton="0" actionButton={handleKeyButton} />
          <TeclaButton style={{ width: "70px", height: "70px", }} textButton="00" actionButton={handleKeyButton} />
          <TeclaButton style={{
            width: "70px", height: "70px",
            padding: "10px 0"
          }} textButton="000" actionButton={handleKeyButton} />

          <TeclaButton style={{
            width: "140px", height: "70px",
            padding: "10px 0",
            backgroundColor: "#baf7d3"
          }} textButton="1.000" actionButton={handleKeyButton} />

        </div>
      </div>
    ) : (
      <></>
    )
  )
};

export default TecladoPagoCaja;
