import { useParams, Navigate } from "react-router-dom";
import { useBrands } from "@/context/BrandContext";
import { useAuth } from "@/context/AuthContext";
import { computeProgress } from "@/utils/statusUtils";
import ProgressBar from "@/components/ProgressBar";
import StageForm from "@/components/StageForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function BrandDetail() {
  const { brandId } = useParams<{ brandId: string }>();
  const { brands, syncERP } = useBrands();
  const { role } = useAuth();

  const brand = brands.find(b => b.id === brandId);
  if (!brand) return <Navigate to="/brands" replace />;

  const progress = computeProgress(brand.stages);

  const statusColor: Record<string, string> = {
    Delayed: "bg-destructive text-destructive-foreground",
    Completed: "bg-success text-success-foreground",
    "In Progress": "bg-primary text-primary-foreground",
    Pending: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold">{brand.name}</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{brand.category}</span>
            <Badge className={statusColor[brand.overallStatus]} variant="secondary">{brand.overallStatus}</Badge>
          </div>
        </div>
        {role === "Team" && (
          <Button variant="outline" size="sm" onClick={() => syncERP(brand.id)}>
            <RefreshCw className="h-4 w-4 mr-1" /> Sync from ERP
          </Button>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <p className="text-xs text-muted-foreground">Launch: {brand.launchDate}</p>

      {/* Stages */}
      <Accordion type="multiple" className="space-y-1">
        {brand.stages.map(stage => (
          <AccordionItem key={stage.name} value={stage.name} className="border rounded-lg px-3">
            <AccordionTrigger className="text-sm py-2">
              <div className="flex items-center gap-2">
                <span>{stage.name}</span>
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${
                    stage.status === "Delayed" ? "bg-destructive text-destructive-foreground" :
                    stage.status === "Completed" ? "bg-success text-success-foreground" :
                    stage.status === "In Progress" ? "bg-primary text-primary-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {stage.status}
                </Badge>
                {stage.delay > 0 && (
                  <Badge variant="destructive" className="text-[10px]">+{stage.delay}d</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <StageForm brandId={brand.id} stage={stage} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}
