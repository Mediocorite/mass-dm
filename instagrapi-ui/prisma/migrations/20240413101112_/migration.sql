/*
  Warnings:

  - You are about to drop the column `email` on the `ExternalAccount` table. All the data in the column will be lost.
  - Added the required column `username` to the `ExternalAccount` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExternalAccount" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proxy" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "ExternalAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ExternalAccount" ("id", "password", "proxy", "userId") SELECT "id", "password", "proxy", "userId" FROM "ExternalAccount";
DROP TABLE "ExternalAccount";
ALTER TABLE "new_ExternalAccount" RENAME TO "ExternalAccount";
CREATE UNIQUE INDEX "ExternalAccount_username_key" ON "ExternalAccount"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
