import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const rowOne = ["Approval Letter", "Money Receipt", "Bank Check", "Agreement Stamp", "Insurance Form", "Transaction", "NID Wrong"];
const rowTwo = ["Police Clearance", "Challan Form"];

const fieldClass =
  "h-11 w-full rounded-lg border border-[#314864] bg-[#0e1828] px-3 text-sm text-white outline-none placeholder:text-[#7f93ab] [color-scheme:dark] focus:border-[#1e6fe3]";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function displayDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${Number(month)}/${Number(day)}/${year}`;
}

function letterDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

function formatTaka(value) {
  const number = value === "" || value == null || Number.isNaN(Number(value)) ? 0 : Number(value);
  return `৳${number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function flatEmi(amount, months, rate = 0.03) {
  const principal = Number(amount) || 0;
  const count = Number(months) || 0;
  if (!count) return 0;
  const interest = principal * rate * (count / 12);
  return Math.round(((principal + interest) / count) * 100) / 100;
}

const SMALL_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS_WORDS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function numberToWords(value) {
  let number = Math.floor(Math.abs(Number(value) || 0));
  if (number === 0) return "Zero";
  const chunk = (num) => {
    if (num < 20) return SMALL_WORDS[num];
    if (num < 100) return `${TENS_WORDS[Math.floor(num / 10)]}${num % 10 ? ` ${SMALL_WORDS[num % 10]}` : ""}`;
    return `${SMALL_WORDS[Math.floor(num / 100)]} Hundred${num % 100 ? ` ${chunk(num % 100)}` : ""}`;
  };
  const parts = [];
  [
    [1_000_000_000, "Billion"],
    [1_000_000, "Million"],
    [1000, "Thousand"],
  ].forEach(([scale, label]) => {
    if (number >= scale) {
      parts.push(`${chunk(Math.floor(number / scale))} ${label}`);
      number %= scale;
    }
  });
  if (number) parts.push(chunk(number));
  return parts.join(" ");
}

function receiptAmount(value) {
  const number = Number(value);
  if (value === "" || value == null || Number.isNaN(number)) return "";
  return Number.isInteger(number) ? `${number}/-` : `${number.toLocaleString("en-US")}/-`;
}

function drawMoneyReceipt(doc) {
  const canvas = document.createElement("canvas");
  canvas.width = 1480;
  canvas.height = 820;
  const ctx = canvas.getContext("2d");
  const teal = "#0d5c68";
  const orange = "#f39b12";
  const ink = "#143844";
  const name = doc.name?.trim() || "";
  const amount = receiptAmount(doc.amount);
  const words = doc.amount === "" || doc.amount == null ? "" : numberToWords(doc.amount);
  const serial = `AFB-${((doc.date || "").replace(/\D/g, "").slice(-4) || "0001").padStart(4, "0")}`;
  const account = doc.officer?.trim() || "SuperAdmin";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = teal;
  ctx.fillRect(0, 0, 214, 112);
  ctx.fillStyle = orange;
  ctx.fillRect(214, 0, canvas.width - 214, 54);

  ctx.fillStyle = ink;
  ctx.font = "800 64px Arial, Helvetica, sans-serif";
  ctx.fillText("MONEY RECEIPT", 250, 104);
  ctx.textAlign = "right";
  ctx.font = "800 30px Arial, Helvetica, sans-serif";
  ctx.fillText("INTERNAL RECEIPT", 1432, 86);
  ctx.font = "15px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#8a93a3";
  ctx.fillText("Customer account record", 1432, 112);
  ctx.textAlign = "left";

  ctx.fillStyle = ink;
  ctx.font = "700 24px Arial, Helvetica, sans-serif";
  ctx.fillText("LOAN ADMINISTRATION PORTAL", 48, 168);
  ctx.font = "700 22px Arial, Helvetica, sans-serif";
  ctx.fillText(`NO. ${serial}`, 48, 208);
  ctx.textAlign = "right";
  ctx.font = "700 22px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText(`Date  ${doc.date || ""}`, 1432, 208);
  ctx.textAlign = "left";

  ctx.fillStyle = orange;
  ctx.fillRect(0, 232, canvas.width, 14);

  linedField(ctx, "Received with thanks from", name, 48, 318, 1432);
  linedField(ctx, "Amount", amount, 48, 386, 1432);
  linedField(ctx, "In word", words, 48, 454, 1432);
  linedField(ctx, "For", "Loan Application", 48, 522, 900);
  linedField(ctx, "Branch", "Dhaka", 960, 522, 1432);

  ctx.font = "22px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText("ACCT.", 48, 598);
  ctx.font = "700 22px Arial, Helvetica, sans-serif";
  ctx.fillText(account, 142, 598);
  ctx.font = "22px Arial, Helvetica, sans-serif";
  ctx.fillText("PAID", 430, 598);
  ctx.font = "700 22px Arial, Helvetica, sans-serif";
  ctx.fillText(amount ? "Yes" : "No", 510, 598);

  ctx.font = "700 24px Arial, Helvetica, sans-serif";
  ctx.fillText("Amount=", 48, 676);
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(188, 644, 268, 46);

  ctx.save();
  ctx.translate(740, 410);
  ctx.rotate(-0.5);
  ctx.font = "700 72px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(214, 78, 78, 0.2)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("INTERNAL RECEIPT  •  SAMPLE", 0, 0);
  ctx.restore();

  drawRecordedStamp(ctx, 1304, 652, 76);

  ctx.fillStyle = orange;
  ctx.fillRect(0, 734, canvas.width, 28);
  ctx.fillStyle = teal;
  ctx.fillRect(0, 762, canvas.width, 58);
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SAMPLE / INTERNAL RECORD — NOT AN OFFICIAL BANK, GOVERNMENT, POLICE OR IDENTITY DOCUMENT", canvas.width / 2, 798);
  ctx.textAlign = "left";
  return canvas;
}

function linedField(ctx, label, value, x, y, lineEnd) {
  ctx.font = "22px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#222222";
  ctx.textAlign = "left";
  ctx.fillText(label, x, y);
  const start = x + ctx.measureText(label).width + 18;
  ctx.strokeStyle = "#b7bdc7";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(start, y + 8);
  ctx.lineTo(lineEnd, y + 8);
  ctx.stroke();
  ctx.font = "700 22px Arial, Helvetica, sans-serif";
  ctx.fillText(value, start + 14, y - 2);
}

function drawArcText(ctx, text, cx, cy, radius, start, end, outward) {
  const chars = [...text];
  chars.forEach((char, index) => {
    const angle = start + ((end - start) * index) / Math.max(chars.length - 1, 1);
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.rotate(angle + (outward ? Math.PI / 2 : -Math.PI / 2));
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });
}

function drawRecordedStamp(ctx, cx, cy, radius) {
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#178a3e";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#178a3e";
  ctx.font = "700 13px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawArcText(ctx, "SAMPLE  /  NOT OFFICIAL", cx, cy, radius - 28, -Math.PI * 0.84, -Math.PI * 0.16, true);
  drawArcText(ctx, "INTERNAL RECORD", cx, cy, radius - 28, Math.PI * 0.8, Math.PI * 0.2, false);
  ctx.font = "800 16px Arial, Helvetica, sans-serif";
  ctx.fillText("RECORDED", cx, cy + 1);
  ctx.restore();
}

function checkDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return "";
  return `${day} ${month} ${year}`;
}

