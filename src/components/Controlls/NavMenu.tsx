import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

import { authOptions } from "@/shared/authOptions";
import ProfileBtn from "@/components/User/ProfileBtn";
const DarkModeButton = dynamic(
  () => import("@/components/Controlls/DarkModeButton"),
);

function Logo() {
  const t = useTranslations("Logo");
  return (
    <h1 className="group text-3xl font-bold">
      📦{" "}
      <span
        className="from-primary to-accent text-text bg-gradient-to-r
            bg-clip-text transition-all duration-500 group-hover:text-transparent"
      >
        {t("title")}
      </span>
    </h1>
  );
}

async function AuthButton() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("AuthButton");

  if (session && session.user)
    return (
      <ProfileBtn
        labels={{
          newCollection: t("newCollection"),
          signout: t("signout"),
          profile: t("profile"),
        }}
        username={session.user.name ?? ""}
        email={session.user.email ?? ""}
        img={session.user.image ?? ""}
      />
    );

  return <Button onClick={() => signIn()}>{t("signin")}</Button>;
}

export function NavMenu() {
  return (
    <div
      className="container mx-auto flex items-center justify-between
        gap-4"
    >
      <Link href={"/"}>
        <Logo />
      </Link>
      <div className="flex gap-4">
        <AuthButton />
        <DarkModeButton />
      </div>
    </div>
  );
}
