-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('WAITING_FOR_PICKUP', 'IN_TRANSIT', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "packages" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "PackageStatus" NOT NULL DEFAULT 'WAITING_FOR_PICKUP',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "picked_up_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "returned_at" TIMESTAMP(3),
    "photo_url" TEXT,
    "recipient_id" TEXT NOT NULL,
    "courier_id" TEXT,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "packages" ADD CONSTRAINT "packages_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
