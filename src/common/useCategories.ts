import { useQuery } from "react-query";
import { ICategory } from "../types/types";
import { conf } from "./config";

const fetchProducts = async (level?: number) => {
  const response = await fetch(`${conf.API_URL}/category/list/${level}`);
  return response.json();
};
export default function useCategories({ level }: { level?: number }) {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<ICategory[]>("categories", () => fetchProducts(level), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  return {
    categories,
    isLoading,
    isError,
  };
}
