import { useQuery } from "react-query";
import { ICategory } from "../types/types";
import { conf } from "./config";

const fetchProducts = async (level?: number) => {
  const response = await fetch(`${conf.API_URL}/categories/list/${level}`);
  return response.json();
};
export default function useCategories({ level }: { level?: number }) {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<ICategory[]>("products", () => fetchProducts(level));
  return {
    categories,
    isLoading,
    isError,
  };
}
