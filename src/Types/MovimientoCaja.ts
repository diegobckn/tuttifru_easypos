interface MovimientoCaja {
    codigoUsuario: number,
    codigoSucursal: number,
    puntoVenta: string,
    fechaIngreso: string,
    tipo: string,
    detalleTipo: string,
    observacion: string,
    monto: number,
    idTurno: number,

    motivo: string | null,//retiro
    
    rutProveedor: string | null,//retiro
    
    idUsuario: string | number | null,//retiro
};

export default MovimientoCaja;