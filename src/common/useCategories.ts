import { useQuery } from "react-query";
import { ICategory } from "../types/types";
import { fetchCategories } from "./ApiService";

export default function useCategories({ parameters }: { parameters: any }) {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<ICategory[]>("categories", () => fetchCategories(), parameters);
  return {
    categories,
    isLoading,
    isError,
  };
}
