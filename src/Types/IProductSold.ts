import IProduct from "./IProduct";

interface IProductSold extends IProduct {
    cantidad: number,
    total: number,

    ocultarEnListado: boolean | undefined
    esAgregado: boolean | undefined
};

export default IProductSold;