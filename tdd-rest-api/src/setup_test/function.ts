import prisma from "./client";
import { prismaMock } from "./singleton";

export async function getUser() {
  console.log("Mock dipanggil", prisma == prismaMock);
  return await prisma.user.findMany();
}
