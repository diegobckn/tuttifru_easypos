import React, { useState, useContext, useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";
import ModelConfig from "../../Models/ModelConfig";
import { useNavigate } from "react-router-dom";
import User from "../../Models/User";
import UserEvent from "../../Models/UserEvent";
import StorageSesion from "../../Helpers/StorageSesion";
import System from "../../Helpers/System";
import Atudepa from "../../Models/Atudepa";

const ScreenSessionOptions = ({ openDialog, setOpenDialog }) => {
  const navigate = useNavigate();

  var prods = [];
  for (let index = 1; index <= 5; index++) {
    prods.push(index);
  }

  const {
    clearSessionData,
    userData,
    showTecladoBuscar,
    setShowTecladoBuscar,
    showMessage,
    showConfirm,
  } = useContext(SelectedOptionsContext);


  const handleLogout = () => {

    UserEvent.send({
      name: "presiono boton confirmar cierre de sesion",
      info: ""
    })

    const user = new User()
    user.fill(userData)

    const hacerCierre = () => {
      if (Atudepa.intervaloFuncion) {
        clearInterval(Atudepa.intervaloFuncion)
      }
      Atudepa.checkNuevosPedidos = false
      Atudepa.nuevoPedidoFuncion = null

      if (Atudepa.ultimoTurno) {
        showConfirm("Cerrar turno de la app?", () => {
          Atudepa.cerrarTurno(
            Atudepa.ultimoTurno,
            (resp) => {

            }, showMessage)
        })
      }

      setTimeout(() => {
        clearSessionData();
        navigate("/login");

      }, 300);
    }

    user.doLogoutInServer((response) => {
      if (showTecladoBuscar) setShowTecladoBuscar(false)
      hacerCierre()
    }, (error) => {
      console.log("error al hacer el logout", error)
      hacerCierre()
    })
  };


  return (
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
    >
      <DialogTitle>Cerrar Sesión</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseas cerrar sesión?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleLogout} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreenSessionOptions;
