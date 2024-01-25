"use client";

import { useRouter } from "@/shared/navigation";

export default function NavigateBack({
  children,
  className,
}: React.PropsWithChildren & { className: string }) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className={className}>
      {children}
    </button>
  );
}
