import React, { useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, GripVertical, PencilLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FieldData {
  id: string;
  label: string;
  value: string | null;
  confidence_score: number;
  originalPath: string[];
  index: number;
}

interface ProcessedDataSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: Record<string, unknown>;
}

const FieldCard = ({ 
  field, 
  isEditing, 
  onValueChange 
}: { 
  field: FieldData; 
  isEditing: boolean;
  onValueChange: (id: string, value: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
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
        "bg-white border border-gray-100 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all",
        isDragging ? "opacity-50 z-50 scale-[1.02] shadow-xl border-vivid-purple/30" : "opacity-100",
        "flex flex-col gap-2 relative"
      )}
    >
      <div className="flex justify-between items-start">
        <span className="field-label text-document-tbl-header">{field.label.replace(/_/g, ' ')}</span>
        <div className="flex flex-col items-end">
          <span className="score-label">Confidence Score</span>
          <span className="confidence-badge mt-1">{field.confidence_score}%</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={field.value || ''}
          onChange={(e) => onValueChange(field.id, e.target.value)}
          disabled={!isEditing}
          className={cn(
            "w-full px-3 py-2.5 rounded-lg text-sm bg-gray-50/50 border border-transparent focus:bg-white focus:border-vivid-purple/20 focus:ring-4 focus:ring-vivid-purple/5 outline-none transition-all duration-200",
            !isEditing && "text-gray-500 cursor-not-allowed",
            isEditing && "bg-white text-gray-900 border-gray-200"
          )}
          placeholder="No value"
        />
        {isEditing && (
          <div {...attributes} {...listeners} className="drag-handle p-2 -mr-2 hover:bg-gray-50 rounded-lg transition-colors">
            <GripVertical size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export const ProcessedDataSheet: React.FC<ProcessedDataSheetProps> = ({ isOpen, onOpenChange, data }) => {
  const [fields, setFields] = useState<FieldData[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const flattenData = useCallback((obj: Record<string, unknown>): FieldData[] => {
    const result: FieldData[] = [];
    const processed = obj.processed_data as Record<string, unknown>;
    if (!processed) return result;

    let currentIndex = 0;
    const keys = Object.keys(processed);
    
    keys.forEach((key) => {
      const value = processed[key];
      if (key === 'other_discount_charges' || key === 'other_additional_charges') return;

      if (Array.isArray(value)) {
        value.forEach((item: unknown, i) => {
          let displayValue = "";
          let score = 0;
          
          if (typeof item === 'object' && item !== null) {
              const itemObj = item as Record<string, unknown>;
              displayValue = String(itemObj.value || "");
              score = Number(itemObj.confidence_score || 0);
              
              if (key === 'gst_details' && itemObj.type) {
                  const typeObj = itemObj.type as Record<string, unknown>;
                  const amountObj = itemObj.amount as Record<string, unknown>;
                  displayValue = `${typeObj.value || ''}: ${amountObj?.value || ''}`;
                  score = Number(typeObj.confidence_score || 0);
              }
          } else {
              displayValue = String(item);
          }

          result.push({
            id: `${key}.${i}`,
            label: `${key} #${i + 1}`,
            value: displayValue,
            confidence_score: score,
            originalPath: [key, i.toString()],
            index: currentIndex++
          });
        });
      } else {
        const val = value as Record<string, unknown>;
        if (!val) return;
        result.push({
          id: key,
          label: key,
          value: val.value !== undefined ? String(val.value) : (typeof val === 'object' ? "[Complex Object]" : String(val)),
          confidence_score: Number(val.confidence_score || 0),
          originalPath: [key],
          index: currentIndex++
        });
      }
    });

    return result;
  }, []);

  useEffect(() => {
    if (isOpen && data) {
      setFields(flattenData(data));
      setIsEditing(false);
    }
  }, [isOpen, data, flattenData]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, idx) => ({ ...item, index: idx }));
      });
    }
  };

  const handleValueChange = (id: string, newValue: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, value: newValue } : f));
  };

  const handleSubmit = () => {
    const updatedData = JSON.parse(JSON.stringify(data));
    const processed = updatedData.processed_data as Record<string, any>;
    
    fields.forEach((field) => {
      const { originalPath, value, index } = field;
      
      if (originalPath.length === 1) {
        const key = originalPath[0];
        if (typeof processed[key] === 'object' && processed[key] !== null) {
          processed[key].index = index;
          if ('value' in processed[key]) {
            processed[key].value = value;
          }
        }
      } else if (originalPath.length === 2) {
        const [key, arrIdx] = originalPath;
        const i = parseInt(arrIdx);
        if (Array.isArray(processed[key]) && processed[key][i]) {
          processed[key][i].index = index;
          if ('value' in processed[key][i]) {
            processed[key][i].value = value;
          }
        }
      }
    });

    console.log("Final Processed JSON:");
    console.log(JSON.stringify(updatedData, null, 2));
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full sm:w-[560px] md:w-[680px] lg:w-[740px] bg-slate-50/95 backdrop-blur-xl z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-white/20">
          
          <div className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
            <div>
              <p className="text-document-tbl-header text-[10px] font-bold uppercase tracking-[0.15em] mb-1">Processing Engine</p>
              <Dialog.Title className="text-xl font-bold text-slate-900 tracking-tight">Processed Data</Dialog.Title>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  isEditing 
                    ? "bg-vivid-purple text-white shadow-lg shadow-vivid-purple/20" 
                    : "bg-vivid-purple/5 text-vivid-purple hover:bg-vivid-purple/10"
                )}
              >
                <PencilLine size={16} />
                {isEditing ? "Finish Editing" : "Edit fields"}
              </button>
              <Dialog.Close className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
                <X size={20} />
              </Dialog.Close>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  {fields.map((field) => (
                    <FieldCard 
                        key={field.id} 
                        field={field} 
                        isEditing={isEditing} 
                        onValueChange={handleValueChange}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          <div className="px-8 py-6 bg-white border-t sticky bottom-0 z-10 flex items-center justify-between gap-4">
            <button 
              onClick={() => onOpenChange(false)}
              className="px-8 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm border border-transparent hover:border-slate-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-12 py-3.5 submit-gradient text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              Submit Transformation
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
