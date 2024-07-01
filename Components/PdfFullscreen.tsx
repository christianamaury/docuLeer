import {useState} from 'react'
import {Dialog, DialogTrigger, DialogContent} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
//Lucide React Library
import { Expand, Loader2 } from 'lucide-react'
//From the SimpleBar React Library; 
import SimpleBar from "simplebar-react"

//This function comes from the react-resize-detector library
import {useResizeDetector} from "react-resize-detector"

//Destructive Notifications, Toast, shadcn/ui library; 
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

//This needs to be a client component ^ Needs to be renderer in the Client side;
//The Document Component we would get it from the PDF Library
import {Document, Outline, Page, pdfjs} from "react-pdf"
//Library for “Suporting for annotations".
import 'react-pdf/dist/Page/AnnotationLayer.css';
//Support for Text Layer; 
import 'react-pdf/dist/Page/TextLayer.css';

//Props
interface PdfFullScreenProps {
    fileUrl: string
}

const PdfFullscreen = ({fileUrl}: PdfFullScreenProps) => {

    //Keeping track of the user state; 
    const [isOpen, setIsOpen] = useState<boolean>(false)

    //Number of Pages of the PDF; 
    //We'd use this constant variable in the onLoadSuccess method <Document />
    const [numPages, setNumPages] = useState<number>()

    const {toast} = useToast()

         //This function comes from the react-resize-detector library
    //Destructing the width and the ref element;
    const {width, ref} = useResizeDetector()


    return(
        <Dialog open={isOpen} onOpenChange={(v) => {
                if(!v){
                   setIsOpen(v) 
                }
            
        }}>
        <DialogTrigger asChild>
            {/* Custom Trigger; */}
            <Button variant='ghost' className='gap-1.5' aria-label='fullscreen'>
                <Expand className='h-4 w-4'/>
            </Button>

        </DialogTrigger>
        <DialogContent className='max-w-7xl w-full'>

            <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)] mt-6'>
            <div ref={ref}>
                                <Document loading={
                                    <div className='flex justify-center'>
                                        <Loader2 className='my-24 h-6 w-6 animate-spin'/>
                                    </div>
                                }
                                onLoadError={() => {
                                    toast({
                                        title: 'Hubo un error subiendo tu PDF :(',
                                        description: 'Por favor intentar mas tarde.', 
                                        variant: 'destructive',
                                    })
                                }}
                                onLoadSuccess={({numPages}) => setNumPages(numPages)}
                                file={fileUrl} className='max-h-full'> 
                                    {/* Mapping through every page that we have */}
                                        {new Array(numPages).fill(0).map((_, i) => (
                                            //Returning a Page Element
                                            <Page width={}/> 

                                        ))}

                                </Document>
                            </div>   

            </SimpleBar>


        </DialogContent>

        </Dialog>
    )
}

export default PdfFullscreen