import { ICategory, Product, Subcategory } from "../types/types";
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
  if (!response.ok) {
    alert(
      `Bro, there is some error with adding new product, probably empty fields or incorrect data. Product was not added`
    );
  }
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
    throw new Error("Something went wrong updating the product");
  }
  return data;
};

export const deleteProduct = async (productId: string) => {
  const response = await fetch(`http://localhost:1333/product/${productId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Something went wrong deleting product");
  }
  return data;
};

export const createNewCategory = async (category: ICategory) => {
  const response = await fetch("http://localhost:1333/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  const data = await response.json();
  return data;
};

export const createNewSubcategory = async (subcategory: Subcategory) => {
  const response = await fetch("http://localhost:1333/category/subcategory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subcategory),
  });
  if (!response.ok) {
    alert(`Bro, there is some error in adding subcategory, try again`);
  }
  const data = await response.json();
  return data;
};

export const deleteCategory = async (categoryId: string) => {
  const response = await fetch(`http://localhost:1333/category/${categoryId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    alert(
      `By the way,  you can't delete category if it has subcategory, bro. Delete all its subcategories first`
    );
  }
  return data;
};

export const deleteSubcategory = async (subcategoryId: string) => {
  const response = await fetch(
    `http://localhost:1333/category/subcategory/${subcategoryId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Something went wrong deleting subcategory");
  }
  return data;
};
