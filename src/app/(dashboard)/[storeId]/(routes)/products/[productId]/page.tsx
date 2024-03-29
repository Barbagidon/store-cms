import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import React from 'react'
import ProductForm from './components/product-form'

const ProductPage = async ({ params }: { params: { productId: string, storeId: string } }) => {

    const { productId, storeId } = params

    const product = await prismadb.product.findUnique({
        where: {
            id: productId
        },
        include: {
            images: true,

        }
    })




    const categories = await prismadb.category.findMany({
        where: {
            storeId: storeId
        },


    })



    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        }
    })





    const colors = await prismadb.color.findMany({
        where: {
            storeId: storeId
        }
    })







    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductForm colors={colors} sizes={sizes} categories={categories} initialData={product} />
            </div>
        </div>
    )
}

export default ProductPage