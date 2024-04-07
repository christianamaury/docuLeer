//Utility Function for our entire application.
//This function cn() stands for class names; 
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//This function comes from a package: clsx 
export function cn(...inputs: ClassValue[]){
    return(twMerge(clsx(inputs)))
  

}