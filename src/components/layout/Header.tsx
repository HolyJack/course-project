import { NavMenu } from "@/components/Controlls/NavMenu";

export default function Header() {
  return (
    <header
      className="bg-background/60 text-text shadow-shadow sticky top-0 z-[1000]
              flex h-20 w-full items-center px-4 py-5 shadow backdrop-blur-md"
    >
      <NavMenu />
    </header>
  );
}
