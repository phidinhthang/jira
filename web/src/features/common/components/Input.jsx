import { forwardRef } from 'react';

export const Input = forwardRef(
  ({ className, isTextarea, hasError, ...props }, ref) => {
    const Component = isTextarea ? 'textarea' : 'input';
    return (
      <div
        className={`flex h-auto justify-between items-start border border-[rgb(179, 186, 197)] rounded-[3px] py-[6px] px-2 focus-within:border-blue-500 focus-within:ring-blue-500 focus-within:ring-1 text-sm break-all ${
          hasError
            ? 'bg-red-50 border-red-500 focus-within:border-red-500 text-red-900 placeholder-red-700 focus-within:ring-red-500'
            : ''
        } ${className}`}
      >
        <Component
          className={`bg-transparent border-0 outline-0 h-full w-full resize-none ${
            hasError ? 'text-red-900 placeholder-red-700' : ''
          }`}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);
