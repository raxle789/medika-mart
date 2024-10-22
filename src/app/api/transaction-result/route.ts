import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const orderId = request.headers.get("OrderId");
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const base64ServerKey = Buffer.from(serverKey + ":").toString("base64");

    // Panggil API Midtrans menggunakan fetch
    const response = await fetch(
      `https://api.sandbox.midtrans.com/v2/${orderId}/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${base64ServerKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Parse data dari Midtrans
    const data = await response.json();

    // res.status(200).json(data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error getting transaction result" },
      { status: 500 }
    );
  }
}
