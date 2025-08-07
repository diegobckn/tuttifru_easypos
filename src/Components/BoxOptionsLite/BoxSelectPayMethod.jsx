import React, { useContext, useState, useEffect } from "react";
import {
  Button
} from "@mui/material";
import ModelConfig from "../../Models/ModelConfig";

const BoxSelectPayMethod = ({ 
  onChange,
  metodoPago,
  excludes = []
}) => {

  const [allExcludes, setAllExcludes] = useState([])

  useEffect(()=>{
    setAllExcludes(excludes)
    if(!ModelConfig.get("pagarConCuentaCorriente")){
      setAllExcludes(excludes.concat(["CUENTACORRIENTE"]))
    }
  },[])

  return (
          <table>
            <tbody>
            <tr>
              { !allExcludes.includes("EFECTIVO") &&(
                <td><Button
                id={`${metodoPago}-btn`}
                sx={{ height: "60px" }}
                fullWidth
                variant={metodoPago === "EFECTIVO" ? "contained" : "outlined"}
                onClick={() => onChange("EFECTIVO")}
                >
                Efectivo
              </Button></td>
              ) }

              { !allExcludes.includes("DEBITO") &&(
              <td>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "60px" }}
                variant={metodoPago === "DEBITO" ? "contained" : "outlined"}
                onClick={() => onChange("DEBITO")}
                fullWidth
              >
                Débito
              </Button>
              </td>
              ) }
              { !allExcludes.includes("CREDITO") &&(
              <td>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "60px" }}
                variant={metodoPago === "CREDITO" ? "contained" : "outlined"}
                onClick={() => onChange("CREDITO")}
                fullWidth
              >
                Crédito
              </Button>
              </td>
              ) }
              { !allExcludes.includes("TRANSFERENCIA") &&(
              <td>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "60px" }}
                variant={
                  metodoPago === "TRANSFERENCIA" ? "contained" : "outlined"
                }
                onClick={() => {
                  onChange("TRANSFERENCIA");
                }}
                fullWidth
              >
                Transferencia
              </Button>
              </td>
              ) }
              { !allExcludes.includes("CUENTACORRIENTE") &&(
              <td>
              <Button
                id={`${metodoPago}-btn`}
                sx={{ height: "60px" }}
                disabled={false}
                variant={
                  metodoPago === "CUENTACORRIENTE" ? "contained" : "outlined"
                }
                onClick={() => {
                  onChange("CUENTACORRIENTE");
                }}
                fullWidth
              >
                CUENTA CORRIENTE
              </Button>
              </td>
              ) }
            </tr>
            </tbody>
          </table>
  );
};

export default BoxSelectPayMethod;
