import { Brand } from "@/data/mockData";
import { computeProgress } from "@/utils/statusUtils";
import ProgressBar from "./ProgressBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const statusColor: Record<string, string> = {
  Delayed: "bg-destructive text-destructive-foreground",
  Completed: "bg-success text-success-foreground",
  "In Progress": "bg-primary text-primary-foreground",
  Pending: "bg-muted text-muted-foreground",
};

export default function BrandCard({ brand }: { brand: Brand }) {
  const navigate = useNavigate();
  const progress = computeProgress(brand.stages);

  return (
    <Card
      className="cursor-pointer hover:ring-1 hover:ring-primary/50 transition-all"
      onClick={() => navigate(`/brands/${brand.id}`)}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm truncate">{brand.name}</h3>
          <Badge className={statusColor[brand.overallStatus] || ""} variant="secondary">
            {brand.overallStatus}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{brand.category}</p>
        <ProgressBar value={progress} />
        <p className="text-xs text-muted-foreground text-right">{progress}%</p>
      </CardContent>
    </Card>
  );
}
