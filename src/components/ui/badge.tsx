import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border border-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-inner shadow-cyan-500/5",
        secondary:
          "bg-slate-800 border-white/5 text-slate-300",
        destructive:
          "bg-red-500/10 border-red-500/20 text-red-400 glow-text-rose",
        outline: "text-slate-300 border-white/10 bg-transparent",
        success:
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 glow-text-emerald",
        warning:
          "bg-amber-500/10 border-amber-500/20 text-amber-400",
        info:
          "bg-blue-500/10 border-blue-500/20 text-blue-400"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
