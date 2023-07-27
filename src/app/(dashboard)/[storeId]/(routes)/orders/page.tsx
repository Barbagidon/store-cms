import React from 'react'
import OrderClient from './components/client'
import prismadb from '@/lib/prismadb'
import { OrderColumn } from './components/columns'
import { formatter } from '@/lib/utils'
import { format } from 'date-fns'



const OrdersPage = async ({ params }: { params: { storeId: string } }) => {

    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })



    const formattedOrders: OrderColumn[] = orders.map(({ id, phone, createdAt, address, orderItems, isPaid }) => {
        const totalPrice = orderItems.reduce((acc, item) => {
            return acc + Number(item.product.price)
        }, 0)

        return {
            id,
            phone,
            address,
            isPaid,
            products: orderItems.map(item => item.product.name).join(', '),
            totalPrice: formatter(`${totalPrice}`),
            createdAt: format(createdAt, 'MMMM do, yyyy')
        }
    })



    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    )
}

export default OrdersPage