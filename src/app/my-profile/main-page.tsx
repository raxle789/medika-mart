"use client";

import { useState, useEffect } from "react";
import { getUserDataFromCookies } from "@/lib/authentication";
import { useRouter } from "next/navigation";
import { getUserField } from "@/lib/firebase.utils";
import { TUserData } from "@/components/header";
import { TUserDoc } from "@/lib/firebase.utils";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const router = useRouter();
  // const [logInState, setLogInState] = useState<TUserData | null>(null);
  const [personalData, setPersonalData] = useState<TUserDoc | null>(null);
  const [section, setSection] = useState<string>("personal data");

  const handleSectionState = (type: string) => {
    setSection(type);
  };

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

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      console.log({ user });
    } else {
      router.replace("/");
    }

    try {
      getPersonalData();
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  useEffect(() => {
    console.log({ personalData });
  }, [personalData]);
  return (
    <section className="flex gap-6 px-6 py-9 h-full">
      <div className="w-[20%] h-fit z-50 sticky top-[110px] flex flex-col items-center justify-center p-4 rounded-xl bg-card text-card-foreground shadow">
        <Button
          className="w-full justify-start rounded-lg text-[15px]"
          variant="ghost"
          onClick={() => handleSectionState("personal data")}
        >
          Personal Data
        </Button>
        <Button
          className="w-full justify-start rounded-lg text-[15px]"
          variant="ghost"
          onClick={() => handleSectionState("purchase history")}
        >
          Purchase History
        </Button>
      </div>
      <div className="w-[80%] min-h-[500px] py-8 px-9 rounded-xl bg-card text-card-foreground shadow">
        {section === "personal data" && (
          <div>
            <h2 className="font-bold text-xl text-blue-600 mb-3">
              Personal Data
            </h2>
            <div className="grid rid-cols-1 md:grid-cols-5">
              <p className="col-span-1 mb-1 font-semibold">Username</p>
              <p className="col-span-4 mb-1">{personalData?.username ?? "-"}</p>
              <p className="col-span-1 mb-1 font-semibold">Email</p>
              <p className="col-span-4 mb-1">{personalData?.email ?? "-"}</p>
              <p className="col-span-1 mb-1 font-semibold">Gender</p>
              <p className="col-span-4 mb-1 capitalize">
                {personalData?.gender ?? "-"}
              </p>
              <p className="col-span-1 mb-1 font-semibold">Date of birth</p>
              <p className="col-span-4 mb-1">
                {personalData?.dateOfBirth ?? "-"}
              </p>
              <p className="col-span-1 mb-1 font-semibold">Address</p>
              <p className="col-span-4 mb-1 capitalize">
                {personalData?.address ?? "-"}
              </p>
              <p className="col-span-1 mb-1 font-semibold">City</p>
              <p className="col-span-4 mb-1 capitalize">
                {personalData?.city ?? "-"}
              </p>
              <p className="col-span-1 mb-1 font-semibold">Phone Number</p>
              <p className="col-span-4 mb-1">
                {personalData?.phoneNumber ?? "-"}
              </p>
            </div>
          </div>
        )}
        {section === "purchase history" && (
          <div>
            <h2 className="font-bold text-xl text-blue-600 mb-3">
              Purchase History
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}