function drawTracked(ctx, text, x, y, align, gap) {
  const chars = [...text];
  const widths = chars.map((char) => ctx.measureText(char).width);
  const total = widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(chars.length - 1, 0);
  let cursor = align === "right" ? x - total : align === "center" ? x - total / 2 : x;
  const previous = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((char, index) => {
    ctx.fillText(char, cursor, y);
    cursor += widths[index] + gap;
  });
  ctx.textAlign = previous;
}

function drawBankCheck(doc) {
  const canvas = document.createElement("canvas");
  canvas.width = 1560;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  const ink = "#0f3a88";
  const soft = "#6d86b3";
  const name = doc.name?.trim() || "";
  const words = doc.amount === "" || doc.amount == null ? "" : numberToWords(doc.amount);

  ctx.fillStyle = "#dbe8ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = ink;
  ctx.font = "700 36px Arial, Helvetica, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("LOAN ADMINISTRATION PORTAL", 58, 86);
  ctx.font = "600 16px Arial, Helvetica, sans-serif";
  ctx.fillStyle = soft;
  ctx.fillText("SAMPLE PAYMENT CHECK", 58, 114);

  ctx.fillStyle = ink;
  ctx.font = "700 30px Arial, Helvetica, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(checkDate(doc.date), 1502, 84);
  ctx.font = "600 15px Arial, Helvetica, sans-serif";
  ctx.fillStyle = soft;
  drawTracked(ctx, "DDMMYYYY", 1502, 114, "right", 3.2);

  ctx.textAlign = "left";
  ctx.fillStyle = ink;
  ctx.font = "600 18px Arial, Helvetica, sans-serif";
  ctx.fillText("PAY", 58, 196);
  ctx.font = "700 30px Arial, Helvetica, sans-serif";
  ctx.fillText(name, 128, 198);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(58, 216);
  ctx.lineTo(1502, 216);
  ctx.stroke();

  ctx.font = "600 18px Arial, Helvetica, sans-serif";
  ctx.fillText("SUM OF", 58, 278);
  ctx.font = "700 28px Arial, Helvetica, sans-serif";
  ctx.fillText(words, 168, 280);
  ctx.beginPath();
  ctx.moveTo(58, 300);
  ctx.lineTo(1088, 300);
  ctx.stroke();
  ctx.strokeRect(1148, 252, 354, 58);

  ctx.strokeRect(58, 392, 640, 86);
  ctx.beginPath();
  ctx.moveTo(1148, 470);
  ctx.lineTo(1502, 470);
  ctx.stroke();

  ctx.save();
  ctx.font = "700 52px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(146, 168, 204, 0.72)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SAMPLE   •   NOT NEGOTIABLE", 780, 360);
  ctx.restore();

  ctx.save();
  ctx.translate(780, 310);
  ctx.rotate(-0.46);
  ctx.font = "700 68px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(214, 92, 102, 0.24)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SAMPLE   •   NOT NEGOTIABLE", 0, 0);
  ctx.restore();

  ctx.fillStyle = "#7f97b8";
  ctx.font = "14px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("SAMPLE / INTERNAL RECORD — NOT AN OFFICIAL BANK, GOVERNMENT, POLICE OR IDENTITY DOCUMENT", 780, 568);
  ctx.textAlign = "left";
  return canvas;
}

function stampAmount(value) {
  if (value === "" || value == null) return "";
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  const formatted = Number.isInteger(number)
    ? number.toLocaleString("en-US")
    : number.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return `${formatted}/-`;
}

function drawSampleSeal(ctx, cx, cy, radius) {
  ctx.save();
  ctx.strokeStyle = "#d0121a";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#d0121a";
  ctx.font = "800 22px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SAMPLE", cx, cy - 6);
  ctx.font = "700 11px Arial, Helvetica, sans-serif";
  drawArcText(ctx, "SAMPLE • NOT VALID", cx, cy, radius - 28, Math.PI * 0.84, Math.PI * 0.16, false);
  ctx.restore();
}

function drawAgreementStamp(doc) {
  const canvas = document.createElement("canvas");
  canvas.width = 980;
  canvas.height = 1180;
  const ctx = canvas.getContext("2d");
  const green = "#207a4c";
  const name = doc.name?.trim() || "";
  const mobile = doc.mobile?.trim() || "";
  const father = doc.father?.trim() || "";
  const address = doc.address?.trim() || "";
  const tenure = doc.month ? `${doc.month} Month` : "";
  const rows = [
    ["Borrower:", name],
    ["Mobile:", mobile],
    ["Date:", doc.date || ""],
    ["Loan Amount:", stampAmount(doc.amount)],
    ["Tenure:", tenure],
    ["Monthly EMI:", stampAmount(doc.emi)],
    ["Father:", father],
    ["Address:", address],
  ];
  const notes = [
    "১. এই ডকুমেন্টটি শুধুমাত্র অভ্যন্তরীণ রেকর্ড ও গ্রাহক তথ্য যাচাইয়ের জন্য।",
    "২. ঋণের পরিমাণ, মেয়াদ ও কিস্তির তথ্য অ্যাপ্লিকেশন রেকর্ড অনুযায়ী প্রদর্শিত হয়েছে।",
    "৩. এটি কোনো সরকারি স্ট্যাম্প পেপার, নোটারি দলিল বা আইনগত সনদ নয়।",
    "৪. তথ্য ভুল থাকলে অ্যাডমিন প্যানেলে সংশোধন করতে হবে।",
  ];

  ctx.fillStyle = "#fffbea";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = green;
  ctx.lineWidth = 11;
  ctx.strokeRect(34, 26, 912, 438);
  ctx.fillStyle = green;
  ctx.font = "700 34px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("SAMPLE AGREEMENT STAMP", canvas.width / 2, 82);
  ctx.fillStyle = "#e7f0d6";
  ctx.fillRect(56, 108, 868, 328);

  ctx.fillStyle = green;
  ctx.font = "700 30px Arial, Helvetica, sans-serif";
  ctx.fillText("Internal Loan Agreement Summary", canvas.width / 2, 528);

  ctx.textAlign = "left";
  ctx.fillStyle = "#161616";
  rows.forEach((row, index) => {
    const y = 592 + index * 44;
    ctx.font = "700 22px Arial, Helvetica, sans-serif";
    ctx.fillText(row[0], 52, y);
    ctx.fillText(row[1], 248, y);
  });

  ctx.fillStyle = "#cfc8b8";
  ctx.font = "17px Nirmala UI, SolaimanLipi, Arial, sans-serif";
  notes.forEach((line, index) => {
    ctx.fillText(line, 52, 980 + index * 36);
  });

  ctx.save();
  ctx.translate(490, 780);
  ctx.rotate(-0.5);
  ctx.font = "700 58px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(214, 96, 104, 0.3)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SAMPLE AGREEMENT  •  NOT VALID", 0, 0);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(708, 556, 214, 268);
  ctx.strokeStyle = "#8ea0b0";
  ctx.lineWidth = 3;
  ctx.strokeRect(708, 556, 214, 268);
  drawSampleSeal(ctx, 815, 730, 74);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  return canvas;
}

