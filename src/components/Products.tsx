import React, { ReactElement } from "react";
import { useProducts } from "../common/useProducts";
import { Product } from "../types/types";
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const { products, isLoading, isError } = useProducts({ parameters: {} });

  const navigate = useNavigate();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  const Headers = [
    "id",
    "title",
    "short description",
    "availability",
    "subcategory",
    "price",
    "images",
  ];

  const Cell = ({
    text,
  }: {
    text?: string | number | ReactElement | string[] | null;
  }): ReactElement => {
    return (
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        {text}
      </td>
    );
  };
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  {Headers.map((header) => (
                    <th key={header}
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(products as Product[])?.map((product) => (
                  <tr key={product.id}
                    className="bg-gray-100 border-b hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    <Cell text={product.id} />
                    <Cell text={product.title} />
                    <Cell text={product.shortDescription} />
                    <Cell text={product.isAvailable ? "YES" : "NO"} />
                    <Cell text={product.subcategoryId} />
                    <Cell text={product.price} />
                    <Cell text={product.images} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
