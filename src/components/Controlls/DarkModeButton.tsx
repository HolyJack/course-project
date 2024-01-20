"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/Button";

const activeIconStyle =
  "duration-600 bg-background text-text transition group-hover:rotate-90 group-hover:opacity-0";
const hoverIconStyle =
  "duration-600 -rotate-90 bg-text text-background opacity-0 transition group-hover:rotate-0 group-hover:opacity-100";

function IconContainer({ ...props }) {
  return (
    <div
      className="absolute left-0 top-0 flex h-full w-full shrink-0 items-center justify-center"
      {...props}
    />
  );
}

export default function DarkModeButton() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant={"ghost"}
      className="duration-600 group relative h-10 w-10 rounded-full bg-background transition hover:bg-text"
      onClick={() =>
        currentTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
    >
      <IconContainer>
        <SunIcon
          className={currentTheme === "dark" ? hoverIconStyle : activeIconStyle}
        />
      </IconContainer>
      <IconContainer>
        <MoonIcon
          className={currentTheme === "dark" ? activeIconStyle : hoverIconStyle}
        />
      </IconContainer>
    </Button>
  );
}
