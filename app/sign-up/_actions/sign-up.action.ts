"use server";

import { auth } from "@/server/auth";
import { SignUpSchemaInput } from "../_schemas/sign-up.schema";

export async function signUpAction(formData: SignUpSchemaInput) {
  const data = await auth.api.signUpEmail({
    body: {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      image: formData.image,
    },
  });
  console.log(123, data);
}
