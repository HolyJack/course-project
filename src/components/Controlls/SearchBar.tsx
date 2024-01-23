"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/Input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((fullText: string) => {
    const params = new URLSearchParams(searchParams);

    if (fullText) {
      params.set("fullText", fullText);
    } else {
      params.delete("fullText");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      onChange={(e) => handleSearch(e.target.value)}
      defaultValue={searchParams.get("fullText")?.toString()}
      placeholder="Type any text related to the collection"
    ></Input>
  );
}
