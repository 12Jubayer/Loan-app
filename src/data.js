const borrowers = [
  ["JOYNODDIN", "01997822950"],
  ["MD JAHIRUL ISLAM", "01301432915"],
  ["KARIM AHMED", "01822334455"],
  ["NUSRAT JAHAN", "01633445566"],
  ["SOHEL RANA", "01744556677"],
  ["AYESHA AKTER", "01955667788"],
  ["FARHAN HOSSAIN", "01366778899"],
  ["MITU RAHMAN", "01877889900"],
  ["HASAN MAHMUD", "01788990011"],
  ["RUPA KHATUN", "01699001122"],
  ["IMRAN KHAN", "01910112233"],
  ["SADIA ISLAM", "01321223344"],
  ["TANVIR CHOWDHURY", "01832334455"],
  ["LIMA BEGUM", "01743445566"],
  ["RAKIB HASAN", "01654556677"],
  ["NABILA SULTANA", "01965667788"],
  ["JAHID HOSSAIN", "01376778899"],
  ["SUMAIYA AKTER", "01887889900"],
  ["BELAL MIA", "01798990011"],
  ["FARZANA HAQUE", "01609001122"],
  ["SHAKIL AHMED", "01919112233"],
  ["MIM RAHMAN", "01320223344"],
  ["ARIF UDDIN", "01831334455"],
  ["TANIA ISLAM", "01742445566"],
  ["RUBEL MIA", "01653556677"],
  ["SHARMIN AKTER", "01964667788"],
  ["KAMAL HOSSAIN", "01375778899"],
  ["JUI KHATUN", "01886889900"],
  ["NASIR UDDIN", "01797990011"],
  ["OMAR FARUK", "01608001122"],
  ["LAMIA NOOR", "01919123344"],
  ["SABBIR RAHMAN", "01320234455"],
];

function stamp(index) {
  const base = new Date(2026, 9, 16, 3, 7, 57);
  base.setMinutes(base.getMinutes() - index * 7);
  const pad = (value) => String(value).padStart(2, "0");
  return {
    date: `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`,
    time: index === 1 ? "03:00:51" : `${pad(base.getHours())}:${pad(base.getMinutes())}:${pad(base.getSeconds())}`,
  };
}

export const applications = borrowers.map(([name, mobile], index) => {
  const when = stamp(index);
  return {
    id: 50 - index,
    name,
    mobile,
    amount: index < 2 ? 50000 : [50000, 80000, 120000, 150000, 200000][index % 5],
    purpose: index < 6 ? "Personal Loan" : ["Personal Loan", "Business Loan", "Agri Loan", "Education Loan"][index % 4],
    interest: index < 8 ? 3 : index % 6 === 0 ? 2.5 : 3,
    duration: index < 8 ? "12 Month" : index % 7 === 0 ? "24 Month" : "12 Month",
    status: index >= 30 ? "Approved" : "Pending",
    date: when.date,
    time: when.time,
  };
});

export const stats = {
  total: applications.length,
  pending: applications.filter((item) => item.status === "Pending").length,
  approved: applications.filter((item) => item.status === "Approved").length,
  rejected: applications.filter((item) => item.status === "Rejected").length,
};