function plainNumber(value) {
  if (value === "" || value == null) return "";
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  return Number.isInteger(number) ? number.toLocaleString("en-US") : number.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function drawInsuranceSeal(ctx, cx, cy, radius) {
  ctx.save();
  ctx.strokeStyle = "#1a56b0";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#1a56b0";
  ctx.font = "800 22px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SAMPLE", cx, cy - 6);
  ctx.font = "700 11px Arial, Helvetica, sans-serif";
  drawArcText(ctx, "SAMPLE • NOT VALID", cx, cy, radius - 28, Math.PI * 0.84, Math.PI * 0.16, false);
  ctx.restore();
}

function drawInsuranceForm(doc) {
  const canvas = document.createElement("canvas");
  canvas.width = 980;
  canvas.height = 1240;
  const ctx = canvas.getContext("2d");
  const navy = "#0d4a88";
  const ink = "#1b2430";
  const name = doc.name?.trim() || "";
  const rows = [
    ["পলিসি নম্বর:", "SAMPLE-000001"],
    ["গ্রাহীর নাম:", name],
    ["এনআইডি নম্বর:", doc.nid?.trim() || "—"],
    ["পিতার নাম:", doc.father?.trim() || ""],
    ["মাতার নাম:", doc.mother?.trim() || ""],
    ["মোবাইল:", doc.mobile?.trim() || ""],
    ["ঠিকানা:", doc.address?.trim() || ""],
    ["বীমা অংক:", plainNumber(doc.amount)],
    ["বীমা প্রিমিয়াম:", doc.fees === "" || doc.fees == null ? "" : `${plainNumber(doc.fees)} টাকা`],
    ["তারিখ:", doc.date || ""],
  ];
  const person = name || "গ্রাহক";

  ctx.fillStyle = "#dff4fa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = navy;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = "800 32px Arial, Helvetica, sans-serif";
  ctx.fillText("INTERNAL INSURANCE INFORMATION", canvas.width / 2, 92);
  ctx.font = "700 18px Arial, Helvetica, sans-serif";
  ctx.fillText("SAMPLE POLICY SUMMARY — NOT AN INSURANCE POLICY", canvas.width / 2, 128);
  ctx.font = "700 32px Nirmala UI, SolaimanLipi, Arial, sans-serif";
  ctx.fillText("বীমা পলিসি বিবরণী", canvas.width / 2, 196);

  ctx.textAlign = "left";
  ctx.fillStyle = ink;
  rows.forEach((row, index) => {
    const y = 268 + index * 46;
    ctx.font = "700 22px Nirmala UI, SolaimanLipi, Arial, sans-serif";
    ctx.fillText(row[0], 64, y);
    ctx.font = "22px Nirmala UI, Arial, sans-serif";
    ctx.fillText(row[1], 300, y);
  });

  ctx.font = "20px Nirmala UI, SolaimanLipi, Arial, sans-serif";
  ctx.fillStyle = ink;
  let noteY = drawWrapped(
    ctx,
    `${person}-এর জন্য এই তথ্যপত্রটি অ্যাপ্লিকেশন ডেটা থেকে প্রস্তুত করা হয়েছে। এটি শুধুমাত্র প্রশাসনিক তথ্য যাচাইয়ের উদ্দেশ্যে ব্যবহারযোগ্য।`,
    64,
    760,
    850,
    34,
    "20px Nirmala UI, SolaimanLipi, Arial, sans-serif",
    ink,
  );
  drawWrapped(
    ctx,
    "এই ডকুমেন্টটি কোনো বীমা কোম্পানির জারি করা পলিসি, কভারেজ সার্টিফিকেট বা দাবির নিশ্চয়তা নয়।",
    64,
    noteY + 64,
    850,
    34,
    "20px Nirmala UI, SolaimanLipi, Arial, sans-serif",
    ink,
  );

  ctx.save();
  ctx.translate(490, 700);
  ctx.rotate(-0.42);
  ctx.font = "700 58px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(214, 96, 104, 0.28)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("INSURANCE SAMPLE  •  NOT VALID", 0, 0);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(700, 236, 220, 340);
  ctx.strokeStyle = "#e3eaef";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(700, 236, 220, 340);
  drawInsuranceSeal(ctx, 810, 470, 74);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  return canvas;
}

function drawRecordedSeal(ctx, cx, cy, radius) {
  ctx.save();
  ctx.strokeStyle = "#1c8a3a";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#1c8a3a";
  ctx.font = "800 22px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RECORDED", cx, cy - 8);
  ctx.font = "700 12px Arial, Helvetica, sans-serif";
  drawArcText(ctx, "SAMPLE • NOT VALID", cx, cy, radius - 30, Math.PI * 0.82, Math.PI * 0.18, false);
  ctx.restore();
}

function drawTransactionReceipt(doc) {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1320;
  const ctx = canvas.getContext("2d");
  const navy = "#0e3f86";
  const ink = "#111111";
  const amount = plainNumber(doc.amount);
  const when = [doc.date || "", doc.txnTime || ""].filter(Boolean).join(" ");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = navy;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = "800 34px Arial, Helvetica, sans-serif";
  ctx.fillText("LOAN ADMINISTRATION PORTAL", 500, 78);
  ctx.font = "700 18px Arial, Helvetica, sans-serif";
  ctx.fillText("INTERNAL TRANSACTION RECEIPT", 500, 114);
  ctx.strokeStyle = navy;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(46, 146);
  ctx.lineTo(954, 146);
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.font = "800 26px Arial, Helvetica, sans-serif";
  ctx.fillText("TRANSACTION RECEIPT", 500, 268);

  ctx.save();
  ctx.translate(560, 700);
  ctx.rotate(-0.5);
  ctx.font = "700 48px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(214, 96, 104, 0.22)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("INTERNAL TRANSACTION  •  SAMPLE", 0, 0);
  ctx.restore();

  const x = 72;
  let y = 360;
  const row = (label, value) => {
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = ink;
    ctx.font = "700 28px Arial, Helvetica, sans-serif";
    ctx.fillText(label, x, y);
    ctx.fillText(value || "", x + ctx.measureText(label).width, y);
    y += 54;
  };
  const heading = (text) => {
    y += 10;
    ctx.font = "700 30px Arial, Helvetica, sans-serif";
    ctx.fillStyle = ink;
    ctx.textAlign = "left";
    ctx.fillText(text, x, y);
    const width = ctx.measureText(text).width;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + width, y + 8);
    ctx.stroke();
    y += 58;
  };

  row("Transaction Type:", doc.txnType?.trim() || "Online Order");
  row("Transaction ID:", " TX-000001");
  row("Date:", doc.date || "");
  heading("Sender Information");
  row("From Bank:", doc.fromBank?.trim() || "");
  row("From Account:", doc.fromAccount?.trim() || "");
  heading("Receiver Information");
  row("To Bank:", ` ${doc.toBank?.trim() || ""}`);
  row("To Account:", ` ${doc.toAccount?.trim() || ""}`);
  row("Account Name:", doc.accountName?.trim() || "");
  row("Amount:", amount);
  row("Depositor Name:", ` ${doc.officer?.trim() || "SuperAdmin"}`);
  row("Transaction Time:", ` ${when}`);

  drawRecordedSeal(ctx, 820, y - 70, 92);

  ctx.fillStyle = "#8b95a1";
  ctx.font = "14px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("SAMPLE / INTERNAL RECORD — NOT AN OFFICIAL BANK, GOVERNMENT, POLICE OR IDENTITY DOCUMENT", 500, 1276);
  return canvas;
}

