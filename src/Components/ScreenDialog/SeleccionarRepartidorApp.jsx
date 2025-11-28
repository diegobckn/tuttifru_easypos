import React, { useState, useEffect, useContext } from "react";

import {
  Grid,
  Paper,
  Dialog,
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

import SmallButton from "../Elements/SmallButton";
import Shop from "../../Models/Shop";
import System from "../../Helpers/System";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Atudepa from "../../Models/Atudepa";
export const defaultTheme = createTheme();


export default function ({
  openDialog,
  setOpenDialog,
  onSelect
}) {
  const {
    showLoading,
    hideLoading,
    showLoadingDialog,
    showMessage
  } = useContext(SelectedOptionsContext);

  const [repartidores, setRepartidores] = useState([])


  const loadRepartidores = () => {
    showLoading("Cargando horarios")
    Atudepa.getRepartidores((resp) => {
      console.log("resp repartidores", resp)
      hideLoading()
      console.log("normal", resp.info)
      setRepartidores(resp.info)
    }, (er) => {
      showMessage(er)
      hideLoading()
    })
  }

  useEffect(() => {
    if (!openDialog) return
    loadRepartidores()
  }, [openDialog]);


  return (<Dialog open={openDialog} maxWidth="lg" onClose={() => {
    setOpenDialog(false)
  }}
  >
    <DialogTitle>
      Seleccionar repartidor
    </DialogTitle>
    <DialogContent>

      <Grid container spacing={2} sx={{ padding: "2%" }}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Table sx={{ border: "1px ", borderRadius: "8px" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {repartidores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>No hay registros</TableCell>
                </TableRow>
              ) : (
                repartidores.map((repartidor, ix) => (
                  <TableRow key={ix}>
                    <TableCell>{repartidor.id}</TableCell>
                    <TableCell>{repartidor.full_name}</TableCell>
                    <TableCell>
                      <SmallButton actionButton={() => {
                        onSelect(repartidor)
                        setOpenDialog(false)
                      }} textButton={"Seleccionar"} />
                    </TableCell>
                  </TableRow>))
              )}
            </TableBody>
          </Table>


        </Grid>

      </Grid>


    </DialogContent>
    <DialogActions>
      <Button onClick={() => {
        setOpenDialog(false)
      }}>Atras</Button>
    </DialogActions>
  </Dialog>);
}
