import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldData } from "@/types/data";

interface FieldCardProps {
  field: FieldData;
  isEditing: boolean;
  onValueChange: (id: string, value: string) => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({
  field,
  isEditing,
  onValueChange,
}) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({ id: field.id, disabled: !isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-all duration-300 flex flex-col gap-2 relative",
        isEditing
          ? "border border-slate-200 rounded-2xl p-5 bg-white"
          : "p-0 border-transparent",
        isDragging &&
          "opacity-50 z-50 scale-[1.01] border-vivid-purple/40 bg-white",
      )}
    >
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {field.label.replace(/_/g, " ")}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
            Confidence
          </span>
          <span
            className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-lg",
              field.confidence_score > 80
                ? "text-emerald-600 bg-emerald-50/50"
                : "text-amber-600 bg-amber-50/50",
            )}
          >
            {field.confidence_score}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={field.value || ""}
          onChange={(e) => onValueChange(field.id, e.target.value)}
          disabled={!isEditing}
          className={cn(
            "w-full text-sm font-medium transition-all duration-300 outline-none",
            !isEditing
              ? "bg-slate-50/80 border border-slate-100 text-slate-400 py-3 px-4 rounded-xl cursor-not-allowed"
              : "bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-vivid-purple focus:ring-4 focus:ring-vivid-purple/5 shadow-none",
          )}
          placeholder="No value"
        />
        {isEditing && (
          <div
            {...attributes}
            {...listeners}
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-all cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500"
          >
            <GripVertical size={20} />
          </div>
        )}
      </div>
    </div>
  );
};
