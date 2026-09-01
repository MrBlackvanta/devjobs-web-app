import { Logo } from "@/components/icons";
import { ThemeToggle } from "@/components/ui";
import Link from "next/link";
import HeaderPattern from "./HeaderPattern";

export default function SiteHeader() {
  return (
    <header className="bg-violet md:rounded-bl-band relative h-34 overflow-clip px-6 md:h-40 md:px-10">
      <HeaderPattern />
      <div className="max-w-page relative mx-auto flex h-24 items-center justify-between md:h-30">
        <Link
          href="/"
          className="v-band-focus text-white"
          aria-label="devjobs home"
        >
          <Logo />
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
