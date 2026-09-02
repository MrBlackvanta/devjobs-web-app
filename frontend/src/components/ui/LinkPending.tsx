"use client";

import { useLinkStatus } from "next/link";
import Spinner from "./Spinner";

export default function LinkPending({ className }: { className: string }) {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return <Spinner className={`text-accent ${className}`} />;
}
