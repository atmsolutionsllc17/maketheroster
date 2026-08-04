import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProfileInfoForm } from "./profile-info-form";
import {
  VideosManager,
  StatsManager,
  DocumentsManager,
} from "./managers";
import { canUploadUnlimitedVideos, FREE_VIDEO_LIMIT } from "@/lib/plans";
import { cloudinaryConfigured } from "@/lib/cloudinary";

export default async function AthleteProfilePage() {
  const user = await requireRole("ATHLETE");
  const profile = await prisma.studentProfile.findUnique({
    where: { userId: user.id },
    include: {
      videos: { orderBy: { createdAt: "desc" } },
      statistics: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!profile) redirect("/dashboard");

  const unlimited = canUploadUnlimitedVideos(user.plan);
  const canAddVideo = unlimited || profile.videos.length < FREE_VIDEO_LIMIT;

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="This is what coaches see. Keep it complete and current."
      >
        <Button variant="outline" asChild>
          <Link href={`/athletes/${profile.id}`}>
            View public profile <ExternalLink className="size-4" />
          </Link>
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="info">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Profile</TabsTrigger>
              <TabsTrigger value="videos">
                Videos ({profile.videos.length})
              </TabsTrigger>
              <TabsTrigger value="stats">
                Stats ({profile.statistics.length})
              </TabsTrigger>
              <TabsTrigger value="docs">
                Documents ({profile.documents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <ProfileInfoForm profile={profile} />
            </TabsContent>
            <TabsContent value="videos">
              <VideosManager
                videos={profile.videos}
                canAddMore={canAddVideo}
                uploadsEnabled={cloudinaryConfigured()}
                limitLabel={`You've reached the ${FREE_VIDEO_LIMIT}-video limit on the Free plan. Upgrade to Premium for unlimited highlight videos.`}
              />
            </TabsContent>
            <TabsContent value="stats">
              <StatsManager stats={profile.statistics} sport={profile.sport} />
            </TabsContent>
            <TabsContent value="docs">
              <DocumentsManager documents={profile.documents} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
