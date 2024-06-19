//The Document Component we would get it from the PDF Library
import {Document, Page} from "react-pdf"
//Library for “Suporting for annotations".
import 'react-pdf/dist/Page/AnnotationLayer.css';
//Support for Text Layer; 
import 'react-pdf/dist/Page/TextLayer.css';

//Declare all the custom properties that we would receive
interface PdfRenderProps {
    url: string
}
//Worker in order to render a PDF
//Assing a prop to our PdfRender Component
const PdfRenderer = ({url}: PdfRenderProps) => {
    return <div className='w-full bg-white rounded-md shadow flex flex-col items-center'> 
            {/* PDF Options Funtionality */}
            <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
                <div className='flex items-center gap-1.5'>
                    Barra de Arriba.
                </div>
            </div>

            <div className="flex-1 w-full max-h-screen">
                <div>
                    <Document file={url} className='max-h-full'> 
                        <Page pageIndex={1}/>

                    </Document>
                </div>
            </div>
     </div>
}

export default PdfRenderer