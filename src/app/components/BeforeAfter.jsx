import { useCallback, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { useCms } from "../content/ContentContext";
import { SectionBadge } from "./SectionBadge";

export function BeforeAfter({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
}) {
  const { content } = useCms();
  const headings = content.settings.sections.beforeAfter;
  const settings = content.settings.beforeAfter;

  const effectiveBeforeImage = beforeImage ?? settings.beforeImage;
  const effectiveAfterImage = afterImage ?? settings.afterImage;
  const effectiveBeforeAlt = beforeAlt ?? settings.beforeAlt;
  const effectiveAfterAlt = afterAlt ?? settings.afterAlt;
  const effectiveBeforeLabel = beforeLabel ?? settings.beforeLabel;
  const effectiveAfterLabel = afterLabel ?? settings.afterLabel;

  const containerRef = useRef(null);
  const [value, setValue] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const clipPath = useMemo(() => {
    const rightInset = 100 - value;
    return `inset(0 ${rightInset}% 0 0)`;
  }, [value]);

  const updateFromClientX = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const next = (x / rect.width) * 100;
    setValue(Math.round(next));
  }, []);

  return (
    <section className="py-38 bg-gradient-to-b from-[var(--muted)] to-[var(--background)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SectionBadge>{headings.badge}</SectionBadge>
          <h2 className="text-4xl md:text-5xl text-[var(--primary)] mb-4">
            {headings.title}
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            {headings.subtitle}
          </p>
        </div>

        <Card className="border-[var(--card-border)] overflow-hidden">
          <div
            ref={containerRef}
            className={
              "relative w-full aspect-[16/9] bg-[rgb(var(--renora-primary-rgb)/0.05)] select-none touch-none " +
              (isDragging ? "cursor-grabbing" : "cursor-col-resize")
            }
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setIsDragging(true);
              updateFromClientX(e.clientX);
            }}
            onPointerMove={(e) => {
              if (!isDragging) return;
              updateFromClientX(e.clientX);
            }}
            onPointerUp={() => setIsDragging(false)}
            onPointerCancel={() => setIsDragging(false)}
          >
            <img
              src={effectiveAfterImage}
              alt={effectiveAfterAlt}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />

            <img
              src={effectiveBeforeImage}
              alt={effectiveBeforeAlt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ clipPath }}
              draggable={false}
            />

            <div
              className="absolute inset-y-0"
              style={{ left: `${value}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-[rgb(var(--renora-accent-rgb))] shadow-sm" />
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <div className="w-12 h-12 rounded-full bg-[rgb(var(--renora-accent-rgb))] flex items-center justify-center border-4 border-[var(--before-after-handle-border)]">
                  <div className="flex items-center gap-1 text-[var(--before-after-handle-icon)]">
                    <ChevronLeft className="w-4 h-4 text-[var(--before-after-handle-icon)]" />
                    <ChevronRight className="w-4 h-4 text-[var(--before-after-handle-icon)]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-4 bottom-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[var(--before-after-label-bg)] text-[var(--before-after-label-text)] backdrop-blur-sm">
                {effectiveBeforeLabel}
              </span>
            </div>
            <div className="absolute right-4 bottom-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[var(--before-after-label-bg)] text-[var(--before-after-label-text)] backdrop-blur-sm">
                {effectiveAfterLabel}
              </span>
            </div>

            <input
              aria-label="Before and after slider"
              className="absolute inset-0 w-full h-full opacity-0"
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>
        </Card>
      </div>
    </section>
  );
}
