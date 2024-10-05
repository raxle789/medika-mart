"use client";

import { useState, useEffect } from "react";
import { getUserDataFromCookies } from "@/lib/authentication";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      console.log({ user });
    } else {
      router.replace("/");
    }
  }, []);
  return (
    <section className="">
      <p>ini halaman checkout</p>
    </section>
  );
}
