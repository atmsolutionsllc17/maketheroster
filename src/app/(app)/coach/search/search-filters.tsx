"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SPORTS, POSITIONS_BY_SPORT, US_STATES, GRAD_YEARS } from "@/lib/constants";

const selectClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

export type SearchValues = {
  sport?: string;
  position?: string;
  state?: string;
  gradYear?: string;
  minGpa?: string;
  minHeight?: string;
  minWeight?: string;
};

export function SearchFilters({
  values,
  canUseAdvanced,
  resetHref = "/coach/search",
}: {
  values: SearchValues;
  canUseAdvanced: boolean;
  resetHref?: string;
}) {
  const [sport, setSport] = useState(values.sport ?? "");
  const positions = sport ? POSITIONS_BY_SPORT[sport] ?? [] : [];

  return (
    <form method="get" className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="sport">Sport</Label>
          <select
            id="sport"
            name="sport"
            className={selectClass}
            value={sport}
            onChange={(e) => setSport(e.target.value)}
          >
            <option value="">Any sport</option>
            {SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <select
            id="position"
            name="position"
            className={selectClass}
            defaultValue={values.position ?? ""}
            disabled={!positions.length}
          >
            <option value="">Any position</option>
            {positions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <select
            id="state"
            name="state"
            className={selectClass}
            defaultValue={values.state ?? ""}
          >
            <option value="">Any state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gradYear">Graduation year</Label>
          <select
            id="gradYear"
            name="gradYear"
            className={selectClass}
            defaultValue={values.gradYear ?? ""}
          >
            <option value="">Any year</option>
            {GRAD_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced (Pro) */}
      <div className="rounded-lg border p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
          Advanced filters
          {!canUseAdvanced && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="size-3" /> Coach Pro
            </span>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="minGpa">Min GPA</Label>
            <Input
              id="minGpa"
              name="minGpa"
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="3.0"
              defaultValue={values.minGpa}
              disabled={!canUseAdvanced}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minHeight">Min height (in)</Label>
            <Input
              id="minHeight"
              name="minHeight"
              type="number"
              placeholder="72"
              defaultValue={values.minHeight}
              disabled={!canUseAdvanced}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minWeight">Min weight (lbs)</Label>
            <Input
              id="minWeight"
              name="minWeight"
              type="number"
              placeholder="180"
              defaultValue={values.minWeight}
              disabled={!canUseAdvanced}
            />
          </div>
        </div>
        {!canUseAdvanced && (
          <p className="mt-3 text-xs text-muted-foreground">
            <Link href="/pricing" className="text-primary">
              Upgrade to Coach Pro
            </Link>{" "}
            to filter by GPA, height, and weight.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit">
          <Search className="size-4" /> Search
        </Button>
        <Button type="button" variant="ghost" asChild>
          <Link href={resetHref}>Reset</Link>
        </Button>
      </div>
    </form>
  );
}
