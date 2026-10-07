import Link from "next/link";
import { StatusTag } from "@/components/status-tag/status-tag";
import { TableSkeleton } from "@/components/table-skeleton/table-skeleton";
import { formatDate } from "@/utils/format-date";
import type { Student } from "@/types/student";
import { AttendanceBar } from "./attendance-bar";

// Column labels — used for the header and as data-label on phones
export const STUDENT_COLUMNS = ["Student ID", "Name", "Grade", "Joined on", "Attendance", "Status"];

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  isRefreshing: boolean; // previous page still shown while the next one loads
  skeletonRows: number;
}

// The students table. Shows skeleton rows while loading.
export function StudentTable({ students, isLoading, isRefreshing, skeletonRows }: StudentTableProps) {
  return (
    <div className={isRefreshing ? "student-table-wrapper student-table-refreshing" : "student-table-wrapper"} aria-busy={isRefreshing}>
      <table className="student-table">
        <thead>
          <tr>
            {STUDENT_COLUMNS.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        {isLoading ? (
          <TableSkeleton columns={STUDENT_COLUMNS} rows={skeletonRows} />
        ) : (
          <tbody data-testid="state-filled">
            {students.map((student) => (
              // key = unique id, so React can track each row between renders
              <tr key={student.id}>
                <td data-label="Student ID" className="student-table-id">
                  {student.studentCode}
                </td>
                <td data-label="Name" className="student-table-name-cell">
                  <span className="student-name">
                    <Link href={`/students/details/${student.id}`} className="student-name-primary">
                      {student.fullName}
                    </Link>
                    <span className="student-name-email">{student.email}</span>
                  </span>
                </td>
                <td data-label="Grade">Grade {student.grade}</td>
                <td data-label="Joined on">{formatDate(student.joinedOn)}</td>
                <td data-label="Attendance">
                  <AttendanceBar percent={student.attendancePercent} />
                </td>
                <td data-label="Status">
                  <StatusTag status={student.status} />
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
