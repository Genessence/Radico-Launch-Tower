import { useParams } from "react-router-dom";
import { useBrands } from "@/context/BrandContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function StageOverview() {
  const { stageName } = useParams<{ stageName: string }>();
  const { brands } = useBrands();
  const decoded = decodeURIComponent(stageName || "");

  const rows = brands.map(b => {
    const stage = b.stages.find(s => s.name === decoded);
    return stage ? { brandName: b.name, brandId: b.id, ...stage } : null;
  }).filter(Boolean) as any[];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h1 className="text-lg font-bold">{decoded}</h1>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Planned</TableHead>
              <TableHead>Actual</TableHead>
              <TableHead>Delay</TableHead>
              <TableHead>Owner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{r.brandName}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    r.status === "Delayed" ? "bg-destructive text-destructive-foreground" :
                    r.status === "Completed" ? "bg-success text-success-foreground" :
                    r.status === "In Progress" ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  }>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.plannedStart} → {r.plannedEnd}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.actualStart || "—"} → {r.actualEnd || "—"}</TableCell>
                <TableCell>{r.delay > 0 ? <Badge variant="destructive">{r.delay}d</Badge> : "—"}</TableCell>
                <TableCell className="text-xs">{r.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
