import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  Paper,
  Avatar,
  Box,
  Grid,
  Stack,
  Typography,
  CircularProgress,
  Snackbar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  MenuItem,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  DialogActions,
  TextField,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import System from "../../Helpers/System";
import PagoBoleta from "../../Models/PagoBoleta";
import TecladoPagoCaja from "./../Teclados/TecladoPagoCaja"
import Validator from "../../Helpers/Validator";

const BoxCantidadBillete = ({ 
  textoBillete,
  cantidad,
  setCantidad,
  hasFocus = false,
  onFocus= ()=>{},
  onEnter= ()=>{}
}) => {

  const handleKeydownInput = (e,a)=>{
    if(e.keyCode == 13){
      onEnter(textoBillete)
    }
  }
  
  return (
    <table style={{
    }}>
      <tbody>
        <tr>
        <td style={{
          width: "100%",
          textAlign:"right"
        }}>
          <Typography>
            ${textoBillete}
          </Typography>
        </td>
      <td style={{
          width: "100%",
          textAlign:"right"
        }}>
        <input
          margin="dense"
          value={cantidad}
          ref={input => input!=null && hasFocus && input.focus()}
          onKeyDown={handleKeydownInput}
          style={{
            width:"40px",
            height: "30px",
            padding: "0",
            border: "1px solid #919090",
            borderRadius: "4px",
            textAlign: "center",
            margin: "0px",
          }}
          onFocus={()=>{
            onFocus(textoBillete)
          }}

          onChange={(e) => {
            const value = e.target.value;
            if (!value.trim()) {
              setCantidad(0);
            } else {
              if(Validator.isCantidad(value))
              setCantidad(parseFloat(value));
            }
          }}
          />
          </td>
          <td style={{
          width: "100%",
          textAlign:"right"
        }}>

          <input
          margin="dense"
          value={cantidad * parseInt(textoBillete)}
          
          style={{
            width:"150px",
            height: "30px",
            padding: "5px",
            border: "1px solid #919090",
            borderRadius: "4px",
            textAlign: "center",
            margin: "0px",
          }}
          disabled={true}
          onChange={(e) => {
            const value = e.target.value;
            if (!value.trim()) {
              setCantidad(0);
            } else {
              setCantidad(parseFloat(value));
            }
          }}
          />

          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default BoxCantidadBillete;
