import { Spinner } from './Spinner';

const variantClassNameMap = {
  secondary:
    'bg-[rgba(9,30,66,0.04)] text-[#42526E] hover:bg-[rgba(9,30,66,0.08)] disabled:hover:bg-[rgba(9,30,66,0.04)]',
  primary:
    'bg-blue-700 text-white hover:bg-blue-500 disabled:hover:bg-blue-700',
};

export const Button = ({
  className,
  children,
  isIcon,
  isTransparent,
  isLoading,
  isDisabled,
  isFullWidth = false,
  variant = 'secondary',
  ...props
}) => {
  return (
    <button
      className={`font-semibold rounded-[4px] flex items-center gap-2 justify-center disabled:cursor-not-allowed ${
        isIcon ? 'p-1' : 'px-3 py-1'
      } ${isTransparent ? 'bg-transparent' : ''}  ${
        variantClassNameMap[variant]
      } ${isFullWidth ? 'w-full' : ''} ${className}`}
      {...props}
      disabled={isDisabled || isLoading}
    >
      {isLoading ? <Spinner /> : null}
      {children}
    </button>
  );
};
