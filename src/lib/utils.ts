import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 //We need an absolute url;
 export function absoluteUrl(path: string) {
  // If its undefined it means that we're on the Client side;
  if(typeof window !== "undefined") return path 
  // Returns to server because we're in the server side; Root where we'd deploy to (like yourdomain.com)
  if(process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000}${path}`

 }
