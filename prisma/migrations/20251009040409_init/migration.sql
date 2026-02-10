-- CreateTable
CREATE TABLE "public"."OtpToken" (
    "pkId" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpToken_token_key" ON "public"."OtpToken"("token");
