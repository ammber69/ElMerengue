import { cn } from '../utils/cn';

export const Button = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-merengue-main text-white hover:bg-merengue-dark focus:ring-merengue-main shadow-md",
    secondary: "bg-merengue-pastel text-merengue-dark hover:bg-merengue-medium focus:ring-merengue-medium",
    outline: "border border-merengue-main text-merengue-main hover:bg-merengue-pastel focus:ring-merengue-main",
    ghost: "text-merengue-text hover:bg-merengue-gray focus:ring-merengue-gray",
  };

  const sizes = {
    sm: "h-9 px-4 py-2",
    md: "h-11 px-8 py-2 text-base",
    lg: "h-14 px-10 py-3 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes['md'], className)}
      {...props}
    >
      {children}
    </button>
  );
};
