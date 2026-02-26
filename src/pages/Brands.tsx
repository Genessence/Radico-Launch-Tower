import { useBrands } from "@/context/BrandContext";
import { useAuth } from "@/context/AuthContext";
import { computeProgress } from "@/utils/statusUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brand, CATEGORIES, STAGE_NAMES, OWNERS } from "@/data/mockData";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Brands() {
  const { brands, addBrand } = useBrands();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Brand["category"]>("Whisky");
  const [newLaunchDate, setNewLaunchDate] = useState("");

  const handleAdd = () => {
    if (!newName.trim() || !newLaunchDate) return;
    const brand: Brand = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      category: newCategory,
      launchDate: newLaunchDate,
      overallStatus: "Pending",
      stages: STAGE_NAMES.map(name => ({
        name,
        plannedStart: "",
        plannedEnd: "",
        actualStart: null,
        actualEnd: null,
        status: "Pending" as const,
        owner: OWNERS[0],
        delay: 0,
        notes: "",
        attachments: [],
      })),
    };
    addBrand(brand);
    setOpen(false);
    setNewName("");
    setNewLaunchDate("");
  };

  const statusColor: Record<string, string> = {
    Delayed: "bg-destructive text-destructive-foreground",
    Completed: "bg-success text-success-foreground",
    "In Progress": "bg-primary text-primary-foreground",
    Pending: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Brands</h1>
        {role === "Team" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Brand</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Brand</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Brand name" value={newName} onChange={e => setNewName(e.target.value)} />
                <Select value={newCategory} onValueChange={v => setNewCategory(v as Brand["category"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" value={newLaunchDate} onChange={e => setNewLaunchDate(e.target.value)} />
                <Button className="w-full" onClick={handleAdd} disabled={!newName.trim() || !newLaunchDate}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Launch Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map(b => (
              <TableRow key={b.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/brands/${b.id}`)}>
                <TableCell className="font-medium">{b.name}</TableCell>
                <TableCell>{b.category}</TableCell>
                <TableCell>
                  <Badge className={statusColor[b.overallStatus]} variant="secondary">{b.overallStatus}</Badge>
                </TableCell>
                <TableCell>{computeProgress(b.stages)}%</TableCell>
                <TableCell className="text-muted-foreground">{b.launchDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
