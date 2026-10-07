import type { Metadata } from "next";
import { StudentDetailsScreen } from "@/features/students/student-details-screen";

export const metadata: Metadata = { title: "Student details | Riverside Academy Admin" };

// URL: /students/details/123 — "[id]" is a dynamic route segment.
// In Next.js 15, params is a Promise, so this server component awaits it and passes the id down.
export default async function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentDetailsScreen id={id} />;
}
