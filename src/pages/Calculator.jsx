import { useMemo, useState } from "react";
import { companyHistory, taka } from "../data";

const MONTHLY_RATE = 0.002;

const statusBadge = {
  Pending: "bg-[#e2b423] text-[#1c1604]",
  Approved: "bg-[#22a34a] text-white",
};

export default function Calculator() {
  const [amount, setAmount] = useState("400000");
  const [months, setMonths] = useState("48");

  const breakdown = useMemo(() => {
    const principal = Math.max(0, Number(amount) || 0);
    const duration = Math.max(0, Number(months) || 0);
    const monthlyInterest = principal * MONTHLY_RATE;
    const totalInterest = monthlyInterest * duration;
    return {
      principal,
      duration,
      monthlyInterest,
      totalInterest,
      totalRepayment: principal + totalInterest,
      installment: duration > 0 ? (principal + totalInterest) / duration : 0,
    };
  }, [amount, months]);

  const history = useMemo(() => {
    const totalAmount = companyHistory.reduce((sum, row) => sum + row.amount, 0);
    const average = companyHistory.reduce((sum, row) => sum + row.months, 0) / companyHistory.length;
    const approved = companyHistory.filter((row) => row.status === "Approved").length;
    const pending = companyHistory.filter((row) => row.status === "Pending").length;
    const rejected = companyHistory.filter((row) => row.status === "Rejected").length;
    return { totalAmount, average, approved, pending, rejected, count: companyHistory.length };
  }, []);

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-bold leading-none text-[#2ad4f0]">Loan Calculator</h1>
          <p className="mt-2 text-[15px] text-[#9aafc6]">Calculate loan repayments, interest, and installments instantly.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#2f6fbf] px-3 py-1.5 text-sm font-semibold text-[#7eb6ff]">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path strokeLinecap="round" d="M4 12h4l2-5 4 10 2-5h4" />
          </svg>
          Real-time Calculation
        </span>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#243652] bg-[#121c2f] p-5">
          <h2 className="flex items-center gap-2 text-[18px] font-bold">
            <span className="text-[#2ad4f0]" aria-hidden="true">☰</span>
            Parameters
          </h2>
          <p className="mt-4 text-sm text-[#d5e2f0]">Interest Rate (Monthly)</p>
          <div className="mt-2 flex items-center justify-between rounded-xl border border-[#24527a] bg-[#12304e] px-4 py-4">
            <span className="font-semibold">Fixed Rate</span>
            <span className="text-xl font-bold text-[#2ad4f0]">0.20%</span>
          </div>

          <label className="mt-4 block text-sm text-[#d5e2f0]">
            Loan Amount
            <span className="relative mt-2 block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea3bb]" aria-hidden="true">৳</span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-label="Loan Amount"
                className="h-14 w-full rounded-xl border border-[#314864] bg-[#0e1828] pl-9 pr-3 text-lg outline-none"
              />
            </span>
          </label>

          <label className="mt-4 block text-sm text-[#d5e2f0]">
            Duration (Months)
            <span className="relative mt-2 block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8ea3bb]" aria-hidden="true">▦</span>
              <input
                type="number"
                min="1"
                value={months}
                onChange={(event) => setMonths(event.target.value)}
                aria-label="Duration (Months)"
                className="h-14 w-full rounded-xl border border-[#314864] bg-[#0e1828] pl-9 pr-3 text-lg outline-none"
              />
            </span>
          </label>

          <div className="mt-4 flex gap-3 rounded-xl border border-[#3a3f86] bg-[#221c45] px-4 py-3 text-sm text-[#d6def8]">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#6d5cff] text-xs font-bold" aria-hidden="true">i</span>
            <p>Installments must be paid between the 1st and 10th of every month.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#243652] bg-[#121c2f] p-5">
          <h2 className="flex items-center gap-2 text-[18px] font-bold">
            <span className="text-[#3dce73]" aria-hidden="true">▣</span>
            Breakdown
          </h2>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#146246] to-[#0d4a34] px-5 py-6 text-center">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#b7f0d0]">MONTHLY INSTALLMENT</p>
            <p className="mt-2 text-[40px] font-bold leading-none">{taka(breakdown.installment)}</p>
            <p className="mt-2 text-sm text-[#b7f0d0]">per month</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Mini label="Monthly Interest" value={taka(breakdown.monthlyInterest)} tone="bg-[#17345c] text-[#7eb6ff]" mark="%" />
            <Mini label="Total Interest" value={taka(breakdown.totalInterest)} tone="bg-[#3a2a14] text-[#f0b45a]" mark="৳" />
            <Mini label="Principal Amount" value={taka(breakdown.principal)} tone="bg-[#17345c] text-[#7eb6ff]" mark="▤" />
            <Mini label="Total Repayment" value={taka(breakdown.totalRepayment)} tone="bg-[#2a2148] text-[#c4b5fd]" mark="↑" />
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h2 className="text-[26px] font-bold">Company History</h2>
        <p className="mt-1 text-sm text-[#9aafc6]">Automatic totals from the existing loan application database.</p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <HistoryStat label="TOTAL LOAN APPLICATION" value={history.count} note="All applications" />
          <HistoryStat label="TOTAL LOAN AMOUNT" value={taka(history.totalAmount)} note="Requested principal" />
          <HistoryStat label="AVERAGE DURATION" value={`${history.average.toFixed(1)} Months`} note="Across applications" />
          <article className="rounded-2xl border border-[#2a3d58] bg-[#121c2f] px-5 py-4">
            <p className="text-[12px] font-semibold tracking-[0.04em] text-[#9aafc6]">APPLICATION STATUS</p>
            <p className="mt-3 text-[28px] font-bold leading-none">
              {history.approved} <span className="text-[#3dce73]">Approved</span>
            </p>
            <p className="mt-2 text-sm text-[#9aafc6]">
              {history.pending} pending · {history.rejected} rejected
            </p>
          </article>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#243652] bg-[#121c2f]">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-[18px] font-bold">Loan Company History</h3>
          <p className="text-sm text-[#9aafc6]">{history.count} records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="bg-white text-[13px] text-[#1b2433]">
                {["APPLICATION", "CUSTOMER", "LOAN AMOUNT", "DURATION", "PURPOSE", "STATUS", "DATE"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companyHistory.map((row) => (
                <tr key={row.id} className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 font-semibold">#{row.id}</td>
                  <td className="px-4 py-3">{row.customer}</td>
                  <td className="px-4 py-3">{taka(row.amount)}</td>
                  <td className="px-4 py-3">{row.months} Month</td>
                  <td className="px-4 py-3 text-[#d5e2f0]">{row.purpose}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge[row.status]}`}>{row.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[#d5e2f0]">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Mini({ label, value, tone, mark }) {
  return (
    <article className="rounded-2xl border border-[#2a3d58] bg-[#0e1828] px-4 py-3">
      <div className="flex items-center gap-2 text-[12px] text-[#9aafc6]">
        <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${tone}`}>{mark}</span>
        {label}
      </div>
      <p className="mt-2 text-[18px] font-bold">{value}</p>
    </article>
  );
}

function HistoryStat({ label, value, note }) {
  return (
    <article className="rounded-2xl border border-[#2a3d58] bg-[#121c2f] px-5 py-4">
      <p className="text-[12px] font-semibold tracking-[0.04em] text-[#9aafc6]">{label}</p>
      <p className="mt-3 text-[26px] font-bold leading-none">{value}</p>
      <p className="mt-2 text-sm text-[#9aafc6]">{note}</p>
    </article>
  );
}
