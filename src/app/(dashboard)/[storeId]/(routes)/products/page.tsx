import React from 'react'
import ProductClient from './components/client'
import prismadb from '@/lib/prismadb'
import { ProductColumn } from './components/columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'



const ProductsPage = async ({ params }: { params: { storeId: string } }) => {

    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            size: true,
            color: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })




    const formattedProducts: ProductColumn[] = products.map(({ id, name, createdAt, isFeatured, isArchived, price, category, color, size }) => ({
        id,
        name,
        isFeatured,
        isArchived,
        category: category.name,
        size: size.name,
        color: color.value,
        price: formatter(price),
        createdAt: format(createdAt, 'MMMM do, yyyy')
    }))



    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}

export default ProductsPage