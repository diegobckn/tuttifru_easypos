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
import { SelectedOptionsContext } from "./../Components/Context/SelectedOptionsProvider";
import { ProviderModalesContext } from "../Components/Context/ProviderModales";


import dayjs from "dayjs";

import System from "./../Helpers/System";
import User from "../Models/User";
import TecladoUsuario from "../Components/Teclados/TecladoUsuario";
import TecladoNumerico from "../Components/Teclados/TecladoNumerico";
import Validator from "../Helpers/Validator";
import ScreenDialogConfig from "../Components/ScreenDialog/AdminConfig";
import ModelConfig from "../Models/ModelConfig";
import UserEvent from "../Models/UserEvent";
import Sucursal from "../Models/Sucursal";
import CardSemaforo from "../Components/BoxOptionsLite/CardSemaforo";
import BoxBat from "../Components/BoxOptionsLite/BoxBat";
import MainButton from "../Components/Elements/MainButton";
import Model from "../Models/Model";
import Licencia from "../Models/Licencia";
import TiposPasarela from "../definitions/TiposPasarela";

import Logo from '../assets/logo-principal.jpg'
import Comercio from "../Models/Comercio";
import PrinterPaper from "../Models/PrinterPaper";
import { ModosTrabajoConexion } from "../definitions/BaseConfig";
import UsersOffline from "../Models/UsersOffline";
import OfflineAutoIncrement from "../Models/OfflineAutoIncrement";

