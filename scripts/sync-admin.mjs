import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!email) {
  throw new Error("ADMIN_EMAIL is required to synchronize the admin user.");
}

if (!password || password.length < 12) {
  throw new Error(
    "ADMIN_PASSWORD must contain at least 12 characters to synchronize the admin user."
  );
}

const prisma = new PrismaClient();

try {
  const passwordHash = await bcrypt.hash(password, 10);
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
    select: { id: true },
  });

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      name: "Sachin Mahaley",
      role: "ADMIN",
    },
  });

  console.log(
    existingAdmin
      ? `Admin password synchronized for ${email}.`
      : `Admin user created for ${email}.`
  );
} finally {
  await prisma.$disconnect();
}
