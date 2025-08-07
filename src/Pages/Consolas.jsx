/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Button, TextField, Grid, Container, Paper } from '@mui/material';

import Navbar from '../Components/Navbar/Navbar';

const LoginScreen = () => {
  const [sellerCode, setSellerCode] = useState('');
  const [code, setCode] = useState('');
  const [activeField, setActiveField] = useState('sellerCode');

  const handleFieldFocus = (field) => {
    setActiveField(field);
  };

  const handleNumberClick = (number) => {
    if (activeField === 'sellerCode') {
      setSellerCode(sellerCode + number);
    } else if (activeField === 'code') {
      setCode(code + number);
    }
  };

  const handleDeleteOne = () => {
    if (activeField === 'sellerCode') {
      setSellerCode(sellerCode.slice(0, -1));
    } else if (activeField === 'code') {
      setCode(code.slice(0, -1));
    }
  };

  const handleDeleteAll = () => {
    if (activeField === 'sellerCode') {
      setSellerCode('');
    } else if (activeField === 'code') {
      setCode('');
    }
  };

  const handleEnter = () => {
    // You can implement your login logic here
    if (sellerCode === 'correct_seller_code' && code === 'correct_code') {
      alert('Login Successful');
    } else {
      alert('Login Failed');
    }
  };

  return (
    <Container>
      <Navbar/>
      <Grid container justifyContent="center" style={{ height: '100vh', alignItems: 'center' }}>
        <Grid item xs={6}>
         
          <Paper elevation={13} style={{ padding: '20px' }}>
            <Grid container spacing={2}>
            
              <Grid item xs={12}>
                <TextField
                  label="Ingresa Código Vendedor"
                  variant="outlined"
                  fullWidth
                  value={sellerCode}
                  onFocus={() => handleFieldFocus('sellerCode')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Código"
                  variant="outlined"
                  fullWidth
                  value={code}
                  onFocus={() => handleFieldFocus('code')}
                />
                <Grid item xs={3}>
                <Button  variant="outlined" onClick={handleDeleteOne}>A</Button>
              </Grid>
              </Grid>
              
              {Array.from({ length: 10 }, (_, i) => (
                <Grid item xs={3} key={i}>
                  <Button variant="outlined" onClick={() => handleNumberClick(i.toString())}>{i}</Button>
                </Grid>
              ))}
              
              <Grid item xs={3}>
                <Button variant="outlined" onClick={handleDeleteOne}>Borrar</Button>
              </Grid>
              <Grid item xs={3}>
                <Button variant="outlined" onClick={handleDeleteAll}>Limpiar</Button>
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" color="primary" onClick={handleEnter}>Enter</Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginScreen;