import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel
} from "@mui/material";
import { SelectedOptionsContext } from "../../Context/SelectedOptionsProvider";
import ModelConfig from "../../../Models/ModelConfig";
import { Check, Dangerous } from "@mui/icons-material";
import User from "../../../Models/User";
import Validator from "../../../Helpers/Validator";


const InputCheckboxAutorizar = ({
  inputState,
  validationState,
  withLabel = true,
  fieldName = "check",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  vars = null
}) => {

  const {
    pedirSupervision,
  } = useContext(SelectedOptionsContext);


  const [inputValue, setInputValue] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")

  const checkCambio = () => {
    pedirSupervision(label, () => {
      setInputValue(!inputValue)
    })
  }
  return (
    <>
      {withLabel && (

        <label onClick={ checkCambio }
          style={{
            userSelect: "none",
            fontSize: "19px",
            display: "inline-block",
            margin: "10px 0"
          }}>
          {label}
        </label>
      )}

      <input
        type="checkbox"
        checked={inputValue}
        onClick={checkCambio}
        onChange={() => { }}
        style={{
          position: "relative",
          top: "4px",
          width: "50px",
          height: "20px"
        }}
      />
    </>
  );
};

export default InputCheckboxAutorizar;
