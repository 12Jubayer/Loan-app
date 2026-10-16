import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0c1628] text-white lg:flex">
      <header className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-lg bg-[#1e6fe3] text-white"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <p className="text-[11px] font-semibold tracking-[0.16em]">SUPER ADMIN</p>
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/55 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      <main className="min-w-0 flex-1 px-4 py-5 lg:px-7 lg:py-7">
        <Outlet />
      </main>
    </div>
  );
}
