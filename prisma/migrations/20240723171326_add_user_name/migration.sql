-- CreateTable
CREATE TABLE "recipe" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "rate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "rateCount" INTEGER NOT NULL DEFAULT 0,
    "servings" INTEGER NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "recipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
