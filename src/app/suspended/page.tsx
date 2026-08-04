import { Ban } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/session-actions";

export default function SuspendedPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4">
          <Logo />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <Ban className="size-6" />
          </div>
          <h1 className="text-2xl font-bold">Account suspended</h1>
          <p className="mt-2 text-muted-foreground">
            Your account has been suspended. If you think this is a mistake,
            please contact support.
          </p>
          <form action={logout} className="mt-6">
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
