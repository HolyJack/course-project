"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Button } from "../ui/Button";
import { locales } from "@/config";
import { useLocale } from "next-intl";
import { CheckIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { cn } from "@/shared/utils";
import { useRouter } from "@/shared/navigation";
import { usePathname } from "@/shared/navigation";

export default function LocaleButton() {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname();

  function onClick(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="font-bold uppercase">
          {locale}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((l) => (
          <DropdownMenuItem
            className="uppercase"
            key={l}
            onClick={() => onClick(l)}
          >
            {l}
            <CheckIcon
              className={cn(
                "ml-auto h-4 w-4 font-bold",
                locale === l ? "opacity-100" : "opacity-0",
              )}
            />{" "}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
