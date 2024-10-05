"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/redux/hook";
import { setAddAmount, setSubtractAmount } from "@/redux/features/cart-slice";
// import { setIsLogin } from "@/redux/features/auth-slice";
import { useAppSelector } from "@/redux/hook";
import type { RootState } from "@/redux/store";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { PopupSignIn, signOutUser, auth } from "@/lib/firebase.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getUserDataFromCookies } from "@/lib/authentication";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ShoppingCart, Search, Plus, Minus } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { getUserField } from "@/lib/firebase.utils";

export type TUserData = {
  uid?: string | null;
  email?: string | null;
  displayName?: string | null;
};

type TCartItem = {
  id: number;
  name: string;
  price: number;
  url: StaticImageData;
  amount: number;
  subTotal: number;
};

const signInSchema = z.object({
  email: z.string().email("Input a valid email."),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const signUpSchema = z
  .object({
    email: z.string().email("Input a valid email."),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: "Password doesn't match.",
    path: ["confirmPassword"],
  });

type TProps = {
  isDrawerOpen?: boolean;
  setIsDrawerOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ isDrawerOpen, setIsDrawerOpen }: TProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState<TUserData | null>(null);
  const [logInState, setLogInState] = useState<string>("Log in");
  const [searchInput, setSearchInput] = useState<boolean>(false);
  const [cartItemsNow, setCartItemsNow] = useState<TCartItem[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [errorAuth, setErrorAuth] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const cartItems = useAppSelector((state: RootState) => state.cart);
  // const isLogin = useAppSelector((state: RootState) => state.auth);
  const formSchema = logInState === "Log in" ? signInSchema : signUpSchema;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: logInState === "Sign up" ? "" : undefined,
    },
  });

  // Functions
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleDrawerState = () => {
    if (setIsDrawerOpen) {
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const result = await PopupSignIn();
      if (result) {
        const data = result.user;
        const userSigned: TUserData = {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
        };
        // setUserData(userSigned);
        console.log("data: ", data);
        // Simpan data pengguna ke dalam cookie
        Cookies.set("medikaMart-userData", JSON.stringify(userSigned), {
          expires: 3,
        }); // Cookie disimpan selama 3 hari
        console.log("cookies created");
        setIsLogin(userSigned);
        // router.push("/my-documents");
        const confirm = await getUserField(data.uid);
        if (logInState === "Sign up" || confirm === "undefined") {
          router.push("/additional-form");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Pengguna berhasil sign up
      const user = userCredential.user;

      console.log("User berhasil didaftarkan:", user);
      const userSigned: TUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        // password: password,
      };
      // setUserData(userSigned);
      // console.log("data: ", data);
      // Simpan data pengguna ke dalam cookie
      Cookies.set("medikaMart-userData", JSON.stringify(userSigned), {
        expires: 3,
      }); // Cookie disimpan selama 3 hari
      console.log("cookies created");
      setIsLogin(userSigned);
      setErrorAuth(false);
      router.push("/additional-form");
    } catch (error: any) {
      console.error("Error saat sign up:", error.message);
    }
    setIsLoading(false);
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Pengguna berhasil sign in
      const user = userCredential.user;
      console.log("User berhasil login:", user);

      const userSigned: TUserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        // password: password,
      };
      // setUserData(userSigned);
      // console.log("data: ", data);
      // Simpan data pengguna ke dalam cookie
      Cookies.set("medikaMart-userData", JSON.stringify(userSigned), {
        expires: 3,
      }); // Cookie disimpan selama 3 hari
      console.log("cookies created");
      setIsLogin(userSigned);
      setErrorAuth(false);
      handleDrawerState();
      // router.push("/my-profile");
    } catch (error: any) {
      console.error("Error saat sign in:", error.message);
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        setErrorAuth(true);
      }
    }
    setIsLoading(false);
  };

  // Function to handle sign out
  const handleSignOut = async () => {
    await signOutUser();
    console.log("user signed out!");
    // Remove user data from cookies
    Cookies.remove("medikaMart-userData");
    console.log("cookies removed");
    const userSigned: TUserData = {
      uid: null,
      email: null,
      displayName: null,
      // password: password,
    };
    // setIsLogin(userSigned);
    setIsLogin(null);
    router.replace("/");
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    if (logInState === "Log in") {
      signInWithEmail(values.email, values.password);
    } else {
      signUpWithEmail(values.email, values.password);
    }
  }

  const handleItemAmount = (id: number, type: string) => {
    if (type === "add amount") {
      dispatch(setAddAmount(id));
    } else {
      dispatch(setSubtractAmount(id));
    }
  };

  const handleLogInState = () => {
    if (logInState === "Log in") {
      setLogInState("Sign up");
    } else {
      setLogInState("Log in");
    }
  };

  useEffect(() => {
    if (pathname.includes("/my-profile")) {
      setSearchInput(false);
    } else if (pathname.includes("/checkout")) {
      setSearchInput(false);
    } else {
      setSearchInput(true);
    }
  }, [pathname]);

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      console.log({ user });
      setIsLogin(user);
    } else {
      console.log("No user data found in cookies.");
    }
  }, []);

  useEffect(() => {
    console.log({ isLogin });
  }, [isLogin]);

  useEffect(() => {
    console.log({ cartItems });
    const currentItems: TCartItem[] = [];
    let totalPriceNow: number = 0;
    if (cartItems.items) {
      cartItems.items.forEach((item) => {
        const newItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          url: item.url,
          amount: 0,
          subTotal: 0,
        };
        const index = cartItems.itemsTotalData.findIndex(
          (itemTotal) => itemTotal.id === item.id
        );
        newItem.amount = cartItems.itemsTotalData[index].amount;
        newItem.subTotal = cartItems.itemsTotalData[index].subTotal;
        currentItems.push(newItem);
        totalPriceNow += newItem.subTotal;
      });
    }
    console.log({ currentItems });
    setCartItemsNow(currentItems);
    setTotalPrice(totalPriceNow);
  }, [cartItems]);
  return (
    <header className="px-6 py-4 sticky top-0 w-full z-30 bg-white shadow">
      <div className="flex justify-between items-center">
        <h1
          className="text-xl font-bold text-blue-600 hover:cursor-pointer"
          onClick={() => router.replace("/")}
        >
          MedikaMart
        </h1>
        <div className="flex items-center gap-3 h-10">
          {searchInput && (
            <form className="flex h-full">
              <Input
                className="rounded-r-none h-full focus-visible:ring-0"
                placeholder="Search"
              />
              <Button
                className="rounded-l-none bg-blue-600 hover:bg-blue-400 h-full"
                type="submit"
              >
                <Search />
              </Button>
            </form>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="h-full hover:bg-transparent active:bg-transparent"
                variant="ghost"
              >
                <ShoppingCart className="mr-1" />
                <span className="p-1 rounded-full bg-red-500 min-w-5 min-h-5 max-w-full max-h-full text-white flex items-center justify-center">
                  <p className="text-sm">{cartItems.itemsAmount ?? "0"}</p>
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="my-5">
                <SheetTitle>My Cart</SheetTitle>
              </SheetHeader>
              <Separator className="my-3" />
              <div
                className={`${
                  cartItems.itemsAmount === 0 ? "h-[250px]" : ""
                } flex items-center justify-center`}
              >
                {/* <div className="flex items-center justify-center"> */}
                {cartItems.itemsAmount === 0 && <p>Your cart is empty</p>}
                {cartItems.itemsAmount > 0 && (
                  <div className="w-full">
                    <div className="flex flex-col gap-2">
                      {cartItemsNow.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center">
                            <p className="font-bold w-3/4">{item.name}</p>
                            <p className="w-1/4 text-end">
                              {item.amount} ({item.subTotal.toLocaleString()})
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p>IDR {item.price.toLocaleString()}</p>
                            <div>
                              <Button
                                className="w-6 h-6 rounded-full p-1 mr-1"
                                size="icon"
                                onClick={() =>
                                  handleItemAmount(item.id, "subtract amount")
                                }
                              >
                                <Minus className="w-5 h-5" />
                              </Button>
                              <Button
                                className="w-6 h-6 rounded-full p-1"
                                size="icon"
                                onClick={() =>
                                  handleItemAmount(item.id, "add amount")
                                }
                              >
                                <Plus className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Separator className="mt-3" />
              <div className="flex justify-between items-center mt-3">
                <p>Subtotal</p>
                <p>IDR {totalPrice.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center my-3">
                <p>Shipping</p>
                <p>FREE</p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="font-bold">Total</p>
                <p>IDR {totalPrice.toLocaleString()}</p>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    type="button"
                    onClick={() => router.push("/checkout")}
                  >
                    Checkout
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {isLogin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="hover:cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                {/* <Avatar className="hover:cursor-pointer">
                  <AvatarImage
                    className="object-cover"
                    src={avatar}
                    alt="avatar-image"
                  />
                  <AvatarFallback>{initial ?? "SW"}</AvatarFallback>
                </Avatar> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DialogTrigger asChild> */}
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => router.push("/my-profile")}
                >
                  My profile
                </DropdownMenuItem>
                {/* </DialogTrigger> */}
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={handleSignOut}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!isLogin && (
            <Drawer open={isDrawerOpen} onClose={handleDrawerState}>
              <DrawerTrigger asChild>
                <Button
                  className="h-full font-semibold hover:bg-transparent active:bg-transparent"
                  variant="ghost"
                  onClick={handleDrawerState}
                >
                  Log In/Sign Up
                </Button>
              </DrawerTrigger>
              <DrawerContent className="flex justify-center items-center">
                <DrawerHeader>
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="mb-10 px-5 pt-7 pb-8 flex flex-col items-center justify-center w-[95%] md:w-[350px] border rounded-xl shadow">
                  <div className="flex flex-col justify-center items-center">
                    {/* <h1 className="text-2xl font-bold text-blue-600">
                      MedikaMart
                    </h1> */}
                    <h2 className="text-2xl font-bold mb-6 text-blue-600">
                      {logInState}
                    </h2>
                  </div>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-3 w-full"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="medika@example.com"
                                {...form.register("email")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="password"
                                  {...form.register("password")}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-0 hover:bg-transparent active:bg-transparent"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? "Hide" : "Show"}{" "}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {logInState === "Sign up" && (
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem className="space-y-0">
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="confirm password"
                                  {...form.register("confirmPassword")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      {errorAuth && (
                        <p className="my-3 text-red-600 text-sm">
                          Email or password is invalid
                        </p>
                      )}
                      <Button
                        className="py-5 mt-3 w-full"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            Please Wait
                          </>
                        )}
                        {!isLoading && "Submit"}
                      </Button>
                    </form>
                  </Form>
                  <p className="my-3 text-sm">Or</p>
                  <Button
                    className="py-5 w-full"
                    onClick={handleSignInWithGoogle}
                  >
                    <Image
                      className="mr-3"
                      src="/assets/logos/Google__Logo.svg"
                      alt="Google Logo"
                      width={21}
                      height={21}
                    />
                    {logInState} with Google
                  </Button>
                  <p className="mt-3 text-sm">
                    {logInState === "Log in"
                      ? "Don't have an account?"
                      : "Have an account?"}{" "}
                    <Button
                      className="p-0 text-sm text-blue-600"
                      variant="link"
                      onClick={handleLogInState}
                    >
                      {logInState === "Log in" ? "Sign up" : "Log in"}
                    </Button>
                  </p>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </header>
  );
}