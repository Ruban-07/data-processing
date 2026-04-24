import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, PencilLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FieldCard } from './FieldCard';
import { useFields } from '@/hooks/useFields';

interface ProcessedDataSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: Record<string, unknown>;
}

export const ProcessedDataSheet: React.FC<ProcessedDataSheetProps> = ({ isOpen, onOpenChange, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { fields, handleDragEnd, updateFieldValue, getUpdatedData } = useFields(data, isOpen);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSubmit = () => {
    const updatedData = getUpdatedData();
    console.log("Final Processed JSON:", JSON.stringify(updatedData, null, 2));
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed right-0 top-0 h-full w-full sm:w-[560px] md:w-[680px] lg:w-[740px] bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l border-slate-100">
          
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
                  isEditing ? "bg-vivid-purple text-white shadow-none" : "bg-vivid-purple/5 text-vivid-purple hover:bg-vivid-purple/10"
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-8">
                  {fields.map((field) => (
                    <FieldCard 
                      key={field.id} 
                      field={field} 
                      isEditing={isEditing} 
                      onValueChange={updateFieldValue}
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
              className="px-12 py-3.5 submit-gradient text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all text-sm shadow-none"
            >
              Submit Transformation
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
