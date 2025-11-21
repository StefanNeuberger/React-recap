// src/layouts/AppLayout.tsx
import { Outlet, Link } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 bg-accent">
        <nav className="flex gap-4 ">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/todos">Todos</Link>
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
