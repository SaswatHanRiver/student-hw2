import type { Metadata } from "next";
import { StudentEditScreen } from "@/features/students/student-edit-screen";

export const metadata: Metadata = { title: "Edit student | Riverside Academy Admin" };

// URL: /students/edit/123
export default async function StudentEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentEditScreen id={id} />;
}
