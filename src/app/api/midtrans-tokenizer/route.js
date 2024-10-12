import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  const { orderId, cart, totalPrice } = await request.json();

  let parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: totalPrice,
    },
    item_details: cart,
    // expiry: {
    //   start_time: formattedStartTime,
    //   unit: "minutes",
    //   duration: expiryDurationInMinutes,
    // },
  };

  const token = await snap.createTransactionToken(parameter);
  console.log(token);
  return NextResponse.json({ token });
}
