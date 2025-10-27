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

import Client from "../../Models/Client.ts";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "../ScreenDialog/IngresarTexto";
import IngresarNumeroORut from "../ScreenDialog/IngresarNumeroORut";
import TouchInputNumber from "../TouchElements/TouchInputNumber";
import TouchInputName from "../TouchElements/TouchInputName";
import TouchInputEmail from "../TouchElements/TouchInputEmail";
import TouchInputPage from "../TouchElements/TouchInputPage";
import SendingButton from "../Elements/SendingButton.jsx";


const FormUpdateClient = ({
  onFinish,
  cliente
}) => {

  const {
    showMessage,
  } = useContext(SelectedOptionsContext);

  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [correo, setCorreo] = useState("");
  const [giro, setGiro] = useState("");
  const [urlPagina, setUrlPagina] = useState("");
  const [formaPago, setFormaPago] = useState(0);
  const [region, setRegion] = useState(0);
  const [comuna, setComuna] = useState(0);

  const [rutExist, setRutExist] = useState(false);
  const [namesExist, setNamesExist] = useState(false);
  const [sending, setSending] = useState(false);


  const [regionOptions, setRegionOptions] = useState([{
    id: 0,
    comunaNombre: "Seleccionar"
  }]);
  const [comunaOptions, setComunaOptions] = useState([{
    id: 0,
    regionNombre: "Seleccionar"
  }]);

  const metodoPagoOptions = [
    { id: 0, nombre: "Seleccionar" },
    { id: 1, nombre: "Efectivo" },
    { id: 2, nombre: "Debito" },
    { id: 3, nombre: "Credito" },
    { id: 4, nombre: "Cuenta Corriente" },
  ];


  useEffect(() => {
    if (!cliente) return

    setNombre(cliente.nombreResponsable)
    setApellido(cliente.apellidoResponsable)
    setRut(cliente.rut)
    setTelefono(cliente.telefono)
    setDireccion(cliente.direccion)
    setRazonSocial(cliente.razonSocial)
    setCorreo(cliente.correo)
    setGiro(cliente.giro)
    setUrlPagina(cliente.urlPagina)

    var ixFm = metodoPagoOptions.filter(x => x.nombre == cliente.formaPago)

    if (ixFm.length > 0) {
      setFormaPago(ixFm[0].id)
    }
    setRegion(cliente.region)
    setComuna(cliente.comuna)


  }, []);

  useEffect(() => {
    if (sending) {
      handleSubmit()
    }
  }, [sending]);

  useEffect(() => {
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

  const handleSubmit = async () => {
    setSending(false)
    if (rut.length < 1) { showMessage("Falta completar rut"); return }
    if (rutExist) { showMessage("El Rut ya esta registrado"); return }
    if (!Validator.isRutChileno(rut)) { showMessage("Rut incorrecto"); return }

    if (nombre.length < 1) { showMessage("Falta completar nombre"); return }
    if (apellido.length < 1) { showMessage("Falta completar apellido"); return }

    if (namesExist) { showMessage("Ya esta registrado un cliente con el nombre y apellido ingresado"); return }

    if (telefono.length < 1) { showMessage("Falta completar telefono"); return }
    if (direccion.length < 1) { showMessage("Falta completar direccion"); return }
    if (correo.length < 1) { showMessage("Falta completar correo"); return }
    if (!Validator.isEmail(correo)) { showMessage("El correo es incorrecto"); return }
    if (giro.length < 1) { showMessage("Falta completar giro"); return }
    if (urlPagina.length < 1) { showMessage("Falta completar url pagina"); return }
    if (razonSocial.length < 1) { showMessage("Falta completar razon social"); return }
    if (region < 1) { showMessage("Falta completar region"); return }
    if (comuna < 1) { showMessage("Falta completar comuna"); return }
    if (formaPago.length < 1) { showMessage("Falta completar forma de pago"); return }

    setSending(true);

    const dataEnviar = {
      codigoCliente: cliente.codigoCliente,
      rut,
      nombre,
      apellido,
      telefono,
      direccion,
      correo,
      giro,
      urlPagina,
      razonSocial,
      region: region + "",
      comuna: comuna + "",
      formaPago: metodoPagoOptions.filter((m) => m.id == formaPago)[0].nombre
    }

    Client.getInstance().update(dataEnviar, () => {
      showMessage("realizado correctamente")
      setSending(false);
      onFinish(dataEnviar)
    }, () => {
      showMessage("no se pudo realizar")
      setSending(false);
    })
  };

  const findIfExistRut = () => {
    if (rut.trim() == "") return
    Client.getInstance().existByRut(rut, (r) => {
      if (r.cantidad > 1) {
        showMessage("Ya existe un cliente  con el rut ingresado")
        setRutExist(true)
      } else {
        setRutExist(false)
      }
    }, (error) => {

    })
  }

  const findIfExistNames = () => {

    console.log("findIfExistNames")
    if (nombre.trim() == "" && apellido.trim() == "") return

    console.log("findIfExistNames2")

    var txtError = ""
    var search = ""
    if (nombre.trim() != "") {
      search = nombre
      txtError = "nombre"
    }
    if (apellido.trim() != "") {
      if (search == "") {
        search = apellido
        txtError = "apellido"
      } else {
        search += " " + apellido
        txtError += " y apellido"
      }
    }

    Client.getInstance().searchInServer({ searchText: search }, (clientes) => {
      if (clientes.length > 1) {
        showMessage("Ya existe un cliente con el " + txtError)
        setNamesExist(true)
      } else {
        setNamesExist(false)
      }
    }, (error) => {
    })
  }

  useEffect(() => {
    findIfExistRut()
  }, [rut])

  useEffect(() => {
    findIfExistNames()
  }, [nombre, apellido])

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

      {cliente && cliente.validacionFactura && cliente.validacionFactura.entidad && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography sx={{
            color: "red"
          }}>Datos incompletos: {cliente.validacionFactura.entidad}</Typography>
          <Typography>&nbsp;</Typography>
        </Grid>
      )}

      <Grid item xs={12} sm={12} md={6}>
        <TouchInputNumber
          inputState={[rut, setRut]}
          label="Rut"
          isRut={true}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6}>
        <TouchInputName
          inputState={[razonSocial, setRazonSocial]}
          label="Razon Social"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TouchInputName
          inputState={[nombre, setNombre]}
          label="Nombre"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TouchInputName
          inputState={[apellido, setApellido]}
          label="Apellido"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TouchInputName
          inputState={[direccion, setDireccion]}
          label="Direccion"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TouchInputNumber
          inputState={[telefono, setTelefono]}
          label="Teléfono"
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
            findIfExistNames()
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
            findIfExistNames()
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
        <TouchInputEmail
          inputState={[correo, setCorreo]}
          label="correo electronico"
        />



      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TouchInputName
          inputState={[giro, setGiro]}
          label="Giro"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <TouchInputPage
          inputState={[urlPagina, setUrlPagina]}
          label="Pagina web"
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa Forma de Pago
        </InputLabel>
        <TextField
          fullWidth
          label="Forma de Pago"
          name="formaPago"
          select
          onClick={() => {
            findIfExistNames()
          }}
          value={formaPago}
          onChange={(e) => {
            setFormaPago(e.target.value);
          }}
        >
          {metodoPagoOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Grid>



      <Grid item xs={12} sm={12} md={12} lg={12}>

        <SendingButton
          textButton={"Guardar"}
          sendingText="Guardando cliente"
          actionButton={() => {
            setSending(true)
          }}
          sending={sending}
        />
      </Grid>


    </Grid>
  );
};

export default FormUpdateClient;
