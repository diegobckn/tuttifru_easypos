import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const BuscadorClientes = ({ setFilteredCustomers }) => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Clientes/GetAllClientes"
        );
        setClientes(response.data.cliente);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
    filterCustomers(event.target.value);
  };

  const filterCustomers = (query) => {
    const filtered = clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(query.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(query.toLowerCase()) ||
      cliente.rut.toLowerCase().includes(query.toLowerCase()) ||
      cliente.codigoCliente.toString().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={handleBusquedaChange}
      />
    </div>
  );
};

const CustomerGrid = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://www.easyposdev.somee.com/api/Clientes/GetAllClientes"
        );
        setCustomers(response.data.cliente);
        setFilteredCustomers(response.data.cliente);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (codigoCliente) => {
    // Lógica para abrir modal con el código de cliente seleccionado
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <BuscadorClientes setFilteredCustomers={setFilteredCustomers} />
      </Grid>
      {filteredCustomers.map((customer) => (
        <Grid item xs={12} sm={6} md={4} key={customer.codigoCliente}>
          <Card sx={{ margin: "5px" }}>
            <CardContent>
              <Typography variant="h7" component="h7">
                ID Cliente: {customer.codigoCliente}
              </Typography>
              <Typography variant="body1" component="p">
                Nombre: {customer.nombre} {customer.apellido}<br /> <hr />
                Rut: {customer.rut}<br /><hr />
                Dirección:{customer.direccion},<br />{customer.comuna}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" variant="contained" onClick={() => handleOpenModal(customer.codigoCliente)}>
                Agrega Sucursal
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CustomerGrid;
