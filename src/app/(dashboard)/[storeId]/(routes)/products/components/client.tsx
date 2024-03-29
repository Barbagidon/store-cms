"use client"


import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Billboard } from '@prisma/client'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { ProductColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'


interface BillboardClientProps {
    data: ProductColumn[]
}

const ProductClient = ({ data }: BillboardClientProps) => {

    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading description='Manage products for your store' title={`Products(${data.length})`} />
                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add new
                </Button>
            </div>
            <Separator />
            <DataTable searchKey='name' data={data} columns={columns} />
            <Heading title='API' description='API calls for products' />
            <Separator />
            <ApiList entityName='products' entityIdName='productId' />

        </>

    )
}

export default ProductClient