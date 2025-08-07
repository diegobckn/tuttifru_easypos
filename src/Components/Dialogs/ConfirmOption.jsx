import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Card,
  CardContent,
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
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import SmallButton from "../Elements/SmallButton";

const ConfirmOption = ({
    openDialog,
    setOpenDialog,

    textTitle = "Confirmar",
    textConfirm,
    onClick,
    buttonOptions
  }) => {

  return (
    <Dialog open={openDialog} onClose={()=>{
      setOpenDialog(false)
    }}
    >
      <DialogTitle style={{
        fontSize:"28px",
        textAlign:"center"
      }}>{textTitle}</DialogTitle>
      <DialogContent style={{
        minWidth:"300px",
        padding:20
      }}>
      <Typography style={{
        textAlign:"center",
        fontSize:"22px"
      }}>{textConfirm}</Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        {buttonOptions.map((option,ix)=>{
          return (
            <SmallButton key={ix} actionButton={()=>{
              onClick(ix)
              setOpenDialog(false)
            }}
            style={{
              fontSize:"20px",
              // backgroundColor:"green",
              // color:"white"
            }}

            textButton={option}
            />
          )
        })}

      </DialogActions>
      </Dialog>
  );
};

export default ConfirmOption;
