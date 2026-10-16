import { useMemo, useState } from "react";
import { taka, withdrawSeed } from "../data";

const badge = {
  Pending: "bg-[#e2b423] text-[#1c1604]",
  Approved: "bg-[#22a34a] text-white",
  Rejected: "bg-[#d63b3b] text-white",
};

export default function Withdraw() {
  const [rows, setRows] = useState(withdrawSeed);
  const [filter, setFilter] = useState("All");

  const counts = useMemo(
    () => ({
      pending: rows.filter((row) => row.status === "Pending").length,
      approved: rows.filter((row) => row.status === "Approved").length,
      rejected: rows.filter((row) => row.status === "Rejected").length,
    }),
    [rows],
  );

  const visible = filter === "All" ? rows : rows.filter((row) => row.status === filter);

  function setStatus(id, status) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
  }

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-[34px] font-bold leading-none text-[#2ad4f0]">Withdraw</h1>
        <p className="mt-2 text-[15px] text-[#9aafc6]">Review customer withdrawal requests.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Pending", counts.pending, "All"],
          ["Approved", counts.approved, "Approved"],
          ["Rejected", counts.rejected, "Rejected"],
        ].map(([label, value]) => (
          <button
            key={label}
            type="button"
            onClick={() => setFilter(label === "Pending" ? "Pending" : label)}
            className={`rounded-2xl border px-5 py-4 text-left ${filter === label || (label === "Pending" && filter === "Pending") ? "border-[#2f7cf6] bg-[#16325c]" : "border-[#2a3d58] bg-[#121c2f]"}`}
          >
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9aafc6]">{label}</p>
            <p className="mt-2 text-[32px] font-bold leading-none">{value}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        {["All", "Pending", "Approved", "Rejected"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === item ? "bg-[#2f7cf6] text-white" : "bg-[#1a2744] text-[#c5d3e6]"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#243652] bg-[#121c2f]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="bg-white text-[13px] text-[#1b2433]">
                {["USER", "AMOUNT", "METHOD", "STATUS", "DATE", "ACTIONS"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#9aafc6]">
                    No requests in this list.
                  </td>
                </tr>
              ) : (
                visible.map((row) => (
                  <tr key={row.id} className="border-t border-white/[0.06]">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{row.name}</p>
                      <p className="text-xs text-[#8ea3bb]">{row.mobile}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold">{taka(row.amount)}</td>
                    <td className="px-4 py-3">{row.method}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[#d5e2f0]">{row.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setStatus(row.id, "Approved")} className="rounded-lg bg-[#178746] px-3 py-1.5 text-xs font-semibold text-white">
                          Approve
                        </button>
                        <button type="button" onClick={() => setStatus(row.id, "Rejected")} className="rounded-lg bg-[#8f2438] px-3 py-1.5 text-xs font-semibold text-white">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
