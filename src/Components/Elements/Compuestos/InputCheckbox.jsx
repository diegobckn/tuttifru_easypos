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


const InputCheckbox = ({
  inputState,
  validationState,
  withLabel = true,
  fieldName = "check",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  vars = null
}) => {

  const [inputValue, setInputValue] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")

  return (
    <>
      {withLabel && (

        <label onClick={() => { setInputValue(!inputValue) }}
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
        onClick={() => { setInputValue(!inputValue) }}
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

export default InputCheckbox;
