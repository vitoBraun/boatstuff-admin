import { ICategory, Product, Subcategory } from "../types/types";
import { conf } from "./config";
import { prepareData } from "./utils";

const getToken = () => {
  return localStorage.getItem("token");
};

export const check = async () => {
  const resp = await makeApiRequest("/users/check");
  return resp.json;
};

export const createNewProduct = async (newData: Product) => {
  const response = await makeApiRequest(`/product/create`, {
    method: "POST",
    body: JSON.stringify(prepareData(newData)),
  });
  return response.json();
};

export const updateProduct = async (productData: Product) => {
  const response = await makeApiRequest(`/product`, {
    method: "PATCH",
    body: JSON.stringify(prepareData(productData)),
  });
  return response.json();
};

export const deleteProduct = async (productId: string) => {
  const response = await makeApiRequest(`/product/${productId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const fetchProducts = async () => {
  const resp = await makeApiRequest(`/product/list`);
  return resp.json();
};

export const fetchProduct = async (productId: number) => {
  const resp = await fetch(`/product/${productId}`);
  return resp.json();
};

export const fetchCategories = async () => {
  const response = await makeApiRequest(`/category/list/`);
  return response.json();
};

export const createNewCategory = async (category: ICategory) => {
  const response = await makeApiRequest(`/category`, {
    method: "POST",
    body: JSON.stringify(category),
  });
  return response.json();
};

export const createNewSubcategory = async (subcategory: Subcategory) => {
  const response = await makeApiRequest(`/category/subcategory`, {
    method: "POST",
    body: JSON.stringify(subcategory),
  });
  return response.json();
};

export const deleteCategory = async (categoryId: string) => {
  const response = await makeApiRequest(`/category/${categoryId}`, {
    method: "DELETE",
  });
  return response.json();
};

export const deleteSubcategory = async (subcategoryId: string) => {
  const response = await makeApiRequest(
    `/category/subcategory/${subcategoryId}`,
    {
      method: "DELETE",
    }
  );
  return response.json();
};

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await makeApiRequest(`/file/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });
  return response.json();
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const jsonCreds = JSON.stringify({
    email,
    password,
  });

  const response = await makeApiRequest(`/users/login`, {
    method: "POST",
    body: jsonCreds,
  });

  const data = await response.json();
  const { jwt } = data;
  localStorage.setItem("token", jwt);
  return true;
};

export const logout = async () => {
  const response = await makeApiRequest(`/users/logout`, {
    method: "POST",
  });
  return response.json;
};

async function makeApiRequest(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const opts = {
    ...(options?.method ? { method: options.method } : { method: "GET" }),
    ...(options?.headers
      ? { headers: options.headers }
      : {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }),
    ...(options?.body && { body: options.body }),
  };
  const response = await fetch(`${conf.API_URL}${url}`, opts);

  if (response.status === 401) {
    alert("Bro, you are not logged in, please log in");
    window.location.href = "/login";
  } else if (![200, 201].includes(response.status)) {
    throw new Error("Request failed, contact website administrator");
  }

  return response;
}
