"use client";
// app/dashboard/reports/page.jsx
import { useState, useEffect } from "react";
import { getAlerts, getLocations } from "@/lib/api"; // রিয়েল ডাটা এপিআই কানেকশন
import { Card, Badge } from "../shared"; // গ্লোবাল শেয়ার্ড কম্পোনেন্ট

const alertColor = (type) =>
  ({ PANIC: "#EF4444", GEOFENCE: "#F59E0B", ANOMALY: "#8B5CF6" })[type] ||
  "#60A5FA"; // অ্যালার্ট সিগনেচার কালার ম্যাট্রিক্স

export default function ReportsPage() {
  const [alerts, setAlerts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationCount, setLocationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // রিয়েল ডাটাবেস টেবিল থেকে প্রমিজ ক্লাস্টারে ডেটা ফেচ করা
      const [alertsR, locsR] = await Promise.allSettled([
        getAlerts(),
        getLocations(1),
      ]);
      if (alertsR.status === "fulfilled")
        setAlerts(alertsR.value?.results || alertsR.value || []);
      if (locsR.status === "fulfilled") {
        const data = locsR.value;
        const locs = data.results || data || [];
        setLocations(locs);
        setLocationCount(data.count || locs.length);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="w-7 h-7 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
          Syncing Threat Reports...
        </span>
      </div>
    );

  const resolved = alerts.filter((a) => a.resolved); // রেজলভড অ্যালার্ট ফিল্টার
  const active = alerts.filter((a) => !a.resolved); // একটিভ ইমার্জেন্সি ফিল্টার

  return (
    <div className="min-h-screen bg-[#030712] p-4 md:p-8 text-slate-100 relative overflow-hidden font-sans animate-in fade-in duration-300">
      {/* গ্লোবাল সাইবার পাঙ্ক মেস গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড লেয়ার */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* সেন্ট্রাল রিপোর্ট হেডার ব্লক */}
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-xl font-black text-white tracking-tight italic m-0">
            📄 Evidence & Audit Logs
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Archived Incidents & Telemetry Packet History
          </p>
        </div>

        {/* ডাইনামিক সিস্টেম কাউন্টার গ্রিড ম্যাট্রিক্স */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Alerts", value: alerts.length, color: "#60A5FA" },
            {
              label: "Resolved Logs",
              value: resolved.length,
              color: "#22C55E",
            },
            { label: "Active Threats", value: active.length, color: "#EF4444" },
            { label: "GPS History", value: locationCount, color: "#A78BFA" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center shadow-xl transition-transform hover:-translate-y-0.5 duration-200"
              style={{ borderTop: `2px solid ${s.color}` }}
            >
              <div
                className="text-2xl font-black font-mono tracking-tight"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* জিপিএস ডাটা লগ টেবিল কন্টেইনার */}
        {locations.length > 0 && (
          <div className="bg-white/[0.01] border border-white/5 backdrop-blur-md rounded-[24px] p-5 shadow-2xl">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-4 flex items-center justify-between">
              <span>📡 Recent Satellite GPS Stream Intercepts</span>
              <span className="text-[9px] font-mono text-purple-400 lowercase normal-case font-bold bg-purple-500/5 border border-purple-500/10 px-2 py-0.5 rounded-md">
                Live Sync Matrix
              </span>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-[10px] md:text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-left text-gray-500 font-bold uppercase tracking-wider text-[9px]">
                    <th className="pb-3 pr-4">Fix Time</th>
                    <th className="pb-3 pr-4">Latitude Vector</th>
                    <th className="pb-3 pr-4">Longitude Vector</th>
                    <th className="pb-3 pr-4">Ground Speed</th>
                    <th className="pb-3">Accuracy Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {locations.slice(0, 8).map((loc, i) => (
                    <tr
                      key={loc.id || i}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-3 pr-4 text-gray-400 font-mono">
                        {new Date(loc.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3 pr-4 text-slate-300 font-mono group-hover:text-purple-400 transition-colors">
                        {parseFloat(loc.latitude).toFixed(6)}°N
                      </td>
                      <td className="py-3 pr-4 text-slate-300 font-mono group-hover:text-purple-400 transition-colors">
                        {parseFloat(loc.longitude).toFixed(6)}°E
                      </td>
                      <td className="py-3 pr-4 text-emerald-400 font-semibold font-mono">
                        {loc.speed != null
                          ? `${parseFloat(loc.speed).toFixed(1)} km/h`
                          : "0.0 km/h"}
                      </td>
                      <td className="py-3 text-purple-400 font-mono">
                        {loc.accuracy != null ? `±${loc.accuracy}m` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ইনসিডেন্ট রিপোর্ট লগ বডি */}
        <div className="space-y-3">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">
            🚨 Incident Signal Evidence Streams
          </div>
          {alerts.length === 0 ? (
            <Card>
              <p className="text-center text-gray-500 text-sm py-8 font-bold uppercase tracking-wider m-0">
                No alert anomalies registered in server cluster.
              </p>
            </Card>
          ) : (
            alerts.slice(0, 10).map((a, i) => {
              const color = alertColor(a.alert_type);
              return (
                <div
                  key={a.id}
                  className="bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-xl transition-all duration-200 hover:border-white/10"
                  style={{ borderLeft: `4px solid ${color}` }}
                >
                  <div className="min-w-0 space-y-1">
                    <div className="text-xs md:text-sm font-black text-slate-200 tracking-wide uppercase">
                      Incident #{i + 1} — {a.alert_type || "SYSTEM ALERT"}
                    </div>
                    <div className="text-[9px] md:text-[10px] text-gray-500 font-mono">
                      Log Timestamp:{" "}
                      {a.timestamp
                        ? new Date(a.timestamp).toLocaleString("en-BD")
                        : "—"}
                    </div>
                    {a.latitude && (
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                        <span>📍</span> {parseFloat(a.latitude).toFixed(5)}°N,{" "}
                        {parseFloat(a.longitude).toFixed(5)}°E
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <Badge color={color}>{a.alert_type}</Badge>{" "}
                    {/* অ্যালার্ট টাইপ ব্যাজ */}
                    <Badge color={a.resolved ? "#22C55E" : "#F59E0B"}>
                      {a.resolved ? "Resolved Clear" : "Active Breach"}{" "}
                      {/* রেজল্যুশন স্ট্যাটাস ব্যাজ */}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
