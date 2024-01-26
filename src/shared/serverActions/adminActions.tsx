"use server";

import { z } from "zod";
import prisma from "@/shared/db/db";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";

const formSchema = z.object({ email: z.string().email() });
const formSchemaMany = z.object({ emails: z.array(formSchema) });

export async function blockUser({ email }: z.infer<typeof formSchema>) {
  try {
    const admin = (await getServerSession(authOptions))?.user;
    if (!admin) throw new Error("No user");
    if (admin.role !== Role.ADMIN || !admin.active)
      throw new Error("Not an Admin");
    const user = await prisma.user.update({
      where: { email, active: true },
      data: { active: false },
    });
    return user.active;
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function unblockUser({ email }: z.infer<typeof formSchema>) {
  try {
    const admin = (await getServerSession(authOptions))?.user;
    if (!admin) throw new Error("No user");
    if (admin.role !== Role.ADMIN || !admin.active)
      throw new Error("Not an Admin");
    const user = await prisma.user.update({
      where: { email, active: false },
      data: { active: true },
    });
    return user.active;
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function blockUsers({ emails }: z.infer<typeof formSchemaMany>) {
  let emailList = emails.map(({ email }) => email);
  try {
    const admin = (await getServerSession(authOptions))?.user;
    if (!admin) throw new Error("No user");
    if (admin.role !== Role.ADMIN || !admin.active)
      throw new Error("Not an Admin");
    const users = await prisma.user.updateMany({
      where: { email: { in: emailList }, active: true },
      data: { active: false },
    });
    return users.count;
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function unblockUsers({ emails }: z.infer<typeof formSchemaMany>) {
  let emailList = emails.map(({ email }) => email);
  try {
    const admin = (await getServerSession(authOptions))?.user;
    if (!admin) throw new Error("No user");
    if (admin.role !== Role.ADMIN || !admin.active)
      throw new Error("Not an Admin");
    const user = await prisma.user.updateMany({
      where: { email: { in: emailList }, active: false },
      data: { active: true },
    });
    return user.count;
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function promoteUser({ email }: z.infer<typeof formSchema>) {
  try {
    const admin = (await getServerSession(authOptions))?.user;
    if (!admin) throw new Error("No user");
    if (admin.role !== Role.ADMIN || !admin.active)
      throw new Error("Not an Admin");

    const user = await prisma.user.update({
      where: { email, role: Role.AUTHOR },
      data: { role: Role.ADMIN },
    });
    return user.role;
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function demoteUser({ email }: z.infer<typeof formSchema>) {
  try {
    const admin = (await getServerSession(authOptions))?.user;
    if (!admin) throw new Error("No user");
    if (admin.role !== Role.ADMIN || !admin.active)
      throw new Error("Not an Admin");

    const user = await prisma.user.update({
      where: { email, role: Role.ADMIN },
      data: { role: Role.AUTHOR },
    });
    return user.role;
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function promoteUsers({ emails }: z.infer<typeof formSchemaMany>) {
  let emailList = emails.map(({ email }) => email);
  try {
    const admin = (await getServerSession(authOptions))?.user;
    if (!admin) throw new Error("No user");
    if (admin.role !== Role.ADMIN || !admin.active)
      throw new Error("Not an Admin");
    const users = await prisma.user.updateMany({
      where: { email: { in: emailList }, role: Role.AUTHOR },
      data: { role: Role.ADMIN },
    });
    return users.count;
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function demoteUsers({ emails }: z.infer<typeof formSchemaMany>) {
  let emailList = emails.map(({ email }) => email);
  try {
    const admin = (await getServerSession(authOptions))?.user;
    if (!admin) throw new Error("No user");
    if (admin.role !== Role.ADMIN || !admin.active)
      throw new Error("Not an Admin");
    const user = await prisma.user.updateMany({
      where: { email: { in: emailList }, role: Role.ADMIN },
      data: { role: Role.AUTHOR },
    });
    return user.count;
  } catch {
    throw new Error("Something went wrong");
  }
}
