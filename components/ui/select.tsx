"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
}

const SelectContext = React.createContext<SelectContextType | null>(null)

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  required?: boolean
}

const Select = ({ value = "", onValueChange, children, required }: SelectProps) => {
  return (
    <SelectContext.Provider value={{ value, onValueChange: onValueChange || (() => {}) }}>
      {children}
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      context?.onValueChange(e.target.value)
    }

    return (
      <select
        className={cn("select", className)}
        ref={ref}
        value={context?.value || ""}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = React.useContext(SelectContext)
  
  if (!context?.value && placeholder) {
    return <option value="" disabled>{placeholder}</option>
  }
  
  return null
}

const SelectContent = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  ({ className, children, value, ...props }, ref) => {
    return (
      <option
        className={className}
        ref={ref}
        value={value}
        {...props}
      >
        {children}
      </option>
    )
  }
)
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
