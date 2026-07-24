"use client";

import { formatCurrency } from "@/lib/utils";

type TooltipPayload = {
  name: string;
  value: number;
  color: string;
  dataKey: string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  labelKey?: string;
};

export const CustomTooltip = ({
  active,
  payload,
  label,
  labelKey = "Date",
}: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formatValue = (value: any) => {
    const numericValue = typeof value === "number" ? value : Number(value ?? 0);
    return formatCurrency(Math.abs(numericValue));
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        minWidth: "180px",
      }}
    >
      <p
        style={{
          color: "#0f172a",
          fontWeight: 600,
          fontSize: "13px",
          marginBottom: "8px",
          borderBottom: "1px solid #e2e8f0",
          paddingBottom: "6px",
        }}
      >
        {labelKey}: {label}
      </p>
      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#64748b",
            marginBottom: index < payload.length - 1 ? "4px" : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "3px",
                backgroundColor: entry.color,
              }}
            />
            {entry.name}
          </div>
          <span style={{ fontWeight: 500, color: "#0f172a" }}>
            {formatValue(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};