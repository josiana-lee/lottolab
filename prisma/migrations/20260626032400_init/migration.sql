-- CreateTable
CREATE TABLE "Draw" (
    "id" SERIAL NOT NULL,
    "round" INTEGER NOT NULL,
    "drawDate" TIMESTAMP(3) NOT NULL,
    "n1" INTEGER NOT NULL,
    "n2" INTEGER NOT NULL,
    "n3" INTEGER NOT NULL,
    "n4" INTEGER NOT NULL,
    "n5" INTEGER NOT NULL,
    "n6" INTEGER NOT NULL,
    "bonus" INTEGER NOT NULL,
    "comboKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Draw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedCombo" (
    "id" SERIAL NOT NULL,
    "numbers" TEXT NOT NULL,
    "comboKey" TEXT NOT NULL,
    "score" DOUBLE PRECISION,
    "matchedRound" INTEGER,
    "matchedDrawId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedCombo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Draw_round_key" ON "Draw"("round");

-- CreateIndex
CREATE UNIQUE INDEX "Draw_comboKey_key" ON "Draw"("comboKey");

-- CreateIndex
CREATE UNIQUE INDEX "SavedCombo_comboKey_key" ON "SavedCombo"("comboKey");
