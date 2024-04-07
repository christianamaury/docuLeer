import {ReactNode} from "react"
//Importing the utility file
//Reusable Component
import {cn} from "../lib/utils"

//Reusable for All Pages: Left & Right Side of our Pages;
//It would take props;
//Inside the div rendeing the props
const MaxWidthWrapper = ({
    className, 
    children,
}: {
    className?: string
    children: ReactNode

}) => {
    return(

        <div className={cn(("mx-auto w-full max-w-screen-xl px-2.5 md:px-20"), className)}> 
        {children}
        </div>
    )
  
}

export default MaxWidthWrapper
