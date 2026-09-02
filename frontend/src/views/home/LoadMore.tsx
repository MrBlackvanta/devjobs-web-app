"use client";

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
        className="v-btn grid h-12 w-35.25 place-items-center"
      >
        Load More
      </Link>
    </div>
  );
}
