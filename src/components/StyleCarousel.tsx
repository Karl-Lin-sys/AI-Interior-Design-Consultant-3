/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export const INTERIOR_STYLES = [
  { id: "modern", name: "Modern", description: "Clean lines, neutral palette", color: "bg-slate-100" },
  { id: "scandinavian", name: "Scandinavian", description: "Minimalist, cozy, wood", color: "bg-orange-50" },
  { id: "midcentury", name: "Mid-Century", description: "Retro charm, organic forms", color: "bg-emerald-50" },
  { id: "industrial", name: "Industrial", description: "Raw materials, urban edge", color: "bg-zinc-100" },
  { id: "bohemian", name: "Bohemian", description: "Eclectic, vibrant, textures", color: "bg-amber-50" },
  { id: "minimalist", name: "Minimalist", description: "Essential, serene, functional", color: "bg-stone-50" },
];

interface StyleCarouselProps {
  selectedStyle: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export default function StyleCarousel({ selectedStyle, onSelect, disabled }: StyleCarouselProps) {
  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        {INTERIOR_STYLES.map((style) => (
          <motion.div
            key={style.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => onSelect(style.id)}
              disabled={disabled}
              className={cn(
                "flex-shrink-0 w-48 p-5 rounded-2xl text-left transition-all border-2 outline-none disabled:opacity-50",
                selectedStyle === style.id
                  ? "border-neutral-900 bg-white shadow-lg"
                  : "border-transparent bg-neutral-50 hover:bg-neutral-100"
              )}
            >
              <div className={cn("w-10 h-10 rounded-full mb-3 mb-4", style.color)} />
              <h3 className="font-semibold text-neutral-900">{style.name}</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                {style.description}
              </p>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
