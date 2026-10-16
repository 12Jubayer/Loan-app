import { useState } from "react";

const field =
  "h-11 w-full rounded-lg border border-[#314864] bg-[#0e1828] px-3 text-sm text-white outline-none placeholder:text-[#7f93ab] focus:border-[#1e6fe3]";

function BannerArt() {
  return (
    <svg viewBox="0 0 168 64" className="h-12 w-[108px] rounded-md" aria-hidden="true">
      <rect width="168" height="64" fill="#16325c" />
      <rect y="42" width="168" height="22" fill="#c45a22" />
      <circle cx="28" cy="24" r="10" fill="#f3d7a4" />
      <rect x="48" y="16" width="78" height="6" rx="3" fill="#ffffff" opacity="0.85" />
      <rect x="48" y="28" width="52" height="5" rx="2.5" fill="#9fd0ff" />
    </svg>
  );
}

let nextId = 2;

export default function HomeBanner() {
  const [banners, setBanners] = useState([
    { id: 1, link: "dashboard.php", status: "Active", order: 1, image: "" },
  ]);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [order, setOrder] = useState("5");
  const [image, setImage] = useState("");
  const [fileLabel, setFileLabel] = useState("");
  const [editing, setEditing] = useState(null);
  const [fileKey, setFileKey] = useState(0);

  function resetForm() {
    setLink("");
    setStatus("Active");
    setOrder("5");
    setImage("");
    setFileLabel("");
    setEditing(null);
    setFileKey((value) => value + 1);
  }

  function onFile(file) {
    if (!file) {
      setImage("");
      return;
    }
    setFileLabel(file.name);
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function onSubmit(event) {
    event.preventDefault();
    const next = {
      link: link.trim() || "—",
      status,
      order: Number(order) || 0,
      image,
    };
    if (editing) {
      setBanners((current) =>
        current
          .map((item) => (item.id === editing ? { ...item, ...next, image: next.image || item.image } : item))
          .sort((a, b) => a.order - b.order),
      );
    } else {
      nextId += 1;
      setBanners((current) => [...current, { id: nextId, ...next }].sort((a, b) => a.order - b.order));
    }
    resetForm();
  }

  function onEdit(item) {
    setEditing(item.id);
    setLink(item.link === "—" ? "" : item.link);
    setStatus(item.status);
    setOrder(String(item.order));
    setImage("");
    setFileKey((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onDelete(id) {
    setBanners((current) => current.filter((item) => item.id !== id));
    if (editing === id) resetForm();
  }

  return (
    <div className="space-y-5">
      <form onSubmit={onSubmit} className="rounded-2xl border border-[#243652] bg-[#121c2f] p-5 sm:p-6">
        <h1 className="text-[22px] font-bold text-white">Add Home Banner</h1>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-[#d5e2f0]">Banner Image</span>
            <span className="flex h-11 items-center gap-3 rounded-lg border border-[#314864] bg-[#0e1828] px-2">
              <span className="rounded-md bg-white px-3 py-1 text-sm font-medium text-black">Browse...</span>
              <span className="truncate text-sm text-[#9aafc6]">{fileLabel || "No file selected."}</span>
              <input
                key={fileKey}
                type="file"
                accept="image/*"
                aria-label="Banner Image"
                onChange={(event) => onFile(event.target.files?.[0])}
                className="sr-only"
              />
            </span>
            <span className="mt-2 block text-[13px] text-[#8ea3bb]">Current dashboard banner height will remain unchanged.</span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-[#d5e2f0]">Redirect Link</span>
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="https://example.com or page.php"
              aria-label="Redirect Link"
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-[#d5e2f0]">Status</span>
            <span className="relative block">
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                aria-label="Status"
                className={`${field} appearance-none pr-10`}
                style={{ colorScheme: "dark" }}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aafc6]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-[#d5e2f0]">Display Order</span>
            <input
              type="number"
              min="1"
              value={order}
              onChange={(event) => setOrder(event.target.value)}
              aria-label="Display Order"
              className={field}
            />
          </label>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button type="submit" className="rounded-lg bg-[#2f7cf6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d6ae0]">
            {editing ? "Update Banner" : "Add Banner"}
          </button>
          {editing ? (
            <button type="button" onClick={resetForm} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#9aafc6] hover:text-white">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <section className="overflow-hidden rounded-2xl border border-[#243652] bg-[#121c2f]">
        <h2 className="px-5 py-4 text-[20px] font-bold text-white">All Home Banners</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-white text-[14px] text-[#1b2433]">
                <th className="px-5 py-3 font-semibold">Banner</th>
                <th className="px-5 py-3 font-semibold">Redirect Link</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-[#9aafc6]">
                    No banners yet. Add one above.
                  </td>
                </tr>
              ) : (
                banners.map((item) => (
                  <tr key={item.id} className="border-t border-white/[0.06]">
                    <td className="px-5 py-3">
                      {item.image ? (
                        <img src={item.image} alt="" className="h-12 w-[108px] rounded-md object-cover" />
                      ) : (
                        <BannerArt />
                      )}
                    </td>
                    <td className="px-5 py-3 text-[#d5e2f0]">{item.link}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "Active" ? "bg-[#d9f7e5] text-[#178746]" : "bg-white/10 text-[#c5d3e6]"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">{item.order}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(item)}
                          className="rounded-md bg-[#dbeafe] px-3 py-1.5 text-xs font-semibold text-[#1d4ed8]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(item.id)}
                          className="rounded-md bg-[#fee2e2] px-3 py-1.5 text-xs font-semibold text-[#dc2626]"
                        >
                          Delete
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
