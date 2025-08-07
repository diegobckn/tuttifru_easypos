import React, { useState, useContext, useEffect } from "react";
import {
  Paper,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Avatar,
  TableContainer,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const UserProfileCard = () => {
  const { userData, clearSessionData, getUserData } = useContext(SelectedOptionsContext);
  const [vendedor, setVendedor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  useEffect(() => {
    // Simulación de obtención de datos del usuario después de un tiempo de espera
    const fetchData = () => {
      if(!userData){
        getUserData();
        return
      }

      if(userData == null){
        alert("Usuario no logueado");
        clearSessionData();
        navigate("/login");
        return
      }
        setVendedor({
          codigo: userData.codigoUsuario || "21",
          nombre:
            userData.nombres + " " + userData.apellidos || "Nombre Apellido",
          caja: "1",
          rol: userData.rol || "Rol del usuario",
          boleta: "323232321",
          operacion: "12123141",
        });
    };

    fetchData();
  }, [userData]);

  return (
    <TableContainer component={Paper} sx={{ background: "#859398",}}>
      <Table aria-label="simple table" sx={{ minWidth: 140 }}>
        <TableHead >
          <TableRow>
          <TableCell colSpan="2">
          <Typography sx={{ width: "100%", textAlign: "center" }}>Información Vendedor</Typography>
          </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vendedor && (
            <>
              <TableRow>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  component="th"
                  scope="row"
                >
                  Nombre y Apellidos
                </TableCell>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  align="right"
                >
                  {vendedor.nombre}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  component="th"
                  scope="row"
                >
                  Código
                </TableCell>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  align="right"
                >
                  {vendedor.codigo}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  component="th"
                  scope="row"
                >
                  Caja
                </TableCell>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  align="right"
                >
                  {vendedor.caja}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  component="th"
                  scope="row"
                >
                  Nº Última Operación
                </TableCell>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  align="right"
                >
                  {vendedor.operacion}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  component="th"
                  scope="row"
                >
                  Última Boleta
                </TableCell>
                <TableCell
                  sx={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  align="right"
                >
                  {vendedor.boleta}
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserProfileCard;
