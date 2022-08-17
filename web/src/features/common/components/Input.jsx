import { forwardRef } from 'react';

export const Input = forwardRef(({ className, isTextarea, ...props }, ref) => {
  const Component = isTextarea ? 'textarea' : 'input';
  return (
    <div
      className={`flex h-auto justify-between items-start border border-[rgb(179, 186, 197)] rounded-[3px] py-[6px] px-2 focus-within:border-blue-500 focus-within:ring-blue-500 focus-within:ring-1 text-sm ${className} break-all`}
    >
      <Component
        className='bg-transparent border-0 outline-0 h-full w-full resize-none'
        {...props}
        ref={ref}
      />
    </div>
  );
});
