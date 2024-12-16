import * as React from "react"

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> { }

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
    ({ children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0"
                {...props}
            >
                {children}
            </span>
        )
    }
)
VisuallyHidden.displayName = "VisuallyHidden"

export { VisuallyHidden }

