import { Stage, OWNERS } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { useBrands } from "@/context/BrandContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { secondsUntil, formatCountdown } from "@/utils/dateUtils";
import { Trash2, Plus } from "lucide-react";

interface Props {
  brandId: string;
  stage: Stage;
}

export default function StageForm({ brandId, stage }: Props) {
  const { role } = useAuth();
  const { updateStage } = useBrands();
  const canEdit = role === "Team";

  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (stage.status === "Completed" || !stage.plannedEnd) return;
    const update = () => setCountdown(secondsUntil(stage.plannedEnd));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [stage.plannedEnd, stage.status]);

  const handleChange = (field: string, value: string) => {
    updateStage(brandId, stage.name, { [field]: value || null });
  };

  const addAttachment = () => {
    const name = `Document_${Date.now()}.pdf`;
    updateStage(brandId, stage.name, { attachments: [...stage.attachments, name] });
  };

  const removeAttachment = (idx: number) => {
    updateStage(brandId, stage.name, {
      attachments: stage.attachments.filter((_, i) => i !== idx),
    });
  };

  const isOverdue = countdown < 0 && stage.status !== "Completed";

  return (
    <div className="grid gap-3 py-3">
      {/* SLA Timer */}
      {stage.status !== "Completed" && stage.plannedEnd && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">SLA:</span>
          <Badge variant={isOverdue ? "destructive" : "secondary"} className="text-xs">
            {formatCountdown(countdown)}
          </Badge>
        </div>
      )}

      {/* Delay */}
      {stage.delay > 0 && (
        <Badge variant="destructive" className="w-fit text-xs">
          Delayed by {stage.delay} day{stage.delay > 1 ? "s" : ""}
        </Badge>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Planned Start</label>
          <Input
            type="date"
            value={stage.plannedStart}
            disabled={!canEdit}
            onChange={e => handleChange("plannedStart", e.target.value)}
            className="text-xs h-8"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Planned End</label>
          <Input
            type="date"
            value={stage.plannedEnd}
            disabled={!canEdit}
            onChange={e => handleChange("plannedEnd", e.target.value)}
            className="text-xs h-8"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Actual Start</label>
          <Input
            type="date"
            value={stage.actualStart || ""}
            disabled={!canEdit}
            onChange={e => handleChange("actualStart", e.target.value)}
            className="text-xs h-8"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Actual End</label>
          <Input
            type="date"
            value={stage.actualEnd || ""}
            disabled={!canEdit}
            onChange={e => handleChange("actualEnd", e.target.value)}
            className="text-xs h-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Status</label>
          <Select
            value={stage.status}
            disabled={!canEdit}
            onValueChange={v => handleChange("status", v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Pending", "In Progress", "Completed", "Delayed"].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Owner</label>
          <Select
            value={stage.owner}
            disabled={!canEdit}
            onValueChange={v => handleChange("owner", v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OWNERS.map(o => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs text-muted-foreground">Notes</label>
        <Textarea
          value={stage.notes}
          disabled={!canEdit}
          onChange={e => handleChange("notes", e.target.value)}
          className="text-xs min-h-[60px]"
          placeholder="Stage notes..."
        />
      </div>

      {/* Attachments */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-xs text-muted-foreground">Attachments</label>
          {canEdit && (
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={addAttachment}>
              <Plus className="h-3 w-3" />
            </Button>
          )}
        </div>
        {stage.attachments.length === 0 && (
          <p className="text-xs text-muted-foreground italic">No attachments</p>
        )}
        {stage.attachments.map((a, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">📎 {a}</span>
            {canEdit && (
              <button onClick={() => removeAttachment(i)} className="text-destructive hover:opacity-80">
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
