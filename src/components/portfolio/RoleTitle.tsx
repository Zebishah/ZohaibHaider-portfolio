import "./RoleTitle.css";

export function RoleTitle() {
  return (
    <span className="role-title">
      Full-stack Software Engineer <span className="role-divider" aria-hidden="true" />
      <span className="sr-only"> | </span> AI Systems
    </span>
  );
}
