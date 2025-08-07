import React, { useState, useContext, useEffect } from "react";

import {
  TextField,
  InputAdornment,
  InputLabel,
  Button
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ModelConfig from "../../Models/ModelConfig";
import { Check, Dangerous, Keyboard } from "@mui/icons-material";
import User from "../../Models/User";
import Validator from "../../Helpers/Validator";
import IngresarTexto from "../ScreenDialog/IngresarTexto";
import InputPage from "../Elements/Compuestos/InputPage";
import IngresarNumeroORut from "../ScreenDialog/IngresarNumeroORut";
import InputNumber from "../Elements/Compuestos/InputNumber";


const TouchInputNumber = ({
  inputState,
  validationState,
  withLabel = true,
  autoFocus = false,
  fieldName = "url",
  label = fieldName[0].toUpperCase() + fieldName.substr(1),
  minLength = null,
  canAutoComplete = false,
  maxLength = 20,
  required = false,
  vars = null,
  onEnter = () => { },
  isDecimal = false,
  isRut = false,
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [showModalTeclado, setShowModalTeclado] = useState(false)

  const [inputValue, setInputValue] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")

  return (
    <>
      <InputNumber
        inputState={inputState}
        validationState={validationState}
        withLabel={withLabel}
        autoFocus={autoFocus}
        fieldName={fieldName}
        label={label}
        minLength={minLength}
        maxLength={maxLength}
        canAutoComplete={canAutoComplete}
        required={required}
        vars={vars}
        isRut={isRut}

        onClick={() => {

          const debeAbrir = ModelConfig.get("abirTecladosTouchSiempre")
          if (debeAbrir) {
            setShowModalTeclado(true)
          }

        }}

        isDecimal={isDecimal}

        endAdornment={<InputAdornment position="end">
          <Button onClick={() => {
            setShowModalTeclado(true)
          }}>
            <Keyboard sx={{
              color: "#868484",
              marginRight: "10px"
            }}
            />
          </Button>
        </InputAdornment>
        }
      />

      <IngresarNumeroORut
        title={label}
        openDialog={showModalTeclado}
        setOpenDialog={setShowModalTeclado}
        varChanger={(newVal) => {
          console.log("varChanger..")
          if (isDecimal && Validator.isDecimal(newVal)) {
            setInputValue(newVal);
            return false
          }

          if (!isDecimal && Validator.isNumeric(newVal)) {
            setInputValue(newVal);
          }

          if (isRut && Validator.isRut(newVal)) {
            setInputValue(newVal);
          }
        }}
        varValue={inputValue}

        onEnter={() => {
          setTimeout(() => {
            setShowModalTeclado(false)
          }, 300);
        }}

        isDecimal={isDecimal}
        isRut={isRut}
      />

    </>
  );
};

export default TouchInputNumber;
