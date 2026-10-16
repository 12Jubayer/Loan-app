import { useState } from "react";

const sections = ["Dashboard", "Application", "Home Banner", "Media", "Manage User", "Card", "Calculator", "Withdraw", "Settings"];

const field =
  "h-11 w-full rounded-lg border border-[#314864] bg-[#0e1828] px-3 text-sm text-white outline-none focus:border-[#1e6fe3]";

let nextId = 1;

export default function Staff() {
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState([]);
  const [notice, setNotice] = useState("");

  const allOn = selected.length === sections.length;

  function toggleAll() {
    setSelected(allOn ? [] : [...sections]);
    setNotice("");
  }

  function toggle(section) {
    setSelected((current) => (current.includes(section) ? current.filter((item) => item !== section) : [...current, section]));
    setNotice("");
  }

  function create(event) {
    event.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      setNotice("Customer name, username and password are required.");
      return;
    }
    nextId += 1;
    setAccounts((current) => [
      ...current,
      { id: nextId, name: name.trim(), username: username.trim(), permissions: [...selected] },
    ]);
    setName("");
    setUsername("");
    setPassword("");
    setSelected([]);
    setNotice("Staff account created.");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={create} className="rounded-2xl border border-[#243652] bg-[#121c2f] p-5 sm:p-6">
        <h1 className="text-[22px] font-bold text-white">Create Staff Account</h1>

        <div className="mt-5 grid gap-x-8 gap-y-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-[#d5e2f0]">Customer Name</span>
            <input value={name} onChange={(event) => { setName(event.target.value); setNotice(""); }} aria-label="Customer Name" className={field} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-[#d5e2f0]">Username</span>
            <input value={username} onChange={(event) => { setUsername(event.target.value); setNotice(""); }} aria-label="Username" className={field} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-[#d5e2f0]">Password</span>
            <input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setNotice(""); }} aria-label="Password" className={field} />
          </label>
        </div>

        <h2 className="mt-6 text-[18px] font-bold">Permissions</h2>
        <label className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#2a6498] bg-[#18406a] px-4 py-3">
          <span className="flex min-w-0 items-center gap-3">
            <input type="checkbox" checked={allOn} onChange={toggleAll} aria-label="All Permissions" className="h-4 w-4 accent-[#2f7cf6]" />
            <span>
              <span className="block text-sm font-semibold">All Permissions</span>
              <span className="block text-xs text-[#b7cbe2]">Give access to all 9 available sections</span>
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-[#2f7cf6] px-3 py-1 text-[11px] font-bold tracking-wide text-white">ALL</span>
        </label>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {sections.map((section) => (
            <label key={section} className="flex items-center gap-3 rounded-lg border border-[#314864] bg-[#0e1828] px-3 py-3 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(section)}
                onChange={() => toggle(section)}
                aria-label={section}
                className="h-4 w-4 accent-[#2f7cf6]"
              />
              {section}
            </label>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button type="submit" className="rounded-lg bg-[#2f7cf6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d6ae0]">
            Create Now
          </button>
          {notice ? (
            <p className={`text-sm font-semibold ${notice.startsWith("Staff") ? "text-[#3dce73]" : "text-[#f0b45a]"}`}>{notice}</p>
          ) : null}
        </div>
      </form>

      {accounts.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-[#243652] bg-[#121c2f]">
          <h2 className="px-5 py-4 text-[18px] font-bold">Staff Accounts</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="bg-white text-[13px] text-[#1b2433]">
                  {["CUSTOMER", "USERNAME", "ACCESS", "ACTIONS"].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-semibold">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-t border-white/[0.06]">
                    <td className="px-4 py-3 font-semibold">{account.name}</td>
                    <td className="px-4 py-3 text-[#d5e2f0]">{account.username}</td>
                    <td className="px-4 py-3 text-[#d5e2f0]">
                      {account.permissions.length === sections.length ? "All sections" : account.permissions.join(", ") || "No access"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          setAccounts((current) => current.filter((item) => item.id !== account.id));
                          setNotice("");
                        }}
                        className="rounded-md bg-[#fee2e2] px-3 py-1.5 text-xs font-semibold text-[#dc2626]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
