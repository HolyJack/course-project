import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { Link } from "@/shared/navigation";

import { authOptions } from "@/shared/authOptions";
import ProfileBtn from "@/components/User/ProfileBtn";
import SignIn from "@/components/User/SignIn";
import SearchButton from "@/components/Controlls/SearchButton";
import LocaleButton from "./LocaleButton";
const DarkModeButton = dynamic(
  () => import("@/components/Controlls/DarkModeButton"),
);

function Logo() {
  const t = useTranslations("Logo");
  return (
    <h1 className="group text-3xl font-bold">
      📦{" "}
      <span
        className="from-primary to-accent text-text hidden
            bg-gradient-to-r bg-clip-text transition-all duration-500 group-hover:text-transparent sm:inline-block"
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
          viewCollections: t("viewCollections"),
          newCollection: t("newCollection"),
          signout: t("signout"),
        }}
        username={session.user.name ?? ""}
        email={session.user.email ?? ""}
        img={session.user.image ?? ""}
      />
    );

  return <SignIn>{t("signin")}</SignIn>;
}

export async function NavMenu() {
  const t = await getTranslations("SearchButton");
  return (
    <div
      className="container mx-auto flex items-center justify-between
        gap-4"
    >
      <Link href={"/"}>
        <Logo />
      </Link>
      <div className="flex gap-4">
        <SearchButton
          labels={{
            placeholderShort: t("placeholder_short"),
            placeholder: t("placeholder"),
            viewAll: t("dropdown.viewAll"),
            itemsFound: t("dropdown.itemsFound"),
          }}
        />
        <AuthButton />
        <DarkModeButton />
        <LocaleButton />
      </div>
    </div>
  );
}
