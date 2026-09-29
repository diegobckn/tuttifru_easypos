import React, { useState, useContext, useEffect } from "react";
import BoxFamilias from "./BoxFamilias";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";

const BoxProductoFamilia = ({
  selectProduct = true,
  addDirectoToSales = true,
  onSelect = () => { }
}) => {

  const {
    userData,
    addToSalesData,
    showConfirm,
    showMessage,
    showLoading,
    hideLoading,
    cliente
  } = useContext(SelectedOptionsContext);


  const handleSelectProduct = (product, cat, subcat, fam, subfam) => {
    if (!addDirectoToSales) {
      onSelect(product, cat, subcat, fam, subfam)
      return
    }
    addToSalesData(product)
  }

  return (
    <BoxFamilias
      selectProduct={selectProduct}
      onSelect={handleSelectProduct}
    />
  );
};

export default BoxProductoFamilia;
