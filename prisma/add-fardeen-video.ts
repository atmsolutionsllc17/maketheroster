import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const EMAIL = "fardeen.islam@athleteconnect.test";
const URL = "/media/fardeen/highlights.mp4";
const TITLE = "Senior Season Highlights";
const POSTER = "/media/fardeen/photo-8.jpg";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    include: { studentProfile: true },
  });
  if (!user?.studentProfile) throw new Error("Fardeen profile not found");
  const studentId = user.studentProfile.id;

  const existing = await prisma.video.findFirst({
    where: { studentId, url: URL },
  });
  if (existing) {
    console.log("Highlight video already present — nothing to do.");
    return;
  }

  const v = await prisma.video.create({
    data: {
      studentId,
      title: TITLE,
      url: URL,
      thumbnail: POSTER,
      moderation: "APPROVED", // curated, so it's live immediately
    },
  });
  console.log(`Added "${TITLE}" (${v.id}) to Fardeen — now his top highlight.`);
  console.log(`Profile: /athletes/${studentId}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
