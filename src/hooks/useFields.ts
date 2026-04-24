import { useState, useCallback, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import type { FieldData } from '@/types/data';

export const useFields = (data: any, isOpen: boolean) => {
  const [fields, setFields] = useState<FieldData[]>([]);

  const flattenData = useCallback((obj: any): FieldData[] => {
    const processed = obj?.processed_data;
    if (!processed) return [];

    let currentIndex = 0;
    return Object.entries(processed).flatMap(([key, value]) => {
      if (['other_discount_charges', 'other_additional_charges'].includes(key)) return [];

      if (Array.isArray(value)) {
        return value.map((item: any, i) => {
          let displayValue = String(item?.value ?? item);
          let score = Number(item?.confidence_score ?? 0);

          if (key === 'gst_details' && item?.type) {
            displayValue = `${item.type.value || ''}: ${item.amount?.value || ''}`;
            score = Number(item.type.confidence_score || 0);
          }

          return {
            id: `${key}.${i}`,
            label: `${key} #${i + 1}`,
            value: displayValue,
            confidence_score: score,
            originalPath: [key, i.toString()],
            index: currentIndex++
          };
        });
      }

      const val = value as any;
      return [{
        id: key,
        label: key,
        value: val?.value !== undefined ? String(val.value) : String(val),
        confidence_score: Number(val?.confidence_score || 0),
        originalPath: [key],
        index: currentIndex++
      }];
    });
  }, []);

  useEffect(() => {
    if (isOpen && data) setFields(flattenData(data));
  }, [isOpen, data, flattenData]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex).map((item, idx) => ({ ...item, index: idx }));
      });
    }
  };

  const updateFieldValue = (id: string, newValue: string) => {
    setFields(prev => prev.map(f => f.id === id ? { ...f, value: newValue } : f));
  };

  const getUpdatedData = () => {
    const updatedData = JSON.parse(JSON.stringify(data));
    const processed = updatedData.processed_data;

    fields.forEach(({ originalPath, value, index }) => {
      let target = processed;
      for (let i = 0; i < originalPath.length; i++) {
        const key = originalPath[i];
        if (i === originalPath.length - 1) {
          if (target[key]) {
            target[key].index = index;
            if ('value' in target[key]) target[key].value = value;
          }
        } else {
          target = target[key];
        }
      }
    });

    return updatedData;
  };

  return { fields, handleDragEnd, updateFieldValue, getUpdatedData };
};
