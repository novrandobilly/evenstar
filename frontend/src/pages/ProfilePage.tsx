import { cn } from "@/lib/utils";

const stats = [
  { label: "Sessions", value: "47" },
  { label: "Matches", value: "23" },
  { label: "Win Rate", value: "65%" },
  { label: "Hours", value: "84h" },
];

const recentForm: ("W" | "L")[] = ["W", "L", "W", "W", "L"];

const details = [
  { label: "Club", value: "Riverside Tennis Club" },
  { label: "Playing Since", value: "2018" },
  { label: "Preferred Surface", value: "Hard Court" },
  { label: "Dominant Hand", value: "Right" },
  { label: "Coach", value: "D. Holloway" },
];

export function ProfilePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Profile
        </h1>
      </div>

      {/* Profile hero card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-lime-300 to-emerald-500 flex items-center justify-center text-xl font-bold text-white shadow-sm shrink-0">
            AC
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Alex Chen
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              NTRP 4.0 · Riverside TC
            </p>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors shrink-0"
          >
            Edit
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mt-5 pt-5 border-t border-slate-100">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xl font-bold text-slate-900 tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Form */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Recent Form
        </h3>
        <div className="flex items-center gap-2">
          {recentForm.map((result, i) => (
            <div
              key={i}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold",
                result === "W"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-600",
              )}
            >
              {result}
            </div>
          ))}
          <span className="text-xs text-slate-400 ml-1">← most recent</span>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Details</h3>
        <dl className="space-y-3">
          {details.map((item) => (
            <div key={item.label} className="flex justify-between gap-4">
              <dt className="text-sm text-slate-500">{item.label}</dt>
              <dd className="text-sm font-medium text-slate-900 text-right">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
