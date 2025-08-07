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


const TouchInputPage = ({
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

  const [page, setPage] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const ref = useRef(null)

  // useEffect(()=>{
  //   if(!showModalTeclado){
  //     System.intentarFoco(ref)
  //   }
  // },[showModalTeclado])

  return (
    <>
      <InputPage
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
        varChanger={(newVal) => {
          if (Validator.isUrl(newVal)) {
            setPage(newVal)
          }
        }}
        isUrl={true}
        varValue={page}

        onEnter={() => {
          setTimeout(() => {
            setShowModalTeclado(false)
          }, 300);
        }}
      />
    </>
  );
};

export default TouchInputPage;
