import type { Metadata } from "next";
import { StudentCreateScreen } from "@/features/students/student-create-screen";

export const metadata: Metadata = { title: "Add student | Riverside Academy Admin" };

// URL: /students/create
export default function StudentCreatePage() {
  return <StudentCreateScreen />;
}
