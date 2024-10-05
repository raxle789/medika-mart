"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/redux/hook";
import { setAddItem } from "@/redux/features/cart-slice";
// import { setIsLogin } from "@/redux/features/auth-slice";
// import { useAppSelector } from "@/redux/hook";
// import type { RootState } from "@/redux/store";
import { getUserDataFromCookies } from "@/lib/authentication";
import Header from "@/components/header";
import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import bannerImg from "../../public/assets/images/banner1.jpg";
import { IoCheckmarkCircle } from "react-icons/io5";
import { products } from "@/utils/products";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

type TUserData = {
  uid?: string;
  email?: string | null;
  displayName?: string | null;
};

export default function Home() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogin, setIsLogin] = useState<TUserData | null>(null);
  // const isLogin = useAppSelector((state: RootState) => state.auth);

  const handleToCart = (
    id: number,
    name: string,
    price: number,
    url: StaticImageData
  ) => {
    const user = getUserDataFromCookies();
    if (user) {
      const newItem = {
        id: id,
        name: name,
        price: price,
        url: url,
        // amount: amount,
        // subTotal: subTotal,
      };
      console.log({ newItem });
      dispatch(setAddItem(newItem));
      toast({
        title: "Item added to cart!",
      });
    } else {
      setIsDrawerOpen(true);
    }
  };

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      // console.log({ user });
      setIsLogin(user);
    } else {
      console.log("No user data found in cookies.");
    }
  }, []);
  return (
    <div>
      <Header isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

      <div id="beranda" className="relative h-[90vh]">
        <Image
          className="absolute w-full h-full object-left xl:object-center object-cover"
          src={bannerImg}
          alt="banner"
        />
        <div className="relative z-10 flex flex-col justify-center items-start h-full text-white px-5 lg:px-10">
          <h1 className="text-[1.6rem] text-base tracking-wide md:text-4xl lg:text-5xl font-bold text-coolyellow">
            All Medical Needs, One Solution.
          </h1>
          <div className="flex items-start justify-center gap-3 mt-3">
            <h2 className="text-base font-semibold p-4 md:px-8 xl:px-0 md:text-xl md:p-0 lg:text-xl">
              Easy
            </h2>
            <IoCheckmarkCircle className="text-[#31ff40] w-7 h-auto" />
            <h2 className="text-base font-semibold p-4 md:px-8 xl:px-0 md:text-xl md:p-0 lg:text-xl">
              Cheap
            </h2>
            <IoCheckmarkCircle className="text-[#31ff40] w-7 h-auto" />
            <h2 className="text-base font-semibold p-4 md:px-8 xl:px-0 md:text-xl md:p-0 lg:text-xl">
              Trusted
            </h2>
            <IoCheckmarkCircle className="text-[#31ff40] w-7 h-auto" />
          </div>
          {/* <div>
            <h2 className="font-bold text-xl">Number of Sales:</h2>
            <p>2500+</p>
          </div> */}
        </div>
        <div className="absolute inset-0 bg-black opacity-40 z-0" />
      </div>

      <section className="px-12 py-16">
        {products.map((category, categoryIndex) => (
          <div key={categoryIndex} className="category-section m-8">
            {/* Menampilkan nama kategori */}
            <h2 className="category-title text-2xl font-bold">
              {category.category}
            </h2>

            {/* Iterasi melalui items di dalam kategori */}
            <div className="items-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {category.items.map((item) => (
                <Card key={item.id} className="w-[350px]">
                  <CardHeader>
                    <CardTitle className="text-lg leading-4">
                      {item.name}
                    </CardTitle>
                    <CardDescription>
                      Price: IDR {item.price.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-[200px] w-full">
                      {item.url ? (
                        <Image
                          className="rounded-xl h-full w-full object-cover"
                          src={item.url}
                          alt={`${item.name} image`}
                        />
                      ) : (
                        <Skeleton className="h-full w-full rounded-xl" />
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div></div>
                    <Button
                      onClick={() =>
                        handleToCart(item.id, item.name, item.price, item.url)
                      }
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="bg-blue-600 py-12 flex items-center justify-center">
        <div className="w-[75%]">
          <div className="grid grid-cols-3 mb-14">
            <div>
              <h1 className="text-white text-lg font-bold mb-3">MedikaMart</h1>
              <p className="text-base text-white">About Us</p>
              <p className="text-base text-white">Career</p>
              <p className="text-base text-white">Contact Us</p>
              <p className="text-base text-white">Support Service</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-3">Others</h3>
              <p className="text-base text-white">Terms & Condition</p>
              <p className="text-base text-white">Privacy</p>
              <p className="text-base text-white">Ads</p>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">Sosial Media</h3>
              <div className="flex items-center gap-2 mt-3">
                <div className="p-2 rounded-full bg-white">
                  <FaFacebookF className="text-lg text-blue-600" />
                </div>
                <div className="p-2 rounded-full bg-white">
                  <FaTwitter className="text-lg text-blue-600" />
                </div>
                <div className="p-2 rounded-full bg-white">
                  <FaLinkedinIn className="text-lg text-blue-600" />
                </div>
                <div className="p-2 rounded-full bg-white">
                  <FaInstagram className="text-lg text-blue-600" />
                </div>
                <div className="p-2 rounded-full bg-white">
                  <FaYoutube className="text-lg text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-base text-white">
            Copyright © 2024 MedikaMart. This website is a personal project, not
            a real company.
          </p>
        </div>
      </footer>
    </div>
  );
}
