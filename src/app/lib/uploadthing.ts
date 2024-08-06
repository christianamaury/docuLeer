//The generateReactHelpers function is used to generate the useUploadThing hook and 
//the uploadFiles functions

import { generateReactHelpers } from "@uploadthing/react";

//In order for this to work, you have to change the ˜ for @ 
import type { OurFileRouter } from "@/app/api/uploadthing/core";
 
//Removed the uploadFiles from the parameters below;
export const { useUploadThing } =
  generateReactHelpers<OurFileRouter>();