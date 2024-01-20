import { NavMenu } from "@/components/Controlls/NavMenu";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-30 flex h-20 w-full
              items-center bg-background/60 px-4 py-5 text-text shadow shadow-shadow backdrop-blur-md"
    >
      <NavMenu />
    </header>
  );
}
