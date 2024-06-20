"use client"

//This needs to be a client component ^ Needs to be renderer in the Client side;
//The Document Component we would get it from the PDF Library
import {Document, Page, pdfjs} from "react-pdf"
//Library for “Suporting for annotations".
import 'react-pdf/dist/Page/AnnotationLayer.css';
//Support for Text Layer; 
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

//Lucide React Library
import { Ghost, MessageSquare, Plus, Trash, Loader2, Cloud, File } from 'lucide-react'
//Destructive Notifications, Toast, shadcn/ui library; 
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

//This function comes from the react-resize-detector library
import {useResizeDetector} from "react-resize-detector"

//Declare all the custom properties that we would receive
interface PdfRenderProps {
    url: string
}
//Worker in order to render a PDF. It need 
//Assing a prop to our PdfRender Component
const PdfRenderer = ({url}: PdfRenderProps) => {

    const {toast} = useToast()

    //This function comes from the react-resize-detector library
    //Destructing the width and the ref element;
    const {width, ref} = useResizeDetector()


    return <div className='w-full bg-white rounded-md shadow flex flex-col items-center'> 
            {/* PDF Options Funtionality */}
            <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
                <div className='flex items-center gap-1.5'>
                    Barra de Arriba.
                </div>
            </div>

            <div className='flex-1 w-full max-h-screen'>
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
                     file={url} className='max-h-full'> 
                        <Page width={width ? width : 1} pageIndex={1}/>

                    </Document>
                </div>
            </div>
     </div>
}

export default PdfRenderer