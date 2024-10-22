"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ReloadIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getUserDataFromCookies } from "@/lib/authentication";
import { TUserDoc } from "@/lib/firebase.utils";
import { addOrChangeUserData } from "@/lib/firebase.utils";

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

export default function AdditionalFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      dob: "",
      gender: "",
      address: "",
      city: "Select city",
      phoneNumber: "",
      paypalId: "",
    },
  });

  async function onSubmit(values: any) {
    setIsLoading(true);
    console.log("onSubmit additional form: ", values);
    const user = getUserDataFromCookies();
    const newUserData: TUserDoc = {
      username: values.username,
      email: user.email,
      dateOfBirth: values.dob,
      gender: values.gender,
      address: values.address,
      city: values.city,
      phoneNumber: values.phoneNumber,
      paypalId: values.paypalId,
    };
    await addOrChangeUserData(user.uid, newUserData);
    router.push("/my-profile");
  }

  useEffect(() => {
    const user = getUserDataFromCookies();
    if (user) {
      console.log({ user });
    } else {
      router.replace("/");
    }
  }, []);
  return (
    <div className="flex justify-center">
      <div className="w-[90%] md:w-[700px] shadow rounded-xl p-7 my-9 bg-white">
        <h1 className="font-bold text-2xl text-blue-600 text-center mb-6">
          Additional Form
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 w-full"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="input username"
                      {...form.register("username")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="input date of birth"
                      {...form.register("dob")}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Please use format day-month-year.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                      {/* <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="none" />
                        </FormControl>
                        <FormLabel className="font-normal">Nothing</FormLabel>
                      </FormItem> */}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="input address"
                      {...form.register("address")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>City</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    // defaultValue={field.value}
                    // value={field.value}
                    {...form.register("city")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bogor">Bogor</SelectItem>
                      <SelectItem value="Banyuwangi">Banyuwangi</SelectItem>
                      <SelectItem value="Gresik">Gresik</SelectItem>
                      <SelectItem value="Bekasi">Bekasi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="input phone number"
                      {...form.register("phoneNumber")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paypalId"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Paypal ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="input paypal id"
                      {...form.register("paypalId")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
      </div>
    </div>
  );
}
