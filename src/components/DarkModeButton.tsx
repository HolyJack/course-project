import { useTheme } from "next-themes";
import Image from "next/image";

function Moon() {
  return (
    <Image
      src="/moon.svg"
      width={20}
      height={20}
      alt="moon"
      className="fill-white"
    />
  );
}

function Sun() {
  return <Image src="/sun.svg" width={30} height={30} alt="sun" />;
}

export default function DarkModeButton() {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      className="bg-background shadow-shadow border-shadow hover:bg-text group
      relative aspect-square w-10 overflow-hidden rounded-full border transition duration-300"
      onClick={() =>
        currentTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
    >
      <div
        className="absolute left-0 top-0 flex aspect-square w-full scale-100
        items-center justify-center opacity-100 transition duration-300
        group-hover:scale-0 group-hover:opacity-0"
      >
        {currentTheme === "dark" ? <Moon /> : <Sun />}
      </div>
      <div
        className="absolute left-0 top-0 flex aspect-square w-full scale-0
        items-center justify-center opacity-0 transition duration-300
        group-hover:scale-100 group-hover:opacity-100"
      >
        {currentTheme === "dark" ? <Sun /> : <Moon />}
      </div>
    </button>
  );
}
