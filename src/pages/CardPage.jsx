import { useRef, useState } from "react";

const field =
  "h-11 w-full rounded-lg border border-[#314864] bg-[#0e1828] px-3 text-sm outline-none placeholder:text-[#7f93ab] focus:border-[#1e6fe3]";

const emptyCard = { name: "", position: "", idNo: "", email: "", phone: "", photo: "" };

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function paintHeader(ctx, width, height, title) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#1eb4ef");
  gradient.addColorStop(1, "#0b78c8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 34px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, height * 0.62);
}

function paintFooter(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, height - 150, 0, height);
  gradient.addColorStop(0, "#1eb4ef");
  gradient.addColorStop(1, "#0b78c8");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, height - 70);
  ctx.lineTo(width, height - 130);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 18px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("World Bank - Bangladesh", width / 2, height - 28);
}

function drawFront(ctx, width, height, card, photo) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  paintHeader(ctx, width, 150, "THE WORLD BANK");

  const photoX = width / 2 - 78;
  const photoY = 190;
  ctx.fillStyle = "#e7eef3";
  ctx.fillRect(photoX, photoY, 156, 190);
  if (photo) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(photoX, photoY, 156, 190);
    ctx.clip();
    const scale = Math.max(156 / photo.width, 190 / photo.height);
    const dw = photo.width * scale;
    const dh = photo.height * scale;
    ctx.drawImage(photo, photoX + (156 - dw) / 2, photoY + (190 - dh) / 2, dw, dh);
    ctx.restore();
  } else {
    ctx.fillStyle = "#9aa8b8";
    ctx.font = "600 16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PHOTO", width / 2, photoY + 104);
  }

  ctx.fillStyle = "#10233d";
  ctx.font = "800 28px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText((card.name || "FULL NAME").toUpperCase(), width / 2, 440);
  ctx.fillStyle = "#1a73c7";
  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText((card.position || "POSITION").toUpperCase(), width / 2, 472);

  ctx.textAlign = "left";
  const lines = [
    ["ID NO:", card.idNo || "ID NUMBER"],
    ["EMAIL:", card.email || "email@example.com"],
    ["PHONE:", card.phone || "01XXXXXXXXX"],
  ];
  lines.forEach(([label, value], index) => {
    const y = 540 + index * 36;
    ctx.font = "700 18px Inter, sans-serif";
    ctx.fillStyle = "#1a73c7";
    ctx.fillText(label, 70, y);
    ctx.font = "600 18px Inter, sans-serif";
    ctx.fillStyle = "#10233d";
    ctx.fillText(value, 160, y);
  });

  paintFooter(ctx, width, height);
}

function drawBack(ctx, width, height) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  paintHeader(ctx, width, 150, "WORLD BANK");
  ctx.fillStyle = "#10233d";
  ctx.textAlign = "center";
  const lines = ["The World Bank Group", "66, Gulshan Avenue", "Gulshan-2, Dhaka-1212", "Bangladesh"];
  lines.forEach((line, index) => {
    ctx.font = index === 0 ? "700 22px Inter, sans-serif" : "500 20px Inter, sans-serif";
    ctx.fillText(line, width / 2, 360 + index * 36);
  });
  paintFooter(ctx, width, height);
}

