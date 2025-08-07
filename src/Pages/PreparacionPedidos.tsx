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

const PreparacionPedidos = () => {
  const {
    GeneralElements,
  } = useContext(SelectedOptionsContext);

  const navigate = useNavigate();


  return (
    <>
      <Grid container spacing={0} sx={{
        padding: "0",
        margin: "0"
      }}>
        <GeneralElements />




        <Grid item xs={12} sm={12} md={12} lg={12} sx={{
          textAlign: "center",
          marginBottom: "5vh"
        }}>
          <img src="https://softus.com.ar/easypos/logo.jpg" style={{
            height: "12vh",
            marginRight: "15vh"
          }} />

        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>

          <TableContainer
            component={Paper}
            style={{ overflowX: "auto", height: "80vh", background: "#F0F8FB", border: "1px solid #DCD9D9" }}
          >
            <Table>

              <TableHead sx={{
                background: "#859398",
              }}>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}></TableCell>
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}></TableCell>
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}></TableCell>
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>TOTAL</TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{

              }}>

                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography>
                      VICTOR 34567
                    </Typography>
                    <Typography variant="caption">
                      2 completos <br />
                      1 promo churr italiano<br />
                      1 papas fritas<br />
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>
                    <Typography>
                      MATIAS 34566
                    </Typography>
                    <Typography variant="caption">
                      1dinamico <br />
                      sin americana<br />
                      1 italiano<br />
                      1 papas fritas<br />
                    </Typography>
                  </TableCell>


                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>
                    <Typography>
                      DIEGO 34568
                    </Typography>
                    <Typography variant="caption">
                      1 completo<br />
                      1 papas fritas<br />
                    </Typography>
                  </TableCell>
                  
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>
                    <Typography>
                      1 dinamico<br />
                      1 taliano<br />
                      3 completos<br />
                      1 promo churr italiano<br />
                      3 papas fritas</Typography>
                  </TableCell>


                </TableRow>











                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Typography>
                      MILTON
                    </Typography>
                    <Typography variant="caption">
                      2 italianos grandes
                    </Typography>
                  </TableCell>


                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>

                  </TableCell>


                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>

                  </TableCell>
                  <TableCell sx={{ textAlign: "center", borderLeft: "2px solid #DCD9D9" }}>
                    <Typography>
                      2 italianos grandes
                    </Typography>
                  </TableCell>

                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>



        </Grid>





      </Grid>


    </>
  );
};




export default PreparacionPedidos;
