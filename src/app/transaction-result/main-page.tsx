"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getUserDataFromCookies } from "@/lib/authentication";
import { useAppSelector } from "@/redux/hook";
// import { setResult } from "@/redux/features/transaction-result-slice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import html2pdf from "html2pdf.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TUserDoc } from "@/lib/firebase.utils";
import { getUserField } from "@/lib/firebase.utils";

export default function MainPage() {
  const router = useRouter();
  const user = getUserDataFromCookies();
  const invoiceRef = useRef(null);
  const checkoutData = useAppSelector((state: RootState) => state.checkout);
  const [transactionResult, setTransactionResult] = useState<any>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [personalData, setPersonalData] = useState<TUserDoc | null>(null);
  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  function isTUserDoc(data: any): data is TUserDoc {
    return (
      data.username !== undefined &&
      data.email !== undefined &&
      data.dateOfBirth !== undefined &&
      data.gender !== undefined
    );
  }

  const getPersonalData = async () => {
    const user = getUserDataFromCookies();
    const data = await getUserField(user.uid);
    if (data && isTUserDoc(data)) {
      setPersonalData(data);
    } else {
      console.log("Data doesn't match for TUserDoc type or doesn't exist");
    }
  };

  const fetchTransactionResult = async (orderId: string) => {
    try {
      const response = await fetch("/api/transaction-result", {
        method: "GET",
        headers: {
          OrderId: orderId,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("hasil fetch transaction result: ", data);
      setTransactionResult(data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleGeneratePDFAndSend = async () => {
    const element = invoiceRef.current;
    const pdfOptions = {
      filename: "invoice.pdf",
      html2canvas: {},
      jsPDF: { orientation: "portrait" },
    };

    const pdfBlob = await html2pdf()
      .from(element)
      .set(pdfOptions)
      .outputPdf("blob");

    const user = getUserDataFromCookies();

    const response = await fetch("/api/send-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/pdf", // Set Content-Type to application/pdf
        Recipient: user.email, // Pass email in headers
      },
      body: pdfBlob, // Send the PDF blob directly
    });

    if (response.ok) {
      console.log("Email sent successfully!");
    } else {
      console.error("Error sending email");
    }
  };

  useEffect(() => {
    if (isDataLoaded && personalData && transactionResult) {
      handleGeneratePDFAndSend();
      setIsDataLoaded(false);
    }
  }, [isDataLoaded, personalData, transactionResult]);

  useEffect(() => {
    if (user) {
      console.log({ user });
      if (checkoutData && checkoutData?.data) {
        const orderId =
          checkoutData?.data[checkoutData.data.length - 1].orderId;
        fetchTransactionResult(orderId);
      }
      getPersonalData();
      setIsDataLoaded(true);
    } else {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    console.log({ transactionResult });
  }, [transactionResult]);
  return (
    <section>
      <div className="px-6 lg:px-10 flex items-center justify-center">
        <div className="w-full lg:w-[80%] my-11 p-2 rounded-xl bg-card text-card-foreground shadow">
          <div className="p-5" ref={invoiceRef}>
            <h1 className="text-3xl text-blue-600 font-bold text-center mt-7 mb-8">
              Transaction Result
            </h1>
            <h3 className="text-xl font-bold text-blue-600">Invoice</h3>
            <div className="mb-3">
              <p className="inline mr-2">
                {checkoutData?.data &&
                  checkoutData?.data[checkoutData.data.length - 1].orderId}
              </p>
              <Badge
                className={`${
                  checkoutData?.data &&
                  checkoutData?.data[checkoutData.data.length - 1]
                    .paymentStatus === "settlement"
                    ? "bg-green-500 hover:bg-green-500/80"
                    : "bg-red-500 hover:bg-red-500/80"
                }`}
              >
                {checkoutData?.data &&
                checkoutData?.data[checkoutData.data.length - 1]
                  .paymentStatus === "settlement"
                  ? "Success"
                  : "Pending"}
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 mb-8">
              <div className="grid grid-cols-[minmax(150px,auto)_1fr] gap-y-1">
                <p className="font-bold">User ID </p>
                <p className="break-all">{user.uid}</p>
                <p className="font-bold">Name </p>
                <p className="break-all">{personalData?.username}</p>
                <p className="font-bold">Address </p>
                <p className="break-all">{personalData?.address}</p>
                <p className="font-bold">Phone Number </p>
                <p className="break-all">{personalData?.phoneNumber}</p>
              </div>
              <div className="grid grid-cols-[minmax(150px,auto)_1fr] gap-y-1">
                <p className="font-bold">Date </p>
                <p className="break-all">{formattedDate}</p>
                <p className="font-bold">Paypal ID </p>
                <p className="break-all">{personalData?.paypalId}</p>
                <p className="font-bold">Bank Name </p>
                <p className="break-all">{"-"}</p>
                <p className="font-bold">Payment Method </p>
                <p className="break-all capitalize">
                  {transactionResult?.payment_type || "-"}
                </p>
              </div>
            </div>
            {checkoutData?.data &&
              checkoutData?.data[checkoutData.data.length - 1].cart.map(
                (item: any) => (
                  <div
                    className="flex justify-between items-center mb-2"
                    key={item.id}
                  >
                    <div>
                      <Image
                        className="w-20 h-auto"
                        src={item.url}
                        alt="product image"
                      />
                    </div>
                    <div className="flex gap-3">
                      <p>{item.name}</p>
                      <p>
                        IDR {item.price.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                  </div>
                )
              )}
            <p className="text-end mt-10 font-bold">
              Total: IDR{" "}
              {checkoutData?.data &&
                checkoutData?.data[
                  checkoutData.data.length - 1
                ].totalPrice.toLocaleString()}
            </p>
          </div>

          <div className="flex justify-end items-center p-5">
            <div></div>
            <div>
              <Button variant="outline" onClick={() => router.replace("/")}>
                Back to home
              </Button>
              <Button
                className="ml-3"
                onClick={() => router.replace("/my-profile")}
              >
                Go to my profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
