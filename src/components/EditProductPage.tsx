import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Product } from '../types/types'
import { useFormik } from 'formik';
import { useParams } from "react-router-dom";
import useProducts from '../common/useProducts';


const TextField = ({ onChange, value, name, label, ...restProps }: { onChange: (e: ChangeEvent<HTMLInputElement>) => void, value: string | number, name: string, label: string }) => {
  return <><label htmlFor="title" className="text-sm text-navy-700 font-bold">{label}</label>
    <input
      type="text"
      name={name}
      onChange={onChange}
      value={value}
      className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500"
      {...restProps}
    /></>
}

const TextArea = ({ onChange, value, name, label, ...restProps }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, value: string | number, name: string, label: string }) => {
  return <><label htmlFor="title" className="text-sm text-navy-700 font-bold">{label}</label>
    <textarea
      rows={3}
      name={name}
      onChange={onChange}
      value={value}
      className="mt-2 flex  w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500"
      {...restProps}
    /></>
}

export default function ProductEditPage({ initialValues }: { initialValues?: Product }) {
  let { id } = useParams();

  const defaultValues: Product = {
    id: '',
    title: '',
    shortDescription: '',
    description: '',
    price: 0,
    isNew: true,
    isAvailable: true,
    categories: [],
  }

  const { products, isLoading, isError } = useProducts(Number(id), { enabled: !initialValues })


  const [fetchetProduct, setFetchedProduct] = useState<Product>(defaultValues)
  console.log(fetchetProduct)

  const hasLoaded = useRef(false)

  const formik = useFormik({
    initialValues: fetchetProduct,
    onSubmit: (values) => {
      console.log(values)
    }
  });

  const handleFieldChange = function (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { setFetchedProduct(prev => ({ ...prev, [e.target.name]: e.target.value })) }


  useEffect(() => {
    if (!hasLoaded.current) {
      if (products) {
        setFetchedProduct(products as Product)
        hasLoaded.current = true
      }
    }

  }, [products])

  if (isLoading) return <div> LOADING...</div>

  if (isError) return <div> ERROR </div>

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <h2>{!id ? 'Create' : 'Edit'} product {fetchetProduct.title ?? ""}</h2>
      <form className="px-20 w-1/2" onSubmit={formik.handleSubmit}>
        <TextField name="title" label="Title" value={fetchetProduct.title} onChange={handleFieldChange} />
        <TextField name="shortDescription" label="Short description" value={fetchetProduct.shortDescription} onChange={handleFieldChange} />
        <TextArea name="description" label="Description" value={fetchetProduct.description} onChange={handleFieldChange} />
        <TextField name="price" label="Price" value={fetchetProduct.price} onChange={handleFieldChange} />

        <label htmlFor="category" className="text-sm text-navy-700 font-bold">Category</label>
        <select name="category" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500">
          <option>{fetchetProduct.categories?.[0]?.title}</option>

        </select>

        <div className='block'>
          <label className="inline-flex items-center mt-3">
            <input onChange={(e) => setFetchedProduct(prev => ({ ...prev, isNew: !prev.isNew }))} type="checkbox" className="form-checkbox h-5 w-5 text-red-600" checked={fetchetProduct.isNew} /><span className="ml-2 text-gray-700">New Product</span>
          </label></div>
        <div className='block'>
          <label className="inline-flex  items-center mt-3">
            <input onChange={(e) => setFetchedProduct(prev => ({ ...prev, isAvailable: !prev.isAvailable }))} type="checkbox" className="form-checkbox h-5 w-5 text-red-600" checked={fetchetProduct.isAvailable} /><span className=" ml-2 text-gray-700">Available</span>
          </label></div>
        <button className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400" >Save</button>
      </form>
    </div >
  )
}
