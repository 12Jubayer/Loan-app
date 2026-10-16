export function GlobeIcon({ className = "h-10 w-10" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="15.2" stroke="#3b82f6" strokeWidth="2" />
      <ellipse cx="24" cy="24" rx="6.4" ry="15.2" stroke="#3b82f6" strokeWidth="1.8" />
      <path d="M9 24h30" stroke="#3b82f6" strokeWidth="1.8" />
      <path d="M11.2 17.2h25.6M11.2 30.8h25.6" stroke="#3b82f6" strokeWidth="1.7" />
    </svg>
  );
}

export function HomeIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinejoin="round" d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5.2v-5.2H10.2V21H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  );
}

export function GridIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </svg>
  );
}

export function FileIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinejoin="round" d="M7 3.5h6.2L19 9.2V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5H7Z" />
      <path d="M13 3.8V9h5.2M8.5 13h7M8.5 16.5h5" strokeLinejoin="round" />
    </svg>
  );
}

export function ImageIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.3" fill="currentColor" stroke="none" />
      <path strokeLinejoin="round" d="m6.5 16 3.4-3.2 2.3 2.1 2.2-2.4L18 16" />
    </svg>
  );
}

export function MediaIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="6" y="6.5" width="14.5" height="12" rx="2" />
      <path d="M3.5 8.5v9A2 2 0 0 0 5.5 19.5" strokeLinecap="round" />
      <circle cx="10" cy="10.2" r="1.1" fill="currentColor" stroke="none" />
      <path strokeLinejoin="round" d="m8.2 16.2 2.6-2.4 1.8 1.6 1.7-1.8 2.6 2.6" />
    </svg>
  );
}

export function UsersIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="9" cy="9" r="3" />
      <path strokeLinecap="round" d="M3.8 18.5c.6-2.6 2.7-4 5.2-4s4.6 1.4 5.2 4" />
      <circle cx="16.5" cy="9.2" r="2.3" />
      <path strokeLinecap="round" d="M16 14.6c1.8.2 3.3 1.2 4 3.4" />
    </svg>
  );
}

export function CalcIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="5" y="3.5" width="14" height="17" rx="2" />
      <path d="M8 7.2h8" strokeLinecap="round" />
      <path strokeLinecap="round" d="M8.2 11.6h.01M12 11.6h.01M15.8 11.6h.01M8.2 15.2h.01M12 15.2h.01M15.8 15.2h.01" />
    </svg>
  );
}

export function WithdrawIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path strokeLinecap="round" d="M3 10h18M12 13.2v4.2m0 0-2-2m2 2 2-2" />
    </svg>
  );
}

export function SettingsIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinejoin="round" d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6.1 6.1l1.6 1.6M16.3 16.3l1.6 1.6M17.9 6.1l-1.6 1.6M7.7 16.3l-1.6 1.6" />
    </svg>
  );
}

export function StaffIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="12" cy="10" r="2.2" />
      <path strokeLinecap="round" d="M8.2 16.2c.6-1.6 1.9-2.4 3.8-2.4s3.2.8 3.8 2.4" />
    </svg>
  );
}

export function CardIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 9.5h18M7 14.5h4" strokeLinecap="round" />
    </svg>
  );
}

export function ClockIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="M12 8.2V12l2.8 2" />
    </svg>
  );
}

export function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.2 2.3 2.3 4.7-5" />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

export function ListIcon({ className = "" }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="5" width="3.2" height="3.2" rx="0.4" />
      <rect x="3" y="10.4" width="3.2" height="3.2" rx="0.4" />
      <rect x="3" y="15.8" width="3.2" height="3.2" rx="0.4" />
      <rect x="8.2" y="5.7" width="12.5" height="1.8" rx="0.8" />
      <rect x="8.2" y="11.1" width="12.5" height="1.8" rx="0.8" />
      <rect x="8.2" y="16.5" width="12.5" height="1.8" rx="0.8" />
    </svg>
  );
}

export function ChevronIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
    </svg>
  );
}
