import { useState, useMemo } from "react";
import { useBrands } from "@/context/BrandContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { STAGE_NAMES } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

const COLORS = ["hsl(43,76%,52%)", "hsl(0,100%,50%)", "hsl(120,61%,34%)", "hsl(0,0%,60%)", "hsl(200,70%,50%)"];

export default function Analytics() {
  const { brands } = useBrands();
  const [brandFilter, setBrandFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    let result = brands;
    if (brandFilter !== "all") result = result.filter(b => b.id === brandFilter);
    return result;
  }, [brands, brandFilter]);

  const stageData = useMemo(() => {
    const stages = stageFilter === "all" ? [...STAGE_NAMES] : [stageFilter];
    return stages.map(name => {
      const allStages = filtered.flatMap(b => b.stages.filter(s => s.name === name));
      const avgDelay = allStages.reduce((s, st) => s + st.delay, 0) / (allStages.length || 1);
      const completed = allStages.filter(s => s.status === "Completed").length;
      return { name: name.length > 12 ? name.substring(0, 12) + "…" : name, avgDelay: Math.round(avgDelay * 10) / 10, completed, total: allStages.length };
    });
  }, [filtered, stageFilter]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach(b => { counts[b.category] = (counts[b.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const exportCSV = () => {
    const data = filtered.flatMap(b =>
      b.stages.map(s => ({
        brand: b.name, category: b.category, stage: s.name, status: s.status,
        plannedStart: s.plannedStart, plannedEnd: s.plannedEnd,
        actualStart: s.actualStart, actualEnd: s.actualEnd,
        delay: s.delay, owner: s.owner,
      }))
    );
    console.log("[CSV Export]", JSON.stringify(data, null, 2));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Analytics</h1>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Brands" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Stages" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {STAGE_NAMES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" className="w-40" value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="From" />
        <Input type="date" className="w-40" value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="To" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average Delay by Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stageData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="avgDelay" fill="hsl(0,100%,50%)" name="Avg Delay (days)" />
                <Bar dataKey="completed" fill="hsl(120,61%,34%)" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Brands by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
