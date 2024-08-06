"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

//Modifying the props parameters to change the colors of the progress bar; 
//Creating type for this; 
type ProgressProps = React.ComponentPropsWithoutRef<
typeof ProgressPrimitive.Root> & {
   indicatorColor?: String
}
//Replacing the current ComponentPropsWithoutReference
// React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> = Replace with ProgressProps
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorColor, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      //Removed the following className information: h-full w-full flex-1 bg-primary transition-all
      //Using our cn utility and merging it with our indicatorColor; 
      className={cn('h-full w-full flex-1 bg-primary transition-all', indicatorColor)}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
