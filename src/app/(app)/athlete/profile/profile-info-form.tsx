"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/submit-button";
import { SportPositionPicker } from "@/components/sport-position-picker";
import { updateAthleteProfile } from "@/lib/actions/athlete";
import type { ActionState } from "@/lib/actions/auth";
import { US_STATES, GRAD_YEARS } from "@/lib/constants";
import type { StudentProfile } from "@/generated/prisma/client";

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  step,
  errors,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  step?: string;
  errors?: string[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        step={step}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
      />
      {errors?.[0] && <p className="text-xs text-destructive">{errors[0]}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
  );
}

export function ProfileInfoForm({ profile }: { profile: StudentProfile }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateAthleteProfile,
    {},
  );
  const fe = state.fieldErrors ?? {};

  useEffect(() => {
    if (state.success) toast.success("Profile saved");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-8">
      {/* Personal */}
      <section className="space-y-4">
        <SectionTitle>Personal</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" name="firstName" defaultValue={profile.firstName} errors={fe.firstName} />
          <Field label="Last name" name="lastName" defaultValue={profile.lastName} errors={fe.lastName} />
        </div>
        <Field
          label="Photo URL"
          name="photoUrl"
          type="url"
          placeholder="https://…"
          defaultValue={profile.photoUrl}
          errors={fe.photoUrl}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Location (city)" name="location" defaultValue={profile.location} placeholder="Dallas" />
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select name="state" defaultValue={profile.state ?? undefined}>
              <SelectTrigger id="state" className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Height (inches)" name="height" type="number" defaultValue={profile.height} placeholder="74" errors={fe.height} />
          <Field label="Weight (lbs)" name="weight" type="number" defaultValue={profile.weight} placeholder="185" errors={fe.weight} />
        </div>
      </section>

      {/* Academics */}
      <section className="space-y-4">
        <SectionTitle>Academics</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="GPA" name="gpa" type="number" step="0.01" defaultValue={profile.gpa} placeholder="3.8" errors={fe.gpa} />
          <Field label="SAT" name="satScore" type="number" defaultValue={profile.satScore} placeholder="1200" errors={fe.satScore} />
          <Field label="ACT" name="actScore" type="number" defaultValue={profile.actScore} placeholder="27" errors={fe.actScore} />
        </div>
        <Field label="Intended major" name="intendedMajor" defaultValue={profile.intendedMajor} placeholder="Business" />
      </section>

      {/* Athletic */}
      <section className="space-y-4">
        <SectionTitle>Athletic</SectionTitle>
        <SportPositionPicker
          defaultSport={profile.sport}
          defaultPosition={profile.position ?? ""}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="School" name="school" defaultValue={profile.school} errors={fe.school} />
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation year</Label>
            <Select name="graduationYear" defaultValue={String(profile.graduationYear)}>
              <SelectTrigger id="graduationYear" className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {GRAD_YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" name="bio" rows={4} defaultValue={profile.bio ?? ""} placeholder="Tell coaches about yourself…" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="awards">Awards</Label>
          <Textarea id="awards" name="awards" rows={3} defaultValue={profile.awards ?? ""} placeholder="All-State 2025, Team Captain…" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="achievements">Achievements</Label>
          <Textarea id="achievements" name="achievements" rows={3} defaultValue={profile.achievements ?? ""} placeholder="Broke school record…" />
        </div>
      </section>

      <div className="flex justify-end">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}
