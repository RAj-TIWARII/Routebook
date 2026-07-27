import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
}

export function GlassCard({ strong, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(strong ? 'glass-strong' : 'glass', 'transition-colors', className)}
      {...props}
    />
  );
}
