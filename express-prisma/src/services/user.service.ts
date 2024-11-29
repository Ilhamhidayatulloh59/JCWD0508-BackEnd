import prisma from "../prisma";

export const findUser = async (username: string, email: string) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: username }, { email: email }] },
  });

  return user;
};
