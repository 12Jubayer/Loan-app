import { Link } from "react-router-dom";

export default function StatCard({ title, value, meta, percent, gradient, barClass, icon, metaIcon, to }) {
  return (
    <Link
      to={to}
      className={`flex flex-col rounded-[16px] px-5 pb-5 pt-[18px] text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] transition duration-200 hover:brightness-110 ${gradient}`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em]">{title}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20">{icon}</span>
      </div>
      <p className="mt-3 text-[38px] font-bold leading-none tracking-[-0.04em]">{value}</p>
      <div className="mt-5 flex items-center gap-2 text-[13px] font-medium leading-none">
        {metaIcon}
        <span className="whitespace-nowrap">{meta}</span>
      </div>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/30">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${percent}%` }} />
      </div>
    </Link>
  );
}
