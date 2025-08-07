import React, { useState, useEffect, useContext } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  ListItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Container,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Slider,
  Dialog,
  DialogContent,
  CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import Client from "../../Models/Client";
import ModelConfig from "../../Models/ModelConfig";
import SmallButton from "../Elements/SmallButton";
import IngresarTexto from "../ScreenDialog/IngresarTexto";
import Validator from "../../Helpers/Validator";

const BoxBuscadorCliente = ({onSelect}) => {

  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Cuando se realiza una búsqueda vacía o se borran los términos de búsqueda,
    // ocultar los componentes de precios y cta corriente
    if (searchText.trim() === "" || searchResults.length === 0) {
    }
  }, [searchText, searchResults]);

  const onClientClick = (index, clientSelected) => {
    onSelect(clientSelected)
  };
  


const handleSearch = async () => {
  setLoading(true)
  Client.getInstance().searchInServer({
    searchText,
    codigoSucursal: ModelConfig.get("sucursal"),
    puntoVenta: ModelConfig.get("puntoVenta"),

  },(result)=>{
    setSearchResults(result);
    if(result.length<1){
      alert("No se encontraron resultados");
    }
    setLoading(false)
  },(error)=>{
    setSearchResults([]);
    alert("No se encontraron resultados");
    setLoading(false)
  })
};

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchText(inputValue);
    if (inputValue.trim() === "") {
      setSearchResults([]);
    }
  };


  const validateChangeSearch = (newvalue)=>{
    if(Validator.isSearch(newvalue))
    setSearchText(newvalue)
  }

  const [dialogSearch, setDialogSearch] = useState(false);
  
  return (
    <Grid container item xs={12} md={12} lg={12}>

      <IngresarTexto
          title="Ingrese un nombre para buscar"
          openDialog={dialogSearch}
          setOpenDialog={setDialogSearch}
          varChanger={validateChangeSearch}
          varValue={searchText}
          onEnter={handleSearch}
        />

      <Paper
        elevation={13}
        sx={{
          background: "#859398",
          width: "100%",
          marginTop: "2%",
        }}
      >
        <Grid
          container
          sx={{ 
            minWidth: "500px",
            width: "100%",
            minHeight:"200px",
            display: "flex"
          }}
          spacing={2}
          alignItems="center"
        >
          <Grid item xs={12} md={12} lg={12}>

            <Typography sx={{
                padding: "20px",
                fontSize:"20px",
              }}>Seleccionar un cliente</Typography>
            <Paper
              elevation={0} // Sin elevación para que el borde funcione
              sx={{
                background: "#859398", // Color de fondo blanco para el Paper interior
                borderRadius: "5px", // Bordes redondeados
                display: "flex",
                alignItems: "center",
                padding: "8px", // Espaciado interno
              }}
            >
              <TextField
                fullWidth
                placeholder="Ingrese Nombre Apellido"
                value={searchText}
                onChange={(e) => validateChangeSearch(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                  margin: "1px",
                }}
                onClick={()=>{
                  setDialogSearch(true)
                }}
                onKeyDown={(e)=>{
                  if(e.keyCode == 13){
                    handleSearch()
                  }
                }}
              />

              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={loading 
                  ?<CircularProgress size={20} />
                  :<SearchIcon />
                }
                disabled={loading}
                sx={{
                  margin: "1px",
                  height: "3.4rem",
                  backgroundColor: "#283048",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1c1b17",
                  },
                  marginLeft: "8px", // Margen izquierdo para separar el TextField del Button
                }}
              >
                Buscar
                
              </Button>
            </Paper>
          </Grid>
        </Grid>
        <TableContainer sx={{ 
          minWidth: "300px",
          minHeight:"200px",
          display: "flex"
        }}>
        {searchResults && searchResults.length > 0 && (
            <table cellPadding={0} cellSpacing={0} style={{
              "margin": "10px auto 6px",
              "borderRadius": "4px",
              "padding": "0",
              "boxShadow": "1px 1px 7px black",
              "background": "#e6e6e6",
              "width": "98%",
            }}>
              <thead>
                <tr style={{ cursor:"default"}}>
                  <td style={{
                    "padding": "10px",
                    "borderBottom": "3px solid #b1b1b1",
                    fontSize:"20px",
                    fontWeight:"bold"
                  }}>
                    Nombre
                  </td>
                  <td style={{
                    "padding": "10px",
                    "borderBottom": "3px solid #b1b1b1",
                  }}>
                    &nbsp;
                  </td>
                </tr>
              </thead>
              <tbody>
              {searchResults.map((clienteItem, index) => (
                <tr key={index} style={{
                  backgroundColor: (index % 2)? "#d4d4d4":"#c2c2c2",
                  cursor:"default"
                }}>
                <td style={{
                    "padding": "10px",
                    "borderBottom": "1px solid #b1b1b1",
                  }}>
                  {`${clienteItem.nombreResponsable} ${clienteItem.apellidoResponsable}`}
                </td>
                <td style={{
                    "padding": "10px",
                    "borderBottom": "1px solid #b1b1b1",
                    fontSize:"15px"
                  }}>
                  <SmallButton 
                    textButton="Seleccionar"
                    actionButton={()=>{
                      onClientClick(index,clienteItem)
                    }}
                  />
                </td>
                </tr>
              ))}
            
            </tbody>
            </table>

          )}
        </TableContainer>
      </Paper>
    </Grid>
  );
};

export default BoxBuscadorCliente;
