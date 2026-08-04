import Link from "next/link";
import { BadgeCheck, MapPin, GraduationCap } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatHeight } from "@/lib/constants";

export type AthleteCardData = {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  sport: string;
  position: string | null;
  school: string;
  state: string | null;
  graduationYear: number;
  height: number | null;
  weight: number | null;
  gpa: number | null;
  verified: boolean;
};

export function AthleteCard({
  athlete,
  action,
}: {
  athlete: AthleteCardData;
  action?: React.ReactNode;
}) {
  const initials = `${athlete.firstName[0] ?? ""}${athlete.lastName[0] ?? ""}`;
  return (
    <Card className="transition-colors hover:border-primary/50">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Link href={`/athletes/${athlete.id}`}>
            <Avatar className="size-14 border">
              {athlete.photoUrl && (
                <AvatarImage src={athlete.photoUrl} alt={athlete.firstName} />
              )}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/athletes/${athlete.id}`}
                className="truncate font-semibold hover:underline"
              >
                {athlete.firstName} {athlete.lastName}
              </Link>
              {athlete.verified && (
                <BadgeCheck className="text-gold size-4 shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {athlete.sport}
              {athlete.position ? ` · ${athlete.position}` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <GraduationCap className="size-3.5" />
                {athlete.graduationYear}
              </span>
              {athlete.state && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {athlete.state}
                </span>
              )}
              {athlete.gpa != null && <span>GPA {athlete.gpa.toFixed(2)}</span>}
              {athlete.height != null && (
                <span>{formatHeight(athlete.height)}</span>
              )}
              {athlete.weight != null && <span>{athlete.weight} lbs</span>}
            </div>
          </div>
        </div>
        {action && <div className="mt-4">{action}</div>}
      </CardContent>
    </Card>
  );
}
