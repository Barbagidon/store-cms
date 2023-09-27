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
  { params }: { params: { storeId: string; paymentId: string } }
) => {
  const { orderId } = await req.json();

  try {
    const url = `https://api.yookassa.ru/v3/payments/${params.paymentId}`;

    const data = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(
          "249186:test_efpxF0Sqdetn3_udxSt6e1WT97d8UKIIqdTIpE-zMyU"
        )}`,
      },
    });

    const res = await data.json();

    ///add statuses
    if (res.status === "succeeded") {
      await prismadb.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
        },
        include: {
          orderItems: true,
        },
      });
    }

    return NextResponse.json(res, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.log(error);
  }
};
