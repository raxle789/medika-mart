import Midtrans from "midtrans-client";
import { NextResponse, NextRequest } from "next/server";

const snap = new Midtrans.Snap({
  isProduction: true,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: NextRequest) {
  const { orderId, cart, totalPrice } = await request.json();

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: totalPrice,
    },
    item_details: cart,
  };

  const token = await snap.createTransactionToken(parameter);
  return NextResponse.json({ token });
}
