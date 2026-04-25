/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import Model from '../../Models/Model';
import dayjs from 'dayjs';
import Conexion from '../../Models/Conexion';

export default function ({
  style = {

  },

  onGetConection = () => { },
  onLostConection = () => { }
}) {

  const INTERVAL = 10 * 1000

  const [estado, setEstado] = useState(null)
  const [intControl, setIntControl] = useState(null)
  const [ultimoCheck, setultimoCheck] = useState("")


  const fetchData = async () => {
    Conexion.getFromServer(() => {
      setEstado(1)
      onGetConection()
      setultimoCheck(dayjs().format("HH:mm") + "hs")
    }, (err) => {
      setEstado(0)
      onLostConection()
      setultimoCheck(dayjs().format("HH:mm") + "hs")
    })
  };

  useEffect(() => {
    setTimeout(() => {
      fetchData()
    }, 2000);
    if (intControl === null) {
      setIntControl(setInterval(() => {
        fetchData()
      }, INTERVAL))
    }
  }, [])

  return (
    <div style={{ style }}>
      {/* <Typography variant="body-md">Conexion</Typography> */}
      {estado !== null && (
        <Typography variant="p"
          sx={{
            padding: "10px",
            margin: "10px",
            backgroundColor: (estado ? "#01E401" : "#FF0033"),
            color: "#fff",
            borderRadius: "5px"
          }}
        >{estado ? "CONECTADO" : "SIN CONEXION"}
          <Typography sx={{
            margin: "0 10px"
          }}
            variant='span'>
            {ultimoCheck}
          </Typography>
        </Typography>
      )}
    </div>
  );
}