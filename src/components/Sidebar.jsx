import { NavLink, useNavigate } from "react-router-dom";
import {
  CalcIcon,
  CardIcon,
  FileIcon,
  GlobeIcon,
  GridIcon,
  HomeIcon,
  ImageIcon,
  MediaIcon,
  SettingsIcon,
  StaffIcon,
  UsersIcon,
  WithdrawIcon,
} from "./Icons";

const primary = [
  { to: "/", label: "Dashboard", icon: <HomeIcon />, end: true },
  { to: "/application", label: "Application", icon: <GridIcon /> },
  { to: "/document", label: "Document", icon: <FileIcon /> },
  { to: "/home-banner", label: "Home Banner", icon: <ImageIcon /> },
];

const secondary = [
  { to: "/media", label: "Media", icon: <MediaIcon /> },
  { to: "/manage-user", label: "Manage User", icon: <UsersIcon /> },
  { to: "/card", label: "Card", icon: <CardIcon /> },
  { to: "/calculator", label: "Calculator", icon: <CalcIcon /> },
  { to: "/withdraw", label: "Withdraw", icon: <WithdrawIcon /> },
  { to: "/settings", label: "Settings", icon: <SettingsIcon /> },
  { to: "/staff", label: "Staff Management", icon: <StaffIcon /> },
];

function NavItem({ to, label, icon, end = false, onNavigate }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[10px] px-3.5 py-[10px] text-[14.5px] font-medium transition-colors ${
          isActive
            ? "bg-[#1e6fe3] text-white shadow-[0_8px_18px_rgba(30,111,227,0.28)]"
            : "text-[#c5d3e6] hover:bg-white/[0.045]"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="grid h-5 w-5 shrink-0 place-items-center">{icon}</span>
          <span className="truncate">{label}</span>
          {isActive ? <span className="ml-auto h-[7px] w-[7px] shrink-0 rounded-full bg-white" /> : null}
        </>
      )}
    </NavLink>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h10m0 0-2.6-2.6M20 12l-2.6 2.6" />
    </svg>
  );
}

export default function Sidebar({ open = false, onNavigate }) {
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[248px] shrink-0 flex-col border-r border-white/[0.04] bg-[#0b1526] transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col items-center px-4 pb-4 pt-6">
        <div className="grid h-[74px] w-[74px] place-items-center rounded-[18px] border-2 border-[#3b82f6] bg-[#0d1c33]">
          <GlobeIcon />
        </div>
        <p className="mt-3 text-[11px] font-semibold tracking-[0.16em] text-white">SUPER ADMIN</p>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-3 pb-3" aria-label="Admin">
        <div className="flex flex-col gap-1">
          {primary.map((item) => (
            <NavItem key={item.label} {...item} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="mt-11 flex flex-col gap-1">
          {secondary.map((item) => (
            <NavItem key={item.label} {...item} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>
      <div className="shrink-0 px-3 pb-4">
        <p className="px-2 text-[13px] font-medium text-white">SuperAdmin</p>
        <p className="px-2 text-[12px] text-[#8ea3bb]">Super Admin</p>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            navigate("/");
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#e11d2e] py-2.5 text-sm font-semibold text-white transition hover:bg-[#c81a28]"
        >
          <LogoutIcon />
          Logout
        </button>
      </div>
    </aside>
  );
}