const Login = () => {
  const {
    GeneralElements,
    showAlert,
    showMessage,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);


  const {
    GeneralElements2
  } = useContext(ProviderModalesContext);

  const refInputUser = useRef(null)
  const refInputPass = useRef(null)

  const [rutOrCode, setRutOrCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 

  const [error, setError] = useState(null);
  const [infoSucursalCaja, setInfoSucursalCaja] = useState("");

  const [showTecladoUsuario, setShowTecladoUsuario] = useState(false)
  const [showTecladoPassword, setShowTecladoPassword] = useState(false)

  const [showScreenConfig, setShowScreenConfig] = useState(false);

  const [reintentarPorSesionActiva, setReintentarPorSesionActiva] = useState(false);

  const setFocus = (inputToFocus) => {
    if (inputToFocus == "rutOrCode") {
      setShowTecladoUsuario(true)
      setShowTecladoPassword(false)
    }

    if (inputToFocus == "password") {
      setShowTecladoPassword(true)
      setShowTecladoUsuario(false)
    }
  }

  useEffect(() => {
    setFocus("rutOrCode")
    UserEvent.send({
      name: "carga pantalla login",
      info: ""
    })

    cargarSucursales()

    Licencia.check(showAlert, () => { navigate("/sin-licencia"); })

  }, [])


  const [footerTextSupport, setFooterTextSupport] = useState("Version 1.0.0");
  const navigate = useNavigate();
  const { updateUserData } = useContext(SelectedOptionsContext);

  const cargaInicial = () => {
    var dateTimeNow = dayjs().format('DD/MM/YYYY - HH:mm:ss')
    setFooterTextSupport(System.getInstance().getAppName() + " - " + dateTimeNow)

    setInfoSucursalCaja(
      "Sucursal " + ModelConfig.get("sucursalNombre") +
      " - PV " + ModelConfig.get("puntoVentaNombre")
    )
  }
  useEffect(() => {
    cargaInicial()
  }, [])


  const cargarSucursales = () => {
    var cantSuc = 0
    var canCaj = 0

    var unicaCaja = null
    Sucursal.getAll((responseData) => {
      responseData.forEach((sucItem, ix) => {
        cantSuc++

        sucItem.puntoVenta.forEach((cajItem, ix2) => {
          canCaj++
          if (cantSuc == 1 && canCaj == 1) {
            unicaCaja = cajItem
          }
        })
      })

      if (cantSuc == 1 && canCaj == 1) {
        // console.log("unicaCaja", unicaCaja)
        ModelConfig.change("sucursal", unicaCaja.idSucursal + "")
        ModelConfig.change("puntoVenta", unicaCaja.idCaja + "")
        ModelConfig.change("afterLogin", unicaCaja.idSucursalPvTipo)

      } else if (cantSuc == 0) {
        showMessage("No tiene sucursales en su sistema")
        ModelConfig.change("sucursal", "-1")
        ModelConfig.change("puntoVenta", "-1")
      }
    }, (error) => {

    })
  }


  const handleLogin = async () => {
    console.log("handleLogin")
    if (!rutOrCode || !password) {
      setError("Por favor, completar ambos campos.");
      return;
    }

    if (ModelConfig.get("sucursal") === "-1") {
      showMessage("Se debe configurar sucursal")
      return
    }

    if (ModelConfig.get("puntoVenta") === "-1") {
      showMessage("Se debe configurar caja")
      return
    }

    var user = new User();
    user.setRutFrom(rutOrCode)
    user.setUserCodeFrom(rutOrCode)
    user.clave = password;

    showLoading("Ingresando al sistema...")

    const callbackWrong = (error) => {
      hideLoading()
      console.log("error", error)
      if (
        error === "El Usuario tiene una Sesión activa."
        && !reintentarPorSesionActiva
      ) {
        setReintentarPorSesionActiva(true)
        return
      } else if (
        error.indexOf("La Caja tiene un turno iniciado por") > -1
      ) {
        setError(error)
      } else {

        const modoTrabajoConexion = ModelConfig.get("modoTrabajoConexion")
        if (
          modoTrabajoConexion == ModosTrabajoConexion.SOLO_OFFLINE
          || modoTrabajoConexion == ModosTrabajoConexion.OFFLINE_INTENTAR_ENVIAR
          || modoTrabajoConexion == ModosTrabajoConexion.PREGUNTAR
        ) {
          // const ultimoLogueado = user.sesion2.cargar(1)
          // console.log("ultimoLogueado", ultimoLogueado)
          UsersOffline.doLoginInLocal(user, (userLocal) => {
            updateUserData(userLocal);
            OfflineAutoIncrement.saveIfNotHasInSesion(userLocal)
            if (ModelConfig.get("afterLogin") == TiposPasarela.PREVENTA) {
              navigate("/pre-venta");
            } else {
              navigate("/punto-venta");
            }
            hideLoading()
          }, (err) => {
            setError(err)
          })
          return
        }

        setError(error)
        // hideLoading()
      }
    }

    const callbackOk = (info) => {
      if (info.descripcion.indexOf("La Caja tiene un turno iniciado por") > -1) {
        callbackWrong(info.descripcion)
        return
      }
      // Actualizar userData después del inicio de sesión exitoso
      updateUserData(info.responseUsuario);
      OfflineAutoIncrement.saveIfNotHasInSesion(info.responseUsuario)
      UsersOffline.add({ ...info.responseUsuario, clave: password })

      // Redirigir a la página de inicio
      if (ModelConfig.get("afterLogin") == TiposPasarela.PREVENTA) {
        navigate("/pre-venta");
      } else {
        navigate("/punto-venta");
      }
      hideLoading()
    }

    user.doLoginInServer(callbackOk, callbackWrong)
  }


  useEffect(() => {
    if (reintentarPorSesionActiva) {
      intentarLogout()
    }
  }, [reintentarPorSesionActiva])


  const intentarLogout = async () => {
    // console.log("intentarLogout")
    var user = new User();
    user.setRutFrom(rutOrCode)
    user.setUserCodeFrom(rutOrCode)
    user.setPassword(password)

    if (user.codigoUsuario === 0) {
      // console.log("buscando usuario por rut", rutOrCode)
      await User.getByRut(rutOrCode, async (usuarios) => {
        const usuario = usuarios[0]

        const user2 = new User()
        user2.codigoUsuario = usuario.codigoUsuario

        await user2.doLogoutInServer(async (response) => {
          // console.log("listo 2 el logout..intentamos hacer login")
          handleLogin()
        }, async (error) => {

          // console.log("no se pudo 2 hacer logout..", error)
          // Alert.alert(error)

          // }
        })

      }, (error) => {

      })
    } else {
      await user.doLogoutInServer(async (response) => {
        // console.log("listo el logout..intentamos hacer login")
        handleLogin()
      }, async (error) => {

        // console.log("no se pudo hacer logout..", error)
        // Alert.alert(error)

        // }
      })
    }
  }



  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alternar entre mostrar y ocultar la contraseña
  };

  return (
    <>
      <Grid container spacing={4} sx={{
        padding: "40px 130px",
        // backgroundColor:"blue",
      }}>
        <GeneralElements />
        <GeneralElements2 />




        <Grid item xs={12} sm={12} md={12} lg={12} sx={{
          margin: "0 auto",
          textAlign: "center"

        }}>
          <img src={Logo} style={{
            width: "200px",
          }} />

        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{
          margin: "0 auto",
          padding: "10px",
          textAlign: "center"

        }}>
          <Typography component="h1" variant="h5" sx={{
            marginTop: "20px"
          }}>
            Iniciar sesión
          </Typography>

        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{
          margin: "0 auto",
          textAlign: "center"

        }}>
          {error && (
            <Typography sx={{ color: "red", marginTop: 2 }}>{error}</Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} sx={{
          margin: "0 auto",
          // backgroundColor:"red",
          textAlign: "center"
        }}>
          <div style={{
            textAlign: "center",
            display: "inline-block",
            marginTop: "-25px",
            width: "300px",
          }}>
            <CardSemaforo />
          </div>
        </Grid>



        <Grid item xs={12} sm={12} md={2} lg={2}>
          <Typography>{" "}</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <TextField
            margin="normal"
            required
            fullWidth
            onInput={(e) => {
              //if(e.nativeEvent.data == undefined){
              if (Validator.isRut(e.target.value, rutOrCode)) setRutOrCode(e.target.value)
              //}
            }}
            label="Código o Rut"
            autoFocus
            value={rutOrCode}
            ref={refInputUser}
            onFocus={() => setFocus("rutOrCode")}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                System.intentarFoco(refInputPass)
              }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Clave"
            type={showPassword ? "text" : "password"} // Cambia dinámicamente el tipo del campo de contraseña
            value={password}
            onFocus={() => setFocus("password")}
            onInput={(e) => {
              //if(e.nativeEvent.data == undefined){
              if (Validator.isNumeric(e.target.value))
                setPassword(e.target.value)
              //}
            }}
            InputProps={{ // Componente de entrada personalizada para agregar el botón de visualización de contraseña
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              inputMode: "numeric", // Establece el modo de entrada como numérico
              pattern: "[0-9]*" // Asegura que solo se puedan ingresar números
            }}

            ref={refInputPass}

            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleLogin()
              }
            }}
          />




          <Typography sx={{ padding: "10px" }}>{infoSucursalCaja}</Typography>
          <MainButton actionButton={() => {
            handleLogin()
          }} textButton={"Ingresar"} xs={12} sm={12} md={12} lg={12} style={{ width: "100%", margin: "0" }} />
        </Grid>

        <Grid item xs={12} sm={12} md={5} lg={5} sx={{
          paddingLeft: "50px",
        }}>

          <TecladoUsuario
            showFlag={showTecladoUsuario}
            varValue={rutOrCode}
            varChanger={setRutOrCode}
            onEnter={() => {
              handleLogin()
            }}
          />

          <TecladoNumerico
            showFlag={showTecladoPassword}
            varValue={password}
            varChanger={setPassword}

            onEnter={() => {
              handleLogin()
            }}
          />
        </Grid>






        <ScreenDialogConfig openDialog={showScreenConfig} setOpenDialog={(v) => {
          setShowScreenConfig(v)
          cargaInicial()
        }} />

      </Grid>

      <Typography component="h4" style={{
        textAlign: "center",
        // backgroundColor:"red",
        position: "fixed",
        width: "100%",
        left: 0,
        bottom: 0
      }}>
        <p>
          {footerTextSupport}
          <IconButton
            onClick={() => { setShowScreenConfig(true) }}
            edge="end"
          >
            <Settings />
          </IconButton>
        </p>

      </Typography>
    </>
  );
};

export default Login;
