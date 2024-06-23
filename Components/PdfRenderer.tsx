"use client"

//This needs to be a client component ^ Needs to be renderer in the Client side;
//The Document Component we would get it from the PDF Library
import {Document, Page, pdfjs} from "react-pdf"
//Library for “Suporting for annotations".
import 'react-pdf/dist/Page/AnnotationLayer.css';
//Support for Text Layer; 
import 'react-pdf/dist/Page/TextLayer.css';
import {useState} from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

//Lucide React Library
import { Ghost, MessageSquare, Plus, Trash, Loader2, Cloud, File, ChevronDown, ChevronUp } from 'lucide-react'
//Destructive Notifications, Toast, shadcn/ui library; 
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

//This function comes from the react-resize-detector library
import {useResizeDetector} from "react-resize-detector"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {useForm} from "react-hook-form"
import {string, z} from "zod"

//Declare all the custom properties that we would receive
interface PdfRenderProps {
    url: string
}
//Worker in order to render a PDF. It need 
//Assing a prop to our PdfRender Component
const PdfRenderer = ({url}: PdfRenderProps) => {

    const {toast} = useToast()

    //Number of Pages of the PDF; 
    //We'd use this constant variable in the onLoadSuccess method <Document />
    const [numPages, setNumPages] = useState<number>()
   
    //In order to keep track on which PDF file we're currently in;
    //By default we would like to be in the 1st page of the Document; 
    const [currentPage, setCurrentPage] = useState<number>(1)

    //This function comes from the react-resize-detector library
    //Destructing the width and the ref element;
    const {width, ref} = useResizeDetector()

    const CustomPageValidator = z.object({

        //num its what the user has input
        page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!)
    })

    //Gettting the type from the CustomPageValidator ^
    //It's a regular Type; 
    type TCustomPageValidator = z.infer<typeof CustomPageValidator>

    //Passing an object which it would be the TCustomPageValidator^
    const {} = useForm<TCustomPageValidator>({
        defaultValues: {
            page: "1", 

        }
    })


    return <div className='w-full bg-white rounded-md shadow flex flex-col items-center'> 
            {/* PDF Options Funtionality */}
            <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
                <div className='flex items-center gap-1.5'>
                    {/* Adding a button, varian ghost color*/}
                    <Button disabled = {currentPage <= 1 } onClick={() => {setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1 ))}} variant='ghost' aria-label='previous page'> 
                        <ChevronDown className='h-4 w-4' />
                    </Button>

                    <div className='flex items-center gap-1.5'>
                        {/* We would be using here an input component; Line below comes from the following library: shadcn-ui@latest add input*/}
                        <Input className='w-12 h-8'/>
                        <p className='text-zinc-700 text-sm space-x-1'>
                            <span>/</span>
                            <span>{numPages ?? "x"}</span>

                        </p>
                    </div>

                       {/* Adding a button, varian ghost color*/}
                       <Button disabled={numPages === undefined || currentPage === numPages} onClick={() => {setCurrentPage((prev) => prev + 1 > numPages! ? numPages! : prev + 1 )}} variant='ghost' aria-label='next page'> 
                        <ChevronUp className='h-4 w-4' />
                    </Button>

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
                     onLoadSuccess={({numPages}) => setNumPages(numPages)}
                     file={url} className='max-h-full'> 
                        <Page width={width ? width : 1} 
                        pageNumber={currentPage}
                        />

                    </Document>
                </div>
            </div>
     </div>
}

export default PdfRenderer