const managedNames = [
  ["MD. FARUK MUNSI", "01313331761"],
  ["SYED JAKIR HOSSAIN", "01716993040"],
  ["JOYNODDIN", "01997822950"],
  ["MD JAHIRUL ISLAM", "01301432915"],
  ["KARIM AHMED", "01822334455"],
  ["NUSRAT JAHAN", "01633445566"],
  ["SOHEL RANA", "01744556677"],
  ["AYESHA AKTER", "01955667788"],
  ["FARHAN HOSSAIN", "01366778899"],
  ["MITU RAHMAN", "01877889900"],
  ["HASAN MAHMUD", "01788990011"],
  ["RUPA KHATUN", "01699001122"],
  ["IMRAN KHAN", "01910112233"],
  ["SADIA ISLAM", "01321223344"],
  ["TANVIR CHOWDHURY", "01832334455"],
  ["LIMA BEGUM", "01743445566"],
  ["SHAHID HOSSAIN", "01654556677"],
  ["MD. HAMIUL ISLAM", "01965667788"],
  ["NABILA SULTANA", "01376778899"],
  ["JAHID HOSSAIN", "01887889900"],
  ["SUMAIYA AKTER", "01798990011"],
  ["BELAL MIA", "01609001122"],
  ["FARZANA HAQUE", "01919112233"],
  ["SHAKIL AHMED", "01320223344"],
  ["MIM RAHMAN", "01831334455"],
  ["ARIF UDDIN", "01742445566"],
  ["TANIA ISLAM", "01653556677"],
  ["RUBEL MIA", "01964667788"],
  ["SHARMIN AKTER", "01375778899"],
  ["KAMAL HOSSAIN", "01886889900"],
  ["JUI KHATUN", "01797990011"],
  ["NASIR UDDIN", "01608001122"],
  ["OMAR FARUK", "01919123344"],
  ["LAMIA NOOR", "01320234455"],
  ["SABBIR RAHMAN", "01831345566"],
];

export const managedUsers = managedNames.map(([name, mobile], index) => {
  const pending = index < 32 ? 1 : 0;
  const approved = index >= 32 && index < 34 ? 1 : 0;
  const rejected = 0;
  const total = pending + approved + rejected;
  return {
    id: 52 - index,
    name,
    mobile,
    total,
    approved,
    pending,
    rejected,
    latest: total === 0 ? "No Application" : approved ? "Approved" : "Pending Documents",
    balance: 0,
    account: "Active",
  };
});

const historyAmounts = [
  ...Array(2).fill(400000),
  ...Array(8).fill(300000),
  ...Array(10).fill(200000),
  ...Array(14).fill(150000),
];

const historyPurposes = ["Personal Loan", "Business Loan", "Agri Loan", "Education Loan"];

export const companyHistory = historyAmounts.map((amount, index) => {
  const when = new Date(2026, 9, 16);
  when.setDate(when.getDate() - index);
  const pad = (value) => String(value).padStart(2, "0");
  return {
    id: 1034 - index,
    customer: managedUsers[index].name,
    amount,
    months: index < 2 ? 12 : 24,
    purpose: historyPurposes[index % historyPurposes.length],
    status: index < 2 ? "Approved" : "Pending",
    date: `${when.getFullYear()}-${pad(when.getMonth() + 1)}-${pad(when.getDate())}`,
  };
});

export const staffSeed = [
  { id: 1, name: "SuperAdmin", role: "Super Admin", mobile: "01700000001", status: "Active" },
  { id: 2, name: "Nadia Islam", role: "Loan Officer", mobile: "01811000022", status: "Active" },
  { id: 3, name: "Sabbir Khan", role: "Reviewer", mobile: "01922000033", status: "Active" },
  { id: 4, name: "Mitu Akter", role: "Support", mobile: "01633000044", status: "Inactive" },
];

export const withdrawSeed = [
  { id: 1, name: "MD. FARUK MUNSI", mobile: "01313331761", amount: 15000, method: "bKash", status: "Pending", date: "2026-10-16" },
  { id: 2, name: "SYED JAKIR HOSSAIN", mobile: "01716993040", amount: 8000, method: "Nagad", status: "Pending", date: "2026-10-15" },
  { id: 3, name: "JOYNODDIN", mobile: "01997822950", amount: 12000, method: "Bank", status: "Approved", date: "2026-10-14" },
  { id: 4, name: "MD JAHIRUL ISLAM", mobile: "01301432915", amount: 5000, method: "bKash", status: "Rejected", date: "2026-10-13" },
  { id: 5, name: "NUSRAT JAHAN", mobile: "01633445566", amount: 20000, method: "Bank", status: "Pending", date: "2026-10-12" },
];

export function taka(value) {
  return `৳${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
