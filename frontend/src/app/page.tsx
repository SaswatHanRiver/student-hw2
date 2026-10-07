import { redirect } from "next/navigation";

// "/" has no page of its own; send people to the Students list
export default function HomePage() {
  redirect("/students/list");
}
