'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { Camera, Gamepad2, Briefcase, Smartphone, Battery, Zap, DollarSign, HardDrive, Monitor, Wallet, TrendingUp, Crown } from 'lucide-react';

export interface Option {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

interface ButtonSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

export const ButtonSelect: React.FC<ButtonSelectProps> = ({
  options,
  value,
  onChange,
  multiSelect = false,
  className,
}) => {
  const handleToggle = (optionId: string) => {
    if (multiSelect) {
      if (value.includes(optionId)) {
        onChange(value.filter(v => v !== optionId));
      } else {
        onChange([...value, optionId]);
      }
    } else {
      onChange([optionId]);
    }
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4', className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = value.includes(option.id);

        return (
          <Card
            key={option.id}
            role="button"
            tabIndex={0}
            className={cn(
              'relative p-4 sm:p-6 cursor-pointer transition-all duration-300 border-2',
              'hover:scale-105 hover:shadow-lg',
              'glassmorphism',
              isSelected
                ? 'border-primary bg-primary/10 shadow-lg scale-105'
                : 'border-transparent hover:border-primary/50'
            )}
            onClick={() => handleToggle(option.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle(option.id);
              }
            }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div
                className={cn(
                  'w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
              </div>

              <div>
                <h3 className={cn(
                  'text-base sm:text-lg font-semibold transition-colors',
                  isSelected ? 'text-primary' : 'text-foreground'
                )}>
                  {option.label}
                </h3>
                {option.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                )}
              </div>

              {/* Checkmark indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                  <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// Predefined option sets
export const useCaseOptions: Option[] = [
  {
    id: 'fotos',
    label: 'Fotos',
    icon: Camera,
    description: 'Capturá momentos increíbles',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    icon: Gamepad2,
    description: 'Jugá sin lag',
  },
  {
    id: 'trabajo',
    label: 'Trabajo',
    icon: Briefcase,
    description: 'Productividad todo el día',
  },
];

export const priorityOptions: Option[] = [
  {
    id: 'batería',
    label: 'Batería',
    icon: Battery,
    description: 'Que dure todo el día',
  },
  {
    id: 'cámara',
    label: 'Cámara',
    icon: Camera,
    description: 'Fotos profesionales',
  },
  {
    id: 'velocidad',
    label: 'Velocidad',
    icon: Zap,
    description: 'Súper rápido',
  },
];

export const budgetOptions: Option[] = [
  {
    id: 'económico',
    label: 'Económico',
    icon: Wallet,
    description: 'Hasta AR$180k',
  },
  {
    id: 'medio',
    label: 'Equilibrado',
    icon: TrendingUp,
    description: 'AR$180k - AR$250k',
  },
  {
    id: 'premium',
    label: 'Premium',
    icon: Crown,
    description: 'Lo mejor sin límite',
  },
];
