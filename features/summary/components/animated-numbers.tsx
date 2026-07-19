// components/cards/animated-number.tsx

"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

type AnimatedNumberProps = {
  value: number;
  className?: string;
  duration?: number;
  delay?: number;
  format?: "currency" | "percentage" | "number";
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

export const AnimatedNumber = ({
  value,
  className,
  duration = 800,
  delay = 200,
  format = "currency",
  decimals = 2,
  prefix = "",
  suffix = "",
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Reset when value changes
    setDisplayValue(0);

    const startTime = Date.now() + delay;
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (value - startValue) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, duration, delay]);

  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return formatCurrency(val);
      case "percentage":
        return `${val.toFixed(decimals)}%`;
      case "number":
        return val.toFixed(decimals);
      default:
        return val.toString();
    }
  };

  const formattedValue = prefix + formatValue(displayValue) + suffix;

  return <span className={cn(className)}>{formattedValue}</span>;
};