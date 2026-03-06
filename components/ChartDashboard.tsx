"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { DashboardStats } from "@/types";

const COLORS = ["#e8622a","#d4a843","#7a9e7e","#6366f1","#f472b6"];

interface Props { stats: DashboardStats; }

const cardStyle: React.CSSProperties = {
  background: "white", borderRadius: 20, padding: "1.5rem",
  border: "1px solid rgba(0,0,0,0.06)",
};
const titleStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem",
  letterSpacing: "-0.02em", marginBottom: "1.25rem", color: "var(--ink)",
};

export function ChartDashboard({ stats }: Props) {
  const monthlyData = stats.adoptionsByMonth?.map(d => ({
    name: d.month.slice(0, 3), value: d.count,
  })) ?? [];

  const statusData = stats.statusBreakdown?.map(d => ({
    name: d.status.charAt(0) + d.status.slice(1).toLowerCase(),
    value: d.count,
  })) ?? [];

  const speciesData = stats.speciesBreakdown?.map(d => ({
    name: d.species, value: d.count,
  })) ?? [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Monthly bar chart */}
      <div style={cardStyle}>
        <p style={titleStyle}>Adoptions by Month</p>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted)", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                cursor={{ fill: "rgba(232,98,42,0.06)" }}
              />
              <Bar dataKey="value" fill="var(--accent)" radius={[6,6,0,0]} name="Adoptions" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.85rem", fontFamily: "var(--font-body)" }}>
            No data yet
          </div>
        )}
      </div>

      {/* Status pie */}
      <div style={cardStyle}>
        <p style={titleStyle}>Pet Status Breakdown</p>
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                dataKey="value" paddingAngle={3}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-body)" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.85rem", fontFamily: "var(--font-body)" }}>
            No data yet
          </div>
        )}
      </div>

      {/* Species bar */}
      <div style={cardStyle}>
        <p style={titleStyle}>Pets by Species</p>
        {speciesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={speciesData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--muted)", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontFamily: "var(--font-body)", fontSize: 12 }} cursor={{ fill: "rgba(232,98,42,0.06)" }} />
              <Bar dataKey="value" radius={[0,6,6,0]} name="Pets">
                {speciesData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.85rem", fontFamily: "var(--font-body)" }}>
            No data yet
          </div>
        )}
      </div>

      {/* Quick stats */}
      <div style={cardStyle}>
        <p style={titleStyle}>Quick Stats</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Total Pets",          value: stats.totalPets        },
            { label: "Available",           value: stats.availablePets    },
            { label: "Total Requests",      value: stats.totalRequests    },
            { label: "Approved Requests",   value: stats.approvedRequests },
            { label: "Registered Users",    value: stats.totalUsers       },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--cream)", borderRadius: 12 }}>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{s.label}</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--ink)" }}>{s.value ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
