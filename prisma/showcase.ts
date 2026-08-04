import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PASSWORD = "Password123!";
const SAMPLE_DOC =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);

  const emails = [
    "diego.martinez@athleteconnect.test",
    "marcus.johnson@athleteconnect.test",
    "tyrese.coleman@athleteconnect.test",
    "cameron.brooks@athleteconnect.test",
    "sofia.ramirez@athleteconnect.test",
    "connor.blake@athleteconnect.test",
    "emma.sullivan@athleteconnect.test",
    "aaliyah.bennett@athleteconnect.test",
    "mia.chen@athleteconnect.test",
    "hannah.kowalski@athleteconnect.test",
    "jesse.rivera@athleteconnect.test",
  ];
  // Idempotent: remove prior showcase users (cascades clean their data).
  await prisma.user.deleteMany({ where: { email: { in: emails } } });

  // A few real coach viewers for the "recent viewers" list, if seeded.
  const coaches = await prisma.user.findMany({
    where: { role: "COACH" },
    select: { id: true },
    take: 4,
  });
  const coachIds = coaches.map((c) => c.id);
  const viewerFor = (i: number) =>
    coachIds.length ? coachIds[i % coachIds.length] : null;

  /* ---------------- Diego Martinez — HS Soccer ---------------- */
  const diego = await prisma.user.create({
    data: {
      email: emails[0],
      passwordHash: hash,
      role: "ATHLETE",
      status: "ACTIVE",
      plan: "PREMIUM",
      studentProfile: {
        create: {
          firstName: "Diego",
          lastName: "Martinez",
          photoUrl: "/media/soccer-portrait.jpg",
          location: "Frisco",
          state: "TX",
          height: 70, // 5'10"
          weight: 160,
          gpa: 3.9,
          satScore: 1380,
          intendedMajor: "Sports Management",
          sport: "Soccer",
          position: "Forward",
          school: "Frisco High School",
          graduationYear: 2026,
          verified: true,
          boosted: true,
          bio: "Dynamic attacking forward with elite pace and a nose for goal. Two-year varsity captain leading Frisco HS to back-to-back district titles. Composed under pressure, two-footed finisher, and relentless in the press. Actively seeking a top collegiate program to compete at the next level.",
          awards:
            "2024 District Player of the Year\n2x All-State Selection (2023, 2024)\nRegional Golden Boot — 24 goals\nECNL National Showcase Invitee",
          achievements:
            "Varsity Team Captain (2 seasons)\n42 goals & 27 assists across two varsity seasons\nLed district in goals (2024)\nNSCAA High School All-American nominee",
          videos: {
            create: [
              {
                title: "2024 Season Highlights",
                url: "/media/soccer1.mp4",
                thumbnail: "/sport-soccer.jpg",
                moderation: "APPROVED",
              },
              {
                title: "Top Goals & Assists Reel",
                url: "/media/soccer2.mp4",
                thumbnail: "/sport-soccer.jpg",
                moderation: "APPROVED",
              },
            ],
          },
          statistics: {
            create: [
              { sport: "Soccer", season: "2024", statName: "Goals", value: "24" },
              { sport: "Soccer", season: "2024", statName: "Assists", value: "15" },
              { sport: "Soccer", season: "2024", statName: "Matches Played", value: "22" },
              { sport: "Soccer", season: "2024", statName: "Shots on Target", value: "68" },
              { sport: "Soccer", season: "2024", statName: "Pass Accuracy", value: "87%" },
              { sport: "Soccer", season: "2023", statName: "Goals", value: "18" },
            ],
          },
          documents: {
            create: [
              { type: "TRANSCRIPT", title: "Official Transcript (3.9 GPA)", url: SAMPLE_DOC },
              { type: "RESUME", title: "Athletic Resume", url: SAMPLE_DOC },
              { type: "CERTIFICATE", title: "ECNL Showcase Invitation", url: SAMPLE_DOC },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });

  /* ---------------- Marcus Johnson — College Football (draft) ---------------- */
  const marcus = await prisma.user.create({
    data: {
      email: emails[1],
      passwordHash: hash,
      role: "ATHLETE",
      status: "ACTIVE",
      plan: "PREMIUM",
      studentProfile: {
        create: {
          firstName: "Marcus",
          lastName: "Johnson",
          photoUrl: "/media/football-portrait.jpg",
          location: "Columbus",
          state: "OH",
          height: 74, // 6'2"
          weight: 215,
          gpa: 3.4,
          actScore: 27,
          intendedMajor: "Communications",
          sport: "Football",
          position: "Running Back",
          school: "Ohio State University",
          graduationYear: 2026,
          verified: true,
          boosted: true,
          bio: "Explosive three-down running back entering the draft with elite contact balance and breakaway speed. First-Team All-Big Ten after a 1,480-yard, 18-TD senior campaign. Reliable pass-catcher and pass-protector projected as a Day 2 pick. Durable, coachable, and a proven locker-room leader.",
          awards:
            "2024 First-Team All-Big Ten\nDoak Walker Award Semifinalist\nTeam Offensive MVP (2024)\n2x Bowl Game Champion",
          achievements:
            "1,480 rushing yards & 18 TDs (2024)\n4.42s 40-yard dash at Pro Day\n3,900+ career rushing yards\nProjected Day 2 NFL Draft selection",
          videos: {
            create: [
              {
                title: "2024 Full Season Highlights",
                url: "/media/football1.mp4",
                thumbnail: "/sport-football.jpg",
                moderation: "APPROVED",
              },
              {
                title: "Pro Day & Combine Workout",
                url: "/media/football2.mp4",
                thumbnail: "/sport-football.jpg",
                moderation: "APPROVED",
              },
            ],
          },
          statistics: {
            create: [
              { sport: "Football", season: "2024", statName: "Rushing Yards", value: "1,480" },
              { sport: "Football", season: "2024", statName: "Rushing TDs", value: "18" },
              { sport: "Football", season: "2024", statName: "Yards per Carry", value: "6.2" },
              { sport: "Football", season: "2024", statName: "Receptions", value: "34" },
              { sport: "Combine", season: "2025", statName: "40-Yard Dash", value: "4.42s" },
              { sport: "Combine", season: "2025", statName: "Bench Press (225)", value: "21 reps" },
              { sport: "Combine", season: "2025", statName: "Vertical Jump", value: "38.5\"" },
            ],
          },
          documents: {
            create: [
              { type: "TRANSCRIPT", title: "University Transcript", url: SAMPLE_DOC },
              { type: "RESUME", title: "Pro Day Combine Report", url: SAMPLE_DOC },
              { type: "CERTIFICATE", title: "All-Big Ten Certificate", url: SAMPLE_DOC },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });

  /* ---------------- Tyrese Coleman — HS Basketball recruit ---------------- */
  const tyrese = await prisma.user.create({
    data: {
      email: emails[2],
      passwordHash: hash,
      role: "ATHLETE",
      status: "ACTIVE",
      plan: "PREMIUM",
      studentProfile: {
        create: {
          firstName: "Tyrese",
          lastName: "Coleman",
          photoUrl: "/media/basketball-portrait.jpg",
          location: "Mouth of Wilson",
          state: "VA",
          height: 75, // 6'3"
          weight: 185,
          gpa: 3.6,
          satScore: 1250,
          intendedMajor: "Business Administration",
          sport: "Basketball",
          position: "Point Guard",
          school: "Oak Hill Academy",
          graduationYear: 2026,
          verified: true,
          boosted: true,
          bio: "Top-50 national point guard with elite court vision and a lethal pull-up jumper. A three-level scorer who runs the offense with poise and locks up on defense. Multiple high-major D1 offers and climbing recruiting boards after a dominant summer on the EYBL circuit.",
          awards:
            "2025 McDonald's All-American Nominee\nState Champion (2024)\nEYBL All-Tournament Team\nTop-50 National Recruit (Class of 2026)",
          achievements:
            "24.5 PPG · 7.8 APG · 4.1 RPG (2024-25)\n11 high-major D1 scholarship offers\n40-point triple-double vs. national #3\nTeam Captain",
          videos: {
            create: [
              { title: "2024-25 Season Mixtape", url: "/media/basketball1.mp4", thumbnail: "/sport-basketball.jpg", moderation: "APPROVED" },
              { title: "EYBL Circuit Highlights", url: "/media/basketball2.mp4", thumbnail: "/sport-basketball.jpg", moderation: "APPROVED" },
            ],
          },
          statistics: {
            create: [
              { sport: "Basketball", season: "2024-25", statName: "Points per Game", value: "24.5" },
              { sport: "Basketball", season: "2024-25", statName: "Assists per Game", value: "7.8" },
              { sport: "Basketball", season: "2024-25", statName: "Rebounds per Game", value: "4.1" },
              { sport: "Basketball", season: "2024-25", statName: "Field Goal %", value: "48%" },
              { sport: "Basketball", season: "2024-25", statName: "Three-Point %", value: "39%" },
              { sport: "Basketball", season: "2024-25", statName: "Steals per Game", value: "2.3" },
            ],
          },
          documents: {
            create: [
              { type: "TRANSCRIPT", title: "Official Transcript (3.6 GPA)", url: SAMPLE_DOC },
              { type: "RESUME", title: "Recruiting Profile & Measurables", url: SAMPLE_DOC },
              { type: "CERTIFICATE", title: "EYBL All-Tournament Selection", url: SAMPLE_DOC },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });

  /* ---------------- Cameron Brooks — College Football QB (transfer portal) ---------------- */
  const cameron = await prisma.user.create({
    data: {
      email: emails[3],
      passwordHash: hash,
      role: "ATHLETE",
      status: "ACTIVE",
      plan: "PREMIUM",
      studentProfile: {
        create: {
          firstName: "Cameron",
          lastName: "Brooks",
          photoUrl: "/media/qb-portrait.jpg",
          location: "Conway",
          state: "SC",
          height: 76, // 6'4"
          weight: 220,
          gpa: 3.5,
          actScore: 28,
          intendedMajor: "Business Management",
          sport: "Football",
          position: "Quarterback",
          school: "Coastal Carolina (Transfer Portal)",
          graduationYear: 2026,
          verified: true,
          boosted: true,
          bio: "Dual-threat quarterback in the transfer portal seeking a Power Five program for his final two seasons. Two-year starter with a live arm, elite mobility, and a 3.5 GPA. Threw for 3,100 yards and rushed for 620 more last season — immediately eligible and looking for the right fit.",
          awards:
            "2024 Second-Team All-Sun Belt\nConference Offensive Player of the Week (4x)\nTeam Captain\nAcademic All-Conference",
          achievements:
            "3,100 passing yards · 28 TD · 8 INT (2024)\n620 rushing yards · 9 rushing TDs\n66% completion rate\nActively in the NCAA Transfer Portal",
          videos: {
            create: [
              { title: "2024 QB Highlights", url: "/media/football1.mp4", thumbnail: "/sport-football.jpg", moderation: "APPROVED" },
              { title: "Arm Talent & Mobility Reel", url: "/media/football2.mp4", thumbnail: "/sport-football.jpg", moderation: "APPROVED" },
            ],
          },
          statistics: {
            create: [
              { sport: "Football", season: "2024", statName: "Passing Yards", value: "3,100" },
              { sport: "Football", season: "2024", statName: "Passing TDs", value: "28" },
              { sport: "Football", season: "2024", statName: "Completion %", value: "66%" },
              { sport: "Football", season: "2024", statName: "Interceptions", value: "8" },
              { sport: "Football", season: "2024", statName: "Rushing Yards", value: "620" },
              { sport: "Football", season: "2024", statName: "QB Rating", value: "158.4" },
            ],
          },
          documents: {
            create: [
              { type: "TRANSCRIPT", title: "University Transcript (3.5 GPA)", url: SAMPLE_DOC },
              { type: "RESUME", title: "Transfer Portal One-Pager", url: SAMPLE_DOC },
              { type: "CERTIFICATE", title: "All-Sun Belt Certificate", url: SAMPLE_DOC },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });

  // Populate profile views over the past two weeks so dashboards look alive.
  async function addViews(studentId: string, total: number) {
    const rows = Array.from({ length: total }, (_, i) => ({
      studentId,
      viewerId: i % 3 === 0 ? viewerFor(i) : null,
      createdAt: daysAgo(Math.floor(Math.random() * 14)),
    }));
    await prisma.profileView.createMany({ data: rows });
  }
  await addViews(diego.studentProfile!.id, 47);
  await addViews(marcus.studentProfile!.id, 63);
  await addViews(tyrese.studentProfile!.id, 58);
  await addViews(cameron.studentProfile!.id, 71);

  // ---- Athletes across every remaining category (incl. female athletes) ----
  type AthleteInput = {
    email: string; first: string; last: string; photo: string;
    location: string; state: string; height: number; weight: number;
    gpa: number; sat?: number; act?: number; major: string;
    sport: string; position: string; school: string; grad: number;
    bio: string; awards: string; achievements: string;
    videos: { title: string; url: string; thumb: string }[];
    stats: { statName: string; value: string; season?: string }[];
    views: number;
  };

  async function createAthlete(a: AthleteInput) {
    const u = await prisma.user.create({
      data: {
        email: a.email, passwordHash: hash, role: "ATHLETE", status: "ACTIVE", plan: "PREMIUM",
        studentProfile: {
          create: {
            firstName: a.first, lastName: a.last, photoUrl: a.photo,
            location: a.location, state: a.state, height: a.height, weight: a.weight,
            gpa: a.gpa, satScore: a.sat ?? null, actScore: a.act ?? null,
            intendedMajor: a.major, sport: a.sport, position: a.position,
            school: a.school, graduationYear: a.grad, verified: true, boosted: true,
            bio: a.bio, awards: a.awards, achievements: a.achievements,
            videos: { create: a.videos.map((v) => ({ title: v.title, url: v.url, thumbnail: v.thumb, moderation: "APPROVED" as const })) },
            statistics: { create: a.stats.map((s) => ({ sport: a.sport, season: s.season ?? "2024", statName: s.statName, value: s.value })) },
            documents: {
              create: [
                { type: "TRANSCRIPT" as const, title: "Official Transcript", url: SAMPLE_DOC },
                { type: "RESUME" as const, title: "Athletic Resume", url: SAMPLE_DOC },
                { type: "CERTIFICATE" as const, title: "Award Certificate", url: SAMPLE_DOC },
              ],
            },
          },
        },
      },
      include: { studentProfile: true },
    });
    await addViews(u.studentProfile!.id, a.views);
    return u;
  }

  const MORE: AthleteInput[] = [
    {
      email: emails[4], first: "Sofia", last: "Ramirez", photo: "/media/softball-portrait.jpg",
      location: "Tempe", state: "AZ", height: 68, weight: 145, gpa: 3.85, sat: 1320, major: "Kinesiology",
      sport: "Softball", position: "Pitcher", school: "Corona del Sol High School", grad: 2026,
      bio: "Dominant fastpitch ace with a devastating rise ball and pinpoint control. Led her team to a state title with a sub-1.00 ERA. Two-way threat who also hits in the middle of the order. Multiple Power Five offers.",
      awards: "2024 State Champion & Tournament MVP\nGatorade Player of the Year (AZ) Finalist\n2x All-State First Team\nAll-Region Selection",
      achievements: "0.94 ERA · 312 strikeouts (2024)\n26-3 record with 14 shutouts\n.410 batting average\nTeam Captain",
      videos: [{ title: "2024 Pitching Highlights", url: "/media/softball1.mp4", thumb: "/sport-softball.jpg" }],
      stats: [
        { statName: "ERA", value: "0.94" }, { statName: "Strikeouts", value: "312" },
        { statName: "Wins-Losses", value: "26-3" }, { statName: "Innings Pitched", value: "168" },
        { statName: "Batting Average", value: ".410" }, { statName: "WHIP", value: "0.82" },
      ], views: 52,
    },
    {
      email: emails[5], first: "Connor", last: "Blake", photo: "/sport-hockey.jpg",
      location: "Faribault", state: "MN", height: 73, weight: 190, gpa: 3.5, act: 26, major: "Business",
      sport: "Ice Hockey", position: "Center", school: "Shattuck-St. Mary's", grad: 2026,
      bio: "Two-way center with elite hockey IQ and a heavy shot. Wins puck battles, drives play, and kills penalties. USHL draft pick weighing NCAA D1 commitments for his next step.",
      awards: "All-Conference First Team (2024)\nTeam MVP & Captain\nHoliday Tournament All-Star\nUSHL Draft Selection",
      achievements: "34 goals · 41 assists · 75 points (2024)\n+38 on the season\n58% faceoff win rate\nMultiple NCAA D1 offers",
      videos: [{ title: "2024 Season Highlights", url: "/media/hockey1.mp4", thumb: "/sport-hockey.jpg" }],
      stats: [
        { statName: "Goals", value: "34" }, { statName: "Assists", value: "41" },
        { statName: "Points", value: "75" }, { statName: "Plus/Minus", value: "+38" },
        { statName: "Faceoff %", value: "58%" }, { statName: "Penalty Minutes", value: "22" },
      ], views: 44,
    },
    {
      email: emails[6], first: "Emma", last: "Sullivan", photo: "/sport-lacrosse.jpg",
      location: "Owings Mills", state: "MD", height: 66, weight: 135, gpa: 3.9, sat: 1350, major: "Nursing",
      sport: "Lacrosse", position: "Attack", school: "McDonogh School", grad: 2026,
      bio: "Dynamic attacker with elite dodging ability and vision from behind the cage. A dual scoring-and-feeding threat who elevates everyone around her. Committed-caliber recruit with top academics.",
      awards: "Under Armour All-American\n2x All-Metro First Team\nConference Player of the Year (2024)\nAcademic All-State",
      achievements: "78 goals · 54 assists (2024)\n132 points as a junior\n112 draw controls\nTeam Captain",
      videos: [],
      stats: [
        { statName: "Goals", value: "78" }, { statName: "Assists", value: "54" },
        { statName: "Points", value: "132" }, { statName: "Draw Controls", value: "112" },
        { statName: "Ground Balls", value: "64" }, { statName: "Shooting %", value: "61%" },
      ], views: 38,
    },
    {
      email: emails[7], first: "Aaliyah", last: "Bennett", photo: "/sport-track.jpg",
      location: "Long Beach", state: "CA", height: 67, weight: 130, gpa: 3.7, sat: 1290, major: "Exercise Science",
      sport: "Track & Field", position: "Sprints", school: "Long Beach Poly High School", grad: 2026,
      bio: "Explosive sprinter with a lightning start and a strong close. State champion in the 100m and anchor of a nationally ranked 4x100 relay. Chasing sub-11.0 and a Power Five scholarship.",
      awards: "2024 State Champion — 100m & 200m\nNike Nationals Finalist\nCIF Record Holder (4x100)\n2x All-American",
      achievements: "100m PR: 11.18s · 200m PR: 23.04s\nAnchored 4x100 to a state title\nNational #6 in the 100m\nTeam Captain",
      videos: [{ title: "Sprint & Relay Highlights", url: "/media/track1.mp4", thumb: "/sport-track.jpg" }],
      stats: [
        { statName: "100m (PR)", value: "11.18s" }, { statName: "200m (PR)", value: "23.04s" },
        { statName: "400m (PR)", value: "54.9s" }, { statName: "Long Jump", value: "19'4\"" },
        { statName: "4x100 Relay", value: "45.2s" },
      ], views: 49,
    },
    {
      email: emails[8], first: "Mia", last: "Chen", photo: "/sport-gymnastics.jpg",
      location: "Houston", state: "TX", height: 60, weight: 105, gpa: 4.0, sat: 1400, major: "Biology (Pre-Med)",
      sport: "Gymnastics", position: "All-Around", school: "Cypress Academy", grad: 2027,
      bio: "Level 10 all-around gymnast with elite difficulty and clean execution. Regional all-around champion with a standout beam and floor. 4.0 student targeting a top NCAA gymnastics program.",
      awards: "Level 10 Regional All-Around Champion\nState Champion — Beam & Floor\nJO Nationals Qualifier\nScholastic Honor Roll",
      achievements: "39.20 all-around high score\n9.85 on beam · 9.80 on floor\nRegional AA Champion (2024)\nVerbal D1 interest",
      videos: [{ title: "Level 10 Competition Reel", url: "/media/gymnastics1.mp4", thumb: "/sport-gymnastics.jpg" }],
      stats: [
        { statName: "All-Around", value: "39.20" }, { statName: "Vault", value: "9.75" },
        { statName: "Uneven Bars", value: "9.70" }, { statName: "Balance Beam", value: "9.85" },
        { statName: "Floor Exercise", value: "9.80" },
      ], views: 41,
    },
    {
      email: emails[9], first: "Hannah", last: "Kowalski", photo: "/sport-swimming.jpg",
      location: "Carmel", state: "IN", height: 70, weight: 150, gpa: 3.95, sat: 1360, major: "Chemistry",
      sport: "Swimming", position: "Freestyle", school: "Carmel High School", grad: 2026,
      bio: "Sprint-freestyle specialist and state champion anchoring a powerhouse program. Futures and Junior National qualifier with Olympic Trials cuts in sight. Elite student-athlete with top-tier academics.",
      awards: "State Champion — 50 & 100 Free\nHigh School All-American\nJunior National Qualifier\nAcademic All-American",
      achievements: "50 Free: 22.4s · 100 Free: 48.9s\nOlympic Trials cut (50 Free)\nState record — 200 Free Relay\nTeam Captain",
      videos: [{ title: "Championship Meet Highlights", url: "/media/swimming1.mp4", thumb: "/sport-swimming.jpg" }],
      stats: [
        { statName: "50 Free", value: "22.4s" }, { statName: "100 Free", value: "48.9s" },
        { statName: "200 Free", value: "1:47.8" }, { statName: "100 Fly", value: "54.1s" },
      ], views: 46,
    },
    {
      email: emails[10], first: "Jesse", last: "Rivera", photo: "/sport-action.jpg",
      location: "Los Angeles", state: "CA", height: 69, weight: 150, gpa: 3.3, act: 24, major: "Film Production",
      sport: "Action Sports", position: "Skateboarding", school: "Venice High School", grad: 2026,
      bio: "Sponsored amateur street and park skater with a deep bag of technical tricks and contest poise. Dew Tour finalist chasing a pro career and creative-media opportunities.",
      awards: "Dew Tour Amateur Finalist (2024)\nX Games Amateur Showcase Invitee\nRegional Street Series Champion\nBrand-Sponsored Am",
      achievements: "2x podium — Street Series\nSponsored by two skate brands\nDew Tour Am Finalist\n120K+ social following",
      videos: [{ title: "Street & Park Part", url: "/media/action1.mp4", thumb: "/sport-action.jpg" }],
      stats: [
        { statName: "Best Contest Finish", value: "1st — Street Series" }, { statName: "Sponsors", value: "2 brands" },
        { statName: "Signature Trick", value: "Nollie 360 Flip" }, { statName: "Discipline", value: "Street / Park" },
      ], views: 33,
    },
  ];

  const more = [];
  for (const a of MORE) more.push(await createAthlete(a));

  console.log("Showcase profiles created:");
  console.log(`  Soccer (HS):         ${emails[0]} / ${PASSWORD}  → /athletes/${diego.studentProfile!.id}`);
  console.log(`  Football (draft):    ${emails[1]} / ${PASSWORD}  → /athletes/${marcus.studentProfile!.id}`);
  console.log(`  Basketball (recruit): ${emails[2]} / ${PASSWORD}  → /athletes/${tyrese.studentProfile!.id}`);
  console.log(`  Football QB (transfer): ${emails[3]} / ${PASSWORD}  → /athletes/${cameron.studentProfile!.id}`);
  for (const u of more) {
    const p = u.studentProfile!;
    console.log(`  ${p.sport} (${p.position}): ${u.email} / ${PASSWORD}  → /athletes/${p.id}`);
  }
  console.log(`\nTotal athletes: ${4 + more.length}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
