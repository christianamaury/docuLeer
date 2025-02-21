import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
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


// In order to change the name of the web browser tab
// from Vercel Create Name to my Custom one: 
//noIndex for indexing purposes in Google;
// Function takes an object;
export function constructMedata({
  title = "docuLeer",
  description = "docuLeer es una aplicación para ayudar estudiantes con sus tareas.",
  image = "/thumbnail.png",
  icons = "favicon.ico",
  noIndex = false

}: {
  title?: string
  description?: string
  image?: string, 
  icons?: string, 
  noIndex?: boolean
} = {}): Metadata {

  return {
      title,
      description,
      openGraph: {
        title,
        description, 
        images: [
          {
            url: image
          }
        ]
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
        creator: "@developedbyamaury"
      },

      icons, 
      // Here we will pass our Production url;
      metadataBase: new URL ('https://docu-leer.vercel.app'),
      themeColor: '#FFF',
      ...(noIndex && {
            robots: {
              index: false,
              follow: false
            }
      })

  }
}