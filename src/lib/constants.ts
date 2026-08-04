export const SPORTS = [
  "Football",
  "Basketball",
  "Baseball",
  "Softball",
  "Soccer",
  "Volleyball",
  "Track & Field",
  "Cross Country",
  "Swimming",
  "Wrestling",
  "Tennis",
  "Golf",
  "Lacrosse",
  "Ice Hockey",
  "Field Hockey",
  "Gymnastics",
  "Action Sports",
] as const;

export const POSITIONS_BY_SPORT: Record<string, string[]> = {
  Football: [
    "Quarterback",
    "Running Back",
    "Wide Receiver",
    "Tight End",
    "Offensive Line",
    "Defensive Line",
    "Linebacker",
    "Cornerback",
    "Safety",
    "Kicker",
    "Punter",
  ],
  Basketball: [
    "Point Guard",
    "Shooting Guard",
    "Small Forward",
    "Power Forward",
    "Center",
  ],
  Baseball: [
    "Pitcher",
    "Catcher",
    "First Base",
    "Second Base",
    "Third Base",
    "Shortstop",
    "Outfield",
  ],
  Softball: [
    "Pitcher",
    "Catcher",
    "Infield",
    "Outfield",
    "Utility",
  ],
  Soccer: ["Goalkeeper", "Defender", "Midfielder", "Forward"],
  Volleyball: [
    "Outside Hitter",
    "Opposite",
    "Setter",
    "Middle Blocker",
    "Libero",
    "Defensive Specialist",
  ],
  "Track & Field": ["Sprints", "Distance", "Hurdles", "Jumps", "Throws", "Relays"],
  "Cross Country": ["Runner"],
  Swimming: ["Freestyle", "Backstroke", "Breaststroke", "Butterfly", "IM", "Distance"],
  Wrestling: ["Wrestler"],
  Tennis: ["Singles", "Doubles"],
  Golf: ["Golfer"],
  Lacrosse: ["Attack", "Midfield", "Defense", "Goalie", "Face-off"],
  "Ice Hockey": ["Goaltender", "Defense", "Center", "Wing"],
  "Field Hockey": ["Goalkeeper", "Defender", "Midfielder", "Forward"],
  Gymnastics: ["All-Around", "Vault", "Uneven Bars", "Balance Beam", "Floor Exercise"],
  "Action Sports": ["Skateboarding", "BMX", "Surfing", "Snowboarding", "Motocross"],
};

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

const currentYear = new Date().getFullYear();
export const GRAD_YEARS = Array.from({ length: 8 }, (_, i) => currentYear + i - 1);

/** Convert inches to a display string like 6'2". */
export function formatHeight(inches?: number | null): string {
  if (!inches) return "—";
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}"`;
}
