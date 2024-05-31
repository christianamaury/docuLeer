//UploadButton would be an entire upload button module, sort of a component;
"use client"
import { Button } from '@/components/ui/button'
//open & onOpenChange are properties from the Dialog Library; 
//DialogTrigger receives one propertie which is: asChild
//which we would override the default button with our Button; 
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import {useState} from 'react'


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
                    Ejemplo de tu documento
            </DialogContent>
        </Dialog>
     )
}

export default UploadButton 