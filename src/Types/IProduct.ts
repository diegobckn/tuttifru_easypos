interface IProduct {
    idProducto: number
    description: string | null,
    nombre: string | null,
    price: number | undefined
    precioVenta: number | undefined
};

export default IProduct;