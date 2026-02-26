import { useBrands } from "@/context/BrandContext";
import { useAuth } from "@/context/AuthContext";
import { computeProgress } from "@/utils/statusUtils";
import BrandCard from "@/components/BrandCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { STAGE_NAMES } from "@/data/mockData";
import { Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const PIE_COLORS: Record<string, string> = {
  Delayed: "hsl(0, 100%, 50%)",
  Completed: "hsl(120, 61%, 34%)",
  "In Progress": "hsl(43, 76%, 52%)",
  Pending: "hsl(0, 0%, 60%)",
};

export default function Dashboard() {
  const { brands } = useBrands();
  const { role } = useAuth();
  const { toast } = useToast();

  // Early warning toasts
  useEffect(() => {
    brands.forEach(b => {
      b.stages.forEach(s => {
        if (s.delay > 3) {
          toast({
            title: `⚠️ ${b.name}`,
            description: `${s.name} delayed by ${s.delay} days`,
            variant: "destructive",
          });
        }
      });
    });
    // Fire only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = brands.length;
  const delayed = brands.filter(b => b.overallStatus === "Delayed").length;
  const completed = brands.filter(b => b.overallStatus === "Completed").length;
  const onTrack = total - delayed - completed;

  // Pie data
  const statusCounts: Record<string, number> = {};
  brands.forEach(b => { statusCounts[b.overallStatus] = (statusCounts[b.overallStatus] || 0) + 1; });
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Bar data: avg planned vs actual days per stage
  const barData = STAGE_NAMES.map(stage => {
    const stagesData = brands.flatMap(b => b.stages.filter(s => s.name === stage));
    const plannedDays = stagesData.reduce((sum, s) => {
      const d = (new Date(s.plannedEnd).getTime() - new Date(s.plannedStart).getTime()) / 86400000;
      return sum + d;
    }, 0) / (stagesData.length || 1);
    const actualDays = stagesData.filter(s => s.actualStart && s.actualEnd).reduce((sum, s) => {
      const d = (new Date(s.actualEnd!).getTime() - new Date(s.actualStart!).getTime()) / 86400000;
      return sum + d;
    }, 0) / (stagesData.filter(s => s.actualStart && s.actualEnd).length || 1);
    return { stage: stage.replace("R&D / Blend Development", "R&D"), planned: Math.round(plannedDays), actual: Math.round(actualDays) };
  });

  // Delay alerts
  const delayAlerts = brands.flatMap(b =>
    b.stages.filter(s => s.delay > 0).map(s => ({ brand: b.name, stage: s.name, delay: s.delay, brandId: b.id }))
  ).sort((a, b) => b.delay - a.delay);

  const kpis = [
    { label: "Total Brands", value: total, icon: Package, color: "text-primary" },
    { label: "On Track", value: onTrack, icon: TrendingUp, color: "text-primary" },
    { label: "Delayed", value: delayed, icon: AlertTriangle, color: "text-destructive" },
    { label: "Completed", value: completed, icon: CheckCircle, color: "text-success" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map(k => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <k.icon className={`h-8 w-8 ${k.color}`} />
              <div>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || "#888"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Planned vs Actual Days</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="planned" fill="hsl(43, 76%, 52%)" name="Planned" />
                <Bar dataKey="actual" fill="hsl(0, 0%, 60%)" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Delay Alerts */}
      {delayAlerts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Delay Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {delayAlerts.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <Badge
                  variant="secondary"
                  className={
                    a.delay > 7 ? "bg-destructive text-destructive-foreground" :
                    a.delay > 3 ? "bg-warning text-warning-foreground" :
                    "bg-primary/20 text-primary"
                  }
                >
                  {a.delay}d
                </Badge>
                <span className="font-medium">{a.brand}</span>
                <span className="text-muted-foreground">→ {a.stage}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Brand Cards */}
      {(role === "Head" || role === "Team") && (
        <div>
          <h2 className="text-sm font-semibold mb-2">Brand Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {brands.map(b => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
