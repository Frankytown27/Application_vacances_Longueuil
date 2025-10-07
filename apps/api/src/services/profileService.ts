import { prisma } from "../utils/prismaClient";

export async function getEmployeeProfile(upn: string, year: number) {
  return prisma.employee.findUnique({
    where: { upn },
    include: {
      entitlements: {
        where: { year },
      },
    },
  });
}
