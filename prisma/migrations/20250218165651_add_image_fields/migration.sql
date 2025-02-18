-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT;
