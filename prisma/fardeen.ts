import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PASSWORD = "Password123!";
const EMAIL = "fardeen.islam@athleteconnect.test";
const P = (n: number) => `/media/fardeen/photo-${n}.jpg`;

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  await prisma.user.deleteMany({ where: { email: EMAIL } });

  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      passwordHash: hash,
      role: "ATHLETE",
      status: "ACTIVE",
      plan: "PREMIUM",
      studentProfile: {
        create: {
          firstName: "Fardeen",
          lastName: "Islam",
          photoUrl: P(8), // driving at the ball — red #9 club kit
          galleryUrls: [P(8), P(7), P(3), P(4), P(6), P(1), P(2), P(5)],
          location: "Bayside",
          state: "NY",
          height: 69, // 5'9"  (placeholder)
          weight: 150, // lbs   (placeholder)
          gpa: 3.5, // placeholder
          satScore: 1180, // placeholder
          intendedMajor: "Business", // placeholder
          sport: "Soccer",
          position: "Forward",
          school: "Bayside High School",
          graduationYear: 2026, // placeholder — confirm 2026 vs 2027
          verified: true,
          boosted: true,
          bio: "Fardeen Islam is a senior forward at Bayside High School who wears the #9 up top. A two-footed attacker with real pace, sharp off-ball movement, and a striker's instinct in the box, he competes year-round across both his high school and club leagues. His ambition is clear: earn a spot at the collegiate level, break into an MLS academy pathway, and ultimately get drafted into MLS. A hungry, coachable forward ready for the next level.",
          awards:
            "PSAL All-Division Selection (2024)\nClub League Top-Scorer Nominee\nTeam Captain",
          achievements:
            "Two-footed forward with pace & clinical finishing\nCompetes across high school (PSAL) and club leagues\nTargeting an NCAA college & MLS academy pathway",
          videos: {
            create: [
              { title: "Match Highlights", url: "/media/fardeen/video-1.mp4", thumbnail: P(8), moderation: "APPROVED" },
              { title: "Skills & Goals Reel", url: "/media/fardeen/video-2.mp4", thumbnail: P(3), moderation: "APPROVED" },
            ],
          },
          statistics: {
            create: [
              { sport: "Soccer", season: "2024", statName: "Goals", value: "16" },
              { sport: "Soccer", season: "2024", statName: "Assists", value: "11" },
              { sport: "Soccer", season: "2024", statName: "Matches Played", value: "18" },
              { sport: "Soccer", season: "2024", statName: "Shots on Target", value: "54" },
              { sport: "Soccer", season: "2024", statName: "Pass Accuracy", value: "82%" },
              { sport: "Soccer", season: "2024", statName: "Preferred Foot", value: "Right" },
            ],
          },
          documents: {
            create: [
              { type: "RESUME", title: "Player Resume", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });

  const sid = user.studentProfile!.id;
  await prisma.profileView.createMany({
    data: Array.from({ length: 68 }, (_, i) => ({
      studentId: sid,
      viewerId: null,
      createdAt: daysAgo(Math.floor(Math.random() * 14)),
    })),
  });

  console.log("Fardeen Islam profile created (featured):");
  console.log(`  Login:   ${EMAIL} / ${PASSWORD}`);
  console.log(`  Profile: /athletes/${sid}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
