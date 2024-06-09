//UploadButton would be an entire upload button module, sort of a component;
"use client"
import { Button } from '@/components/ui/button'
//open & onOpenChange are properties from the Dialog Library; 
//DialogTrigger receives one propertie which is: asChild
//which we would override the default button with our Button; 
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import {useState} from 'react'

//Importing the Dropzone Library;
import Dropzone from "react-dropzone"

//getRootProps comes from the Dropzone Library; 
//Whenever someone drops the files it would be for the: acceptedFiles;
const UploadDropzone = () => {
    return <Dropzone multiple={false}>
            {/* We can destructre objects right away */}
            {({getRootProps, getInputProps, acceptedFiles}) => (
                <div></div>
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