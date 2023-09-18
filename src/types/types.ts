export type ICategory = {
  id: string;
  title: string;
  description: string;
};

export type Product = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  isNew: boolean;
  isAvailable: boolean;
  categories: ICategory[];
  images?: string[];
};
