// Grey placeholder while a student loads (edit and details screens)
const SKELETON_ROWS = 7;

export function FormSkeleton() {
  const rows = Array.from({ length: SKELETON_ROWS }, (_, index) => `form-skeleton-${index}`);
  return (
    <div className="form-skeleton" aria-busy="true" data-testid="state-loading">
      {rows.map((row) => (
        <div key={row} className="form-skeleton-row">
          <span className="skeleton-line skeleton-line-short" />
          <span className="skeleton-line" />
        </div>
      ))}
    </div>
  );
}
