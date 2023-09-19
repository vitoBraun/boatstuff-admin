import { useQuery } from "react-query";
import { Product } from "../types/types";
import { conf } from "./config";

const fetchProducts = async () => {
  const resp = await fetch(`${conf.API_URL}/product/list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return resp.json();
};

const fetchProduct = async (productId: number) => {
  const resp = await fetch(`${conf.API_URL}/product/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return resp.json();
};

export function useProduct({
  productId,
  parameters,
}: {
  productId: number;
  parameters?: any;
}) {
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery<Product>("product", () => fetchProduct(productId), parameters);
  return {
    product,
    isLoading,
    isError,
    refetch,
  };
}

export function useProducts({ parameters }: { parameters?: any }) {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery<Product[]>("products", () => fetchProducts(), parameters);
  return {
    products,
    isLoading,
    isError,
    refetch,
  };
}
