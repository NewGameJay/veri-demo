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
    relative overflow-hidden rounded-full font-medium transition-all duration-300 ease-out
    transform-gpu will-change-transform backdrop-blur-xl
    before:content-[''] before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-500
    after:content-[''] after:absolute after:inset-0 after:rounded-full after:transition-all after:duration-700
    hover:scale-105 hover:-translate-y-0.5 active:scale-95
    border border-white/20 shadow-lg
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
      bg-transparent border-white/30 text-white backdrop-blur-md
      before:bg-white/10 before:opacity-0 hover:before:opacity-100
      after:bg-gradient-to-r after:from-white/20 after:via-white/10 after:to-transparent after:opacity-0 hover:after:opacity-100
      hover:border-white/50 hover:bg-white/5 hover:shadow-white/10
    `
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Animated liquid effect on hover
  const liquidEffect = `
    before:animate-pulse hover:before:animate-none
    after:bg-gradient-to-r after:from-white/20 after:via-transparent after:to-white/20
    after:animate-shimmer hover:after:animate-none
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