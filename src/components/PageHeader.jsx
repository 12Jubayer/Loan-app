export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[32px] font-bold leading-none tracking-[-0.03em] text-[#2ad4f0]">{title}</h1>
        {subtitle ? <p className="mt-2.5 text-[15px] text-[#9aafc6]">{subtitle}</p> : null}
      </div>
      {children}
    </header>
  );
}
