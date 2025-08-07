/* eslint-disable no-unused-vars */
// StepperComponent.js
import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import Step1Component from "./Step1Component";
import Step2Component from "./Step2Component";
import Step3Component from "./Step3Component";
import Step4Component from "./Step4Component";
import Step5Component from "./Step5Component";

const steps = ["Paso 1", "Paso 2", "Paso 3", "Paso 4", "Paso 5"];

const StepperComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [data, setData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  });

  useEffect(() => {
    // Load data from local storage if available
    const storedData = localStorage.getItem("stepperData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);
  const handleNext = (stepData) => {
    const updatedData = { ...data, [`step${activeStep + 1}`]: stepData };
    setData(updatedData);

    if (activeStep === steps.length - 1) {
      console.log("Complete data submitted:", updatedData);
      axios
        .post(
          "https://www.easyposdev.somee.com/api/ProductosTmp/AddProducto",
          updatedData
        )
        .then((response) => {
          // handle the response from the server
        })
        .catch((error) => {
          // handle any errors
        });
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    localStorage.setItem("stepperData", JSON.stringify(updatedData));
  };

  // const handleNext = (stepData) => {
  //   // Update the data object with the data from the current step
  //   const updatedData = { ...data, [`step${activeStep + 1}`]: stepData };
  //   setData(updatedData);

  //   if (activeStep === steps.length - 1) {
  //     // Log the complete data when the last step is reached
  //     console.log("Complete Data Submitted:", updatedData);

  //     // Send the complete data to the server using Axios
  //     axios
  //       .post("your-api-endpoint", updatedData)
  //       .then((response) => {
  //         // Handle the response from the server
  //       })
  //       .catch((error) => {
  //         // Handle any errors
  //       });
  //   } else {
  //     // Save the data for the current step and proceed to the next step
  //     localStorage.setItem("stepperData", JSON.stringify(updatedData));
  //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   }
  // };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    // Assuming 'data' contains the collected data from all steps
    console.log("Submitting Data:", data);
  
    // Send the data to the server using Axios (replace with your API endpoint)
    axios
      .post(
        "https://www.easyposdev.somee.com/api/ProductosTmp/AddProducto",
        data
      )
      .then((response) => {
        // Handle the response from the server if needed
        console.log("Server Response:", response.data);
  
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
  
        // Reset the data and step state:
        setData({
          step1: {},
          step2: {},
          step3: {},
          step4: {},
          step5: {},
        });
        // setActiveStep(0);
  
        // Set success message and open dialog
        setDialogMessage("Producto guardado con exito");
        setOpen(true);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error:", error);
  
        // Set error message and open dialog
        setDialogMessage("Error al guardar");
        setOpen(true);
      });
  
    // Agregar un console.log aquí
    console.log("Producto guardado");
  
    // Si ves este mensaje, significa que la función handleSubmit ha sido ejecutada completamente.
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Step1Component data={data.step1} onNext={handleNext} />;
      case 1:
        return <Step2Component data={data.step2} onNext={handleNext} />;
      case 2:
        return <Step3Component data={data.step3} onNext={handleNext} />;
      case 3:
        return <Step4Component data={data.step4} onNext={handleNext} />;
      case 4:
        return <Step5Component data={data.step5} onNext={handleNext} />;

      default:
        return "Unknown step";
    }
  };

  return (
    <Container>
      <Paper sx={{ display: "flex", justifyContent: "center" ,marginBottom:"5px",marginRight:"13px"}}>
        <Typography variant="h5"> PRODUCTOS SIN CÓDIGO</Typography>
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
                volver
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  margin="dense"
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit({})}
                >
                  Terminar
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Notification"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StepperComponent;
