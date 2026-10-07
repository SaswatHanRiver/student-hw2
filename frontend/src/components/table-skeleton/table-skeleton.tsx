interface TableSkeletonProps {
  columns: string[]; // column labels (also used as data-label on phones)
  rows: number;
}

// Grey placeholder rows shown while the list is loading
export function TableSkeleton({ columns, rows }: TableSkeletonProps) {
  const rowKeys = Array.from({ length: rows }, (_, index) => `skeleton-row-${index}`);

  return (
    <tbody aria-busy="true" data-testid="state-loading">
      {rowKeys.map((rowKey) => (
        <tr key={rowKey}>
          {columns.map((column, columnIndex) => (
            <td key={column} data-label={column}>
              {/* Alternate long/short lines so it looks like real text */}
              <span className={columnIndex % 2 === 0 ? "skeleton-line" : "skeleton-line skeleton-line-short"} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
