import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-navy-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all text-navy-800 ${
            error ? 'border-danger-500 bg-danger-50' : 'border-navy-200 bg-white hover:border-navy-300'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-danger-600 font-medium">⚠️ {error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
