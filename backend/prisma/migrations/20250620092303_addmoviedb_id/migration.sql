/*
  Warnings:

  - A unique constraint covering the columns `[moviedbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "moviedbId" INTEGER,
ALTER COLUMN "releaseDate" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_moviedbId_key" ON "Movie"("moviedbId");
