"use client"


import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Billboard } from '@prisma/client'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { BillboardColumn } from './columns'


interface BillboardClientProps {
    data: BillboardColumn[]
}

const BillboardClient = ({ data }: BillboardClientProps) => {

    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading description='Manage billboards for your store' title={`Billboards(${data.length})`} />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Add new
                </Button>
            </div>
            <Separator />

        </>

    )
}

export default BillboardClient