function clockTime(value) {
  if (!value) return "";
  const [hourText, minute] = value.split(":");
  let hour = Number(hourText);
  if (Number.isNaN(hour) || minute == null) return value;
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${minute} ${suffix}`;
}

function drawCenteredLines(ctx, text, centerX, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  if (line) lines.push(line);
  lines.forEach((item, index) => ctx.fillText(item, centerX, y + index * lineHeight));
  return y + Math.max(lines.length - 1, 0) * lineHeight;
}

function drawNidWrong(doc) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1320;
  const ctx = canvas.getContext("2d");
  const ink = "#16181d";
  const name = doc.name?.trim() || "";
  const father = doc.father?.trim() || "";
  const mother = doc.mother?.trim() || "";
  const amount = plainNumber(doc.amount);
  const fee = plainNumber(doc.fees);
  const idNo = doc.idNo?.trim() || "";

  ctx.fillStyle = "#fffdf0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fffbe5";
  ctx.fillRect(0, 620, canvas.width, canvas.height - 620);

  ctx.fillStyle = ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = "800 64px Arial, Helvetica, sans-serif";
  ctx.fillText("THE", 72, 150);
  ctx.fillText("LOAN PORTAL", 72, 224);
  ctx.font = "800 34px Arial, Helvetica, sans-serif";
  ctx.fillText("BANGLADESH", 72, 276);

  ctx.save();
  ctx.translate(450, 640);
  ctx.rotate(-0.55);
  ctx.font = "700 54px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(214, 96, 104, 0.28)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SAMPLE CORRECTION NOTICE", 0, 0);
  ctx.restore();

  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = "700 28px Arial, Helvetica, sans-serif";
  ctx.fillText("[account.data.review@internal]", 450, 720);
  ctx.font = "700 24px Arial, Helvetica, sans-serif";
  ctx.fillText(`Time : ${clockTime(doc.txnTime)}`, 450, 768);
  ctx.font = "20px Arial, Helvetica, sans-serif";
  drawCenteredLines(
    ctx,
    `${name}, Father: ${father}, Mother: ${mother}`,
    450,
    816,
    820,
    30,
  );
  ctx.font = "700 24px Arial, Helvetica, sans-serif";
  ctx.fillText(`Loan amount: ${amount}${amount ? " taka" : ""}`, 450, 868);
  ctx.font = "20px Arial, Helvetica, sans-serif";
  drawCenteredLines(
    ctx,
    "Some account information requires correction before internal processing can continue.",
    450,
    916,
    820,
    30,
  );

  roundRect(ctx, 175, 990, 550, 78, 6);
  ctx.fillStyle = "#34a853";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 28px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`ID NO: ${idNo}`, 450, 1038);

  ctx.fillStyle = ink;
  ctx.font = "700 28px Arial, Helvetica, sans-serif";
  ctx.fillText(`Correction Fee (sample): ${fee}`, 450, 1128);
  ctx.font = "22px Arial, Helvetica, sans-serif";
  ctx.fillText("Internal review notice only", 450, 1168);

  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(0, 1224);
  ctx.lineTo(canvas.width, 1224);
  ctx.lineTo(canvas.width, canvas.height - 18);
  ctx.arcTo(canvas.width, canvas.height, canvas.width - 18, canvas.height, 18);
  ctx.lineTo(18, canvas.height);
  ctx.arcTo(0, canvas.height, 0, canvas.height - 18, 18);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "15px Arial, Helvetica, sans-serif";
  ctx.fillText("SAMPLE / NOT A PAYMENT DEMAND / INTERNAL USE ONLY", 450, 1264);
  ctx.fillStyle = "#d7d7d7";
  ctx.font = "12px Arial, Helvetica, sans-serif";
  ctx.fillText("SAMPLE / INTERNAL RECORD — NOT AN OFFICIAL BANK, GOVERNMENT, POLICE OR IDENTITY DOCUMENT", 450, 1290);
  ctx.textAlign = "left";
  return canvas;
}

function drawNotPoliceSeal(ctx, cx, cy, radius) {
  ctx.save();
  ctx.strokeStyle = "#d0121a";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#d0121a";
  ctx.font = "800 22px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NOT POLICE", cx, cy - 8);
  ctx.font = "700 12px Arial, Helvetica, sans-serif";
  drawArcText(ctx, "SAMPLE • NOT VALID", cx, cy, radius - 30, Math.PI * 0.82, Math.PI * 0.18, false);
  ctx.restore();
}

function drawPoliceClearance(doc) {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1414;
  const ctx = canvas.getContext("2d");
  const ink = "#1a1a1a";
  const blue = "#2a35c8";
  const name = doc.name?.trim() || "";
  const father = doc.father?.trim() || "";
  const dob = doc.dob?.trim() || "";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = "600 28px Arial, Helvetica, sans-serif";
  drawTracked(ctx, "INTERNAL CUSTOMER VERIFICATION SUMMARY", 500, 168, "center", 1.4);
  ctx.font = "700 22px Arial, Helvetica, sans-serif";
  ctx.fillText("DMP POLICE STATION", 500, 214);
  ctx.fillText("DHAKA METROPOLITAN POLICE", 500, 248);

  ctx.textAlign = "left";
  ctx.font = "700 20px Arial, Helvetica, sans-serif";
  ctx.fillText("REPORT NO: 00000", 78, 340);
  ctx.textAlign = "right";
  ctx.fillText(`DATE: ${doc.date || ""}`, 922, 340);

  ctx.textAlign = "center";
  ctx.fillStyle = blue;
  ctx.font = "700 30px Arial, Helvetica, sans-serif";
  ctx.fillText("BACKGROUND REVIEW SUMMARY", 500, 430);
  const titleWidth = ctx.measureText("BACKGROUND REVIEW SUMMARY").width;
  ctx.strokeStyle = blue;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(500 - titleWidth / 2, 442);
  ctx.lineTo(500 + titleWidth / 2, 442);
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.textAlign = "left";
  let y = drawWrapped(
    ctx,
    `Account information reviewed for ${name} [DOB: ${dob}]. Father name: ${father}.`,
    78,
    520,
    844,
    36,
    "22px Arial, Helvetica, sans-serif",
    ink,
  );
  drawWrapped(
    ctx,
    "This page records an internal administrative review only. It is not a police clearance certificate, criminal record check, government verification, or document issued by any police authority.",
    78,
    y + 64,
    844,
    36,
    "22px Arial, Helvetica, sans-serif",
    ink,
  );

  ctx.save();
  ctx.translate(500, 760);
  ctx.rotate(-0.55);
  ctx.font = "700 64px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(214, 96, 104, 0.22)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NOT A POLICE CLEARANCE", 0, 0);
  ctx.restore();

  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(78, 1048);
  ctx.lineTo(360, 1048);
  ctx.moveTo(640, 1048);
  ctx.lineTo(922, 1048);
  ctx.stroke();
  ctx.fillStyle = ink;
  ctx.font = "700 16px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("ADMIN SIGNATURE", 219, 1080);
  ctx.fillText("REVIEWER", 781, 1080);
  drawNotPoliceSeal(ctx, 790, 980, 86);

  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.6;
  ctx.strokeRect(78, 1168, 844, 78);
  ctx.fillStyle = "#5d6b82";
  ctx.font = "15px Arial, Helvetica, sans-serif";
  ctx.fillText("SAMPLE / INTERNAL RECORD — NOT AN OFFICIAL BANK, GOVERNMENT, POLICE OR IDENTITY DOCUMENT", 500, 1288);
  ctx.textAlign = "left";
  return canvas;
}

const BN_ONES = ["", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়"];
const BN_TEENS = ["দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোল", "সতেরো", "আঠারো", "উনিশ"];
const BN_TENS = {
  20: "বিশ", 21: "একুশ", 22: "বাইশ", 23: "তেইশ", 24: "চব্বিশ", 25: "পঁচিশ", 26: "ছাব্বিশ", 27: "সাতাশ", 28: "আটাশ", 29: "ঊনত্রিশ",
  30: "ত্রিশ", 31: "একত্রিশ", 32: "বত্রিশ", 33: "তেত্রিশ", 34: "চৌত্রিশ", 35: "পঁয়ত্রিশ", 36: "ছত্রিশ", 37: "সাঁইত্রিশ", 38: "আটত্রিশ", 39: "ঊনচল্লিশ",
  40: "চল্লিশ", 41: "একচল্লিশ", 42: "বিয়াল্লিশ", 43: "তেতাল্লিশ", 44: "চুয়াল্লিশ", 45: "পঁয়তাল্লিশ", 46: "ছেচল্লিশ", 47: "সাতচল্লিশ", 48: "আটচল্লিশ", 49: "ঊনপঞ্চাশ",
  50: "পঞ্চাশ", 51: "একান্ন", 52: "বাহান্ন", 53: "তিপ্পান্ন", 54: "চুয়ান্ন", 55: "পঞ্চান্ন", 56: "ছাপ্পান্ন", 57: "সাতান্ন", 58: "আটান্ন", 59: "ঊনষাট",
  60: "ষাট", 61: "একষট্টি", 62: "বাষট্টি", 63: "তেষট্টি", 64: "চৌষট্টি", 65: "পঁয়ষট্টি", 66: "ছেষট্টি", 67: "সাতষট্টি", 68: "আটষট্টি", 69: "ঊনসত্তর",
  70: "সত্তর", 71: "একাত্তর", 72: "বাহাত্তর", 73: "তিয়াত্তর", 74: "চুয়াত্তর", 75: "পঁচাত্তর", 76: "ছিয়াত্তর", 77: "সাতাত্তর", 78: "আটাত্তর", 79: "ঊনআশি",
  80: "আশি", 81: "একাশি", 82: "বিরাশি", 83: "তিরাশি", 84: "চুরাশি", 85: "পঁচাশি", 86: "ছিয়াশি", 87: "সাতাশি", 88: "আটাশি", 89: "ঊননব্বই",
  90: "নব্বই", 91: "একানব্বই", 92: "বিরানব্বই", 93: "তিরানব্বই", 94: "চুরানব্বই", 95: "পঁচানব্বই", 96: "ছিয়ানব্বই", 97: "সাতানব্বই", 98: "আটানব্বই", 99: "নিরানব্বই",
};

function bnDigits(value) {
  return String(value).replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[digit]);
}

function bnUnder100(number) {
  if (number < 10) return BN_ONES[number] || "শূন্য";
  if (number < 20) return BN_TEENS[number - 10];
  return BN_TENS[number] || "";
}

function bnWords(value) {
  let number = Math.floor(Math.abs(Number(value) || 0));
  if (!number) return "";
  const parts = [];
  if (number >= 10000000) {
    parts.push(`${bnUnder100(Math.floor(number / 10000000))} কোটি`);
    number %= 10000000;
  }
  if (number >= 100000) {
    parts.push(`${bnUnder100(Math.floor(number / 100000))} লক্ষ`);
    number %= 100000;
  }
  if (number >= 1000) {
    parts.push(`${bnUnder100(Math.floor(number / 1000))} হাজার`);
    number %= 1000;
  }
  if (number >= 100) {
    parts.push(`${BN_ONES[Math.floor(number / 100)]} শত`);
    number %= 100;
  }
  if (number) parts.push(bnUnder100(number));
  return parts.join(" ");
}

function drawChallanForm(doc) {
  const canvas = document.createElement("canvas");
  canvas.width = 1500;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  const ink = "#111111";
  const font = "Nirmala UI, SolaimanLipi, Arial, sans-serif";
  const name = doc.name?.trim() || "";
  const branch = doc.branch?.trim() || "";
  const hasAmount = doc.amount !== "" && doc.amount != null && !Number.isNaN(Number(doc.amount));
  const amount = hasAmount ? Math.floor(Math.abs(Number(doc.amount))) : "";
  const amountText = hasAmount ? `${bnDigits(amount)}/-` : "";
  const words = hasAmount ? `${bnWords(amount)} টাকা মাত্র` : "";
  const dateText = bnDigits(doc.date || "");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = ink;
  ctx.textBaseline = "alphabetic";

  ctx.textAlign = "center";
  ctx.font = `800 42px ${font}`;
  ctx.fillText("চালান ফরম", 750, 58);
  ctx.font = `700 20px ${font}`;
  ctx.fillText("অভ্যন্তরীণ হিসাব রেকর্ড / SAMPLE", 750, 92);
  ctx.font = `700 18px ${font}`;
  ctx.fillText("সরকারি চালান নয় • NOT A GOVERNMENT CHALLAN", 750, 120);

  ctx.textAlign = "left";
  ctx.font = `20px ${font}`;
  ctx.fillText("চালান নং :  গ-০০০০০১", 48, 168);
  ctx.fillText(`তারিখ :  ${dateText}`, 48, 202);
  ctx.fillText("ব্যাংক/হিসাব বিভাগ", 48, 248);

  ["১ম (মূল) কপি", "২য় কপি", "৩য় কপি"].forEach((label, index) => {
    const x = 1048 + index * 142;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.4;
    ctx.strokeRect(x, 146, 130, 52);
    ctx.font = `18px ${font}`;
    ctx.textAlign = "center";
    ctx.fillText(label, x + 65, 178);
  });

  ctx.textAlign = "left";
  ctx.font = `18px ${font}`;
  ctx.fillText("শাখা/ঠিকানা", 620, 248);
  ctx.font = `700 18px ${font}`;
  ctx.fillText(branch, 760, 248);
  ctx.font = `18px ${font}`;
  ctx.textAlign = "right";
  ctx.fillText("অভ্যন্তরীণ ঋণ হিসাবের চালান", 1452, 248);

  ctx.textAlign = "left";
  ctx.font = `18px ${font}`;
  ctx.fillText("কোড নং :", 48, 300);
  for (let index = 0; index < 13; index += 1) {
    const x = 160 + index * 34 + Math.floor(index / 4) * 10;
    ctx.strokeRect(x, 278, 28, 30);
    ctx.font = `16px ${font}`;
    ctx.textAlign = "center";
    ctx.fillText("০", x + 14, 300);
  }

  const tableX = 40;
  const tableY = 330;
  const colWidths = [190, 280, 250, 240, 150, 100, 210];
  const headTop = 34;
  const headSub = 86;
  const bodyH = 210;
  const totalH = 58;
  const tableW = colWidths.reduce((sum, width) => sum + width, 0);
  const colX = [tableX];
  colWidths.forEach((width) => colX.push(colX[colX.length - 1] + width));

  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.3;
  ctx.strokeRect(tableX, tableY, tableW, headTop + headSub + bodyH + totalH);
  ctx.beginPath();
  ctx.moveTo(tableX, tableY + headTop);
  ctx.lineTo(colX[4], tableY + headTop);
  ctx.moveTo(colX[4], tableY + headTop);
  ctx.lineTo(colX[6], tableY + headTop);
  ctx.moveTo(tableX, tableY + headTop + headSub);
  ctx.lineTo(tableX + tableW, tableY + headTop + headSub);
  ctx.moveTo(tableX, tableY + headTop + headSub + bodyH);
  ctx.lineTo(tableX + tableW, tableY + headTop + headSub + bodyH);
  colX.slice(1, -1).forEach((x) => {
    ctx.moveTo(x, tableY + (x >= colX[6] ? 0 : headTop));
    ctx.lineTo(x, tableY + headTop + headSub + bodyH + totalH);
  });
  ctx.moveTo(colX[6], tableY);
  ctx.lineTo(colX[6], tableY + headTop + headSub + bodyH + totalH);
  ctx.stroke();

  const headers = [
    "আদায়কারক দপ্তর হইতে আদায় নাম ও ঠিকানা",
    "যে ব্যক্তি/প্রতিষ্ঠানের পক্ষ হইতে টাকা প্রদান হইবে তাহার নাম, পদবী ও ঠিকানা",
    "কি বাবদ জমা দেওয়া হইল আদায় বিবরণ",
    "মূল ও নোটের বিবরণ / ড্রাফট, চেক ইত্যাদি",
    "টাকা",
    "পয়সা",
  ];
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.font = `700 16px ${font}`;
  ctx.fillText("জমা প্রদানকারী কর্তৃক পূরণ করিতে হইবে", (tableX + colX[4]) / 2, tableY + 23);
  ctx.fillText("টাকার অংক", (colX[4] + colX[6]) / 2, tableY + 23);
  ctx.textAlign = "left";
  drawWrapped(ctx, "বিভাগ/অফিস এবং চালানের রেকর্ড/স্বাক্ষর এলাকা", colX[6] + 12, tableY + 36, colWidths[6] - 24, 20, `14px ${font}`, ink);
  headers.forEach((header, index) => {
    ctx.textAlign = "left";
    drawWrapped(ctx, header, colX[index] + 8, tableY + headTop + 24, colWidths[index] - 16, 18, `13px ${font}`, ink);
  });

  const values = [branch, name, "ঋণ আবেদন সংক্রান্ত", "ব্যাংক/হিসাব", amountText, hasAmount ? "—" : ""];
  ctx.font = `20px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  values.forEach((value, index) => {
    ctx.fillText(value, colX[index] + colWidths[index] / 2, tableY + headTop + headSub + bodyH / 2);
  });
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 18px ${font}`;
  ctx.fillText("মোট টাকা", colX[3] + colWidths[3] / 2, tableY + headTop + headSub + bodyH + 36);
  ctx.font = `20px ${font}`;
  ctx.fillText(amountText, colX[4] + colWidths[4] / 2, tableY + headTop + headSub + bodyH + 36);
  ctx.fillText(hasAmount ? "—" : "", colX[5] + colWidths[5] / 2, tableY + headTop + headSub + bodyH + 36);

  ctx.save();
  ctx.translate(760, 620);
  ctx.rotate(-0.42);
  ctx.font = `700 46px ${font}`;
  ctx.fillStyle = "rgba(214, 96, 104, 0.24)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("SAMPLE  •  NOT A GOVERNMENT CHALLAN", 0, 0);
  ctx.restore();

  drawSampleSeal(ctx, colX[6] + colWidths[6] / 2, tableY + headTop + headSub + bodyH - 20, 62);

  const infoY = tableY + headTop + headSub + bodyH + totalH + 48;
  ctx.fillStyle = ink;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `20px ${font}`;
  ctx.fillText("টাকা (কথায়) :", 48, infoY);
  ctx.font = `700 20px ${font}`;
  ctx.fillText(words, 210, infoY);
  ctx.font = `20px ${font}`;
  ctx.fillText("টাকা পাওয়া গেল :", 48, infoY + 40);
  ctx.beginPath();
  ctx.moveTo(230, infoY + 46);
  ctx.lineTo(620, infoY + 46);
  ctx.stroke();
  ctx.fillText(`তারিখ :  ${dateText}`, 48, infoY + 82);
  ctx.font = `16px ${font}`;
  ctx.fillText("(নোট) ১) সঠিক তথ্য ও ঘোষণাপত্র নম্বর যাচাই করে রেকর্ড সংরক্ষণ করুন।", 48, infoY + 128);
  ctx.fillText("২) প্রয়োজনীয় অনুমোদন ও যাচাই কেবল অভ্যন্তরীণ প্রশাসনিক প্রক্রিয়া অনুসারী প্রযোজ্য।", 108, infoY + 156);

  ctx.textAlign = "center";
  ctx.font = `700 16px ${font}`;
  ctx.fillText("SAMPLE / INTERNAL USE ONLY — NOT VALID FOR GOVERNMENT OR BANK PAYMENT", 750, 1024);
  ctx.font = `15px ${font}`;
  ctx.fillStyle = "#444444";
  ctx.fillText("Generated from selected loan application record", 750, 1052);
  ctx.textAlign = "left";
  return canvas;
}

function renderCanvas(doc) {
  if (doc.type === "Money Receipt") return drawMoneyReceipt(doc);
  if (doc.type === "Bank Check") return drawBankCheck(doc);
  if (doc.type === "Agreement Stamp") return drawAgreementStamp(doc);
  if (doc.type === "Insurance Form") return drawInsuranceForm(doc);
  if (doc.type === "Transaction") return drawTransactionReceipt(doc);
  if (doc.type === "NID Wrong") return drawNidWrong(doc);
  if (doc.type === "Police Clearance") return drawPoliceClearance(doc);
  if (doc.type === "Challan Form") return drawChallanForm(doc);
  return drawLetter(buildLetter(doc));
}

function buildLetter(doc) {
  const person = doc.name?.trim() || "Customer";
  const months = doc.month || "12";
  const emi = doc.emi === "" || doc.emi == null ? flatEmi(doc.amount, months) : Number(doc.emi);
  return {
    title: (doc.type || "Approval Letter").toUpperCase(),
    name: person,
    reference: `APP/MANUAL/${(doc.date || "").replace(/-/g, "")}`,
    subject: doc.type === "Approval Letter" ? "Approval for loan application" : `Internal summary — ${doc.type}`,
    amount: formatTaka(doc.amount),
    date: letterDate(doc.date),
    purpose: "Personal Loan",
    interest: "3.00% per annum",
    tenure: `${months} Month`,
    emi: formatTaka(emi),
    fee: formatTaka(doc.fees),
    officer: doc.officer?.trim() || "SuperAdmin",
    badge: doc.type === "Approval Letter" ? "INTERNAL APPROVAL" : "INTERNAL RECORD",
    greeting: `Dear ${person},`,
    body: `This internal letter records the loan approval information entered in the administration portal for ${person}. It is provided as a customer-facing account summary and does not represent a document issued by any external bank, government body, or international institution.`,
  };
}

function drawLetter(letter) {
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1414;
  const ctx = canvas.getContext("2d");
  const left = 78;
  const right = 922;
  const width = right - left;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111111";
  ctx.textBaseline = "alphabetic";

  centerText(ctx, "LOAN ADMINISTRATION PORTAL", 86, "700 28px Arial, Helvetica, sans-serif", "#111111", 1.6);
  centerText(ctx, "Internal lending approval summary", 118, "16px Arial, Helvetica, sans-serif", "#666666");
  ctx.strokeStyle = "#111111";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(left, 142);
  ctx.lineTo(right, 142);
  ctx.stroke();

  ctx.font = "700 26px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#222222";
  const titleWidth = ctx.measureText(letter.title).width;
  const titleX = (canvas.width - titleWidth) / 2;
  ctx.fillText(letter.title, titleX, 196);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(titleX, 206);
  ctx.lineTo(titleX + titleWidth, 206);
  ctx.stroke();

  ctx.font = "18px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#222222";
  const meta = [
    `Name: ${letter.name}`,
    `Reference: ${letter.reference}`,
    `Subject: ${letter.subject}`,
    `Loan Amount: ${letter.amount}`,
    `Date: ${letter.date}`,
  ];
  meta.forEach((line, index) => ctx.fillText(line, left, 258 + index * 32));

  ctx.font = "18px Arial, Helvetica, sans-serif";
  ctx.fillText(letter.greeting, left, 448);
  let y = drawWrapped(ctx, letter.body, left, 492, width, 28, "18px Arial, Helvetica, sans-serif", "#222222");

  y += 28;
  y = sectionTitle(ctx, "Loan details:", left, y);
  y += 8;
  const details = [
    ["Loan Amount:", letter.amount],
    ["Loan Purpose:", letter.purpose],
    ["Interest Rate:", letter.interest],
    ["Loan Tenure:", letter.tenure],
    ["Monthly EMI:", letter.emi],
    ["Processing Fee:", letter.fee],
  ];
  details.forEach(([label, value]) => {
    y += 30;
    ctx.font = "18px Arial, Helvetica, sans-serif";
    ctx.fillStyle = "#222222";
    ctx.fillText("•", left, y);
    ctx.fillText(label, left + 28, y);
    ctx.fillText(value, left + 250, y);
  });

  y += 46;
  y = sectionTitle(ctx, "Conditions of approval:", left, y);
  const conditions = [
    "Information should be reviewed by the customer before acceptance.",
    "Repayment dates and disbursement details follow the account record.",
    "Any discrepancy should be reported through the service portal.",
  ];
  conditions.forEach((item) => {
    y += 32;
    ctx.font = "18px Arial, Helvetica, sans-serif";
    ctx.fillStyle = "#222222";
    ctx.fillText("•", left, y);
    drawWrapped(ctx, item, left + 28, y, width - 28, 26, "18px Arial, Helvetica, sans-serif", "#222222");
  });

  y += 70;
  ctx.fillStyle = "#666666";
  ctx.font = "16px Arial, Helvetica, sans-serif";
  ctx.fillText("Authorized by", left, y);
  ctx.fillStyle = "#111111";
  ctx.font = "700 22px Arial, Helvetica, sans-serif";
  ctx.fillText(letter.officer, left, y + 32);
  ctx.fillStyle = "#6b7280";
  ctx.font = "15px Arial, Helvetica, sans-serif";
  ctx.fillText("Internal Loan Administration", left, y + 58);
  drawBadge(ctx, letter.badge, right, y + 18);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 + 40);
  ctx.rotate(-0.55);
  ctx.font = "700 54px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "rgba(210, 70, 70, 0.16)";
  ctx.textAlign = "center";
  ctx.fillText("SAMPLE / INTERNAL USE ONLY", 0, 0);
  ctx.restore();

  ctx.strokeStyle = "#d0d0d0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(left, 1328);
  ctx.lineTo(right, 1328);
  ctx.stroke();
  centerText(
    ctx,
    "SAMPLE / INTERNAL RECORD — NOT AN OFFICIAL BANK, GOVERNMENT, POLICE OR IDENTITY DOCUMENT",
    1362,
    "13px Arial, Helvetica, sans-serif",
    "#8a8a8a",
  );
  return canvas;
}

function centerText(ctx, text, y, font, color, spacing = 0) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "left";
  if (!spacing) {
    const width = ctx.measureText(text).width;
    ctx.fillText(text, (1000 - width) / 2, y);
    return;
  }
  const widths = [...text].map((char) => ctx.measureText(char).width);
  const total = widths.reduce((sum, item) => sum + item, 0) + spacing * (text.length - 1);
  let x = (1000 - total) / 2;
  [...text].forEach((char, index) => {
    ctx.fillText(char, x, y);
    x += widths[index] + spacing;
  });
}

function sectionTitle(ctx, text, x, y) {
  ctx.font = "18px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#222222";
  ctx.fillText(text, x, y);
  const width = ctx.measureText(text).width;
  ctx.strokeStyle = "#222222";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + 6);
  ctx.lineTo(x + width, y + 6);
  ctx.stroke();
  return y;
}

function drawWrapped(ctx, text, x, y, maxWidth, lineHeight, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;
  const words = text.split(" ");
  let line = "";
  let cursor = y;
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = next;
    }
  });
  if (line) ctx.fillText(line, x, cursor);
  return cursor;
}

function drawBadge(ctx, label, right, y) {
  ctx.font = "700 15px Arial, Helvetica, sans-serif";
  const textWidth = ctx.measureText(label).width;
  const width = textWidth + 36;
  const height = 40;
  const x = right - width;
  const top = y - 26;
  roundRect(ctx, x, top, width, height, 20);
  ctx.fillStyle = "#f4fbf6";
  ctx.fill();
  ctx.strokeStyle = "#3caf6e";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#1e9a48";
  ctx.fillText(label, x + 18, y);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export default function Document() {
  const navigate = useNavigate();
  const [type, setType] = useState("Approval Letter");
  const [date, setDate] = useState("2026-10-16");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("12");
  const [emi, setEmi] = useState("");
  const [fees, setFees] = useState("");
  const [officer, setOfficer] = useState("SuperAdmin");
  const [mobile, setMobile] = useState("");
  const [father, setFather] = useState("");
  const [mother, setMother] = useState("");
  const [address, setAddress] = useState("");
  const [nid, setNid] = useState("");
  const [fromBank, setFromBank] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toBank, setToBank] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [txnTime, setTxnTime] = useState("");
  const [idNo, setIdNo] = useState("");
  const [dob, setDob] = useState("");
  const [branch, setBranch] = useState("");
  const [preview, setPreview] = useState(null);
  const previewRef = useRef(null);
  const documentData = useMemo(
    () => ({ type, date, name, amount, month, emi, fees, officer, mobile, father, mother, address, nid, fromBank, fromAccount, toBank, toAccount, accountName, txnTime, idNo, dob, branch }),
    [type, date, name, amount, month, emi, fees, officer, mobile, father, mother, address, nid, fromBank, fromAccount, toBank, toAccount, accountName, txnTime, idNo, dob, branch],
  );
  const previewUrl = useMemo(() => (preview ? renderCanvas(preview).toDataURL("image/png") : ""), [preview]);

  function generate(event) {
    event.preventDefault();
    setPreview({ ...documentData });
    window.setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function clearForm() {
    setDate("2026-10-16");
    setName("");
    setAmount("");
    setMonth("12");
    setEmi("");
    setFees("");
    setOfficer("SuperAdmin");
    setMobile("");
    setFather("");
    setMother("");
    setAddress("");
    setNid("");
    setFromBank("");
    setFromAccount("");
    setToBank("");
    setToAccount("");
    setAccountName("");
    setTxnTime("");
    setIdNo("");
    setDob("");
    setBranch("");
    setPreview(null);
  }

  function downloadImage() {
    if (!previewUrl) return;
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = `${(preview.type || "document").toLowerCase().replace(/ /g, "-")}.png`;
    link.click();
    clearForm();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#314864] bg-[#152238] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#1b2d46]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 6 9 12l6 6" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold tracking-[-0.02em] text-white sm:text-[22px]">Document Generator</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        {rowOne.map((item) => (
          <Tab key={item} active={type === item} onClick={() => setType(item)}>
            {item}
          </Tab>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {rowTwo.map((item) => (
          <Tab key={item} active={type === item} onClick={() => setType(item)}>
            {item}
          </Tab>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-2">
        <section ref={previewRef} className="flex flex-col rounded-2xl border border-[#2a3d58] bg-[#121c2f] p-5">
          <h2 className="text-[22px] font-bold">Document Preview</h2>
          <div
            className={`mt-4 min-h-[360px] flex-1 overflow-auto rounded-xl border border-[#314864] ${
              preview ? "bg-[#e6e9ee] p-4" : "flex items-center justify-center bg-[#0e1828] px-6"
            }`}
          >
            {preview ? (
              <img
                src={previewUrl}
                alt={`${preview.type} preview`}
                className={`mx-auto h-auto bg-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] ${
                  preview.type === "Money Receipt" || preview.type === "Bank Check" || preview.type === "Challan Form" ? "w-full" : "w-full max-w-[720px]"
                }`}
              />
            ) : (
              <p className="text-center text-sm text-[#8ea3bb]">Your generated document will appear here.</p>
            )}
          </div>
          <button
            type="button"
            onClick={downloadImage}
            disabled={!preview}
            className="mt-4 h-12 w-full rounded-lg bg-gradient-to-r from-[#3b6fd4] to-[#7a45d6] text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download Image
          </button>
        </section>

        <section className="rounded-2xl border border-[#2a3d58] bg-[#121c2f] p-5">
          <h2 className="text-[22px] font-bold">Document Details</h2>
          <form onSubmit={generate} className="mt-4 space-y-3">
            <label className="relative block">
              <input
                value={displayDate(date)}
                readOnly
                aria-label="Date"
                className={`${fieldClass} pr-10`}
              />
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Choose date"
              />
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aafc6]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="4" y="5" width="16" height="15" rx="2" />
                <path strokeLinecap="round" d="M8 3.5v3M16 3.5v3M4 10h16" />
              </svg>
            </label>
            {type === "Transaction" ? (
              <>
                <input value={fromBank} onChange={(event) => setFromBank(event.target.value)} placeholder="From Bank" aria-label="From Bank" className={fieldClass} />
                <input value={fromAccount} onChange={(event) => setFromAccount(event.target.value)} placeholder="From Account" aria-label="From Account" className={fieldClass} />
                <input value={toBank} onChange={(event) => setToBank(event.target.value)} placeholder="To Bank" aria-label="To Bank" className={fieldClass} />
                <input value={toAccount} onChange={(event) => setToAccount(event.target.value)} placeholder="To Account" aria-label="To Account" className={fieldClass} />
                <input value={accountName} onChange={(event) => setAccountName(event.target.value)} placeholder="Account Name" aria-label="Account Name" className={fieldClass} />
              </>
            ) : (
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" aria-label="Name" className={fieldClass} />
            )}
            {type === "Police Clearance" && (
              <input value={dob} onChange={(event) => setDob(event.target.value)} placeholder="DOB" aria-label="DOB" className={fieldClass} />
            )}
            {type === "Challan Form" && (
              <input value={branch} onChange={(event) => setBranch(event.target.value)} placeholder="Branch" aria-label="Branch" className={fieldClass} />
            )}
            {(type === "Agreement Stamp" || type === "Insurance Form") && (
              <input value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="Mobile" aria-label="Mobile" className={fieldClass} />
            )}
            {type === "Insurance Form" && (
              <input value={nid} onChange={(event) => setNid(event.target.value)} placeholder="NID" aria-label="NID" className={fieldClass} />
            )}
            {type !== "Police Clearance" && (
              <input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0" step="1" placeholder={type === "Insurance Form" ? "Insurance Amount" : type === "Transaction" ? "Amount" : "Loan Amount"} aria-label="Loan Amount" className={fieldClass} />
            )}
            {type === "NID Wrong" && (
              <input value={idNo} onChange={(event) => setIdNo(event.target.value)} placeholder="ID No" aria-label="ID No" className={fieldClass} />
            )}
            {type !== "Transaction" && type !== "NID Wrong" && type !== "Police Clearance" && type !== "Challan Form" && (
              <>
                <input value={month} onChange={(event) => setMonth(event.target.value)} type="number" min="0" step="1" placeholder="Month" aria-label="Month" className={fieldClass} />
                <input value={emi} onChange={(event) => setEmi(event.target.value)} type="number" min="0" step="1" placeholder="Monthly EMI" aria-label="Monthly EMI" className={fieldClass} />
              </>
            )}
            {(type === "Agreement Stamp" || type === "Insurance Form" || type === "NID Wrong" || type === "Police Clearance") && (
              <>
                <input value={father} onChange={(event) => setFather(event.target.value)} placeholder="Father" aria-label="Father" className={fieldClass} />
                {(type === "Insurance Form" || type === "NID Wrong") && (
                  <input value={mother} onChange={(event) => setMother(event.target.value)} placeholder="Mother" aria-label="Mother" className={fieldClass} />
                )}
                {type !== "NID Wrong" && type !== "Police Clearance" && (
                  <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Address" aria-label="Address" className={fieldClass} />
                )}
              </>
            )}
            {type !== "Transaction" && type !== "Police Clearance" && type !== "Challan Form" && (
              <input value={fees} onChange={(event) => setFees(event.target.value)} type="number" min="0" step="1" placeholder={type === "Insurance Form" ? "Premium" : type === "NID Wrong" ? "Correction Fee" : "Processing Fees"} aria-label="Processing Fees" className={fieldClass} />
            )}
            {(type === "Transaction" || type === "NID Wrong") && (
              <input value={txnTime} onChange={(event) => setTxnTime(event.target.value)} type="time" aria-label="Transaction Time" className={fieldClass} />
            )}
            {type !== "NID Wrong" && type !== "Police Clearance" && type !== "Challan Form" && (
              <input value={officer} onChange={(event) => setOfficer(event.target.value)} placeholder={type === "Transaction" ? "Depositor Name" : "SuperAdmin"} aria-label="Prepared by" className={fieldClass} />
            )}
            <button type="submit" className="h-12 w-full rounded-lg bg-[#1e6fe3] text-sm font-semibold text-white transition hover:bg-[#185fc7]">
              Generate Document
            </button>
          </form>
          <p className="mt-3 text-[12px] leading-5 text-[#8ea3bb]">
            Generated files are internal customer records. Bank Check and NID outputs are non-negotiable/reference summaries and are not official bank, government, police, or identity documents.
          </p>
        </section>
      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3.5 py-2 text-[13px] font-medium transition ${
        active ? "border-[#3b82f6] bg-[#163056] text-white" : "border-[#314864] bg-[#152238] text-white hover:bg-[#1b2d46]"
      }`}
    >
      {children}
    </button>
  );
}

