import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/shared/utils";

const activeIconStyle =
  "transition duration-300 group-hover:rotate-45 group-hover:opacity-0";
const hoverIconStyle =
  "-rotate-45 opacity-0 transition duration-300 group-hover:rotate-0 group-hover:opacity-100";

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
      className="bg-background hover:bg-text group relative h-10 w-10 rounded-full transition duration-300"
      onClick={() =>
        currentTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
    >
      {currentTheme === "dark" ? (
        <>
          <IconContainer>
            <MoonIcon className={cn("text-white", activeIconStyle)} />
          </IconContainer>
          <IconContainer>
            <SunIcon className={cn("text-black", hoverIconStyle)} />
          </IconContainer>
        </>
      ) : (
        <>
          <IconContainer>
            <SunIcon className={cn("text-black", activeIconStyle)} />
          </IconContainer>
          <IconContainer>
            <MoonIcon className={cn("text-white", hoverIconStyle)} />
          </IconContainer>
        </>
      )}
    </Button>
  );
}
