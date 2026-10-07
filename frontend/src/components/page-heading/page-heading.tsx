import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  description?: string;
  badge?: ReactNode; // small element next to the title, e.g. the total count
  actions?: ReactNode; // buttons on the right, e.g. "Add student"
}

// Shared page title block — every page uses this
export function PageHeading({ title, description, badge, actions }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div className="page-heading-text">
        <div className="page-heading-title-row">
          <h1 className="page-heading-title">{title}</h1>
          {badge}
        </div>
        {description && <p className="page-heading-description">{description}</p>}
      </div>
      {actions && <div className="page-heading-actions">{actions}</div>}
    </div>
  );
}
