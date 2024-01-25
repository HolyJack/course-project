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
import { Button } from "../ui/Button";
import { usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { item_fts } from "@prisma/client";

const SEARCH_KEYBIND = "k";
const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
let CMD = "ALT +";
if (isMac) CMD = "⌘";

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
  }, 50);
  return (
    <CommandInput
      ref={ref}
      onValueChange={handleSearch}
      defaultValue={searchParams.get("fullText") ?? ""}
    />
  );
});

SearchCommandInput.displayName = CommandInput.displayName;

export default function SearchButton({
  labels,
}: {
  labels: {
    placeholder: string;
    placeholderShort: string;
    viewAll: string;
    itemsFound: string;
  };
}) {
  const router = useRouter();
  const [results, setResults] = useState<item_fts[]>([]);
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const fullText = searchParams.get("fullText") ?? "";

  useEffect(() => {
    async function updateResults() {
      try {
        const newResults: item_fts[] = await search({
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
        className=" bg-shadow group inline-flex justify-between px-2 py-0 text-xs md:w-40 lg:w-64"
      >
        <span className="inline-flex gap-2">
          <MagnifyingGlassIcon />
          <span className="hidden lg:inline-block">{labels.placeholder}</span>
          <span className="hidden md:inline-block lg:hidden">
            {labels.placeholderShort}
          </span>
        </span>
        <kbd
          className="border-shadow bg-background pointer-events-none
          hidden rounded border px-2 py-1 capitalize sm:inline-flex"
        >
          {CMD}
          {SEARCH_KEYBIND}
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} aria-sort="none">
          <SearchCommandInput />
          <CommandList>
            <CommandEmpty>{`No results found for "${fullText}"`}.</CommandEmpty>
            <CommandGroup heading={`${labels.itemsFound}: `}>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.name} ${result.author} ${result.title}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(
                      `/collection/${result.authorslug}/${result.collectionslug}/${result.slug}`,
                    );
                  }}
                >
                  <div className="inline-flex w-full justify-between">
                    <div>{result.name} </div>
                    <div className="text-gray-400">{result.title}</div>
                  </div>
                </CommandItem>
              ))}
              <CommandSeparator />
              <CommandItem
                value={labels.viewAll}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/collection/search?fullText=${fullText}`);
                }}
              >
                {labels.viewAll}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
