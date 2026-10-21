
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  CalendarClock,
  Settings,
  Bell,
  Plus,
  Search,
  Building2,
  CalendarDays,
  Trophy,
  X,
  Trash2,
  ExternalLink,
  Menu,
} from "lucide-react";
import {
  // Keep your existing icons
  Pencil,
} from "lucide-react";
const initialApplications = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer Intern",
    date: "2026-10-15",
    status: "Interview",
    link: "",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "SDE Intern",
    date: "2026-10-14",
    status: "Applied",
    link: "",
  },
  {
    id: 3,
    company: "Amazon",
    role: "Software Development Intern",
    date: "2026-10-12",
    status: "Offer",
    link: "",
  },
  {
    id: 4,
    company: "Adobe",
    role: "Software Engineer Intern",
    date: "2026-10-10",
    status: "Rejected",
    link: "",
  },
  {
    id: 5,
    company: "Samsung",
    role: "Research Intern",
    date: "2026-10-09",
    status: "Interview",
    link: "",
  },
];

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700 ring-blue-200",
  Interview: "bg-amber-50 text-amber-700 ring-amber-200",
  Offer: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Rejected: "bg-red-50 text-red-700 ring-red-200",
};

const statuses = ["Applied", "Interview", "Offer", "Rejected"];

export default function Home() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");

  const [activeTab, setActiveTab] = useState("Dashboard");

  const [editingApp, setEditingApp] = useState(null);
const [editCompany, setEditCompany] = useState("");
const [editRole, setEditRole] = useState("");
const [editDate, setEditDate] = useState("");
const [editInterviewDate, setEditInterviewDate] = useState("");
const [editStatus, setEditStatus] = useState("Applied");
const [editLink, setEditLink] = useState("");
const [editNotes, setEditNotes] = useState("");
const [editSaving, setEditSaving] = useState(false);
const [editError, setEditError] = useState("");


