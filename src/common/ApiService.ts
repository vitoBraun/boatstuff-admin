import { Product } from "../types/types";
import { conf } from "./config";
import { prepareData } from "./utils";

export const fetchProducts = async () => {
  const resp = await fetch(`${conf.API_URL}/product/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return resp.json();
};

export const fetchProduct = async (productId: number) => {
  const resp = await fetch(`${conf.API_URL}/product/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return resp.json();
};

export const fetchCategories = async () => {
  const response = await fetch(`${conf.API_URL}/category/list/`);
  return response.json();
};

export const createNewProduct = async (newData: Product) => {
  const response = await fetch("http://localhost:1333/product/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prepareData(newData)),
  });

  const data = await response.json();
  return data;
};

export const updateProduct = async (productData: Product) => {
  const response = await fetch("http://localhost:1333/product", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prepareData(productData)),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return data;
};
