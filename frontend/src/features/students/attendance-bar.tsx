import { ATTENDANCE_FAIR_MIN, ATTENDANCE_GOOD_MIN } from "@/constants/student-list";

interface AttendanceBarProps {
  percent: number;
}

// Picks the colour class from the attendance thresholds
function getAttendanceLevel(percent: number): string {
  if (percent >= ATTENDANCE_GOOD_MIN) return "attendance-good";
  if (percent >= ATTENDANCE_FAIR_MIN) return "attendance-fair";
  return "attendance-low";
}

// "96%" plus a small bar filled to that width
export function AttendanceBar({ percent }: AttendanceBarProps) {
  return (
    <span className={`attendance ${getAttendanceLevel(percent)}`}>
      <span className="attendance-value">{percent}%</span>
      <span className="attendance-track" aria-hidden="true">
        {/* Width comes from data, so it is set inline as a percentage, not a fixed size */}
        <span className="attendance-fill" style={{ width: `${percent}%` }} />
      </span>
    </span>
  );
}
