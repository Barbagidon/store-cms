"use client"


import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'

const BillboardClient = () => {
    return (
        <>
            <div className='flex items-center justify-between'>
                <Heading description='Manage billboards for your store' title='Billboards(0)' />
                <Button>
                    <Plus className='mr-2 h-4 w-4' />
                    Add new
                </Button>
            </div>
            <Separator />

        </>

    )
}

export default BillboardClient