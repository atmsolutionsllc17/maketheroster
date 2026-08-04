"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { registerParent, type ActionState } from "@/lib/actions/auth";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

export default function ParentRegisterPage() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    registerParent,
    {},
  );
  const fe = state.fieldErrors ?? {};

  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create your parent account</CardTitle>
        <CardDescription>Follow and support your athlete.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state.error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required />
              <FieldError errors={fe.firstName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required />
              <FieldError errors={fe.lastName} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
            <FieldError errors={fe.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
            <FieldError errors={fe.password} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="athleteName">Athlete&apos;s name</Label>
              <Input id="athleteName" name="athleteName" placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input id="relationship" name="relationship" placeholder="e.g. Parent" />
            </div>
          </div>

          <SubmitButton className="btn-hero w-full">Create account</SubmitButton>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not a parent?{" "}
          <Link href="/register" className="font-medium text-primary">
            Choose a different role
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
