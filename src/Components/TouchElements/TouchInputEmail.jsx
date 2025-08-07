import React, { useState, useContext, useEffect, useRef } from "react";

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
import System from "../../Helpers/System";
import InputName from "../Elements/Compuestos/InputName";
import InputEmail from "../Elements/Compuestos/InputEmail";


const TouchInputEmail = ({
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
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [showModalTeclado, setShowModalTeclado] = useState(false)

  const [valueInput, setValueInput] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const ref = useRef(null)

  // useEffect(()=>{
  //   if(!showModalTeclado){
  //     System.intentarFoco(ref)
  //   }
  // },[showModalTeclado])

  return (
    <>
      <InputEmail
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

        onEnter = {onEnter}
        onRef={(r)=>(ref.current = r.current)}

        onClick={() => {
          const debeAbrir = ModelConfig.get("abirTecladosTouchSiempre")
          if (debeAbrir) {
            setShowModalTeclado(true)
          }

        }}

        endAdornment={<InputAdornment position="end">
          <Button onClick={() => {
            setShowModalTeclado(true)
            return false
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

      <IngresarTexto
        title={label}
        openDialog={showModalTeclado}
        setOpenDialog={setShowModalTeclado}
        varChanger={setValueInput}
        isUrl={true}
        isEmail={true}
        varValue={valueInput}

        onEnter={() => {
          setTimeout(() => {
            setShowModalTeclado(false)
          }, 300);
        }}
      />
    </>
  );
};

export default TouchInputEmail;
