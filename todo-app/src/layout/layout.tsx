import { NavLink, Outlet } from "react-router-dom";

function navClasses({ isActive }: { isActive: boolean }) {
  return [
    "text-sm transition-colors underline-offset-4",
    isActive
      ? "underline text-foreground"
      : "text-foreground/70 hover:text-foreground",
  ].join(" ");
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-accent">
        <nav className="flex gap-4">
          <NavLink to="/" className={navClasses}>
            Home
          </NavLink>
          <NavLink to="/about" className={navClasses}>
            About
          </NavLink>
          <NavLink to="/todos" className={navClasses}>
            Todos
          </NavLink>
        </nav>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <footer className="p-4 text-sm text-center bg-accent">
        © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
