"use client";

import { useState, useLayoutEffect, useId } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";

function SortableImageItem({ id, url, index, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-md border bg-muted/20 overflow-hidden ${
        isDragging ? "opacity-90 shadow-lg ring-2 ring-primary/30" : ""
      }`}
    >
      <span
        className="absolute bottom-1 right-1 z-10 rounded bg-black/60 text-white text-xs px-1.5 py-0.5 tabular-nums pointer-events-none"
        dir="ltr"
      >
        {index + 1}
      </span>
      <button
        type="button"
        className="absolute top-1 right-1 z-10 flex h-8 w-8 cursor-grab touch-none items-center justify-center rounded-md bg-secondary/95 text-secondary-foreground shadow-sm hover:bg-secondary active:cursor-grabbing"
        title="اسحب لإعادة الترتيب"
        aria-label="سحب لإعادة ترتيب الصورة"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Button
        className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        type="button"
        size="icon"
        variant="destructive"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        title="حذف الصورة"
      >
        <X className="h-3 w-3" />
      </Button>
      <Image
        src={url}
        alt={`صورة السيارة ${index + 1}`}
        height={128}
        width={128}
        draggable={false}
        unoptimized={typeof url === "string" && url.startsWith("data:")}
        className="h-32 w-full object-cover p-0 select-none"
        priority={index === 0}
      />
    </div>
  );
}

/**
 * Preview and reorder car images by dragging. Order is preserved when saving (first = primary/cover).
 */
export default function CarImageGalleryEditor({ images, setImages }) {
  const dndId = useId();
  const [items, setItems] = useState([]);

  useLayoutEffect(() => {
    if (!images?.length) {
      setItems([]);
      return;
    }
    setItems((prev) => {
      if (prev.length === 0) {
        return images.map((url) => ({ id: crypto.randomUUID(), url }));
      }
      if (images.length > prev.length) {
        const prevUrls = new Set(prev.map((p) => p.url));
        const added = images.filter((u) => !prevUrls.has(u));
        return [
          ...prev,
          ...added.map((url) => ({ id: crypto.randomUUID(), url })),
        ];
      }
      if (images.length < prev.length) {
        return prev.filter((p) => images.includes(p.url));
      }
      return prev;
    });
  }, [images]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((current) => {
      const oldIndex = current.findIndex((i) => i.id === active.id);
      const newIndex = current.findIndex((i) => i.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return current;
      const next = arrayMove(current, oldIndex, newIndex);
      setImages(next.map((i) => i.url));
      return next;
    });
  };

  const removeImage = (index) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setImages(next.map((i) => i.url));
      return next;
    });
  };

  if (!items.length) return null;

  return (
    <div className="mt-4">
      <p className="text-sm text-muted-foreground text-right mb-2" dir="rtl">
        اسحب الصور من المقبض لترتيبها. الصورة الأولى تُعرض كصورة رئيسية في القوائم
        والتفاصيل.
      </p>
      <h3 className="text-right font-medium mb-2">
        تم رفع {items.length} صورة
      </h3>
      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {items.map((item, index) => (
              <SortableImageItem
                key={item.id}
                id={item.id}
                url={item.url}
                index={index}
                onRemove={removeImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
