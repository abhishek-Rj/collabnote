import React from "react";

interface TechnicalAnnotationProps {
  label: string;
  value?: string;
  variant?: "dark" | "light" | "accent";
  className?: string;
}

export function TechnicalAnnotation({
  label,
  value,
  variant = "dark",
  className = "",
}: TechnicalAnnotationProps) {
  const colorMap = {
    dark: "text-[#A3A3A3]",
    light: "text-[#F5F5F5]",
    accent: "text-[#F97316]",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono-tech text-[9px] sm:text-[10px] uppercase tracking-widest select-none flex-wrap ${colorMap[variant]} ${className}`}
    >
      <span className="inline-block w-1.5 h-1.5 bg-current opacity-70 shrink-0" />
      <span className="font-semibold whitespace-nowrap">{label}</span>
      {value && <span className="opacity-75 whitespace-nowrap">[{value}]</span>}
    </div>
  );
}
