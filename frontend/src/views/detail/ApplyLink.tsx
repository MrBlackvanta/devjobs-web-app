export default function ApplyLink({
  href,
  className,
}: {
  href: string;
  className: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`v-btn grid h-12 place-items-center ${className}`}
    >
      Apply Now
    </a>
  );
}
