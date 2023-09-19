import React, { ChangeEvent, useEffect, useState } from 'react'
import { ICategory, Product } from '../types/types'
import { useFormik } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from '../common/useProducts';
import useCategories from '../common/useCategories';
import { TextArea, TextField } from './TextComponents';
import { createNewCategory, createNewProduct, deleteCategory, deleteProduct, updateProduct } from '../common/ApiService';
import { getCategoryBySubcategoryId } from '../common/utils';
import { useMutation, useQueryClient } from 'react-query';


export default function ProductEditPage() {
  const queryClient = useQueryClient()
  const { id } = useParams();
  const NumberId = id ? Number(id) : undefined
  const isEditPage = typeof id === 'string'
  const navigate = useNavigate();
  const defaultValues: Product = {
    id: undefined,
    title: '',
    shortDescription: '',
    description: '',
    price: null,
    isNew: true,
    isAvailable: true,
    subcategoryId: null,
    categoryId: null
  }

  const { isLoading: IsCategoriesLoading } = useCategories({
    parameters: {
      staleTime: 0,
      cacheTime: 0,
      onSuccess: (data: ICategory[]) => {
        setFetchedCategories(data)

      }
    }
  })

  const [fetchedProduct, setFetchedProduct] = useState<Product>(defaultValues)

  const [fetchedCategories, setFetchedCategories] = useState<ICategory[]>()


  const [newCategory, setNewCategory] = useState<ICategory>({
    title: '',
    description: ''
  })

  const { isLoading, isError, } = useProduct({
    productId: NumberId!, parameters: {
      enabled: id !== undefined,
      cacheTime: 0,
      staleTime: Infinity,
      onSuccess: (data: Product) => {
        setFetchedProduct(data)
      }
    }
  })
  const subcategories = fetchedCategories?.find(cat => cat.id === fetchedProduct.categoryId)?.subcategories


  const { mutateAsync: createProductMutation } = useMutation({
    mutationFn: () => createNewProduct(fetchedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
  const { mutateAsync: updateProductMutation } = useMutation({
    mutationFn: () => updateProduct(fetchedProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
  const { mutateAsync: deleteProductMutation } = useMutation({
    mutationFn: () => deleteProduct(id!),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
    }
  })
  const { mutateAsync: createCategoryMutation } = useMutation({
    mutationFn: () => createNewCategory(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })

  const selectedCategory = fetchedCategories?.find(cat => cat.id === fetchedProduct?.categoryId) || fetchedCategories?.[0]

  const { mutateAsync: deleteCategoryMutation } = useMutation({
    mutationFn: () => deleteCategory(selectedCategory?.id?.toString()!),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories'])
    }
  })

  const handleFieldChange = function (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { setFetchedProduct(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  const handleDeleteProduct = async () => {
    // eslint-disable-next-line no-restricted-globals
    const userResponse = confirm("Are you fucking sure you want to delete this item??");
    userResponse && deleteProductMutation().then(() => {
      navigate('/products')
    }).catch((error) => { alert(error); });
  }

  const formik = useFormik({
    initialValues: defaultValues,
    enableReinitialize: true,
    onSubmit: async () => {
      if (NumberId) {
        updateProductMutation().then(() => navigate('/products')).catch((error) => {
          alert(error.message)
        });
      }
      else {
        createProductMutation().then(() => navigate('/products'))
          .catch((error) => {
            alert(error.message)
          });
      }

    }
  });



  useEffect(() => {
    if (fetchedCategories && fetchedProduct.subcategoryId) {
      const categoryId = getCategoryBySubcategoryId(fetchedCategories, fetchedProduct.subcategoryId)
      if (categoryId) {
        setFetchedProduct(prev => ({ ...prev, categoryId }))
      }

    }
  }, [fetchedCategories, fetchedProduct.subcategoryId])


  console.log(selectedCategory)

  if (isLoading) return <div className=" justify-center w-full  items-center px-20 pt-20 pb-20">
    <h2 className="pb-10 text-xl font-bold ">LOADING...</h2></div>

  if (isError) return <div className=" justify-center w-full  items-center px-20 pt-20 pb-20">
    <h2 className="pb-10 text-xl font-bold ">ERROR!!</h2></div>

  return (
    <>
      <button className="m-4 block hover:border-white rounded-xl border p-3 border-gray-500 disabled:text-gray-400" onClick={() => { navigate('/products') }}>To the products list</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
        <div className=" justify-center w-full  items-center px-20 pt-20 pb-20">

          <h2 className="pb-10 text-xl font-bold ">{!id ? 'Create' : 'Edit'} product {id ? `'№${id}` : ''} {fetchedProduct.title ?? ""}</h2>


          <TextField name="title" label="Title" value={fetchedProduct.title} onChange={handleFieldChange} />
          <TextField name="shortDescription" label="Short description" value={fetchedProduct.shortDescription} onChange={handleFieldChange} />
          <TextArea name="description" label="Description" value={fetchedProduct.description} onChange={handleFieldChange} />
          <TextField name="price" label="Price" value={fetchedProduct.price} onChange={handleFieldChange} />

          <label htmlFor="categoryId" className="text-sm text-navy-700 font-bold">Category</label>
          <select name="categoryId" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500" value={selectedCategory?.id ?? ''} onChange={(e) => {
            setFetchedProduct(prev => ({ ...prev, categoryId: Number(e.target.value) }))
          }}>

            {fetchedCategories?.length && fetchedCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
          </select>

          <label htmlFor="subcategoryId" className="text-sm text-navy-700 font-bold">Subcategory</label>
          <select value={fetchedProduct.subcategoryId ?? ''} name="subcategoryId" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-500" onChange={(e) => {
            setFetchedProduct(prev => ({ ...prev, subcategoryId: Number(e.target.value) }))
          }}>
            {subcategories?.length && subcategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.title}</option>)}
          </select>
          <div className='block'>
            <label className="inline-flex items-center mt-3">
              <input name="isNew" onChange={(e) => { setFetchedProduct(prev => ({ ...prev, isNew: !prev.isNew })) }} type="checkbox" className="form-checkbox h-5 w-5 text-red-600" checked={fetchedProduct.isNew} /><span className="ml-2 text-gray-700" >New Product</span>
            </label></div>
          <div className='block'>
            <label className="inline-flex  items-center mt-3">
              <input name="isAvailable" checked={fetchedProduct.isAvailable} onChange={(e) => { setFetchedProduct(prev => ({ ...prev, isAvailable: !prev.isAvailable })) }} type="checkbox" className="form-checkbox h-5 w-5 tsext-red-600" /><span className=" ml-2 text-gray-700">Available</span>
            </label></div>

          <button disabled={!selectedCategory} className="block rounded-xl border p-3 border-gray-500 disabled:bg-gray-300" type="submit" onClick={() => formik.submitForm()}>Save</button>

          {isEditPage && <button onClick={handleDeleteProduct} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-red-200" >Delete product</button>}
        </div>
        <div className="w-1/2 justify-center w-full flex-col items-center px-20 pt-20 pb-20">

          <h1 className="pb-10 text-xl font-bold">Categories Edit</h1>
          <TextField value={newCategory.title} label="Category Title" onChange={(e) => setNewCategory(prev => ({ ...prev, title: e.target.value }))} />
          <TextField value={newCategory.description} label="Category Description" onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))} />
          <button onClick={() => { createCategoryMutation() }} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-green-200" >Add Category</button>

          <TextField name="newSubcategoryName" label={`Add Subcategory for selected Category: ${selectedCategory?.title ?? ''}`} />
          <button onClick={() => { }} className="disabled:bg-gray-300 block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-green-200" disabled={!selectedCategory}>Add SubCategory</button>

          <button onClick={() => deleteCategoryMutation()} className="disabled:bg-gray-300 block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-red-200" disabled={!selectedCategory}>Delete Selected Category</button>
          <button onClick={() => { }} className="block rounded-xl border p-3 border-gray-500 disabled:text-gray-400 bg-red-200" >Delete Selected SubCategory</button>

        </div >
      </div >
    </>
  )
}
