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
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  makeStyles,
} from "@mui/material";
import { Settings, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "./../Components/Context/SelectedOptionsProvider";

import SmallButton from "../Components/Elements/SmallButton";

const EstadosDePedidos = () => {
  const {
    GeneralElements,
  } = useContext(SelectedOptionsContext);

  const navigate = useNavigate();


  return (
    <>
      <Grid container spacing={0} sx={{
        padding:"0",
        margin:"0"
      }}>
        <GeneralElements />




        <Grid item xs={12} sm={12} md={12} lg={12} sx={{
          textAlign: "center",
          marginBottom:"5vh"
        }}>
          <img src="https://softus.com.ar/easypos/logo.jpg" style={{
            height: "12vh",
            marginRight:"15vh"
          }} />

        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>

          <TableContainer
            component={Paper}
            style={{ overflowX: "auto", height: "80vh", background: "#F0F8FB", border:"1px solid #DCD9D9"}}
          >
            <Table>

              <TableHead sx={{
                background: "#859398",
              }}>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>EN PREPARACION</TableCell>
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>LISTO PARA RETIRAR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{
                
              }}>

                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>MATIAS 34566</TableCell>
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>VICTOR 34567</TableCell>
                </TableRow>


                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>MATIAS 34566</TableCell>
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>VICTOR 34567</TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>



        </Grid>





      </Grid>


    </>
  );
};




export default EstadosDePedidos;
