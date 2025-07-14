import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function LiquidGlassButton({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: LiquidGlassButtonProps) {
  const baseClasses = `
    relative overflow-hidden rounded-full font-medium
    transform-gpu backdrop-blur-xl
    border border-white/20 shadow-lg
    transition-all duration-300 ease-out
    hover:scale-[1.02] hover:-translate-y-1 active:scale-95
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-emerald-500/80 to-blue-500/80 text-white
      before:bg-gradient-to-r before:from-emerald-400/50 before:to-blue-400/50 before:opacity-0 hover:before:opacity-100
      after:bg-gradient-to-r after:from-white/20 after:to-transparent after:opacity-0 hover:after:opacity-100
      shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:shadow-xl
    `,
    secondary: `
      bg-white/10 text-white backdrop-blur-md
      before:bg-white/20 before:opacity-0 hover:before:opacity-100
      after:bg-gradient-to-r after:from-white/10 after:to-transparent after:opacity-0 hover:after:opacity-100
      hover:bg-white/20 hover:shadow-white/20
    `,
    emerald: `
      bg-gradient-to-r from-emerald-500 to-emerald-600 text-white
      before:bg-gradient-to-r before:from-emerald-400 before:to-emerald-500 before:opacity-0 hover:before:opacity-100
      after:bg-gradient-to-r after:from-white/30 after:to-transparent after:opacity-0 hover:after:opacity-100
      shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:shadow-2xl
    `,
    outline: `
      bg-white/5 border-white/30 text-white backdrop-blur-md
      before:bg-white/15 
      after:bg-gradient-to-r after:from-white/20 after:via-white/10 after:to-transparent 
      hover:border-white/50 hover:bg-white/10 hover:shadow-white/20
    `
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Simple hover glow effect
  const liquidEffect = `
    hover:shadow-xl hover:shadow-white/10
  `;

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        liquidEffect,
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}