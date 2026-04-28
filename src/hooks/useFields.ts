import { useState, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import type { FieldData } from "@/types/data";

export const useFields = (data: any, isOpen: boolean) => {
  const [fields, setFields] = useState<FieldData[]>([]);

  // 1. Initial State: Flatten the JSON and extract only proper items
  useEffect(() => {
    if (!isOpen || !data?.processed_data) return;

    const flatList: FieldData[] = [];
    
    Object.entries(data.processed_data).forEach(([key, val]: [string, any]) => {
      const items = Array.isArray(val) ? val : [val];
      
      items.forEach((item, i) => {
        // ONLY extract if it's a valid object containing value and confidence_score
        if (item && typeof item === "object" && "confidence_score" in item) {
          flatList.push({
            id: Array.isArray(val) ? `${key}.${i}` : key,
            label: (Array.isArray(val) ? `${key} #${i + 1}` : key).replace(/_/g, " "),
            value: item.value !== null && item.value !== undefined ? String(item.value) : "",
            confidence_score: Number(item.confidence_score),
            index: item.index,
          });
        }
      });
    });

    // If backend returns an index, we position them accordingly. 
    // New OCR data with no index falls to the end (Infinity) in the order it was found.
    flatList.sort((a, b) => {
      const aIndex = a.index ?? Infinity;
      const bIndex = b.index ?? Infinity;
      return aIndex - bIndex;
    });

    setFields(flatList);
  }, [isOpen, data]);

  // 2. Drag & Drop: Just update the array order when moved
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 3. Field Edit: Find by ID and update the value string
  const updateFieldValue = (id: string, value: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  // 4. Save: Loop through our UI fields and update the JSON with position indexes
  const getUpdatedData = () => {
    const updated = JSON.parse(JSON.stringify(data));
    
    fields.forEach((field, finalIndex) => {
      const [key, idx] = field.id.split(".");
      
      const entry = idx
        ? updated.processed_data[key][idx]
        : updated.processed_data[key];

      if (entry) {
        entry.value = field.value;
        entry.index = finalIndex; // Assign the exact UI position back to the DB payload
      }
    });

    return updated;
  };

  return { fields, handleDragEnd, updateFieldValue, getUpdatedData };
};
