"use client"

//This needs to be a client component ^ Needs to be renderer in the Client side;
//The Document Component we would get it from the PDF Library
import {Document, Outline, Page, pdfjs} from "react-pdf"
//Library for “Suporting for annotations".
import 'react-pdf/dist/Page/AnnotationLayer.css';
//Support for Text Layer; 
import 'react-pdf/dist/Page/TextLayer.css';
import {useState} from 'react'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

//Lucide React Library
import { Ghost, MessageSquare, Plus, Trash, Loader2, Cloud, File, ChevronDown, ChevronUp, Search, RotateCw } from 'lucide-react'
//Destructive Notifications, Toast, shadcn/ui library; 
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

//This function comes from the react-resize-detector library
import {useResizeDetector} from "react-resize-detector"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

//Importing PdfFullscreen Component
import PdfFullscreen from "@/app/Components/PdfFullscreen"

import {useForm} from "react-hook-form"
import {string, z} from "zod"

//Library for the hookform resolvers; 
import {zodResolver} from "@hookform/resolvers/zod"
import { cn } from "../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

//From the SimpleBar React Library; 
import SimpleBar from "simplebar-react"

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

    //Creating a focus in effect for the Search icon
    const [scale, setScale] = useState<number>(1)

    const [rotation, setRotation] = useState<number>(0)

    const [renderedScale, setRenderedScale] = useState<number  |null>(null)
    
    //Derivered from the two state References above; 
    const isLoading = renderedScale !== scale

    const CustomPageValidator = z.object({

        //num its what the user has input
        page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!)
    })

    //Gettting the type from the CustomPageValidator ^
    //It's a regular Type; 
    type TCustomPageValidator = z.infer<typeof CustomPageValidator>

    //Passing an object which it would be the TCustomPageValidator^
    const {
        //Destructing it, using the register Function; 
        register,
        handleSubmit, 
        formState: {errors},
        setValue


    } = useForm<TCustomPageValidator>({
        defaultValues: {
            page: "1", 
            
        },
        resolver: zodResolver(CustomPageValidator),
    })

     //This function comes from the react-resize-detector library
    //Destructing the width and the ref element;
    const {width, ref} = useResizeDetector()

    //To handle the page submitting logic;
    const handlePageSumit  = ({page}: TCustomPageValidator) => {
            //Setting the current Page we're in; 
            setCurrentPage(Number(page))
            setValue("page", String(page))

    }


    return <div className='w-full bg-white rounded-md shadow flex flex-col items-center'> 
            {/* PDF Options Funtionality */}
            <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
                <div className='flex items-center gap-1.5'>
                    {/* Adding a button, varian ghost color*/}
                    <Button 
                    disabled = {currentPage <= 1 } 
                    onClick={() => {
                        setCurrentPage((prev) => 
                        prev - 1 > 1 ? prev - 1 : 1
                            )
                            //Modifying Value; 
                            setValue("page", String(currentPage - 1))
                        }} 
                        variant='ghost' 
                        aria-label='previous page'> 
                        <ChevronDown className='h-4 w-4' />
                    </Button>

                    <div className='flex items-center gap-1.5'>
                        {/* We would be using here an input component; Line below comes from the following library: shadcn-ui@latest add input*/}
                        <Input {...register('page')} 
                        className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')} 
                        onKeyDown={(e) => {
                            //If the enter key gets press 3 times
                            if(e.key === "Enter"){
                                handleSubmit(handlePageSumit)()
                            }

                        }}
                        
                        
                        />
                        <p className='text-zinc-700 text-sm space-x-1'>
                            <span>/</span>
                            <span>{numPages ?? "x"}</span>

                        </p>
                    </div>

                       {/* Adding a button, varian ghost color*/}
                       <Button disabled={numPages === undefined || currentPage === numPages} 
                       onClick={() => {
                        setCurrentPage((prev) => 
                        prev + 1 > numPages! ? numPages! : prev + 1
                            )
                            //Modifying Value; 
                            setValue("page", String(currentPage + 1))
                        }} 
                        variant='ghost' 
                        aria-label='next page'> 
                        <ChevronUp className='h-4 w-4' />
                    </Button>

                </div>
                {/* Focusing Feature. Creating the zooming effect on the PDF. */}
                <div className='space-x-2'> 
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
                                    {/* Adding a search icon to the far right corner of the screen */}
                                    <Search className='h-4 w-4'/>
                                    {/* Adding a dynamic value from our scale const variable */}
                                    {scale * 100}%<ChevronDown className='h-3 w-3 opacity-50'/>

                                </Button>

                            </DropdownMenuTrigger>

                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => setScale(1)}>
                                    100%
                                </DropdownMenuItem>

                                <DropdownMenuItem onSelect={() => setScale(1.5)}>
                                    150%
                                </DropdownMenuItem>

                                <DropdownMenuItem onSelect={() => setScale(2)}>
                                    200%
                                </DropdownMenuItem>

                                <DropdownMenuItem onSelect={() => setScale(2.5)}>
                                    250%
                                </DropdownMenuItem>
                            </DropdownMenuContent>

                        </DropdownMenu>

                        {/* Rotation Feature */}
                      <Button onClick={() => setRotation((prev) => prev + 90)} variant='ghost' aria-label='rotate 90 degrees'> 
                        <RotateCw className='h-4 w-4'/>
                      
                      </Button>

                      {/* PDF Fullscreen Component */}
                      <PdfFullscreen fileUrl={url}/>
                </div>

            </div>

            <div className='flex-1 w-full max-h-screen'>
                {/* Adding the Simple Bar from the SimpleBar React Library; */}
                        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
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
                                   {isLoading && renderedScale ?  <Page width={width ? width : 1} 
                                    pageNumber={currentPage}
                                    scale={scale}
                                    rotate = {rotation}
                                    key={"@" + renderedScale}
                                    /> : null}

                                    <Page className={cn(isLoading ? 'hidden' : '')} 
                                    width={width ? width : 1} 
                                    pageNumber={currentPage}
                                    scale={scale}
                                    rotate = {rotation}
                                    key={"@" + scale}
                                    loading = {
                                        <div className='flex justify-center'>
                                            {/* Loader 2 icon */}
                                            <Loader2 className='my-24 h-6 2-6 animate-spin'/>
                                        </div>
                                    }
                                        onRenderSuccess={() => setRenderedScale(scale)}
                                    />

                                </Document>
                            </div>   
                        </SimpleBar>
            </div>
     </div>
}

export default PdfRenderer