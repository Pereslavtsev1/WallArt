"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type z from "zod";
import { FormField } from "@/components/general/form";
import { loginSchema } from "@/components/schemas/login-schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Login() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <Card className="w-full max-w-md bg-transparent">
      <CardHeader className="text-left">
        <CardTitle className="text-xl font-bold">Login to WallArt</CardTitle>
        <CardDescription className="font-semibold text-muted-foreground">
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={() => {}}>
          <FieldGroup>
            <Field>
              <Button variant="outline" type="button">
                Login with Google
              </Button>
            </Field>

            <FieldSeparator className="mt-2 font-medium *:data-[slot=field-separator-content]:bg-background">
              Or continue with
            </FieldSeparator>

            <FormField name="email" label="Email" control={form.control}>
              {(field) => <Input {...field} />}
            </FormField>

            <FormField name="password" label="Password" control={form.control}>
              {(field) => <Input {...field} />}
            </FormField>

            <Field>
              <Button type="submit" size="lg" className="w-full font-semibold">
                Login
              </Button>

              <FieldDescription className="text-center">
                Don’t have an account?{" "}
                <Link href="/sign-up" className="font-semibold">
                  Sign up
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