const [today, setToday] = useState(null);
useEffect(() => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  setToday(currentDate);
}, []);

  useEffect(() => {
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 10);

    setDate(localDate);

    async function loadApplications() {
      try {
        setPageError("");

        const response = await fetch("/api/applications");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Could not load applications"
          );
        }

        setApplications(result);
      } catch (error) {
        console.error(error);
        setPageError(error.message || "Could not load applications");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const [status, setStatus] = useState("Applied");
  const [link, setLink] = useState("");

  const stats = [
    {
      label: "Total applications",
      value: applications.length,
      icon: BriefcaseBusiness,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Interviews",
      value: applications.filter((a) => a.status === "Interview").length,
      icon: CalendarDays,
      color: "bg-amber-50 text-amber-700",
    },
    {
      label: "Offers",
      value: applications.filter((a) => a.status === "Offer").length,
      icon: Trophy,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Rejected",
      value: applications.filter((a) => a.status === "Rejected").length,
      icon: X,
      color: "bg-red-50 text-red-700",
    },
  ];

  const upcomingInterviews = useMemo(() => {
  if (!today) return [];

  return applications
    .filter((app) => {
      if (!app.interviewDate) return false;

      const interviewDate = new Date(app.interviewDate);
      interviewDate.setHours(0, 0, 0, 0);

      return interviewDate >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.interviewDate) - new Date(b.interviewDate)
    );
}, [applications, today]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = `${app.company} ${app.role}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || app.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [applications, search, filter]);

  if (!today) {
  return (
    <div className="min-h-screen bg-gray-950" />
  );
}


  async function addApplication(e) {
    e.preventDefault();
    setSaving(true);
    setPageError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  company: company.trim(),
  role: role.trim(),
  date,
  interviewDate: interviewDate || null,
  status,
  link: link.trim(),
}),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not save application");
      }

      setApplications((prev) => [result, ...prev]);
      setCompany("");
      setRole("");
      setInterviewDate("");
      setStatus("Applied");
      setLink("");
      setShowForm(false);

      const now = new Date();
      setDate(
        new Date(now.getTime() - now.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 10)
      );
    } catch (error) {
      console.error(error);
      setPageError(error.message || "Could not save application");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id, nextStatus) {
    setPageError("");

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not update application");
      }

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? result : app))
      );
    } catch (error) {
      console.error(error);
      setPageError(error.message || "Could not update application");
    }
  }

  async function deleteApplication(id) {
    setPageError("");

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not delete application");
      }

      setApplications((prev) =>
        prev.filter((app) => app.id !== id)
      );
    } catch (error) {
      console.error(error);
      setPageError(error.message || "Could not delete application");
    }
  }

  
function startEdit(app) {
  setEditingApp(app);
  setEditCompany(app.company);
  setEditRole(app.role);
  setEditDate(
    typeof app.date === "string"
      ? app.date.slice(0, 10)
      : ""
  );
  setEditInterviewDate(
  app.interviewDate
    ? new Date(app.interviewDate).toISOString().slice(0, 10)
    : ""
);
  setEditStatus(app.status);
  setEditLink(app.link || "");
  setEditNotes(app.notes || "");
  setEditError("");
}

async function saveEdit(e) {
  e.preventDefault();

  if (!editingApp) return;

  setEditSaving(true);
  setEditError("");

  try {
    const response = await fetch(
      `/api/applications/${editingApp.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: editCompany.trim(),
          role: editRole.trim(),
          date: editDate,
          status: editStatus,
          link: editLink.trim(),
          notes: editNotes.trim(),
          interviewDate: editInterviewDate || null,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Failed to update application"
      );
    }

    setApplications((prev) =>
      prev.map((app) =>
        app.id === result.id ? result : app
      )
    );

    setEditingApp(null);
  } catch (error) {
    console.error("Edit application failed:", error);
    setEditError(
      error.message || "Failed to update application"
    );
  } finally {
    setEditSaving(false);
  }
}


  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`${mobileMenu ? "flex" : "hidden"
            } fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-slate-200 bg-white p-5 md:static md:flex`}
        >
          <div className="mb-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-600 p-2.5 text-white">
                <BriefcaseBusiness size={22} />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">
                  CareerTrack
                </h1>
                <p className="text-xs text-slate-500">
                  JOB APPLICATIONS
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileMenu(false)}
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-2">
            <button className="flex w-full items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-left font-semibold text-indigo-700">
              <LayoutDashboard size={19} />
              Dashboard
            </button>

            <button
              onClick={() => {
                setFilter("All");
                setSearch("");
                setMobileMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-600 hover:bg-slate-50"
            >
              <BriefcaseBusiness size={19} />
              Applications
            </button>

            <button
              onClick={() => {
                setSearch("");
                setFilter("Interview");
                setMobileMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-600 hover:bg-slate-50"
            >
              <CalendarClock size={19} />
              Interviews
            </button>

            <button
              onClick={() => {
  setActiveTab("Reminders");
  setMobileMenu(false);
}}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-600 hover:bg-slate-50"
            >
              <Bell size={19} />
              Reminders
            </button>

            <button
              onClick={() =>
                alert("Settings will be implemented in a later step.")
              }
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-600 hover:bg-slate-50"
            >
              <Settings size={19} />
              Settings
            </button>
          </nav>

          <div className="mt-auto rounded-2xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <Settings size={17} />
              Your workspace
            </div>
            <p className="text-sm leading-6 text-slate-500">
              Keep every application organized in one place.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenu(true)}
                className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
                aria-label="Open menu"
              >
                <Menu size={21} />
              </button>

              <div>
                <p className="text-sm text-slate-500">
                  Workspace / Overview
                </p>
                <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                  Dashboard
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-500 sm:block">
                Your job search, organized.
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                U
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
            {pageError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {pageError}
              </div>
            )}

            {loading && (
              <p className="py-4 text-sm text-slate-500">
                Loading applications...
              </p>
            )}
            {/* Welcome section */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Welcome back!
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Here&apos;s what&apos;s happening with your job search.
                </p>
              </div>

              <button
                onClick={() => setShowForm(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Plus size={19} />
                Add application
              </button>
            </section>

            {/* Statistics */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.label}
                      </p>
                      <div className={`rounded-xl p-2.5 ${stat.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>

                    <p className="mt-5 text-3xl font-bold">
                      {stat.value}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Based on your current applications
                    </p>
                  </div>
                );
              })}
            </section>


<section className="mb-10">
  {/* Section heading */}
  <div className="mb-5 flex items-center justify-between gap-4">
    <div>
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-lg">
          📅
        </span>
        <h2 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
          Upcoming Interviews
        </h2>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        Stay prepared for what comes next.
      </p>
    </div>

    <span className="shrink-0 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-sm font-semibold text-indigo-600">
      {upcomingInterviews.length} scheduled
    </span>
  </div>

  {/* Horizontal scrolling cards */}
  {upcomingInterviews.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/60 px-6 py-10 text-center">
      <div className="mb-3 text-3xl">🗓️</div>
      <h3 className="font-semibold text-gray-200">
        Nothing scheduled yet
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Add an interview date to an application to see it here.
      </p>
    </div>
  ) : (
    <div className="-mx-1 overflow-x-auto px-1 pb-4">
      <div className="flex w-max gap-4">
        {upcomingInterviews.map((app) => {
          const interviewDate = new Date(app.interviewDate);
          interviewDate.setHours(0, 0, 0, 0);

          const daysUntil = Math.round(
  (interviewDate.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24)
);
         

          const urgency =
            daysUntil === 0
              ? {
                  label: "Today",
                  badge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
                  accent: "from-emerald-400 to-teal-500",
                }
              : daysUntil === 1
              ? {
                  label: "Tomorrow",
                  badge: "bg-amber-400/10 text-amber-300 border-amber-400/20",
                  accent: "from-amber-400 to-orange-500",
                }
              : daysUntil <= 3
              ? {
                  label: `In ${daysUntil} days`,
                  badge: "bg-amber-400/10 text-amber-300 border-amber-400/20",
                  accent: "from-amber-400 to-orange-500",
                }
              : {
                  label: `In ${daysUntil} days`,
                  badge: "bg-indigo-400/10 text-indigo-300 border-indigo-400/20",
                  accent: "from-indigo-400 to-violet-500",
                };

          return (
            <article
              key={app.id}
              className="group relative w-[270px] shrink-0 overflow-hidden rounded-2xl border border-gray-700/70 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800/90 p-5 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-indigo-950/30 sm:w-[300px]"
            >
              {/* Accent strip */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${urgency.accent}`}
              />

              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-xl font-bold text-indigo-200">
                  {app.company?.trim()?.charAt(0)?.toUpperCase() || "?"}
                </div>

                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${urgency.badge}`}
                >
                  {urgency.label}
                </span>
              </div>

              <h3 className="truncate text-lg font-bold text-white">
                {app.company}
              </h3>
              <p className="mt-1 truncate text-sm text-gray-400">
                {app.role}
              </p>

              <div className="my-5 border-t border-gray-700/70" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-lg">
                  🗓️
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Interview date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-200">
                    {interviewDate.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  )}
</section>


            {/* Applications table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <h3 className="text-lg font-bold">
                    Your applications
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Track companies, roles, and application progress.
                  </p>
                </div>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 px-5 pt-4 sm:px-6">
                {["All", ...statuses].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${filter === item
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">
                        Company / Role
                      </th>
                      <th className="px-6 py-4 font-semibold">
                        Applied on
                      </th>
                      <th className="px-6 py-4 font-semibold">
                        Status
                      </th>
                      <th className="px-6 py-4 font-semibold">
                        Update status
                      </th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredApplications.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">
                                {app.company}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {app.role}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-slate-500">
                          {new Date(app.date).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[app.status]
                              }`}
                          >
                            {app.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              updateStatus(app.id, e.target.value)
                            }
                            aria-label={`Update ${app.company} status`}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs outline-none focus:border-indigo-500"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            {app.link && (
                              <a
                                href={app.link}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Open ${app.company} job link`}
                                className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                <ExternalLink size={17} />
                              </a>
                            )}


<button
  type="button"
  onClick={() => startEdit(app)}
  aria-label={`Edit ${app.company}`}
  className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
>
  <Pencil size={17} />
</button>


                            <button
                              onClick={() =>
                                deleteApplication(app.id)
                              }
                              aria-label={`Delete ${app.company}`}
                              className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredApplications.length === 0 && (
                  <div className="px-6 py-16 text-center">
                    <BriefcaseBusiness
                      className="mx-auto text-slate-300"
                      size={36}
                    />
                    <p className="mt-3 font-semibold">
                      No applications found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try another search or add an application.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
                Showing {filteredApplications.length} of{" "}
                {applications.length} applications
              </div>
            </section>

            <p className="text-center text-xs text-slate-400">
              CareerTrack · Built with Next.js and JavaScript
            </p>
          </div>
        </main>
      </div>

      {/* Add application modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-application-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3
                  id="add-application-title"
                  className="text-xl font-bold"
                >
                  Add application
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the details of the job you applied for.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addApplication} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Company name *
                </label>
                <input
                  required
                  maxLength={100}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Job role *
                </label>
                <input
                  required
                  maxLength={150}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Application date *
                </label>
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

<div>
  <label className="mb-1.5 block text-sm font-medium">
    Interview date (optional)
  </label>
  <input
    type="date"
    value={interviewDate}
    onChange={(e) => setInterviewDate(e.target.value)}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
  />
</div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Current status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Job posting URL (optional)
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
{editingApp && (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-application-title"
      className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3
            id="edit-application-title"
            className="text-xl font-bold"
          >
            Edit application
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Update your job application details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingApp(null)}
          aria-label="Close edit form"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={saveEdit} className="space-y-4">
        {editError && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {editError}
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Company name *
          </label>
          <input
            required
            maxLength={100}
            value={editCompany}
            onChange={(e) => setEditCompany(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Job role *
          </label>
          <input
            required
            maxLength={150}
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Application date *
          </label>
          <input
            required
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>

        
<div>
  <label className="mb-1.5 block text-sm font-medium">
    Interview date (optional)
  </label>
  <input
    type="date"
    value={editInterviewDate}
    onChange={(e) => setEditInterviewDate(e.target.value)}
    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
  />
</div>


        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Status
          </label>
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Job posting URL
          </label>
          <input
            type="url"
            value={editLink}
            onChange={(e) => setEditLink(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Notes
          </label>
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Interview details, recruiter contacts, follow-ups..."
            rows={3}
            maxLength={5000}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
          />
        </div>

        <div className="flex gap-3 pt-3">
          <button
            type="button"
            disabled={editSaving}
            onClick={() => setEditingApp(null)}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={editSaving}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {editSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