function FrontFace({ card }) {
  return (
    <div className="mx-auto w-[230px] overflow-hidden rounded-xl bg-white text-[#10233d] shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      <div className="bg-gradient-to-b from-[#1eb4ef] to-[#0b78c8] py-4 text-center text-[13px] font-bold tracking-wide text-white">THE WORLD BANK</div>
      <div className="flex justify-center pt-4">
        <div className="grid h-[86px] w-[72px] place-items-center overflow-hidden bg-[#e7eef3] text-[10px] font-semibold text-[#8aa0b3]">
          {card.photo ? <img src={card.photo} alt="" className="h-full w-full object-cover" /> : "PHOTO"}
        </div>
      </div>
      <div className="px-4 pt-3 text-center">
        <p className="text-[15px] font-extrabold tracking-wide">{(card.name || "FULL NAME").toUpperCase()}</p>
        <p className="mt-0.5 text-[11px] font-bold text-[#1a73c7]">{(card.position || "POSITION").toUpperCase()}</p>
      </div>
      <div className="space-y-1 px-4 pb-3 pt-3 text-left text-[10px] leading-tight">
        <p>
          <span className="font-bold text-[#1a73c7]">ID NO:</span> {card.idNo || "ID NUMBER"}
        </p>
        <p>
          <span className="font-bold text-[#1a73c7]">EMAIL:</span> {card.email || "email@example.com"}
        </p>
        <p>
          <span className="font-bold text-[#1a73c7]">PHONE:</span> {card.phone || "01XXXXXXXXX"}
        </p>
      </div>
      <div className="relative h-10 bg-gradient-to-b from-[#1eb4ef] to-[#0b78c8]" style={{ clipPath: "polygon(0 46%, 100% 0, 100% 100%, 0 100%)" }}>
        <p className="absolute inset-x-0 bottom-1 text-center text-[8px] font-semibold text-white">World Bank - Bangladesh</p>
      </div>
    </div>
  );
}

function BackFace() {
  return (
    <div className="mx-auto flex h-full min-h-[292px] w-[230px] flex-col overflow-hidden rounded-xl bg-white text-[#10233d] shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      <div className="bg-gradient-to-b from-[#1eb4ef] to-[#0b78c8] py-4 text-center text-[13px] font-bold tracking-wide text-white">WORLD BANK</div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center text-[11px] leading-5">
        <p className="font-bold">The World Bank Group</p>
        <p>66, Gulshan Avenue</p>
        <p>Gulshan-2, Dhaka-1212</p>
        <p>Bangladesh</p>
      </div>
      <div className="relative h-10 bg-gradient-to-b from-[#1eb4ef] to-[#0b78c8]" style={{ clipPath: "polygon(0 46%, 100% 0, 100% 100%, 0 100%)" }}>
        <p className="absolute inset-x-0 bottom-1 text-center text-[8px] font-semibold text-white">World Bank - Bangladesh</p>
      </div>
    </div>
  );
}

export default function CardPage() {
  const [form, setForm] = useState(emptyCard);
  const [fileLabel, setFileLabel] = useState("");
  const [preview, setPreview] = useState(null);
  const previewRef = useRef(null);
  const shown = preview || emptyCard;

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onPhoto(file) {
    if (!file) {
      setFileLabel("");
      setField("photo", "");
      return;
    }
    setFileLabel(file.name);
    const reader = new FileReader();
    reader.onload = () => setField("photo", String(reader.result || ""));
    reader.readAsDataURL(file);
  }

  function generate(event) {
    event.preventDefault();
    setPreview({ ...form });
    window.setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }

  async function download(side) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 1040;
    const ctx = canvas.getContext("2d");
    const photo = shown.photo ? await loadImage(shown.photo) : null;
    if (side === "front") drawFront(ctx, canvas.width, canvas.height, shown, photo);
    else drawBack(ctx, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = side === "front" ? "id-card-front.png" : "id-card-back.png";
    link.click();
  }

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-[34px] font-bold leading-none text-[#2ad4f0]">ID Card Generator</h1>
        <p className="mt-2 text-[15px] text-[#9aafc6]">Create an individual ID card using the photo and information entered below.</p>
      </header>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(320px,420px)_1fr]">
        <form onSubmit={generate} className="rounded-2xl border border-[#243652] bg-[#121c2f] p-5">
          <h2 className="text-[18px] font-bold">Card Information</h2>
          <label className="mt-4 block text-sm text-[#d5e2f0]">
            Upload Photo
            <span className="mt-2 flex h-11 cursor-pointer items-center gap-3 rounded-lg border border-[#314864] bg-[#0e1828] px-2">
              <span className="rounded-md bg-white px-3 py-1 text-sm font-medium text-black">Browse...</span>
              <span className="truncate text-sm text-[#9aafc6]">{fileLabel || "No file selected."}</span>
              <input
                type="file"
                accept="image/*"
                aria-label="Upload Photo"
                onChange={(event) => onPhoto(event.target.files?.[0])}
                className="sr-only"
              />
            </span>
            <span className="mt-2 block text-[13px] text-[#8ea3bb]">Choose a clear passport-size photo.</span>
          </label>
          {[
            ["name", "Full Name", "Full Name"],
            ["position", "Position", "Position"],
            ["idNo", "ID Number", "ID Number"],
            ["email", "Email", "Email"],
            ["phone", "Phone Number", "Phone Number"],
          ].map(([key, label, placeholder]) => (
            <label key={key} className="mt-4 block text-sm text-[#d5e2f0]">
              {label}
              <input value={form[key]} onChange={(event) => setField(key, event.target.value)} placeholder={placeholder} aria-label={label} className={`${field} mt-2`} />
            </label>
          ))}
          <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1d4f86] py-3 text-sm font-semibold text-white transition hover:bg-[#173f6c]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="5.5" width="18" height="13" rx="2" />
              <path d="M3 9.5h18" />
            </svg>
            Generate Card
          </button>
        </form>

        <section ref={previewRef} className="rounded-2xl border border-[#243652] bg-[#121c2f] p-5">
          <h2 className="text-[18px] font-bold">Card Preview</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-3 text-center text-sm text-[#d5e2f0]">Front Side</p>
              <FrontFace card={shown} />
              <button type="button" onClick={() => download("front")} className="mx-auto mt-4 flex w-[230px] items-center justify-center gap-2 rounded-xl bg-[#1a2740] py-3 text-sm font-semibold">
                <span aria-hidden="true">↓</span> Download Front
              </button>
            </div>
            <div>
              <p className="mb-3 text-center text-sm text-[#d5e2f0]">Back Side</p>
              <BackFace />
              <button type="button" onClick={() => download("back")} className="mx-auto mt-4 flex w-[230px] items-center justify-center gap-2 rounded-xl bg-[#1a2740] py-3 text-sm font-semibold">
                <span aria-hidden="true">↓</span> Download Back
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
