import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Paper,
} from "@mui/material";
import axios from "axios";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";

const steps = ["Paso 1", "Paso 2"];

const StepperSI = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
 

  const [stepData, setStepData] = useState({
    selectedCategoryId: "",
    selectedSubCategoryId: "",
    selectedFamilyId: "",
    selectedSubFamilyId: "",
    marca: "",
    nombre: "",
    selectedUnidadId:"",
    precioCosto:"",
    stockInicial:"",
    precioVenta:"",

    // Otros campos necesarios para el paso 3
  });

  useEffect(() => {
    const storedData = localStorage.getItem("stepperData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setStepData(parsedData.step1 || {});
      setStepData(parsedData.step3 || {});
    }
  }, []);

  // useEffect(() => {
  //   const storedData = localStorage.getItem("stepperData");
  //   if (storedData) {
  //     setData(JSON.parse(storedData));
  //   }
  // }, []);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setStepData((prevData) => ({ ...prevData,  }));
   
  };
  

  // const handleNext = (stepData) => {
  //   const updatedData = { ...data, [`step${activeStep + 1}`]: stepData };
  //   setData(updatedData);
  //   localStorage.setItem("stepperData", JSON.stringify(updatedData));
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const postData = {
        step1: step1Data,
        step3: step3Data,
      };

      const response = await axios.post(
        "https://www.easyposdev.somee.com/api/ProductosTmp/AddProducto",
        postData
      );

      console.log("Server Post Response:", response.data);

      setStep1Data({}); // Reinicia los datos del paso 1
      setStep3Data({}); // Reinicia los datos del paso 3

      setDialogMessage("Producto guardado con éxito");
      setOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setDialogMessage("Error al guardar");
      setOpen(true);
    }
  };

  const handleSaveStep5 = async (stepData) => {
    try {
      const updatedData = { ...data, step5: stepData };
      setData(updatedData);
      localStorage.setItem("stepperData", JSON.stringify(updatedData));

      await handleSubmit(); // Envía los datos al servidor
    } catch (error) {
      console.error("Error:", error);
      setDialogMessage("Error al guardar");
      setOpen(true);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Step1 data={stepData} onNext={handleNext} setStepData={setStepData} />;
      case 1:
        return <Step3 data={stepData} onNext={handleNext}setStepData={setStepData}  />;
      // return <Step2 data={data.step2} onNext={handleNext} />;
      case 2:
      // return <Step6 data={data.step6} onNext={handleNext} />;
      // return <Step4 data={data.step4} onNext={handleNext} />;
      // return <Step3 data={data.step3} onNext={handleNext} />;
    }
  };

  return (
    <Container>
      <Paper
        sx={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}
      >
        {/* <Typography variant="h5"> PRODUCTOS CON CÓDIGO</Typography> */}
      </Paper>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <p>Todos los pasos han sido completados!!.</p>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Volver
              </Button>
              {/* {activeStep === steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  margin="dense"
                  onClick={handleSubmit}
                >
                  Enviar
                </Button>
              )} */}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default StepperSI;
