import { User } from "next-auth";
import prisma from "@/shared/db/db";

export default async function Profile({ user }: { user: User }) {
  const collections = await prisma.collection.findMany({
    where: { author: { email: user.email } },
    select: {
      title: true,
      imgageUrl: true,
      topic: true,
      items: {
        select: {
          name: true,
          customFieldValues: {
            select: {
              intValue: true,
              booleanValue: true,
              dateValue: true,
              stringValue: true,
              textValue: true,
              customField: { select: { type: true, state: true, value: true } },
            },
          },
          tags: { select: { tag: { select: { name: true } } } },
        },
      },
    },
  });

  return (
    <div>
      <div>{`Hey ${user.name}`}</div>
      <div>{collections}</div>
    </div>
  );
}
