"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SPORTS, POSITIONS_BY_SPORT } from "@/lib/constants";

export function SportPositionPicker({
  defaultSport = "",
  defaultPosition = "",
  required = false,
}: {
  defaultSport?: string;
  defaultPosition?: string;
  required?: boolean;
}) {
  const [sport, setSport] = useState(defaultSport);
  const [position, setPosition] = useState(defaultPosition);
  const positions = sport ? POSITIONS_BY_SPORT[sport] ?? [] : [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="sport">Sport</Label>
        <Select
          name="sport"
          value={sport}
          onValueChange={(v) => {
            setSport(v ?? "");
            setPosition("");
          }}
          required={required}
        >
          <SelectTrigger id="sport" className="w-full">
            <SelectValue placeholder="Select sport" />
          </SelectTrigger>
          <SelectContent>
            {SPORTS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Select
          name="position"
          value={position}
          onValueChange={(v) => setPosition(v ?? "")}
          disabled={!positions.length}
        >
          <SelectTrigger id="position" className="w-full">
            <SelectValue
              placeholder={sport ? "Select position" : "Pick a sport first"}
            />
          </SelectTrigger>
          <SelectContent>
            {positions.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
