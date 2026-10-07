import Link from "next/link";

interface BackLinkProps {
  href: string;
  label: string;
}

// "Back to students" link shown above sub-page titles
export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link href={href} className="back-link">
      <span aria-hidden="true">&larr;</span> {label}
    </Link>
  );
}
