import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  onClick?: () => void;
  clickable?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle,
  onClick,
  clickable = false
}) => {
  const baseClasses = "bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200";
  const interactiveClasses = clickable 
    ? "hover:shadow-lg hover:scale-105 cursor-pointer hover:border-blue-300 transform" 
    : "hover:shadow-md";

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`${baseClasses} ${interactiveClasses}`}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {clickable && value !== 0 && (
            <p className="text-xs text-blue-600 mt-2 font-medium">
              Clicca per visualizzare →
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} ${clickable && value !== 0 ? 'group-hover:scale-110 transition-transform' : ''}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};