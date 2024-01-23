"use client";

"use client";

import React, { useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandDialog,
  CommandSeparator,
} from "../ui/Command";
import { toast } from "sonner";
import search from "@/shared/serverActions/search";
import { fts } from "@prisma/client";
import { Button } from "../ui/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const SEARCH_KEYBIND = "k";

const SearchCommandInput = React.forwardRef<
  React.ElementRef<typeof CommandInput>,
  React.ComponentPropsWithoutRef<typeof CommandInput>
>(({ className, ...props }, ref) => {
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
  }, 150);
  return (
    <CommandInput
      ref={ref}
      onValueChange={handleSearch}
      defaultValue={searchParams.get("fullText") ?? ""}
    />
  );
});

SearchCommandInput.displayName = CommandInput.displayName;

export default function SearchButton() {
  const router = useRouter();
  const [results, setResults] = useState<fts[]>([]);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const fullText = searchParams.get("fullText") ?? "";

  useEffect(() => {
    async function updateResults() {
      try {
        const newResults: fts[] = await search({
          take: 5,
          searchString: fullText ?? "",
        });

        setResults(() => newResults);
      } catch {
        toast("Something went wrong!");
      }
    }

    updateResults();
  }, [fullText]);

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
          <SearchCommandInput />
          <CommandList>
            <CommandEmpty>{`No results found for "${fullText}"`}.</CommandEmpty>
            <CommandGroup heading="Search Results">
              {results.map((result, i) => (
                <CommandItem
                  key={i}
                  onSelect={() => {
                    setOpen(false);
                    router.push(
                      `/collection/${result.authorslug}/${result.slug}`,
                    );
                  }}
                >
                  {result.title}
                </CommandItem>
              ))}
              <CommandSeparator />
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push(`/collection/search?fullText=${fullText}`);
                }}
              >
                View All
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
