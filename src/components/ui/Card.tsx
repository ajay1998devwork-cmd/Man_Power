import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-navy-200 hover:shadow-md transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`px-4 lg:px-6 py-3 lg:py-4 border-b border-navy-200 bg-gradient-to-r from-navy-50 to-white ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`px-4 lg:px-6 py-4 lg:py-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h3 className={`text-base lg:text-lg font-semibold text-navy-800 ${className}`}>
      {children}
    </h3>
  );
}
