export default function RequirementList({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 space-y-2 md:mt-6">
      {items.map((item) => (
        <li key={item} className="flex gap-8">
          <span className="bg-accent mt-2.5 size-1 shrink-0 rounded-full" />
          {item}
        </li>
      ))}
    </ul>
  );
}
