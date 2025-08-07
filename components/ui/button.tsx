import * as React from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const baseClasses = "btn"
    
    const variantClasses = {
      default: "btn-primary",
      destructive: "btn-destructive", 
      outline: "btn-outline",
      secondary: "btn-secondary",
      ghost: "hover:bg-gray-100",
      link: "text-blue-600 hover:underline underline-offset-4"
    }
    
    const sizeClasses = {
      default: "",
      sm: "btn-sm",
      lg: "btn-lg", 
      icon: "btn-icon"
    }

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    if (asChild) {
      return <span className={classes} {...props} />
    }

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
