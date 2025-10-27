import StorageSesion from '../Helpers/StorageSesion.ts';
import BaseConfig from "../definitions/BaseConfig.ts";
import Product from './Product.ts';
import IProductSold from '../Types/IProductSold.ts';
import Singleton from './Singleton.ts';
import ProductSold from './ProductSold.ts';
import axios from 'axios';
import ModelConfig from './ModelConfig.ts';
import Sales from './Sales.ts';


class SalesDummy extends Sales {

  constructor() {
    super()
    this.sesionProducts = new StorageSesion("dummy_sales_products");
  }

  //el original cambia al envase su misma cantidad
  checkQuantityEnvase(index: number) {
  }


  changeQuantityByIndex(index: number, quantity: number, removeIfQuantityIs0 = false) {
    this.products[index].quantity = quantity;
    this.products[index].updateSubtotal();

    this.checkQuantityEnvase(index)

    if (removeIfQuantityIs0 && this.products[index].quantity <= 0) {
      console.log("eliminando")
      this.products.splice(index, 1);
    }
    this.sesionProducts.guardar(this.products)
    return (this.products);
  }

  removeFromIndex(index: number) {
    if (this.products.length < 1) this.loadFromSesion()
    return super.removeFromIndex(index)
  }
};


export default SalesDummy;