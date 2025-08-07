/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
} from "@mui/material";
import TecladoCierre from "../Teclados/TecladoCierre";
import Validator from "../../Helpers/Validator";
import User from "../../Models/User";
import ScreenDialogConfig from "../ScreenDialog/AdminConfig";
import { Settings } from "@mui/icons-material";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";


const BoxLoginVolantes = ({
  onSelect = () => { }
}) => {

  const {
    userData,
    updateUserData,
    showMessage,
    showConfirm,
    showLoading,
    hideLoading
  } = useContext(SelectedOptionsContext);

  const [users, setUsers] = useState([])
  const [showScreenConfig, setShowScreenConfig] = useState(false);


  const cargarUsers = () => {
    showLoading("Cargando usuarios...")
    User.getInstance().getAllFromServer((usersx) => {
      hideLoading()
      const vendedores = []
      usersx.forEach((user) => {
        if (user.rol == "5") { //vendedor volante
          vendedores.push(user)
        }
      })
      setUsers(vendedores)
    }, (err) => {
      hideLoading()
      showMessage(err)
    })
  }

  useEffect(() => {
    cargarUsers()
  }, [])

  return (
    <Grid container spacing={2}>

      <ScreenDialogConfig openDialog={showScreenConfig} setOpenDialog={(v) => {
        setShowScreenConfig(v)
      }} />



      <Grid item xs={12} sm={12} md={2} lg={2}>
      </Grid>
      <Grid item xs={12} sm={12} md={8} lg={8} sx={{
        alignContent: "center",
        alignItems: "center",
        textAlign:"center"
      }}>
        <Typography variant="body4" color="black">
          SELECCIONAR UN VENDEDOR PARA COMENZAR
        </Typography>

        <div>

          {users.map((user, ix) => (
            <Button style={{
              backgroundColor: "#FAF2F5",
              margin: "10px 10px 0 0",
              boxShadow: "#605e5e 0px 0px 4px 0px",
              borderRadius: "5px",
              border: "1px solid black",
              height: "150px",
              width: "150px",
              display: "inline-block",
              alignContent: "center",
              textAlign: "center"
            }} key={ix} onClick={() => {
              onSelect(user)
            }}>
              <Typography variant="p" sx={{ display: "block" }} color="black">
                {user.nombres}
              </Typography>
              <Typography variant="p" sx={{ display: "block" }} color="black">
                {user.codigoUsuario}
              </Typography>
            </Button>
          ))}

        </div>

        <IconButton
          onClick={() => { setShowScreenConfig(true) }}
          edge="end"
        >
          <Settings />
          Configuraciones
        </IconButton>

      </Grid>


    </Grid >
  );
};

export default BoxLoginVolantes;
