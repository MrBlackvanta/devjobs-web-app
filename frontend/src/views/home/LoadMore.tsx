"use client";

import { Spinner } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LoadMore({ href }: { href: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-8 flex justify-center md:mt-14">
      <Link
        href={href}
        aria-busy={pending}
        onClick={(event) => {
          event.preventDefault();
          startTransition(() => router.push(href, { scroll: false }));
        }}
        className="group v-btn grid h-12 w-35.25 place-items-center"
      >
        <span className="col-start-1 row-start-1 group-aria-busy:opacity-0">
          Load More
        </span>
        {pending && (
          <Spinner className="col-start-1 row-start-1 size-6 border-2" />
        )}
      </Link>
    </div>
  );
}
