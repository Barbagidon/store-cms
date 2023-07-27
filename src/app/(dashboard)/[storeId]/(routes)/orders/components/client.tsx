"use client"


import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'


interface OrderClientProps {
    data: OrderColumn[]
}

const OrderClient = ({ data }: OrderClientProps) => {
    return (
        <>
            <Heading description='Manage orders for your store' title={`Orders(${data.length})`} />
            <Separator />
            <DataTable searchKey='products' data={data} columns={columns} />
        </>

    )
}

export default OrderClient