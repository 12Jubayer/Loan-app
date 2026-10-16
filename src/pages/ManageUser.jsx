import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { managedUsers, taka } from "../data";

const pageSize = 18;
const field =
  "h-11 w-full rounded-lg border border-[#314864] bg-[#0e1828] px-3 text-sm outline-none placeholder:text-[#7f93ab] focus:border-[#1e6fe3]";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="m16 16 4 4" />
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
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="9" r="3" />
      <path strokeLinecap="round" d="M6.8 18.2c.7-2.2 2.5-3.4 5.2-3.4s4.5 1.2 5.2 3.4" />
    </svg>
  );
}

function countsFor(latest) {
  if (latest === "Approved") return { total: 1, approved: 1, pending: 0, rejected: 0 };
  if (latest === "Rejected") return { total: 1, approved: 0, pending: 0, rejected: 1 };
  if (latest === "No Application") return { total: 0, approved: 0, pending: 0, rejected: 0 };
  return { total: 1, approved: 0, pending: 1, rejected: 0 };
}

export default function ManageUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(managedUsers);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return users;
    return users.filter((user) => `${user.name} ${user.id} ${user.mobile}`.toLowerCase().includes(text));
  }, [users, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const totals = users.reduce(
    (sum, user) => ({
      loan: sum.loan + user.total,
      approved: sum.approved + user.approved,
      pending: sum.pending + user.pending,
      rejected: sum.rejected + user.rejected,
    }),
    { loan: 0, approved: 0, pending: 0, rejected: 0 },
  );

  function search(event) {
    event.preventDefault();
    setQuery(draft.trim());
    setPage(1);
  }

  function openEdit(user) {
    setEditForm({
      id: user.id,
      name: user.name,
      mobile: user.mobile,
      balance: String(user.balance),
      latest: user.latest,
    });
    setModal({ type: "edit", id: user.id });
  }

  function saveEdit(event) {
    event.preventDefault();
    const counts = countsFor(editForm.latest);
    setUsers((current) =>
      current.map((user) =>
        user.id === editForm.id
          ? {
              ...user,
              name: editForm.name.trim() || user.name,
              mobile: editForm.mobile.trim() || user.mobile,
              balance: Number(editForm.balance) || 0,
              latest: editForm.latest,
              ...counts,
            }
          : user,
      ),
    );
    setModal(null);
  }

  function toggleAccount(id) {
    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, account: user.account === "Active" ? "Inactive" : "Active" } : user)),
    );
  }

  function removeUser(id) {
    setUsers((current) => current.filter((user) => user.id !== id));
    setModal(null);
  }

  const activeUser = users.find((user) => user.id === modal?.id);

  return (
    <div>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-bold leading-none text-[#2ad4f0]">All User</h1>
          <p className="mt-2 text-sm text-[#9aafc6]">
            Total registered users: <span className="text-white">{users.length}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/document")}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2f7cf6] bg-[#16325c] px-4 py-2 text-sm font-semibold text-[#7eb6ff]"
        >
          <DocIcon />
          Document Generator
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["TOTAL LOAN", totals.loan, "bg-[#17345c] text-[#7eb6ff]"],
          ["APPROVED", totals.approved, "bg-[#143528] text-[#3dce73]"],
          ["PENDING", totals.pending, "bg-[#3a3114] text-[#e6c34a]"],
          ["REJECTED", totals.rejected, "bg-[#3a1c28] text-[#f08aa4]"],
        ].map(([label, value, tone]) => (
          <article key={label} className="flex items-center justify-between rounded-2xl border border-[#2a3d58] bg-[#121c2f] px-5 py-4">
            <div>
              <p className="text-[12px] font-semibold tracking-[0.06em] text-[#9aafc6]">{label}</p>
              <p className="mt-2 text-[34px] font-bold leading-none">{value}</p>
            </div>
            <span className={`grid h-10 w-10 place-items-center rounded-lg ${tone}`}>
              {label === "APPROVED" ? "✓" : label === "PENDING" ? "◷" : label === "REJECTED" ? "×" : "▤"}
            </span>
          </article>
        ))}
      </section>

      <form onSubmit={search} className="mt-5 rounded-2xl border border-[#243652] bg-[#121c2f] p-4 sm:p-5">
        <p className="mb-3 text-sm font-semibold">Search User</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="User ID, mobile number or username"
            aria-label="Search User"
            className="h-12 flex-1 rounded-xl border border-[#314864] bg-[#0e1828] px-4 text-sm outline-none placeholder:text-[#7f93ab] focus:border-[#1e6fe3]"
          />
          <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#2f7cf6] px-6 text-sm font-semibold">
            <SearchIcon />
            Search
          </button>
        </div>
      </form>

      <section className="mt-5 overflow-hidden rounded-2xl border border-[#243652] bg-[#121c2f]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="bg-white text-[13px] text-[#1b2433]">
                {["SERIAL", "USER", "TOTAL LOAN", "APPROVED", "PENDING", "REJECTED", "LATEST STATUS", "BALANCE", "ACCOUNT", "ACTIONS"].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-[#9aafc6]">
                    No users found.
                  </td>
                </tr>
              ) : (
                rows.map((user, index) => (
                  <tr key={user.id} className="border-t border-white/[0.06]">
                    <td className="px-4 py-4">{(safePage - 1) * pageSize + index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1d4f91] text-white">
                          <PersonIcon />
                        </span>
                        <div className="min-w-[140px]">
                          <p className="max-w-[150px] font-bold uppercase leading-tight">{user.name}</p>
                          <p className="mt-1 text-[12px] text-[#8ea3bb]">
                            ID: {user.id} • {user.mobile}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold">{user.total}</td>
                    <td className="px-4 py-4 font-semibold text-[#3dce73]">{user.approved}</td>
                    <td className="px-4 py-4 font-semibold text-[#e6c34a]">{user.pending}</td>
                    <td className="px-4 py-4 font-semibold text-[#f08aa4]">{user.rejected}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          user.latest === "Approved"
                            ? "bg-[#146c36] text-white"
                            : user.latest === "Rejected"
                              ? "bg-[#7f1d2e] text-white"
                              : user.latest === "No Application"
                                ? "bg-white/10 text-[#c5d3e6]"
                                : "bg-[#6d5818] text-[#f3e2a2]"
                        }`}
                      >
                        {user.latest}
                      </span>
                    </td>
                    <td className="px-4 py-4">{taka(user.balance)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.account === "Active" ? "bg-[#1f9d4a] text-white" : "bg-[#3a4658] text-[#d5e2f0]"}`}>
                        {user.account}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex w-[118px] flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setModal({ type: "history", id: user.id })}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#3b82f6] px-2 py-1.5 text-xs font-semibold text-[#8eb6ff]"
                        >
                          <span aria-hidden="true">↻</span> History
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" aria-label={`View ${user.name}`} onClick={() => setModal({ type: "view", id: user.id })} className="grid h-9 place-items-center rounded-lg bg-[#2563eb] text-white">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                              <path d="M2.8 12S6.2 6.8 12 6.8 21.2 12 21.2 12 17.8 17.2 12 17.2 2.8 12 2.8 12Z" />
                              <circle cx="12" cy="12" r="2.3" />
                            </svg>
                          </button>
                          <button type="button" aria-label={`Edit ${user.name}`} onClick={() => openEdit(user)} className="grid h-9 place-items-center rounded-lg bg-[#d4a017] text-white">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                              <path strokeLinejoin="round" d="M4 16.5V20h3.5L18.8 8.7l-3.5-3.5L4 16.5Z" />
                            </svg>
                          </button>
                        </div>
                        <button type="button" onClick={() => toggleAccount(user.id)} className="rounded-lg bg-[#1a2744] px-2 py-1.5 text-xs font-semibold">
                          {user.account === "Active" ? "Inactive" : "Active"}
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${user.name}`}
                          onClick={() => setModal({ type: "delete", id: user.id })}
                          className="mx-auto grid h-9 w-9 place-items-center rounded-lg bg-[#6b2433] text-white"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <path strokeLinecap="round" d="M5 7h14M9 7V5h6v2M8 7l.7 12h6.6L16 7" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-3 border-t border-white/[0.06] py-4">
          <button
            type="button"
            aria-label="Previous page"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
            className="grid h-9 w-9 place-items-center rounded-lg bg-[#1a2744] disabled:opacity-40"
          >
            ‹
          </button>
          <p className="text-sm text-[#d5e2f0]">
            Page {safePage} of {pages}
          </p>
          <button
            type="button"
            aria-label="Next page"
            disabled={safePage === pages}
            onClick={() => setPage(safePage + 1)}
            className="grid h-9 w-9 place-items-center rounded-lg bg-[#1a2744] disabled:opacity-40"
          >
            ›
          </button>
        </div>
      </section>

      {modal && activeUser && modal.type !== "edit" ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setModal(null)}>
          <div className="w-full max-w-md rounded-2xl border border-[#243652] bg-[#121c2f] p-5" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            {modal.type === "delete" ? (
              <>
                <h3 className="text-lg font-bold">Delete user</h3>
                <p className="mt-2 text-sm text-[#c5d3e6]">Remove {activeUser.name} from the registered user list?</p>
                <div className="mt-5 flex justify-end gap-2">
                  <button type="button" onClick={() => setModal(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#9aafc6]">
                    Cancel
                  </button>
                  <button type="button" onClick={() => removeUser(activeUser.id)} className="rounded-lg bg-[#dc2626] px-4 py-2 text-sm font-semibold">
                    Delete
                  </button>
                </div>
              </>
            ) : modal.type === "history" ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{activeUser.name}</h3>
                    <p className="mt-1 text-sm text-[#9aafc6]">Loan history • ID {activeUser.id}</p>
                  </div>
                  <button type="button" onClick={() => setModal(null)} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">
                    Close
                  </button>
                </div>
                {activeUser.total === 0 ? (
                  <p className="mt-4 text-sm text-[#9aafc6]">No loan history for this user.</p>
                ) : (
                  <div className="mt-4 space-y-2">
                    {activeUser.approved > 0 ? <HistoryRow status="Approved" /> : null}
                    {activeUser.pending > 0 ? <HistoryRow status="Pending" /> : null}
                    {activeUser.rejected > 0 ? <HistoryRow status="Rejected" /> : null}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{activeUser.name}</h3>
                  <button type="button" onClick={() => setModal(null)} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">
                    Close
                  </button>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  {[
                    ["User ID", activeUser.id],
                    ["Mobile", activeUser.mobile],
                    ["Total loan", activeUser.total],
                    ["Approved", activeUser.approved],
                    ["Pending", activeUser.pending],
                    ["Rejected", activeUser.rejected],
                    ["Latest status", activeUser.latest],
                    ["Balance", taka(activeUser.balance)],
                    ["Account", activeUser.account],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-white/[0.06] py-2">
                      <dt className="text-[#9aafc6]">{label}</dt>
                      <dd className="font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}
          </div>
        </div>
      ) : null}

      {modal?.type === "edit" && editForm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setModal(null)}>
          <form onSubmit={saveEdit} className="w-full max-w-md rounded-2xl border border-[#243652] bg-[#121c2f] p-5" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-bold">Edit user</h3>
            <label className="mt-4 block text-sm">
              Name
              <input value={editForm.name} onChange={(event) => setEditForm({ ...editForm, name: event.target.value })} className={`${field} mt-1`} aria-label="Edit name" />
            </label>
            <label className="mt-3 block text-sm">
              Mobile
              <input value={editForm.mobile} onChange={(event) => setEditForm({ ...editForm, mobile: event.target.value })} className={`${field} mt-1`} aria-label="Edit mobile" />
            </label>
            <label className="mt-3 block text-sm">
              Balance
              <input type="number" min="0" value={editForm.balance} onChange={(event) => setEditForm({ ...editForm, balance: event.target.value })} className={`${field} mt-1`} aria-label="Edit balance" />
            </label>
            <label className="mt-3 block text-sm">
              Latest status
              <select value={editForm.latest} onChange={(event) => setEditForm({ ...editForm, latest: event.target.value })} className={`${field} mt-1`} aria-label="Edit latest status" style={{ colorScheme: "dark" }}>
                <option>Pending Documents</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>No Application</option>
              </select>
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setModal(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#9aafc6]">
                Cancel
              </button>
              <button type="submit" className="rounded-lg bg-[#2f7cf6] px-4 py-2 text-sm font-semibold">
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function HistoryRow({ status }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#0e1828] px-4 py-3">
      <div>
        <p className="font-semibold">Personal Loan</p>
        <p className="text-xs text-[#9aafc6]">2026-10-16 • {taka(50000)}</p>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === "Approved" ? "bg-[#146c36] text-white" : status === "Rejected" ? "bg-[#7f1d2e] text-white" : "bg-[#6d5818] text-[#f3e2a2]"}`}>
        {status}
      </span>
    </div>
  );
}
