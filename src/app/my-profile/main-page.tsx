"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getUserDataFromCookies } from "@/lib/authentication";
import { useRouter } from "next/navigation";
import { getUserField, getActivityDoc } from "@/lib/firebase.utils";
import { useAppSelector, useAppDispatch } from "@/redux/hook";
import { setSection } from "@/redux/features/profile-section";
import type { RootState } from "@/redux/store";
import { TCheckoutData } from "@/components/header";
import { TUserDoc, addOrChangeUserData } from "@/lib/firebase.utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { AlignLeft } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Username must be at least 6 characters.",
  }),
  dob: z.string().min(3, {
    message: "Please input date of birth.",
  }),
  gender: z.enum(["male", "female"], {
    required_error: "You have to select.",
  }),
  address: z.string().min(2, {
    message: "Please input address.",
  }),
  city: z.string().min(2, {
    message: "Please input city.",
  }),
  phoneNumber: z.string().min(2, {
    message: "Please input phone number.",
  }),
  paypalId: z.string().min(2, {
    message: "Please input paypal id.",
  }),
});

export default function MainPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const [logInState, setLogInState] = useState<TUserData | null>(null);
  const [personalData, setPersonalData] = useState<TUserDoc | null>(null);
  const [checkout, setCheckout] = useState<TCheckoutData | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  // const [section, setSection] = useState<string>("personal data");
  const [edit, setEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const profileSection = useAppSelector(
    (state: RootState) => state.profileSection
  );
  const checkoutData = useAppSelector((state: RootState) => state.checkout);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      dob: "",
      gender: "",
      address: "",
      city: "",
      phoneNumber: "",
      paypalId: "",
    },
  });

  const toggleRow = (orderId: string) => {
    if (expandedRows.includes(orderId)) {
      setExpandedRows(expandedRows.filter((row) => row !== orderId));
    } else {
      setExpandedRows([...expandedRows, orderId]);
    }
  };

  const handleSectionState = (type: string) => {
    dispatch(setSection(type));
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

  async function onSubmit(values: any) {
    if (personalData) {
      setIsLoading(true);
      console.log("edit personal data: ", values);
      const user = getUserDataFromCookies();
      const newUserData: TUserDoc = {
        username: values.username,
        email: personalData.email,
        dateOfBirth: values.dob,
        gender: values.gender,
        address: values.address,
        city: values.city,
        phoneNumber: values.phoneNumber,
        paypalId: values.paypalId,
      };
      await addOrChangeUserData(user.uid, newUserData);
      setIsLoading(false);
      setEdit(false);
      getPersonalData();
    }
  }

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      console.log({ user });
      getPersonalData();
      getActivityDoc(user.uid, "checkout")
        .then((result) => {
          setCheckout(result);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      getActivityDoc(user.uid, "checkout")
        .then((result) => {
          setCheckout(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [checkoutData]);

  useEffect(() => {
    console.log("checkout history: ", checkout);
  }, [checkout]);

  useEffect(() => {
    console.log({ personalData });
    if (personalData) {
      form.reset({
        username: personalData.username || "",
        dob: personalData.dateOfBirth || "",
        gender: personalData.gender || "",
        address: personalData.address || "",
        city: personalData.city || "",
        phoneNumber: personalData.phoneNumber || "",
        paypalId: personalData.paypalId || "",
      });
    }
  }, [personalData, form]);
  return (
    <section className="flex gap-6 px-6 py-9 h-full">
      <div className="hidden w-[20%] h-fit z-50 sticky top-[110px] lg:flex flex-col items-center justify-center p-4 rounded-xl bg-card text-card-foreground shadow">
        <Button
          className={`w-full justify-start rounded-lg text-[15px] ${
            profileSection.section === "personal data" ? "bg-accent" : ""
          }`}
          variant="ghost"
          onClick={() => handleSectionState("personal data")}
        >
          Personal Data
        </Button>
        <Button
          className={`w-full justify-start rounded-lg text-[15px] ${
            profileSection.section === "purchase history" ? "bg-accent" : ""
          }`}
          variant="ghost"
          onClick={() => handleSectionState("purchase history")}
        >
          Purchase History
        </Button>
      </div>
      <div className="w-full lg:w-[80%] min-h-[500px] py-8 px-9 rounded-xl bg-card text-card-foreground shadow">
        {profileSection.section === "personal data" && (
          <div>
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-xl text-blue-600">Personal Data</h2>
              <Button variant="link" onClick={() => setEdit(!edit)}>
                Edit
              </Button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-1 w-full"
              >
                {/* <div className="grid rid-cols-1 md:grid-cols-5"> */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid rid-cols-1 md:grid-cols-5">
                        {/* <FormLabel>Username</FormLabel> */}
                        <p className="col-span-1 mb-1 font-semibold">
                          Username
                        </p>
                        {!edit && (
                          <div className="col-span-4 mb-1 flex items-center">
                            {personalData?.username ?? (
                              <Skeleton className="h-4 w-full" />
                            )}
                          </div>
                        )}
                        {edit && (
                          <>
                            <FormControl>
                              <Input
                                className="col-span-4 mb-1"
                                type="text"
                                placeholder="input username"
                                {...form.register("username")}
                              />
                            </FormControl>
                            <div className="col-span-1"></div>
                            <FormMessage className="col-span-4" />
                          </>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <div className="grid rid-cols-1 md:grid-cols-5">
                  <p className="col-span-1 mb-1 font-semibold">Email</p>
                  <div className="col-span-4 mb-1 flex items-center">
                    {personalData?.email ?? <Skeleton className="h-4 w-full" />}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="grid rid-cols-1 md:grid-cols-5">
                        {/* <FormLabel>Date of birth</FormLabel> */}
                        <p className="col-span-1 mb-1 font-semibold">
                          Date of birth
                        </p>
                        {!edit && (
                          <div className="col-span-4 mb-1 flex items-center">
                            {personalData?.dateOfBirth ?? (
                              <Skeleton className="h-4 w-full" />
                            )}
                          </div>
                        )}
                        {edit && (
                          <>
                            <FormControl>
                              <Input
                                className="col-span-4 mb-1"
                                type="text"
                                placeholder="input date of birth"
                                {...form.register("dob")}
                              />
                            </FormControl>
                            {/* <FormMessage /> */}
                            <div className="col-span-1"></div>
                            <FormDescription className="col-span-4">
                              Please use format day-month-year.
                            </FormDescription>
                            <div className="col-span-1"></div>
                            <FormMessage />
                          </>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="grid rid-cols-1 md:grid-cols-5">
                        {/* <FormLabel>Gender</FormLabel> */}
                        <p className="col-span-1 mb-1 font-semibold">Gender</p>
                        {!edit && (
                          <div className="col-span-4 mb-1 capitalize flex items-center">
                            {personalData?.gender ?? (
                              <Skeleton className="h-4 w-full" />
                            )}
                          </div>
                        )}
                        {edit && (
                          <>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1 col-span-4 mb-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="male" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Male
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="female" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Female
                                  </FormLabel>
                                </FormItem>
                                {/* <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="none" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Nothing</FormLabel>
                                </FormItem> */}
                              </RadioGroup>
                            </FormControl>
                            <div className="col-span-1"></div>
                            <FormMessage className="col-span-4" />
                          </>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      {/* <FormLabel>Address</FormLabel> */}
                      <div className="grid rid-cols-1 md:grid-cols-5">
                        <p className="col-span-1 mb-1 font-semibold">Address</p>
                        {!edit && (
                          <div className="col-span-4 mb-1 capitalize flex items-center">
                            {personalData?.address ?? (
                              <Skeleton className="h-4 w-full" />
                            )}
                          </div>
                        )}
                        {edit && (
                          <>
                            <FormControl>
                              <Input
                                className="col-span-4 mb-1"
                                type="text"
                                placeholder="input address"
                                {...form.register("address")}
                              />
                            </FormControl>
                            <div className="col-span-1"></div>
                            <FormMessage className="col-span-4" />
                          </>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid rid-cols-1 md:grid-cols-5">
                        {/* <FormLabel>City</FormLabel> */}
                        <p className="col-span-1 mb-1 font-semibold">City</p>
                        {!edit && (
                          <div className="col-span-4 mb-1 flex items-center capitalize">
                            {personalData?.city ?? (
                              <Skeleton className="h-4 w-full" />
                            )}
                          </div>
                        )}
                        {edit && (
                          <>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={personalData?.city}
                              // value={field.value}
                              {...form.register("city")}
                            >
                              <FormControl>
                                <SelectTrigger className="col-span-4 mb-1">
                                  <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Bogor">Bogor</SelectItem>
                                <SelectItem value="Banyuwangi">
                                  Banyuwangi
                                </SelectItem>
                                <SelectItem value="Gresik">Gresik</SelectItem>
                                <SelectItem value="Bekasi">Bekasi</SelectItem>
                              </SelectContent>
                            </Select>
                            {/* <FormControl>
                              <Input
                                className="col-span-4 mb-1"
                                type="text"
                                placeholder="input city"
                                {...form.register("city")}
                              />
                            </FormControl> */}
                            <div className="col-span-1"></div>
                            <FormMessage className="col-span-4" />
                          </>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid rid-cols-1 md:grid-cols-5">
                        {/* <FormLabel>Phone Number</FormLabel> */}
                        <p className="col-span-1 mb-1 font-semibold">
                          Phone Number
                        </p>
                        {!edit && (
                          <div className="col-span-4 mb-1 flex items-center">
                            {personalData?.phoneNumber ?? (
                              <Skeleton className="h-4 w-full" />
                            )}
                          </div>
                        )}
                        {edit && (
                          <>
                            <FormControl>
                              <Input
                                className="col-span-4 mb-1"
                                type="text"
                                placeholder="input phone number"
                                {...form.register("phoneNumber")}
                              />
                            </FormControl>
                            <div className="col-span-1"></div>
                            <FormMessage className="col-span-4" />
                          </>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paypalId"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <div className="grid rid-cols-1 md:grid-cols-5">
                        <p className="col-span-1 mb-1 font-semibold">
                          Paypal ID
                        </p>
                        {!edit && (
                          <div className="col-span-4 mb-1 flex items-center">
                            {personalData?.paypalId ?? (
                              <Skeleton className="h-4 w-full" />
                            )}
                          </div>
                        )}
                        {edit && (
                          <>
                            <FormControl>
                              <Input
                                className="col-span-4 mb-1"
                                type="text"
                                placeholder="input paypal id"
                                {...form.register("paypalId")}
                              />
                            </FormControl>
                            <div className="col-span-1"></div>
                            <FormMessage className="col-span-4" />
                          </>
                        )}
                      </div>
                    </FormItem>
                  )}
                />
                {edit && (
                  <div className="flex justify-between">
                    <div></div>
                    <Button
                      className="py-5 mt-3"
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
                  </div>
                )}
              </form>
            </Form>
          </div>
        )}
        {profileSection.section === "purchase history" && (
          <div>
            <h2 className="font-bold text-xl text-blue-600 mb-5">
              Purchase History
            </h2>
            <div>
              <Table className="purchase-table">
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Invoice</TableHead>
                    <TableHead>Transaction Status</TableHead>
                    {/* <TableHead>Method</TableHead> */}
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkout &&
                    checkout.data &&
                    checkout.data.map((item: any) => (
                      <>
                        <TableRow key={item.orderId}>
                          <TableCell className="font-medium">
                            {item.orderId}
                          </TableCell>
                          <TableCell>
                            {item.paymentStatus === "settlement" ? (
                              <Badge className="bg-green-500 hover:bg-green-500/80">
                                Success
                              </Badge>
                            ) : item.paymentStatus === "pending" ? (
                              <Badge className="bg-red-500 hover:bg-red-500/80">
                                Pending
                              </Badge>
                            ) : (
                              <Badge>Unknown</Badge>
                            )}
                          </TableCell>
                          {/* <TableCell>{item.paymentMethod}</TableCell> */}
                          <TableCell>
                            IDR {item.totalPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => toggleRow(item.orderId)}
                              className="text-blue-500 hover:underline underline-offset-2"
                            >
                              {expandedRows.includes(item.orderId)
                                ? "Hide Details"
                                : "Show Details"}
                            </button>
                          </TableCell>
                        </TableRow>
                        {/* expanded row */}
                        {expandedRows.includes(item.orderId) && (
                          <TableRow
                            key={`${item.orderId}-details`}
                            className="bg-gray-50"
                          >
                            <TableCell colSpan={4}>
                              <div className="p-4">
                                <h3 className="mb-2">
                                  <strong>Details:</strong>
                                </h3>
                                <div className="flex flex-col gap-2">
                                  {item.cart.map(
                                    (cartItem: any, index: number) => (
                                      <div
                                        key={index}
                                        className="grid grid-cols-3 gap-3"
                                      >
                                        <Image
                                          className="w-14 h-auto"
                                          src={cartItem.url}
                                          alt="product image"
                                        />
                                        <p>{cartItem.name}</p>
                                        <p>
                                          IDR {cartItem.price.toLocaleString()}{" "}
                                          x {cartItem.quantity}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-5 fixed right-0 top-[72px] z-30 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-l-full px-3">
              <AlignLeft />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Section</DropdownMenuLabel>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => handleSectionState("personal data")}
            >
              Personal Data
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => handleSectionState("purchase history")}
            >
              Purchase History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
