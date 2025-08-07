/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Paper,
  Grid,
  TextField,
  InputLabel,
  Snackbar,
  MenuItem,
  Typography,
} from "@mui/material";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import Client from "../../Models/Client";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "../ScreenDialog/IngresarTexto";
import IngresarNumeroORut from "../ScreenDialog/IngresarNumeroORut";
import MainButton from "../Elements/MainButton";
import SmallButton from "../Elements/SmallButton";

const InfoClienteFactura = ({
  onFinish,
  initialInfo = null
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [giro, setGiro] = useState("");
  const [region, setRegion] = useState(0);
  const [comuna, setComuna] = useState(0);


  const [regionOptions, setRegionOptions] = useState([{
    id: 0,
    comunaNombre: "Seleccionar"
  }]);
  const [comunaOptions, setComunaOptions] = useState([{
    id: 0,
    regionNombre: "Seleccionar"
  }]);

  useEffect(() => {
    cargarRegiones()
    recuperarInfoInicial()
  }, []);

  useEffect(() => {
    if (region > 0) {
      Client.getInstance().getComunasFromRegion(region, (comunas) => {
        comunas.push({
          id: 0,
          comunaNombre: "Seleccionar"
        })
        setComunaOptions(comunas);
      }, (e) => {
        showMessage(e)
      })
    }
  }, [region]);

  useEffect(() => {
    if (comunaOptions.length > 1) {
      //precargamos si viene con una comuna inicial
      if (initialInfo.comuna) {
        comunaOptions.forEach((comunaItem) => {
          if (comunaItem.comunaNombre == initialInfo.comuna)
            setComuna(comunaItem.id)
        })

      }
    }
  }, [comunaOptions]);



  const recuperarInfoInicial = () => {
    console.log("initialInfo")
    console.log(initialInfo)
    if (initialInfo.rutResponsable) setRut(initialInfo.rutResponsable)
    if (initialInfo.razonSocial) setRazonSocial(initialInfo.razonSocial)
    if (initialInfo.nombreResponsable) setNombre(initialInfo.nombreResponsable)
    if (initialInfo.apellidoResponsable) setApellido(initialInfo.apellidoResponsable)
    if (initialInfo.direccion) setDireccion(initialInfo.direccion)
    if (initialInfo.region) setRegion(initialInfo.region)
    if (initialInfo.giro) setGiro(initialInfo.giro)
  }

  const cargarRegiones = () => {
    Client.getInstance().getRegions((regs) => {
      regs.push({
        id: 0,
        regionNombre: "Seleccionar"
      })
      setRegionOptions(regs)
    }, () => {
      var regs = []
      regs.push({
        id: 0,
        regionNombre: "Seleccionar"
      })
      setRegionOptions(regs)
    })
  }

  const handleSubmit = async () => {

    if (rut.length < 1) { showMessage("Falta completar rut"); return }
    if (rutExist) { showMessage("El Rut ya esta registrado"); return }
    if (!Validator.isRutChileno(rut)) { showMessage("Rut incorrecto"); return }

    if (nombre.length < 1) { showMessage("Falta completar nombre"); return }
    if (apellido.length < 1) { showMessage("Falta completar apellido"); return }

    if (namesExist) { showMessage("Ya esta registrado un cliente con el nombre y apellido ingresado"); return }

    if (direccion.length < 1) { showMessage("Falta completar direccion"); return }
    if (giro.length < 1) { showMessage("Falta completar giro"); return }
    if (razonSocial.length < 1) { showMessage("Falta completar razon social"); return }
    if (region < 1) { showMessage("Falta completar region"); return }
    if (comuna < 1) { showMessage("Falta completar comuna"); return }


    setTimeout(() => {
      showMessage("ok")

    }, 2000);

    // Client.getInstance().create({
    //   rut,
    //   nombre,
    //   apellido,
    //   telefono,
    //   direccion,
    //   correo,
    //   giro,
    //   urlPagina,
    //   razonSocial,
    //   region:region+"",
    //   comuna:comuna + "",
    //   formaPago: metodoPagoOptions.filter((m)=>m.id == formaPago)[0].nombre
    // },()=>{
    //   showMessage("realizado correctamente")
    //   setSending(false);
    //   onFinish()
    // },()=>{
    //   showMessage("no se pudo realizar")
    //   setSending(false);
    // })
  };

  const [showIngresarRut, setShowIngresarRut] = useState(false)
  const [showIngresarNombre, setShowIngresarNombre] = useState(false)
  const [showIngresarApellido, setShowIngresarApellido] = useState(false)
  const [showIngresarDireccion, setShowIngresarDireccion] = useState(false)
  const [showIngresarGiro, setShowIngresarGiro] = useState(false)
  const [showIngresarRazonSocial, setShowIngresarRazonSocial] = useState(false)

  const checkRut = (nuevoValor) => {
    if (Validator.isRut(nuevoValor))
      setRut(nuevoValor)
  }

  const checkNombre = (nuevoValor) => {
    if (Validator.isNombre(nuevoValor))
      setNombre(nuevoValor)
  }

  const checkApellido = (nuevoValor) => {
    if (Validator.isNombre(nuevoValor))
      setApellido(nuevoValor)
  }

  const checkDireccion = (nuevoValor) => {
    if (Validator.isSearch(nuevoValor))
      setDireccion(nuevoValor)
  }

  const checkGiro = (nuevoValor) => {
    if (Validator.isNombre(nuevoValor))
      setGiro(nuevoValor)
  }

  const checkRazonSocial = (nuevoValor) => {
    if (Validator.isNombre(nuevoValor))
      setRazonSocial(nuevoValor)
  }


  return (
    <Grid
      container
      sx={{ margin: "auto", display: "flex", justifyContent: "center" }}
      item
      xs={12}
      sm={11}
      md={12}
      lg={12}
      spacing={2}
    >

      <IngresarNumeroORut
        title="Ingrese RUT del cliente"
        openDialog={showIngresarRut}
        setOpenDialog={setShowIngresarRut}
        varChanger={checkRut}
        varValue={rut}
        isRut={true}
      />


      <IngresarTexto
        title="Ingrese nombre del cliente"
        openDialog={showIngresarNombre}
        setOpenDialog={setShowIngresarNombre}
        varChanger={checkNombre}
        varValue={nombre}
      />
      <IngresarTexto
        title="Ingrese apellido del cliente"
        openDialog={showIngresarApellido}
        setOpenDialog={setShowIngresarApellido}
        varChanger={checkApellido}
        varValue={apellido}
      />

      <IngresarTexto
        title="Ingrese direccion del cliente"
        openDialog={showIngresarDireccion}
        setOpenDialog={setShowIngresarDireccion}
        varChanger={checkDireccion}
        varValue={direccion}
      />

      <IngresarTexto
        title="Ingrese giro del cliente"
        openDialog={showIngresarGiro}
        setOpenDialog={setShowIngresarGiro}
        varChanger={checkGiro}
        varValue={giro}
      />

      <IngresarTexto
        title="Ingrese razon social del cliente"
        openDialog={showIngresarRazonSocial}
        setOpenDialog={setShowIngresarRazonSocial}
        varChanger={checkRazonSocial}
        varValue={razonSocial}
      />



      {initialInfo && initialInfo.validacionFactura && initialInfo.validacionFactura.entidad && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography sx={{
            color:"red"
          }}>Datos incompletos: {initialInfo.validacionFactura.entidad}</Typography>
          <Typography>&nbsp;</Typography>
        </Grid>
      )}
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa rut sin puntos y con guión
        </InputLabel>
        <TextField
          label="Ej: 11111111-1"
          name="rut"
          placeholder="Ingrese rut con puntos y con guión"
          fullWidth
          onBlur={() => {
            findIfExistRut()
          }}
          onClick={() => {
            // findIfExistNames()
            setShowIngresarRut(true)
          }}
          value={rut}
          onChange={(e) => {
            checkRut(e.target.value)
          }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa Nombre
        </InputLabel>
        <TextField
          label="Nombre"
          name="nombre"
          type="text"
          fullWidth
          onClick={() => {
            setShowIngresarNombre(true)
          }}
          value={nombre}
          onChange={(e) => {
            checkNombre(e.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa Apellido
        </InputLabel>
        <TextField
          type="text"
          label="Apellido"
          name="apellido"
          fullWidth
          onClick={() => {
            setShowIngresarApellido(true)
          }}
          value={apellido}
          onChange={(e) => {
            checkApellido(e.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa Dirección
        </InputLabel>
        <TextField
          label="Dirección"
          name="direccion"
          fullWidth
          value={direccion}
          onClick={() => {
            // findIfExistNames()
            setShowIngresarDireccion(true)
          }}
          onChange={(e) => {
            checkDireccion(e.target.value)
          }}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Selecciona región
        </InputLabel>
        <TextField
          fullWidth
          id="region"
          select
          onClick={() => {
            // findIfExistNames()
          }}
          label="Región"
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
          }}
        >
          {regionOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.regionNombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} ssm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Selecciona comuna
        </InputLabel>
        <TextField
          id="comuna"
          select
          fullWidth
          onClick={() => {
            // findIfExistNames()
          }}
          label="Comuna"
          value={comuna}
          onChange={(e) => {
            setComuna(e.target.value);
          }}
        >
          {comunaOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.comunaNombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Giro</InputLabel>
        <TextField
          label="Giro"
          name="giro"
          fullWidth
          value={giro}
          onClick={() => {
            // findIfExistNames()
            setShowIngresarGiro(true)
          }}
          onChange={(e) => {
            checkGiro(e.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa Razón social
        </InputLabel>
        <TextField
          fullWidth
          label="Razón Social"
          name="razonSocial"
          onClick={() => {
            // findIfExistNames()
            setShowIngresarRazonSocial(true)
          }}
          value={razonSocial}
          onChange={(e) => {
            checkRazonSocial(e.target.value)
          }}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>
        <SmallButton actionButton={() => {

        }}
          textButton={"Continuar"}

        />
      </Grid>

    </Grid>


  );
};

export default InfoClienteFactura;
