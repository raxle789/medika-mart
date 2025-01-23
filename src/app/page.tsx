"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/redux/hook";
import { setAddItem } from "@/redux/features/cart-slice";
import dynamic from "next/dynamic";
import { getUserDataFromCookies } from "@/lib/authentication";
import { useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import bannerImg from "../../public/assets/images/banner1.jpg";
import { products } from "@/utils/products";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { AlignLeft } from "lucide-react";

const Header = dynamic(() => import("@/components/header"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [isLogin, setIsLogin] = useState<TUserData | null>(null);

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
      // setIsLogin(user);
    } else {
      console.log("No user data found in cookies.");
    }
  }, []);
  return (
    <div>
      <Header isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

      <div id="beranda" className="relative h-screen lg:h-[90vh]">
        <Image
          className="absolute w-full h-full object-center object-cover"
          src={bannerImg}
          alt="banner"
        />
        <div className="relative z-10 flex flex-col justify-center items-start h-full text-white px-3 sm:px-5 lg:px-10">
          <h1 className="text-[1.6rem] tracking-wide md:text-4xl lg:text-5xl font-bold text-coolyellow">
            All Medical Needs, One Solution.
          </h1>
          <div className="flex items-center justify-start flex-wrap mt-0 lg:gap-3 xl:mt-3">
            <h2 className="text-xl font-semibold py-4 px-2 pl-0 md:pr-4 xl:px-0">
              Easy
            </h2>
            <svg
              height="32"
              viewBox="0 0 32 32"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
              id="fi_5582932"
            >
              <g id="Ikon">
                <path
                  d="m30 16a2.04127 2.04127 0 0 0 -.75977-1.5918l-1.80322-1.502.82569-2.14844a2.059 2.059 0 0 0 -1.5918-2.75576l-2.313-.39941-.35936-2.27349a2.05916 2.05916 0 0 0 -2.75635-1.5918l-2.20264.81153-1.44775-1.78906a2.10978 2.10978 0 0 0 -3.1836 0l-1.502 1.80273-2.1479-.8252a2.05919 2.05919 0 0 0 -2.75684 1.5918l-.39892 2.31348-2.27246.35842a2.06013 2.06013 0 0 0 -1.59278 2.75681l.81153 2.20313-1.79 1.44726a2.06034 2.06034 0 0 0 .001 3.1836l1.80322 1.502-.82575 2.14839a2.0591 2.0591 0 0 0 1.5918 2.75586l2.313.39941.35937 2.27344a2.05979 2.05979 0 0 0 2.75635 1.5918l2.20264-.81153 1.44775 1.78906a2.05914 2.05914 0 0 0 3.1836 0l1.502-1.80273 2.148.8252a2.05943 2.05943 0 0 0 2.75684-1.5918l.39892-2.31348 2.27246-.3584a2.06015 2.06015 0 0 0 1.59278-2.75683l-.81153-2.20313 1.79-1.44726a2.04339 2.04339 0 0 0 .75872-1.5918z"
                  fill="#1976d2"
                ></path>
                <path
                  d="m14.11963 20.71582a2.97305 2.97305 0 0 1 -1.7915-.59473l-2.42823-1.82129a.9999.9999 0 1 1 1.2002-1.5996l2.42773 1.82128a1.00693 1.00693 0 0 0 1.38965-.18652l5.793-7.44922a1.00035 1.00035 0 0 1 1.5791 1.22852l-5.79346 7.44922a3.00752 3.00752 0 0 1 -2.37649 1.15234z"
                  fill="#f5f5f5"
                ></path>
              </g>
            </svg>
            <h2 className="text-xl font-semibold py-4 px-2 md:px-4 xl:px-0">
              Cheap
            </h2>
            <svg
              height="32"
              viewBox="0 0 32 32"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
              id="fi_5582932"
            >
              <g id="Ikon">
                <path
                  d="m30 16a2.04127 2.04127 0 0 0 -.75977-1.5918l-1.80322-1.502.82569-2.14844a2.059 2.059 0 0 0 -1.5918-2.75576l-2.313-.39941-.35936-2.27349a2.05916 2.05916 0 0 0 -2.75635-1.5918l-2.20264.81153-1.44775-1.78906a2.10978 2.10978 0 0 0 -3.1836 0l-1.502 1.80273-2.1479-.8252a2.05919 2.05919 0 0 0 -2.75684 1.5918l-.39892 2.31348-2.27246.35842a2.06013 2.06013 0 0 0 -1.59278 2.75681l.81153 2.20313-1.79 1.44726a2.06034 2.06034 0 0 0 .001 3.1836l1.80322 1.502-.82575 2.14839a2.0591 2.0591 0 0 0 1.5918 2.75586l2.313.39941.35937 2.27344a2.05979 2.05979 0 0 0 2.75635 1.5918l2.20264-.81153 1.44775 1.78906a2.05914 2.05914 0 0 0 3.1836 0l1.502-1.80273 2.148.8252a2.05943 2.05943 0 0 0 2.75684-1.5918l.39892-2.31348 2.27246-.3584a2.06015 2.06015 0 0 0 1.59278-2.75683l-.81153-2.20313 1.79-1.44726a2.04339 2.04339 0 0 0 .75872-1.5918z"
                  fill="#1976d2"
                ></path>
                <path
                  d="m14.11963 20.71582a2.97305 2.97305 0 0 1 -1.7915-.59473l-2.42823-1.82129a.9999.9999 0 1 1 1.2002-1.5996l2.42773 1.82128a1.00693 1.00693 0 0 0 1.38965-.18652l5.793-7.44922a1.00035 1.00035 0 0 1 1.5791 1.22852l-5.79346 7.44922a3.00752 3.00752 0 0 1 -2.37649 1.15234z"
                  fill="#f5f5f5"
                ></path>
              </g>
            </svg>
            <h2 className="text-xl font-semibold py-4 px-2 md:px-4 xl:px-0">
              Trusted
            </h2>
            <svg
              height="32"
              viewBox="0 0 32 32"
              width="32"
              xmlns="http://www.w3.org/2000/svg"
              id="fi_5582932"
            >
              <g id="Ikon">
                <path
                  d="m30 16a2.04127 2.04127 0 0 0 -.75977-1.5918l-1.80322-1.502.82569-2.14844a2.059 2.059 0 0 0 -1.5918-2.75576l-2.313-.39941-.35936-2.27349a2.05916 2.05916 0 0 0 -2.75635-1.5918l-2.20264.81153-1.44775-1.78906a2.10978 2.10978 0 0 0 -3.1836 0l-1.502 1.80273-2.1479-.8252a2.05919 2.05919 0 0 0 -2.75684 1.5918l-.39892 2.31348-2.27246.35842a2.06013 2.06013 0 0 0 -1.59278 2.75681l.81153 2.20313-1.79 1.44726a2.06034 2.06034 0 0 0 .001 3.1836l1.80322 1.502-.82575 2.14839a2.0591 2.0591 0 0 0 1.5918 2.75586l2.313.39941.35937 2.27344a2.05979 2.05979 0 0 0 2.75635 1.5918l2.20264-.81153 1.44775 1.78906a2.05914 2.05914 0 0 0 3.1836 0l1.502-1.80273 2.148.8252a2.05943 2.05943 0 0 0 2.75684-1.5918l.39892-2.31348 2.27246-.3584a2.06015 2.06015 0 0 0 1.59278-2.75683l-.81153-2.20313 1.79-1.44726a2.04339 2.04339 0 0 0 .75872-1.5918z"
                  fill="#1976d2"
                ></path>
                <path
                  d="m14.11963 20.71582a2.97305 2.97305 0 0 1 -1.7915-.59473l-2.42823-1.82129a.9999.9999 0 1 1 1.2002-1.5996l2.42773 1.82128a1.00693 1.00693 0 0 0 1.38965-.18652l5.793-7.44922a1.00035 1.00035 0 0 1 1.5791 1.22852l-5.79346 7.44922a3.00752 3.00752 0 0 1 -2.37649 1.15234z"
                  fill="#f5f5f5"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-40 z-0" />
      </div>

      <div className="flex justify-end pt-5 sticky right-0 top-[72px] z-30">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-l-full px-3">
              <AlignLeft />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Category</DropdownMenuLabel>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => router.push(`#${products[0].url_link}`)}
            >
              Diagnostic Devices
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => router.push(`#${products[1].url_link}`)}
            >
              General Medical Equipment
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => router.push(`#${products[2].url_link}`)}
            >
              Rehabilitation Equipment
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => router.push(`#${products[3].url_link}`)}
            >
              Nursing Equipment
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => router.push(`#${products[4].url_link}`)}
            >
              Hygienic Equipment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <section className="lg:px-12 pt-10 pb-16">
        {products.map((category, categoryIndex) => (
          <div
            id={category.url_link}
            key={categoryIndex}
            className="category-section m-8"
          >
            <h2 className="category-title text-2xl font-bold">
              {category.category}
            </h2>

            <div className="items-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
              {category.items.map((item) => (
                <Card key={item.id} className="w-full md:w-[350px]">
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
          <div className="grid grid-cols-2 md:grid-cols-3 mb-14">
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
            <div className="mt-7 md:mt-0">
              <h3 className="text-white text-lg font-bold">Sosial Media</h3>
              <div className="flex items-center gap-2 flex-wrap mt-3">
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
