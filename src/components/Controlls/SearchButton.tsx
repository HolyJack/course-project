"use client";

import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandDialog,
} from "../ui/Command";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { fts } from "@prisma/client";
import { toast } from "sonner";
import search from "@/shared/serverActions/search";
import { CommandLoading } from "cmdk";
import { Button } from "../ui/Button";

const SEARCH_KEYBIND = "k";

export default function SearchButton() {
  const [searchValue, setSearch] = useState("");
  const [results, setResults] = useState<fts[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function updateResults() {
      console.log(searchValue);
      try {
        setLoading(true);
        const newResults: fts[] = await search({
          take: 5,
          searchString: searchValue ?? "",
        });

        setResults(() => newResults);
      } catch {
        toast("Something went wrong!");
      }
      setLoading(false);
    }

    const delayDebounceFn = setTimeout(() => {
      updateResults();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === SEARCH_KEYBIND && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className=" bg-shadow group inline-flex justify-between px-4 py-0 text-xs md:w-40 lg:w-64"
      >
        <span className="hidden lg:inline-block">Search for Collection</span>
        <span className="hidden md:inline-block lg:hidden">Search...</span>
        <kbd
          className="border-shadow bg-background pointer-events-none
          inline-flex rounded border px-2 py-1 capitalize"
        >
          {"⌘"}
          {SEARCH_KEYBIND}
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type anything to find a Collection"
            value={searchValue}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && <CommandLoading />}
            <CommandEmpty>
              {`No results found for "${searchValue}"`}.
            </CommandEmpty>
            <CommandGroup heading="Search Results">
              {results.map((result, i) => (
                <CommandItem key={i}>
                  <Link
                    href={`/collection/${result.authorslug}/${result.slug}`}
                  >
                    {result.title}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
