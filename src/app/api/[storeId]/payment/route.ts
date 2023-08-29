import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const idempotenceKey = Date.now();

    const requestData = {
      amount: {
        value: "2.00",
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: "http://localhost:3001",
      },
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
    console.log(res);

    return NextResponse.json(res);
  } catch (error) {
    console.log("here");
    console.log(error);
  }
};
