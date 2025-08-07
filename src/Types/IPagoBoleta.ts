export type IProductoPagoBoleta ={
    codProducto: number, 
    cantidad: number, 
    precioUnidad: number, 
    descripcion: string, 
}

export type ITransferencia ={
    idCuentaCorrientePago: number,
    nombre: string,
    rut: string,
    banco: string,
    tipoCuenta: string,
    nroCuenta: string,
    fecha: string, //"2024-05-09T01:43:23.476Z"
    nroOperacion: string,
}

interface IPagoBoleta {
    idUsuario: number,
    codigoClienteSucursal: number,
    codigoCliente: number,
    total: number,
    products: any[],
    metodoPago: string,
    transferencias: any,
};

export default IPagoBoleta;