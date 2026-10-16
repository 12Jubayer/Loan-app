import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { CheckIcon, ChevronIcon, ClockIcon, CloseIcon, FileIcon, ListIcon, UsersIcon } from "../components/Icons";
import { stats } from "../data";

const total = stats.total || 1;

export default function Dashboard() {
  return (
    <div>
      <header className="mb-[22px]">
        <h1 className="text-[30px] font-bold leading-none tracking-[-0.03em] text-[#2ad4f0] lg:text-[34px]">Dashboard</h1>
        <p className="mt-2 text-[15px] text-[#8ea3bb]">
          Welcome back, <span className="font-medium text-[#e7eef6]">WorldBank</span>
        </p>
      </header>

      <section className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={stats.total}
          meta="100% all applications"
          percent={100}
          gradient="bg-gradient-to-b from-[#2f90ef] to-[#1574dc]"
          barClass="bg-white"
          icon={<FileIcon className="h-[18px] w-[18px]" />}
          metaIcon={<ListIcon className="shrink-0 text-white" />}
          to="/application"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          meta={`${Math.round((stats.pending / total) * 100)}% of total`}
          percent={Math.round((stats.pending / total) * 100)}
          gradient="bg-gradient-to-b from-[#f3b52b] to-[#e1960d]"
          barClass="bg-[#ffe7a6]"
          icon={<ClockIcon />}
          to="/application?status=Pending"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          meta={`${Math.round((stats.approved / total) * 100)}% of total`}
          percent={Math.round((stats.approved / total) * 100)}
          gradient="bg-gradient-to-b from-[#32b15a] to-[#1f8d40]"
          barClass="bg-[#e7fff1]"
          icon={<CheckIcon />}
          to="/application?status=Approved"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          meta={`${Math.round((stats.rejected / total) * 100)}% of total`}
          percent={Math.round((stats.rejected / total) * 100)}
          gradient="bg-gradient-to-b from-[#ee4343] to-[#d42525]"
          barClass="bg-white"
          icon={<CloseIcon />}
          to="/application?status=Rejected"
        />
      </section>

      <section className="mt-[22px] grid grid-cols-1 gap-[18px] lg:grid-cols-12">
        <Link
          to="/application"
          className="flex items-center gap-4 rounded-[16px] border border-[#243652] bg-[#13233a] px-5 py-4 transition hover:bg-[#182a44] lg:col-span-7"
        >
          <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[12px] bg-[#1b5eab] text-white">
            <FileIcon className="h-6 w-6" />
          </span>
          <span className="min-w-0">
            <span className="block text-[17px] font-bold leading-tight text-white">Application</span>
            <span className="mt-1 block text-[13.5px] text-[#8ea3bb]">Manage → All Application</span>
          </span>
          <ChevronIcon className="ml-auto h-5 w-5 shrink-0 text-[#8ea3bb]" />
        </Link>

        <Link
          to="/manage-user"
          className="flex items-center gap-4 rounded-[16px] border border-[#243652] bg-[#13233a] px-5 py-4 transition hover:bg-[#182a44] lg:col-span-5"
        >
          <span className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[12px] bg-[#1b8a45] text-white">
            <UsersIcon className="h-6 w-6" />
          </span>
          <span className="min-w-0">
            <span className="block text-[17px] font-bold leading-tight text-white">User</span>
            <span className="mt-1 block text-[13.5px] text-[#8ea3bb]">Manage → All User</span>
          </span>
          <ChevronIcon className="ml-auto h-5 w-5 shrink-0 text-[#8ea3bb]" />
        </Link>
      </section>
    </div>
  );
}
