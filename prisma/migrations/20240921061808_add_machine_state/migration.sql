-- AlterTable
ALTER TABLE "GameSession" ADD COLUMN     "persistedState" JSONB;

-- CreateTable
CREATE TABLE "MachineState" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MachineState_workflowId_key" ON "MachineState"("workflowId");
