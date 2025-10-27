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

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider.jsx";

import Client from "../../Models/Client.ts";
import Validator from "../../Helpers/Validator.ts";
import IngresarTexto from "../ScreenDialog/IngresarTexto.jsx";
import IngresarNumeroORut from "../ScreenDialog/IngresarNumeroORut.jsx";
import SendingButton from "../Elements/SendingButton.jsx";

const FormUpdateClient = ({
  onFinish,
  cliente
}) => {

  const {
    showMessage,
    showAlert
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
    { id: 5, nombre: "Transferencia" },
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

    console.log("handleSubmit")
    setSending(false)
    if (rut.length < 1) { showAlert("Falta completar rut"); return }
    if (rutExist) { showAlert("El Rut ya esta registrado"); return }
    if (!Validator.isRutChileno(rut)) { showAlert("Rut incorrecto"); return }

    console.log("handleSubmit2")
    if (nombre.length < 1) { showAlert("Falta completar nombre"); return }
    if (apellido.length < 1) { showAlert("Falta completar apellido"); return }

    if (namesExist) { showAlert("Ya esta registrado un cliente con el nombre y apellido ingresado"); return }

    if (telefono.length < 1) { showAlert("Falta completar telefono"); return }
    if (direccion.length < 1) { showAlert("Falta completar direccion"); return }
    if (correo.length < 1) { showAlert("Falta completar correo"); return }
    if (!Validator.isEmail(correo)) { showAlert("El correo es incorrecto"); return }
    if (giro.length < 1) { showAlert("Falta completar giro"); return }
    if (urlPagina.length < 1) { showAlert("Falta completar url pagina"); return }
    if (razonSocial.length < 1) { showAlert("Falta completar razon social"); return }
    if (region < 1) { showAlert("Falta completar region"); return }
    if (comuna < 1) { showAlert("Falta completar comuna"); return }

    console.log("formaPago", formaPago)
    if (formaPago.length < 1) { showAlert("Falta completar forma de pago"); return }

    console.log("handleSubmit3")
    setSending(true);

    const data = {
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

    Client.getInstance().update(data, () => {
      showMessage("realizado correctamente")
      setSending(false);
      onFinish(data)
    }, () => {
      showMessage("no se pudo realizar")
      setSending(false);
    })
  };

  const findIfExistRut = () => {
    return
    if (rut.trim() == "") return
    Client.getInstance().existByRut(rut, (r) => {
      if (r.cantidad > 0) {
        showMessage("Ya existe un cliente  con el rut ingresado")
        setRutExist(true)
      } else {
        setRutExist(false)
      }
    }, (error) => {

    })
  }

  const findIfExistNames = () => {
    return
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
      if (clientes.length > 0) {
        showMessage("Ya existe un cliente con el " + txtError)
        setNamesExist(true)
      } else {
        setNamesExist(false)
      }
    }, (error) => {
    })
  }

  const [showIngresarRut, setShowIngresarRut] = useState(false)
  const [showIngresarNombre, setShowIngresarNombre] = useState(false)
  const [showIngresarApellido, setShowIngresarApellido] = useState(false)
  const [showIngresarTelefono, setShowIngresarTelefono] = useState(false)
  const [showIngresarDireccion, setShowIngresarDireccion] = useState(false)
  const [showIngresarCorreo, setShowIngresarCorreo] = useState(false)
  const [showIngresarGiro, setShowIngresarGiro] = useState(false)
  const [showIngresarRazonSocial, setShowIngresarRazonSocial] = useState(false)
  const [showIngresarUrl, setShowIngresarUrl] = useState(false)

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

  const checkTelefono = (nuevoValor) => {
    if (Validator.isTelefono(nuevoValor))
      setTelefono(nuevoValor)
  }

  const checkCorreo = (nuevoValor) => {
    if (Validator.isPreEmail(nuevoValor))
      setCorreo(nuevoValor)
  }

  const checkGiro = (nuevoValor) => {
    if (Validator.isNombre(nuevoValor))
      setGiro(nuevoValor)
  }

  const checkUrl = (nuevoValor) => {
    if (Validator.isUrl(nuevoValor))
      setUrlPagina(nuevoValor)
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

      <IngresarNumeroORut
        title="Ingrese telefono del cliente"
        openDialog={showIngresarTelefono}
        setOpenDialog={setShowIngresarTelefono}
        varChanger={checkTelefono}
        varValue={telefono}
      />

      <IngresarTexto
        title="Ingrese correo electronico del cliente"
        openDialog={showIngresarCorreo}
        setOpenDialog={setShowIngresarCorreo}
        varChanger={checkCorreo}
        varValue={correo}
        isEmail={true}
      />

      <IngresarTexto
        title="Ingrese giro del cliente"
        openDialog={showIngresarGiro}
        setOpenDialog={setShowIngresarGiro}
        varChanger={checkGiro}
        varValue={giro}
      />

      <IngresarTexto
        title="Ingrese pagina del cliente"
        openDialog={showIngresarUrl}
        setOpenDialog={setShowIngresarUrl}
        varChanger={checkUrl}
        varValue={urlPagina}
      />

      <IngresarTexto
        title="Ingrese razon social del cliente"
        openDialog={showIngresarRazonSocial}
        setOpenDialog={setShowIngresarRazonSocial}
        varChanger={checkRazonSocial}
        varValue={razonSocial}
      />

      {cliente && cliente.validacionFactura && cliente.validacionFactura.entidad && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography sx={{
            color: "red"
          }}>Datos incompletos: {cliente.validacionFactura.entidad}</Typography>
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
            findIfExistNames()
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
            findIfExistNames()
            setShowIngresarDireccion(true)
          }}
          onChange={(e) => {
            checkDireccion(e.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa Teléfono
        </InputLabel>
        <TextField
          label="Teléfono"
          type="text"
          name="telefono"
          fullWidth
          onClick={() => {
            findIfExistNames()
            setShowIngresarTelefono(true)
          }}
          value={telefono}
          onChange={(e) => {
            checkTelefono(e.target.value)
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
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa correo electrónico
        </InputLabel>
        <TextField
          required
          label="Correo"
          name="correo"
          type="email"
          fullWidth
          onClick={() => {
            findIfExistNames()
            setShowIngresarCorreo(true)
          }}
          value={correo}
          onChange={(e) => {
            checkCorreo(e.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>Ingresa Giro</InputLabel>
        <TextField
          label="Giro"
          name="giro"
          fullWidth
          value={giro}
          onClick={() => {
            findIfExistNames()
            setShowIngresarGiro(true)
          }}
          onChange={(e) => {
            checkGiro(e.target.value)
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>URL Página</InputLabel>
        <TextField
          label="URL Página"
          name="urlPagina"
          fullWidth
          onClick={() => {
            findIfExistNames()
            setShowIngresarUrl(true)
          }}
          value={urlPagina}
          onChange={(e) => {
            checkUrl(e.target.value)
          }}
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
      <Grid item xs={12} sm={12} md={6}>
        <InputLabel sx={{ marginBottom: "4%" }}>
          Ingresa Razón social
        </InputLabel>
        <TextField
          fullWidth
          label="Razón Social"
          name="razonSocial"
          onClick={() => {
            findIfExistNames()
            setShowIngresarRazonSocial(true)
          }}
          value={razonSocial}
          onChange={(e) => {
            checkRazonSocial(e.target.value)
          }}
        />
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
