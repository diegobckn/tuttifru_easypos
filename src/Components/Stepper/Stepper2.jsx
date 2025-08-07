/* eslint-disable no-undef */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState,useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import Step1Component from "./Step1Component"; // Import your custom components for each step
import Step2Component from "./Step2Component";
import Step3Component from "./Step3Component";
import Step4Component from "./Step4Component";
import Step5Component from "./Step5Component";
import Step6Component from "./Step6Component";
// import Step7Component from "./Step7Component";

const App = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState({});

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleStepSubmit = (stepData) => {
    setData((prevData) => ({ ...prevData, ...stepData }));
    localStorage.setItem('stepperData', JSON.stringify({ ...data, ...stepData }));
  };

  useEffect(() => {
    const storedData = localStorage.getItem('stepperData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = (data) => {
    // Handle form submission here
  };

  const steps = [
    { label: "Paso 1" ,component:<Step1Component onSubmit={handleStepSubmit} data={data} />},
    { label: "Paso 2" ,component:<Step2Component onSubmit={handleStepSubmit} data={data} />},
    { label: "Paso 3" ,component:<Step3Component onSubmit={handleStepSubmit} data={data} />},
    { label: "Paso 4" ,component:<Step4Component onSubmit={handleStepSubmit} data={data}  />},
    { label: "Paso 5" ,component:<Step5Component onSubmit={handleStepSubmit} data={data} />},
    { label: "Paso 6" ,component:<Step6Component onSubmit={handleStepSubmit} data={data} />},
  ];

  const StepComponent = steps[activeStep].component;

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Paper
        elevation={3}
        style={{
          padding: "16px",
          marginBottom: "16px",
          width: "80%",
          height: "80%",
        }}
      >
        <Typography variant="subtitle2" align="right">
          Paso actual: {activeStep + 1}
        </Typography>
      </Paper>

      <Stepper
        activeStep={activeStep}
        alternativeLabel
        style={{ width: "80%", height: "80%" }}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div style={{ width: "80%", marginTop: "16px" }}>
      {steps[activeStep].component}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Volver
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
          >
            {/* {activeStep === steps.length ? "Guardar" : "Siguiente"} */}
            {activeStep === steps.length - 1 ? "Guardar" : "Siguiente"}
          </Button>

          <Button onClick={handleReset}>Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default App;
