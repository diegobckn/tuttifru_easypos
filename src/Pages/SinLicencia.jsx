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

import SmallButton from "../Components/Elements/SmallButton";

const SinLicencia = () => {
  const {
    GeneralElements,
  } = useContext(SelectedOptionsContext);

const navigate = useNavigate();

const rehabilitar = ()=>{
  navigate("/login");
}
  

  return (
    <>
      <Grid container spacing={4} sx={{
        padding: "40px 130px",
        // backgroundColor:"blue",
      }}>
        <GeneralElements />




        <Grid item xs={12} sm={12} md={12} lg={12} sx={{
          margin: "0 auto",
          textAlign: "center"

        }}>
          <img src="https://softus.com.ar/easypos/logo.jpg" style={{
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
            Licencia vencida
          </Typography>
        </Grid>



        <Grid item xs={12} sm={12} md={12} lg={12} sx={{
          margin: "0 auto",
          padding: "10px",
          textAlign: "center"

        }}>
          <SmallButton textButton={"Recargar"} actionButton={rehabilitar} />
        </Grid>

      </Grid>


    </>
  );
};

export default SinLicencia;
