-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE INDEX "Video_publicId_idx" ON "Video"("publicId");
