"use client";

import { LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/session-actions";

export function UserMenu({
  name,
  email,
  photoUrl,
  planLabel,
}: {
  name: string;
  email: string;
  photoUrl?: string | null;
  planLabel: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="size-9 cursor-pointer border">
          {photoUrl && <AvatarImage src={photoUrl} alt={name} />}
          <AvatarFallback>
            {initials || <UserIcon className="size-4" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Plain header div — NOT DropdownMenuLabel (Base UI GroupLabel needs a
            Menu.Group parent and throws MenuGroupContext otherwise). */}
        <div className="px-1.5 py-1.5">
          <div className="text-sm font-medium">{name}</div>
          <div className="truncate text-xs text-muted-foreground">{email}</div>
          <div className="mt-1 inline-flex rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
            {planLabel}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          render={<Link href="/dashboard" />}
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* Plain form submit (not a Menu.Item, which would swallow the click)
            so the logout server action reliably fires. */}
        <form action={logout} className="w-full">
          <button
            type="submit"
            className="relative flex w-full cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-sm text-destructive outline-hidden select-none hover:bg-destructive/10"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
