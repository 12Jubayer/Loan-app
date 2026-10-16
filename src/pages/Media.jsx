import { useMemo, useState } from "react";
import { managedUsers } from "../data";

const slots = [
  ["Personal ID Front", "id-front"],
  ["Personal ID Back", "id-back"],
  ["Personal ID With Face", "face"],
  ["Personal Signature", "signature"],
  ["Nominee Photo", "nominee"],
  ["Nominee ID Front", "nid-front"],
  ["Nominee ID Back", "nid-back"],
];

const people = managedUsers.slice(0, 5).map((user) => ({
  ...user,
  items: slots.map(([label, kind]) => ({ label, kind })),
}));

function SampleTile({ kind }) {
  if (kind === "signature") {
    return (
      <div className="flex h-[104px] items-center justify-center rounded-md bg-[#243044]">
        <svg viewBox="0 0 120 40" className="w-[72px] text-[#b7ddd4]" aria-hidden="true">
          <path d="M4 28c12-20 18 0 28-8 7 10 12-18 24-6 8 8 12-12 22-4 7 5 12 2 20-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  if (kind === "face" || kind === "nominee") {
    return (
      <div className={`flex h-[104px] items-end justify-center overflow-hidden rounded-md ${kind === "face" ? "bg-[#3f6d52]" : "bg-[#8d6840]"}`}>
        <svg viewBox="0 0 80 70" className="h-[88px] w-[80px] text-white/85" aria-hidden="true">
          <circle cx="40" cy="24" r="14" fill="currentColor" />
          <path d="M10 70c3-18 14-26 30-26s27 8 30 26" fill="currentColor" />
        </svg>
      </div>
    );
  }
  const tones = {
    "id-front": "from-[#e7eef6] to-[#c5d4e6]",
    "id-back": "from-[#f6ead4] to-[#e4c99a]",
    "nid-front": "from-[#def3e8] to-[#c3e2d2]",
    "nid-back": "from-[#ece7f6] to-[#d4cce8]",
  };
  return (
    <div className={`flex h-[104px] items-center justify-center rounded-md bg-gradient-to-br ${tones[kind] || tones["id-front"]}`}>
      <div className="w-[78%] rounded border border-[#1e3a5f]/25 bg-white/80 px-2 py-2 text-center">
        <p className="text-[10px] font-bold tracking-wide text-[#1e3a5f]">SAMPLE FILE</p>
        <p className="text-[9px] text-[#5c7390]">Not an ID document</p>
      </div>
    </div>
  );
}

export default function Media() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Newest First");
  const [open, setOpen] = useState(null);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    const matched = people.filter((person) => {
      if (!text) return true;
      return person.name.toLowerCase().includes(text) || String(person.id).includes(text);
    });
    return [...matched].sort((a, b) => (sort === "Oldest First" ? a.id - b.id : b.id - a.id));
  }, [query, sort]);

  const itemCount = visible.reduce((sum, person) => sum + person.items.length, 0);

  return (
    <div>
      <header className="mb-4 flex items-end justify-between gap-3">
        <h1 className="text-[32px] font-bold leading-none text-white">User Media</h1>
        <p className="text-sm text-[#9aafc6]">{itemCount} items found</p>
      </header>

      <section className="rounded-2xl border border-[#243652] bg-[#121c2f] p-4 sm:p-5">
        <div className="grid items-end gap-4 lg:grid-cols-[1fr_240px]">
          <label className="relative block">
            <span className="sr-only">Search by name or ID</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or ID"
              aria-label="Search by name or ID"
              className="h-12 w-full rounded-xl border border-[#314864] bg-[#0e1828] px-4 pr-11 text-sm outline-none placeholder:text-[#7f93ab] focus:border-[#1e6fe3]"
            />
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aafc6]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path strokeLinecap="round" d="m16 16 4 4" />
            </svg>
          </label>
          <div>
            <p className="mb-2 text-right text-sm text-[#d5e2f0]">Sort by:</p>
            <span className="relative block">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort by"
                className="h-11 w-full appearance-none rounded-lg border border-[#314864] bg-[#0e1828] px-3 pr-10 text-sm outline-none"
                style={{ colorScheme: "dark" }}
              >
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aafc6]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSort("Newest First");
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#9f2942] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#861f36]"
          >
            <span aria-hidden="true">×</span>
            Clear Filters
          </button>
        </div>
      </section>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-[#243652] bg-[#121c2f] px-5 py-10 text-center text-[#9aafc6]">No media matches this search.</p>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
          {visible.map((person) => (
            <article key={person.id} className="rounded-2xl border border-[#243652] bg-[#15263d] p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-[15px] font-bold uppercase tracking-wide">{person.name}</h2>
                <p className="shrink-0 text-xs text-[#9aafc6]">{person.items.length} items</p>
              </div>
              <p className="mt-1 text-[12px] text-[#8ea3bb]">
                User ID: {person.id} • {person.mobile}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {person.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setOpen({ person, item })}
                    className="text-left"
                  >
                    <SampleTile kind={item.kind} />
                    <span className="mt-1 block text-center text-[10px] leading-tight text-[#9aafc6]">{item.label}</span>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setOpen(null)}>
          <div
            className="w-full max-w-md rounded-2xl border border-[#243652] bg-[#121c2f] p-5"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={open.item.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{open.item.label}</h3>
                <p className="mt-1 text-sm text-[#9aafc6]">
                  {open.person.name} • User ID {open.person.id}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold">
                Close
              </button>
            </div>
            <div className="mt-4">
              <SampleTile kind={open.item.kind} />
            </div>
            <p className="mt-3 text-sm text-[#9aafc6]">Sample customer file for internal review. This is not an identity document.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
