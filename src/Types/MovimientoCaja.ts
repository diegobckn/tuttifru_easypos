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

    motivo: string | null | undefined,//retiro
    
    rutProveedor: string | null | undefined,//retiro
    
    idUsuario: string | null | undefined,//retiro
};

export default MovimientoCaja;