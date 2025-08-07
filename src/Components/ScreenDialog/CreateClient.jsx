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
  Container,
  useTheme,
  useMediaQuery,

  IconButton,
  Menu,
  TextField,
  Chip,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup

} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import FormCreateClient from "../Forms/FormCreateClient";
import SendingButton from "../Elements/SendingButton";

const CreateClient = ({
  openDialog,
  setOpenDialog
}) => {


  const {
    userData,
    salesData,
    grandTotal
  } = useContext(SelectedOptionsContext);

  const [sending, setSending] = useState(false);


  return (
      <Dialog open={openDialog} onClose={ ()=> { setOpenDialog(false) } } maxWidth={"md"}>
        <DialogTitle>Crear Cliente</DialogTitle>
        <DialogContent>
          <FormCreateClient
            onFinish={()=>{
              setOpenDialog(false)
            }}
            sending={sending}
            setSending={setSending}
            />
        </DialogContent>
        <DialogActions>
          <SendingButton
            textButton={"Crear"}
            sendingText="Creando cliente"
            actionButton={()=>{
              setSending(true)
            }}
            sending={sending}
          />
          <Button onClick={ ()=> { setOpenDialog(false)  } }>Atras</Button>
        </DialogActions>
      </Dialog>
  );
};

export default CreateClient;
