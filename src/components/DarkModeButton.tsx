import { useTheme } from "next-themes";

export default function DarkModeButton() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      className="aspect-square w-10 rounded-full bg-background shadow shadow-shadow hover:invert"
      onClick={() =>
        currentTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
    >
      T
    </button>
  );
}
