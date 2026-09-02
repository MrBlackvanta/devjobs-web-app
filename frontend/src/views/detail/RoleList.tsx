export default function RoleList({ items }: { items: string[] }) {
  return (
    <ol className="mt-8 space-y-2 md:mt-6">
      {items.map((item, index) => (
        <li key={item} className="flex">
          <span className="text-accent w-9 shrink-0 font-bold">
            {index + 1}
          </span>
          {item}
        </li>
      ))}
    </ol>
  );
}
