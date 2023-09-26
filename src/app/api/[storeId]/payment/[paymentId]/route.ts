import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-type, Authorization",
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; payment: string } }
) => {
  console.log(params);

  try {
    const url = `https://api.yookassa.ru/v3/payments/${params.payment}`;

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

    return NextResponse.json(res, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.log(error);
  }
};
