import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // const order = await prismadb.order.create({
  //   data: {
  //     storeId: params.storeId,
  //     isPaid: false,
  //     orderItems: {
  //       create: productIds.map((productId: string) => ({
  //         product: {
  //           connect: {
  //             id: productId,
  //           },
  //         },
  //       })),
  //     },
  //   },
  // });

  try {
    const idempotenceKey = Date.now();

    const requestData = {
      amount: {
        value: "100",
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      },
      metadata: { orderId: "order.id" },
      description: "Заказ #1",
    };

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Idempotence-key", idempotenceKey.toString());

    const url = "https://api.yookassa.ru/v3/payments";

    const data = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-key": idempotenceKey.toString(),
        Authorization: `Basic ${btoa(
          "249186:test_efpxF0Sqdetn3_udxSt6e1WT97d8UKIIqdTIpE-zMyU"
        )}`,
      },
      body: JSON.stringify(requestData),
    });

    const res = await data.json();

    return NextResponse.json(res, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.log(error);
  }
};
