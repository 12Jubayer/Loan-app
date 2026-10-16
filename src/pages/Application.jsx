import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { applications as seedApplications, taka } from "../data";

const statuses = ["All Status", "Pending", "Approved", "Rejected"];

const statusBadge = {
  Pending: "bg-[#e2b423] text-[#1c1604]",
  Approved: "bg-[#22a34a] text-white",
  Rejected: "bg-[#d63b3b] text-white",
};

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h10m0 0-2.6-2.6M20 12l-2.6 2.6" />
    </svg>
  );
}

function SearchIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="6.5" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CheckBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.4 12.2 2.3 2.3 4.8-5.1" />
    </svg>
  );
}

function ClockBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="M12 8.2V12l2.6 1.8" />
    </svg>
  );
}

function CloseBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2.8 12S6.2 6.8 12 6.8 21.2 12 21.2 12 17.8 17.2 12 17.2 2.8 12 2.8 12Z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path strokeLinejoin="round" d="M7 3.8h6.2L18.5 9v10.2a1.4 1.4 0 0 1-1.4 1.4H7.4A1.4 1.4 0 0 1 6 19.2V5.2A1.4 1.4 0 0 1 7.4 3.8H7Z" />
      <path d="M13 3.8V9h5.2" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="9" r="3" />
      <path strokeLinecap="round" d="M6.5 18.2c.8-2.4 2.8-3.7 5.5-3.7s4.7 1.3 5.5 3.7" />
    </svg>
  );
}

function MiniStat({ label, value, percent, bar, iconWrap, icon }) {
  return (
    <article className="rounded-2xl border border-[#2a3d58] bg-[#121c2f] px-4 pb-4 pt-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9aafc6]">{label}</p>
          <p className="mt-2 text-[34px] font-bold leading-none tracking-[-0.03em]">{value}</p>
        </div>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${iconWrap}`}>{icon}</span>
      </div>
      <div className="mt-4 h-[4px] w-[78%] overflow-hidden rounded-full bg-white/15">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${percent}%` }} />
      </div>
    </article>
  );
}

