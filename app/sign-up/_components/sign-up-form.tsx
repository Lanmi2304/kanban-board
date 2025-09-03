"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { signUpSchema, SignUpSchemaInput } from "../_schemas/sign-up.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { SquareKanban, X } from "lucide-react";
import { useState, useTransition } from "react";
import { signUpAction } from "../_actions/sign-up.action";
import { convertImageToBase64 } from "@/lib/utils/convert-image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignUpForm() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const form = useForm<SignUpSchemaInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const [isSubmitting, startTransition] = useTransition();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: SignUpSchemaInput) {
    startTransition(async () => {
      const imageFile = image ? await convertImageToBase64(image) : "";
      try {
        const response = await signUpAction({ ...values, image: imageFile });
        router.push("/dashboard");
        console.log("Sign up successful:", response);
      } catch (error) {
        toast.error("Error during sign up");
        console.error("Error during sign up:", error);
      }
    });
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="my-4 flex w-full flex-col items-center justify-center gap-2">
          <SquareKanban size={40} className="text-primary" />
          <h2 className="text-center text-4xl font-bold">
            Welcome To Kanban Board
          </h2>
        </div>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter your details below to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-sm space-y-3.5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image (optional)</FormLabel>
                  <div className="flex items-end gap-4">
                    {imagePreview && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                        <Image
                          src={imagePreview}
                          alt="Profile preview"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    )}
                    <div className="flex w-full items-center gap-2">
                      {/* TODO: fix this */}
                      <FormControl>
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full"
                        />
                      </FormControl>

                      {imagePreview && (
                        <X
                          className="cursor-pointer"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
