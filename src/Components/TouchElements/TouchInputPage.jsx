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
  onBlur = () => { },
  onConfirmModal = () => { },
  onChangeModal = () => { },
}) => {

  const {
    showMessage
  } = useContext(SelectedOptionsContext);

  const [showModalTeclado, setShowModalTeclado] = useState(false)

  const [page, setPage] = inputState ? inputState : vars ? vars[0][fieldName] : useState("")
  const ref = useRef(null)

  const [antesModalValue, setAntesModalValue] = useState("")
  const [despuesModalValue, setDespuesModalValue] = useState("")

  useEffect(() => {
    // console.log("detectando cambios en antesModalValue o en despuesModalValue")
    // console.log("detectando cambios en antesModalValue", antesModalValue)
    // console.log("detectando cambios en despuesModalValue", despuesModalValue)
    if (antesModalValue && despuesModalValue && antesModalValue != despuesModalValue) {
      // console.log("antesModalValue != despuesModalValue")
      onChangeModal()
    }
  }, [despuesModalValue])

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.querySelector("input").addEventListener("blur", function () {
        onBlur()
      })
    }
  }, [ref])

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

        onEnter={onEnter}
        onRef={(r) => {
          (ref.current = r.current)
        }}

        onClick={() => {
          const debeAbrir = ModelConfig.get("abirTecladosTouchSiempre")
          if (debeAbrir) {
            setShowModalTeclado(true)
          }

          setAntesModalValue(inputState[0] + "")

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
            onEnter()
            setDespuesModalValue(inputState[0] + "")
          }, 300);
        }}

        onConfirm={(vlMd) => {
          onConfirmModal()
          setDespuesModalValue(inputState[0] + "")

        }}
      />
    </>
  );
};

export default TouchInputPage;