export default function Application() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const initialStatus = statuses.includes(params.get("status")) ? params.get("status") : "All Status";
  const [loans, setLoans] = useState(seedApplications);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState("Newest First");
  const [active, setActive] = useState(null);
  const [panel, setPanel] = useState(null);

  const counts = useMemo(() => {
    return {
      total: loans.length,
      approved: loans.filter((item) => item.status === "Approved").length,
      pending: loans.filter((item) => item.status === "Pending").length,
      rejected: loans.filter((item) => item.status === "Rejected").length,
    };
  }, [loans]);

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    const filtered = loans.filter((item) => {
      const statusOk = status === "All Status" || item.status === status;
      const haystack = `${item.id} ${item.mobile} ${item.name}`.toLowerCase();
      return statusOk && (!text || haystack.includes(text));
    });
    filtered.sort((a, b) => {
      const left = `${a.date} ${a.time}`;
      const right = `${b.date} ${b.time}`;
      return sort === "Newest First" ? right.localeCompare(left) : left.localeCompare(right);
    });
    return filtered;
  }, [loans, query, sort, status]);

  function applySearch(event) {
    event?.preventDefault();
    setQuery(draft.trim());
  }

  function changeStatus(next) {
    setStatus(next);
    if (next === "All Status") setParams({});
    else setParams({ status: next });
  }

  function setLoanStatus(id, next) {
    setLoans((current) => current.map((item) => (item.id === id ? { ...item, status: next } : item)));
  }

  const total = counts.total || 1;
  const viewed = loans.find((item) => item.id === active);

  return (
    <div>
      <section className="rounded-2xl border border-[#2a3d58] bg-[#121c2f] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-bold leading-none tracking-[-0.03em] text-[#2ad4f0] lg:text-[34px]">Super Admin</h1>
            <p className="mt-2 text-[15px] text-[#8ea3bb]">
              Welcome, <span className="text-[#e7eef6]">WorldBank</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e11d2e] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c81a28]"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat
          label="Total Loans"
          value={counts.total}
          percent={100}
          bar="bg-[#2f8cff]"
          iconWrap="bg-[#1d5fbf] text-white"
          icon={<WalletIcon />}
        />
        <MiniStat
          label="Approved"
          value={counts.approved}
          percent={Math.round((counts.approved / total) * 100)}
          bar="bg-[#3ddc78]"
          iconWrap="bg-[#176b38] text-[#7dffa8]"
          icon={<CheckBadge />}
        />
        <MiniStat
          label="Pending"
          value={counts.pending}
          percent={Math.round((counts.pending / total) * 100)}
          bar="bg-[#f0c14b]"
          iconWrap="bg-[#6d5314] text-[#f6d36b]"
          icon={<ClockBadge />}
        />
        <MiniStat
          label="Rejected"
          value={counts.rejected}
          percent={Math.round((counts.rejected / total) * 100)}
          bar="bg-[#ff8d8d]"
          iconWrap="bg-[#6e2430] text-[#ff9aa8]"
          icon={<CloseBadge />}
        />
      </section>

      <section className="mt-4 rounded-2xl border border-[#2a3d58] bg-[#121c2f] p-4">
        <form onSubmit={applySearch} className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ea3bb]" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search by User ID..."
              className="h-11 w-full rounded-lg border border-[#314864] bg-[#0e1828] pl-10 pr-3 text-sm text-white outline-none placeholder:text-[#7f93ab] focus:border-[#1e6fe3]"
            />
          </label>
          <span className="relative shrink-0">
            <select
              value={status}
              onChange={(event) => changeStatus(event.target.value)}
              className="h-11 w-[168px] appearance-none rounded-lg border border-[#314864] bg-[#0e1828] py-0 pl-3 pr-9 text-sm text-white outline-none"
              aria-label="All Status"
            >
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aafc6]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 5 5 5-5" />
            </svg>
          </span>
          <span className="relative shrink-0">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-11 w-[168px] appearance-none rounded-lg border border-[#314864] bg-[#0e1828] py-0 pl-3 pr-9 text-sm text-white outline-none"
              aria-label="Newest First"
            >
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aafc6]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 5 5 5-5" />
            </svg>
          </span>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1e6fe3] px-4 text-sm font-semibold text-white transition hover:bg-[#185fc7]"
          >
            <SearchIcon className="h-4 w-4" />
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#1e6fe3] px-3 py-1 text-[12px] font-semibold">TOTAL: {counts.total}</span>
          <span className="rounded-full bg-[#1f9d4a] px-3 py-1 text-[12px] font-semibold">APPROVED: {counts.approved}</span>
          <span className="rounded-full bg-[#e2b423] px-3 py-1 text-[12px] font-semibold text-[#1c1604]">PENDING: {counts.pending}</span>
          <span className="rounded-full bg-[#d63b3b] px-3 py-1 text-[12px] font-semibold">REJECTED: {counts.rejected}</span>
        </div>
      </section>

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#2a3d58]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] border-collapse text-left">
            <thead className="bg-[#eef3f8] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7d8da5]">
              <tr>
                <th className="px-5 py-3.5">Borrower</th>
                <th className="px-3 py-3.5 text-center">Amount</th>
                <th className="px-3 py-3.5 text-center">Purpose</th>
                <th className="px-3 py-3.5 text-center">Interest</th>
                <th className="px-3 py-3.5 text-center">Duration</th>
                <th className="px-3 py-3.5 text-center">Status</th>
                <th className="px-3 py-3.5 text-center">Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[#152033] text-sm">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-[#8ea3bb]">
                    No loans match this search.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.id} className="border-t border-[#2a3e58]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1d4e8f] text-white">
                          <PersonIcon />
                        </span>
                        <span>
                          <span className="block text-[13px] font-bold tracking-wide">{item.name}</span>
                          <span className="mt-0.5 block text-[12px] text-[#8ea3bb]">
                            ID: {item.id} · {item.mobile}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center font-medium">{taka(item.amount)}</td>
                    <td className="px-3 py-4 text-center">
                      <span className="mx-auto block max-w-[88px] leading-tight text-[#d5deea]">{item.purpose}</span>
                    </td>
                    <td className="px-3 py-4 text-center font-bold">{item.interest.toFixed(2)}%</td>
                    <td className="px-3 py-4 text-center text-[#d5deea]">{item.duration}</td>
                    <td className="px-3 py-4 text-center">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusBadge[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className="block text-[13px]">{item.date}</span>
                      <span className="mt-0.5 block text-[12px] text-[#8ea3bb]">{item.time}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="ml-auto flex w-[92px] flex-col items-stretch gap-1.5">
                        <button
                          type="button"
                          aria-label={`View ${item.name}`}
                          onClick={() => {
                            setActive(item.id);
                            setPanel("view");
                          }}
                          className="grid h-8 w-8 place-self-end place-items-center rounded-full border border-[#3b82f6] text-[#7eb6ff] transition hover:bg-[#1e6fe3]/20"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          type="button"
                          aria-label={`Documents for ${item.name}`}
                          onClick={() => {
                            setActive(item.id);
                            setPanel("documents");
                          }}
                          className="grid h-8 w-8 place-self-end place-items-center rounded-md bg-[#1e6fe3] text-white transition hover:bg-[#185fc7]"
                        >
                          <DocIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoanStatus(item.id, "Approved")}
                          className="rounded-md bg-[#1f9d4a] px-2 py-1.5 text-[12px] font-bold text-white transition hover:bg-[#18873e]"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoanStatus(item.id, "Rejected")}
                          className="rounded-md bg-[#7a2e38] px-2 py-1.5 text-[12px] font-bold text-[#ffd0d4] transition hover:bg-[#8d3642]"
                        >
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
      </div>

      {viewed && panel ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setPanel(null)}>
          <div
            className="w-full max-w-md rounded-2xl border border-[#2a3d58] bg-[#121c2f] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8ea3bb]">
                  {panel === "view" ? "Loan details" : "Documents"}
                </p>
                <h2 className="mt-1 text-xl font-bold">{viewed.name}</h2>
                <p className="mt-1 text-sm text-[#8ea3bb]">
                  ID: {viewed.id} · {viewed.mobile}
                </p>
              </div>
              <button type="button" onClick={() => setPanel(null)} className="text-sm text-[#9aafc6]" aria-label="Close">
                Close
              </button>
            </div>

            {panel === "view" ? (
              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[#8ea3bb]">Amount</dt>
                  <dd className="font-semibold">{taka(viewed.amount)}</dd>
                </div>
                <div>
                  <dt className="text-[#8ea3bb]">Interest</dt>
                  <dd className="font-semibold">{viewed.interest.toFixed(2)}%</dd>
                </div>
                <div>
                  <dt className="text-[#8ea3bb]">Purpose</dt>
                  <dd className="font-semibold">{viewed.purpose}</dd>
                </div>
                <div>
                  <dt className="text-[#8ea3bb]">Duration</dt>
                  <dd className="font-semibold">{viewed.duration}</dd>
                </div>
                <div>
                  <dt className="text-[#8ea3bb]">Status</dt>
                  <dd className="font-semibold">{viewed.status}</dd>
                </div>
                <div>
                  <dt className="text-[#8ea3bb]">Date</dt>
                  <dd className="font-semibold">
                    {viewed.date} {viewed.time}
                  </dd>
                </div>
              </dl>
            ) : (
              <ul className="mt-5 space-y-2 text-sm">
                {["National ID", "Applicant Photo", "Income Proof"].map((doc) => (
                  <li key={doc} className="flex items-center justify-between rounded-lg bg-[#0e1828] px-3 py-2">
                    <span>{doc}</span>
                    <span className="text-[#7ddea0]">Attached</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
