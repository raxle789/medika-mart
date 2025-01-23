import nodemailer from "nodemailer";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const recipient = request.headers.get("Recipient");
  const pdfBuffer = Buffer.from(await request.arrayBuffer());

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: "Transaction Report",
    text: "Please find attached the invoice.",
    attachments: [
      {
        filename: "invoice.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Error sending email" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Email sent successfully" },
    { status: 200 }
  );
}
