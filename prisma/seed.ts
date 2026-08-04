import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PASSWORD = "Password123!";

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);

  // Clean slate (order matters for FKs, but cascades handle most)
  await prisma.report.deleteMany();
  await prisma.searchLog.deleteMany();
  await prisma.profileView.deleteMany();
  await prisma.message.deleteMany();
  await prisma.coachNote.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.video.deleteMany();
  await prisma.statistic.deleteMany();
  await prisma.document.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.coachProfile.deleteMany();
  await prisma.user.deleteMany();

  // ---- Admin ----
  await prisma.user.create({
    data: {
      email: "admin@athleteconnect.test",
      passwordHash: hash,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  // ---- Athletes ----
  type A = {
    email: string;
    first: string;
    last: string;
    sport: string;
    position: string;
    state: string;
    school: string;
    grad: number;
    gpa: number;
    height: number;
    weight: number;
    sat?: number;
    act?: number;
    major?: string;
    city: string;
    verified?: boolean;
    premium?: boolean;
    bio: string;
    awards: string;
    videos: { title: string; url: string }[];
    stats: { statName: string; value: string; season?: string }[];
  };

  const athletes: A[] = [
    {
      email: "jayden.q@athleteconnect.test",
      first: "Jayden", last: "Carter", sport: "Football", position: "Quarterback",
      state: "TX", school: "Allen High School", grad: 2027, gpa: 3.8, height: 75, weight: 205,
      sat: 1280, major: "Business", city: "Allen", verified: true, premium: true,
      bio: "Dual-threat QB with a strong arm and quick reads. Team captain two years running.",
      awards: "All-District QB 2025\nTeam Captain",
      videos: [
        { title: "Junior Season Highlights", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { title: "Spring Camp Reel", url: "https://youtu.be/oHg5SJYRHA0" },
      ],
      stats: [
        { statName: "Passing Yards", value: "3,240", season: "2025" },
        { statName: "Passing TDs", value: "34", season: "2025" },
        { statName: "Completion %", value: "67%", season: "2025" },
      ],
    },
    {
      email: "marcus.rb@athleteconnect.test",
      first: "Marcus", last: "Bell", sport: "Football", position: "Running Back",
      state: "GA", school: "Grayson High School", grad: 2026, gpa: 3.4, height: 70, weight: 195,
      act: 24, major: "Kinesiology", city: "Loganville", verified: true,
      bio: "Explosive back with elite vision and contact balance.",
      awards: "1,500-yard season 2025",
      videos: [{ title: "Senior Highlights", url: "https://www.youtube.com/watch?v=abc123" }],
      stats: [
        { statName: "Rushing Yards", value: "1,512", season: "2025" },
        { statName: "Rushing TDs", value: "19", season: "2025" },
      ],
    },
    {
      email: "aisha.pg@athleteconnect.test",
      first: "Aisha", last: "Nguyen", sport: "Basketball", position: "Point Guard",
      state: "CA", school: "Sierra Canyon", grad: 2027, gpa: 4.0, height: 68, weight: 140,
      sat: 1450, major: "Computer Science", city: "Chatsworth", verified: true, premium: true,
      bio: "Floor general with a high basketball IQ and deep range.",
      awards: "All-State 2025\nAcademic All-American",
      videos: [{ title: "Playmaking Reel", url: "https://youtu.be/9bZkp7q19f0" }],
      stats: [
        { statName: "Points Per Game", value: "18.4", season: "2025" },
        { statName: "Assists Per Game", value: "7.1", season: "2025" },
      ],
    },
    {
      email: "tyler.c@athleteconnect.test",
      first: "Tyler", last: "Brooks", sport: "Basketball", position: "Center",
      state: "FL", school: "Montverde Academy", grad: 2026, gpa: 3.2, height: 82, weight: 230,
      major: "Communications", city: "Montverde",
      bio: "Rim-protecting big with soft hands around the basket.",
      awards: "District Defensive POY",
      videos: [],
      stats: [
        { statName: "Rebounds Per Game", value: "11.2", season: "2025" },
        { statName: "Blocks Per Game", value: "3.4", season: "2025" },
      ],
    },
    {
      email: "sofia.mf@athleteconnect.test",
      first: "Sofia", last: "Ramirez", sport: "Soccer", position: "Midfielder",
      state: "TX", school: "Southlake Carroll", grad: 2027, gpa: 3.9, height: 65, weight: 130,
      sat: 1330, major: "Nursing", city: "Southlake", verified: true,
      bio: "Box-to-box midfielder with a relentless motor.",
      awards: "All-Region 2025",
      videos: [{ title: "Club Season Highlights", url: "https://vimeo.com/76979871" }],
      stats: [
        { statName: "Goals", value: "14", season: "2025" },
        { statName: "Assists", value: "11", season: "2025" },
      ],
    },
    {
      email: "emma.oh@athleteconnect.test",
      first: "Emma", last: "Johnson", sport: "Volleyball", position: "Outside Hitter",
      state: "NE", school: "Papillion-La Vista", grad: 2026, gpa: 3.7, height: 72, weight: 155,
      act: 29, major: "Biology", city: "Papillion", premium: true,
      bio: "High-flying outside with a heavy swing and steady serve-receive.",
      awards: "All-State First Team",
      videos: [{ title: "Attack Highlights", url: "https://www.youtube.com/watch?v=xyz789" }],
      stats: [
        { statName: "Kills", value: "412", season: "2025" },
        { statName: "Kills Per Set", value: "4.3", season: "2025" },
      ],
    },
    {
      email: "noah.p@athleteconnect.test",
      first: "Noah", last: "Williams", sport: "Baseball", position: "Pitcher",
      state: "FL", school: "American Heritage", grad: 2027, gpa: 3.5, height: 74, weight: 185,
      major: "Sports Management", city: "Plantation", verified: true,
      bio: "RHP sitting 88-91 with a plus slider and clean mechanics.",
      awards: "All-County Pitcher",
      videos: [{ title: "Bullpen Session", url: "https://youtu.be/pitch123" }],
      stats: [
        { statName: "ERA", value: "1.82", season: "2025" },
        { statName: "Strikeouts", value: "94", season: "2025" },
      ],
    },
    {
      email: "olivia.sp@athleteconnect.test",
      first: "Olivia", last: "Davis", sport: "Track & Field", position: "Sprints",
      state: "NC", school: "Charlotte Catholic", grad: 2026, gpa: 4.0, height: 67, weight: 135,
      sat: 1400, major: "Engineering", city: "Charlotte", verified: true, premium: true,
      bio: "State-qualifying sprinter in the 100m and 200m.",
      awards: "State Champion 200m",
      videos: [],
      stats: [
        { statName: "100m PR", value: "11.62s", season: "2025" },
        { statName: "200m PR", value: "23.85s", season: "2025" },
      ],
    },
    {
      email: "liam.wr@athleteconnect.test",
      first: "Liam", last: "Anderson", sport: "Football", position: "Wide Receiver",
      state: "OH", school: "St. Edward", grad: 2028, gpa: 3.6, height: 73, weight: 180,
      major: "Undecided", city: "Lakewood",
      bio: "Route-technician with reliable hands and YAC ability.",
      awards: "Freshman of the Year",
      videos: [{ title: "Sophomore Film", url: "https://www.youtube.com/watch?v=wr2028" }],
      stats: [
        { statName: "Receiving Yards", value: "980", season: "2025" },
        { statName: "Receptions", value: "62", season: "2025" },
      ],
    },
    {
      email: "maya.def@athleteconnect.test",
      first: "Maya", last: "Thompson", sport: "Soccer", position: "Defender",
      state: "CA", school: "Mater Dei", grad: 2027, gpa: 3.85, height: 66, weight: 138,
      sat: 1360, major: "Psychology", city: "Santa Ana", verified: true,
      bio: "Lockdown center back, strong in the air and on the ball.",
      awards: "All-League Defender",
      videos: [],
      stats: [
        { statName: "Clean Sheets", value: "12", season: "2025" },
        { statName: "Tackles Won", value: "88", season: "2025" },
      ],
    },
    {
      email: "ethan.ss@athleteconnect.test",
      first: "Ethan", last: "Martinez", sport: "Baseball", position: "Shortstop",
      state: "TX", school: "Flower Mound", grad: 2026, gpa: 3.3, height: 71, weight: 175,
      act: 26, major: "Finance", city: "Flower Mound",
      bio: "Smooth-fielding shortstop with a quick first step and gap power.",
      awards: "All-District SS",
      videos: [{ title: "Infield & BP", url: "https://youtu.be/ss2026" }],
      stats: [
        { statName: "Batting Avg", value: ".361", season: "2025" },
        { statName: "Stolen Bases", value: "22", season: "2025" },
      ],
    },
    {
      email: "chloe.sw@athleteconnect.test",
      first: "Chloe", last: "Wilson", sport: "Swimming", position: "Freestyle",
      state: "AZ", school: "Brophy Prep", grad: 2027, gpa: 3.95, height: 69, weight: 145,
      sat: 1420, major: "Marine Biology", city: "Phoenix", verified: true, premium: true,
      bio: "Distance freestyler with sectional cuts in the 500 and 1000.",
      awards: "Sectional Qualifier",
      videos: [],
      stats: [
        { statName: "500 Free", value: "4:52.10", season: "2025" },
        { statName: "200 Free", value: "1:51.30", season: "2025" },
      ],
    },
  ];

  const createdAthletes: { id: string; userId: string }[] = [];
  for (const a of athletes) {
    const user = await prisma.user.create({
      data: {
        email: a.email,
        passwordHash: hash,
        role: "ATHLETE",
        status: "ACTIVE",
        plan: a.premium ? "PREMIUM" : "FREE",
        studentProfile: {
          create: {
            firstName: a.first,
            lastName: a.last,
            sport: a.sport,
            position: a.position,
            state: a.state,
            location: a.city,
            school: a.school,
            graduationYear: a.grad,
            gpa: a.gpa,
            height: a.height,
            weight: a.weight,
            satScore: a.sat ?? null,
            actScore: a.act ?? null,
            intendedMajor: a.major ?? null,
            bio: a.bio,
            awards: a.awards,
            verified: a.verified ?? false,
            boosted: a.premium ?? false,
            videos: { create: a.videos.map((v) => ({ title: v.title, url: v.url })) },
            statistics: {
              create: a.stats.map((s) => ({
                sport: a.sport,
                statName: s.statName,
                value: s.value,
                season: s.season ?? null,
              })),
            },
          },
        },
      },
      include: { studentProfile: true },
    });
    createdAthletes.push({ id: user.studentProfile!.id, userId: user.id });
  }

  // ---- Coaches ----
  const coachPro = await prisma.user.create({
    data: {
      email: "coach.pro@athleteconnect.test",
      passwordHash: hash,
      role: "COACH",
      status: "ACTIVE",
      plan: "COACH_PRO",
      coachProfile: {
        create: {
          firstName: "Dana",
          lastName: "Reeves",
          school: "University of Texas",
          organization: "UT Athletics",
          title: "Recruiting Coordinator",
          sport: "Football",
          verified: true,
          bio: "15 years recruiting D1 talent across the Southwest.",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "coach.basic@athleteconnect.test",
      passwordHash: hash,
      role: "COACH",
      status: "ACTIVE",
      plan: "COACH_BASIC",
      coachProfile: {
        create: {
          firstName: "Sam",
          lastName: "Okafor",
          school: "Ohio State University",
          title: "Assistant Coach",
          sport: "Basketball",
          verified: true,
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: "coach.pending@athleteconnect.test",
      passwordHash: hash,
      role: "COACH",
      status: "PENDING",
      plan: "COACH_BASIC",
      coachProfile: {
        create: {
          firstName: "Riley",
          lastName: "Nakamura",
          school: "Riverside Club Volleyball",
          organization: "Riverside VBC",
          title: "Club Director",
          sport: "Volleyball",
        },
      },
    },
  });

  // ---- Pro coach engagement: favorites, watchlist, notes, views, messages ----
  const [a0, a1, a2] = createdAthletes;

  await prisma.favorite.createMany({
    data: [
      { coachId: coachPro.id, studentId: a0.id },
      { coachId: coachPro.id, studentId: a2.id },
    ],
  });

  const watchlist = await prisma.watchlist.create({
    data: {
      coachId: coachPro.id,
      name: "2027 QB Targets",
      items: { create: [{ studentId: a0.id }] },
    },
  });
  void watchlist;

  await prisma.coachNote.create({
    data: {
      coachId: coachPro.id,
      studentId: a0.id,
      body: "Great arm talent. Following up after spring game. Strong academics too.",
    },
  });

  await prisma.profileView.createMany({
    data: [
      { studentId: a0.id, viewerId: coachPro.id },
      { studentId: a0.id, viewerId: coachPro.id, createdAt: new Date(Date.now() - 2 * 864e5) },
      { studentId: a2.id, viewerId: coachPro.id },
    ],
  });

  await prisma.message.createMany({
    data: [
      {
        senderId: coachPro.id,
        receiverId: a0.userId,
        body: "Hi Jayden — really impressed with your film. Do you have a spring schedule?",
      },
      {
        senderId: a0.userId,
        receiverId: coachPro.id,
        body: "Thank you Coach! Yes, I can send it over this week.",
        read: true,
      },
    ],
  });

  await prisma.searchLog.createMany({
    data: [
      { coachId: coachPro.id, query: JSON.stringify({ sport: "Football", state: "TX" }), results: 3 },
      { coachId: coachPro.id, query: JSON.stringify({ sport: "Basketball" }), results: 2 },
    ],
  });

  await prisma.report.create({
    data: {
      reporterId: coachPro.id,
      targetType: "VIDEO",
      targetId: "seed-example",
      reason: "Video link appears broken / unrelated content.",
    },
  });

  console.log("Seed complete.");
  console.log(`Admin:      admin@athleteconnect.test / ${PASSWORD}`);
  console.log(`Coach Pro:  coach.pro@athleteconnect.test / ${PASSWORD}`);
  console.log(`Athlete:    jayden.q@athleteconnect.test / ${PASSWORD}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
