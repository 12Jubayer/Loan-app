import { useState } from "react";
import { GlobeIcon } from "../components/Icons";

const field =
  "h-11 w-full rounded-lg border border-[#314864] bg-[#0e1828] px-3 text-sm text-white outline-none focus:border-[#1e6fe3]";

function readFile(file, onReady) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => onReady(String(reader.result || ""), file.name);
  reader.readAsDataURL(file);
}

function FilePicker({ label, fileName, onPick }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-[#d5e2f0]">{label}</span>
      <span className="flex h-11 cursor-pointer items-center gap-3 rounded-lg border border-[#314864] bg-[#0e1828] px-2">
        <span className="rounded-md bg-white px-3 py-1 text-sm font-medium text-black">Browse...</span>
        <span className="truncate text-sm text-[#9aafc6]">{fileName || "No file selected."}</span>
        <input
          type="file"
          accept="image/*"
          aria-label={label}
          className="sr-only"
          onChange={(event) => readFile(event.target.files?.[0], onPick)}
        />
      </span>
    </label>
  );
}

function Mark({ src, label }) {
  return (
    <div className="grid h-[74px] w-[74px] place-items-center overflow-hidden rounded-[14px] bg-white" aria-label={label}>
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <GlobeIcon className="h-10 w-10" />}
    </div>
  );
}

export default function Settings() {
  const [name, setName] = useState("WorldBank");
  const [currency, setCurrency] = useState("৳");
  const [minimum, setMinimum] = useState("100.00");
  const [maximum, setMaximum] = useState("50000.00");
  const [interest, setInterest] = useState("3.00");
  const [withdrawUrl, setWithdrawUrl] = useState("uttolon");
  const [welcome, setWelcome] = useState("আপনার আর্থিক সহায়তার জন্য আমরা প্রস্তুত।");
  const [logo, setLogo] = useState("");
  const [logoName, setLogoName] = useState("");
  const [favicon, setFavicon] = useState("");
  const [faviconName, setFaviconName] = useState("");
  const [saved, setSaved] = useState(false);

  function touch(setter) {
    return (event) => {
      setter(event.target.value);
      setSaved(false);
    };
  }

  function save(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-[#243652] bg-[#121c2f] p-5 sm:p-6">
      <h1 className="text-[22px] font-bold text-white">Website Settings</h1>

      <div className="mt-5 grid gap-x-8 gap-y-5 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-[#d5e2f0]">Website Name</span>
          <input value={name} onChange={touch(setName)} aria-label="Website Name" className={field} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#d5e2f0]">Currency Symbol</span>
          <input value={currency} onChange={touch(setCurrency)} aria-label="Currency Symbol" className={field} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#d5e2f0]">Minimum Deposit Amount</span>
          <input type="number" min="0" step="0.01" value={minimum} onChange={touch(setMinimum)} aria-label="Minimum Deposit Amount" className={field} style={{ colorScheme: "dark" }} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#d5e2f0]">Maximum Deposit Amount</span>
          <input type="number" min="0" step="0.01" value={maximum} onChange={touch(setMaximum)} aria-label="Maximum Deposit Amount" className={field} style={{ colorScheme: "dark" }} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#d5e2f0]">Loan Interest (%)</span>
          <input type="number" min="0" step="0.01" value={interest} onChange={touch(setInterest)} aria-label="Loan Interest" className={field} style={{ colorScheme: "dark" }} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-[#d5e2f0]">Withdraw URL</span>
          <input value={withdrawUrl} onChange={touch(setWithdrawUrl)} aria-label="Withdraw URL" className={field} />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm text-[#d5e2f0]">Dashboard Welcome Message</span>
        <textarea
          value={welcome}
          onChange={touch(setWelcome)}
          aria-label="Dashboard Welcome Message"
          rows={4}
          className="w-full rounded-lg border border-[#314864] bg-[#0e1828] px-3 py-3 text-sm text-white outline-none focus:border-[#1e6fe3]"
        />
      </label>

      <div className="mt-5 grid gap-x-8 gap-y-4 lg:grid-cols-2">
        <div>
          <FilePicker label="Website Logo" fileName={logoName} onPick={(src, file) => { setLogo(src); setLogoName(file); setSaved(false); }} />
          <div className="mt-4">
            <Mark src={logo} label="Website logo preview" />
          </div>
        </div>
        <div>
          <FilePicker label="Favicon" fileName={faviconName} onPick={(src, file) => { setFavicon(src); setFaviconName(file); setSaved(false); }} />
          <div className="mt-4">
            <Mark src={favicon} label="Favicon preview" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button type="submit" className="rounded-lg bg-[#2f7cf6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1d6ae0]">
          Save Settings
        </button>
        {saved ? <p className="text-sm font-semibold text-[#3dce73]">Settings saved.</p> : null}
      </div>
    </form>
  );
}
