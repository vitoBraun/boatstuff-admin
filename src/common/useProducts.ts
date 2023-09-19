import { useQuery } from "react-query";
import { Product } from "../types/types";
import { fetchProduct, fetchProducts } from "./ApiService";

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
