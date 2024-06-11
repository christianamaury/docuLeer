//UploadButton would be an entire upload button module, sort of a component;
"use client"
import { Button } from '@/components/ui/button'
//open & onOpenChange are properties from the Dialog Library; 
//DialogTrigger receives one propertie which is: asChild
//which we would override the default button with our Button; 
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import {useState} from 'react'

//Lucide React Library
import { Ghost, MessageSquare, Plus, Trash, Loader2, Cloud, File } from 'lucide-react'

//Importing the Dropzone Library;
import Dropzone from "react-dropzone"

//getRootProps comes from the Dropzone Library; 
//Whenever someone drops the files it would be for the: acceptedFiles;
//Passin props on the div
//onDrop{} to check if it was successful
//PDF(4MB) section would dynamically change depending if the user is a Pro one. Pro would be 16MB
const UploadDropzone = () => {

    //Creating Loading state for whenever an user upload a file;
    const [isUpLoading, setIsUploading] = useState<boolean>(true)


    return <Dropzone multiple={false} onDrop={(acceptedFiles) => {
        console.log(acceptedFiles)

    }}>
            {/* We can destructre objects right away */}
            {({getRootProps, getInputProps, acceptedFiles}) => (
                 
                <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'>
                    <div className='flex items-center justify-center h-full w-full'>
                        <label htmlFor='dropzone-file' className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'> 
                            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                <Cloud className='h-6 w-6 text-zinc-500 mb-2'/>
                                <p className='mb-2 text-sm text-zinc-700'>
                                    <span className='font-semibold'> Aqui para subir documento </span> {''} o agarra el documento y sueltalo en el area
                                </p>

                                <p className='text-xs text-zinc-500'> 
                                    PDF (hasta 4MB)
                                </p>

                            </div>

                            {/* User feedback so whenever they drop a PDF file on the drop area; Ternary Operator */}
                            {acceptedFiles && acceptedFiles[0] ? (
                                <div className='max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200 '>
                                    <div className='px-3 py-2 h-full grid place-items-center'>
                                        {/*Initially set text-blue-500*/}
                                        <File className='h-4 w-4 text-red-500'/>
                                    </div>
                                    {/* Display PDF file name. Rendering file name */}
                                    <div className='px-3 py-2 h-full text-sm truncate'>
                                        {acceptedFiles[0].name}
                                    </div>

                                </div>

                            ) : null }

                            {/* Displaying Loading state of the PDF file. If it's true*/}
                            {isUpLoading ? (
                                <div className='w-ful mt-4 max-w-xs mx-auto'>
                                    
                                </div>

                            ) : null}
                        
                        </label>

                    </div>

                </div>
            )}
        
         </Dropzone>
}


const UploadButton = () => {
    //By default would set to False
     const [isOpen, setIsOpen] = useState<boolean>(false)
     
     //If not true,
     return (
        <Dialog open={isOpen} onOpenChange={(v) => {
            if(!v){
                setIsOpen(v)
            }
        }}>
            <DialogTrigger asChild>
                <Button> Subir Documentos </Button>
            </DialogTrigger>

            <DialogContent>
                    {/*Custom Component*/}
                    <UploadDropzone/>
            </DialogContent>
        </Dialog>
     )
}

export default UploadButton 